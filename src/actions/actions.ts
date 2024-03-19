"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { delay } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* --- user actions --- */
export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data." };
  }

  try {
    await signIn("credentials", formData);
  } catch (e) {
    if (e instanceof AuthError) {
      console.error("[login | AuthError]: " + e.message);
      return { message: "Invalid credentials." };
    }

    throw e;
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data." };
  }
  const formDataEntries = Object.fromEntries(formData);

  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) return { message: "Invalid form data." };

  const { email, password } = validatedFormData.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, hashedPassword } });
    await signIn("credentials", formData);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[signUp | PrismaError] " + e.message);
      switch (e.code) {
        case "P2002":
          return { message: "Email already exists." };
        default:
          return { message: "Could not sign up." };
      }
    } else if (e instanceof AuthError) {
      console.error("[signUp | AuthError] " + e.message);
      return { message: "Oops. Something went wrong." };
    }
    throw e;
  }
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

/* --- pet actions --- */

export async function addPet(pet: unknown) {
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) return { message: "Invalid pet data." };

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: { connect: { id: session.user.id } },
      },
    });
  } catch (e) {
    console.error(e);
    return { message: "Could not add pet." };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return { message: "Invalid pet data." };
  }

  const pet = await getPetById(validatedPetId.data);
  if (!pet) return { message: "Pet not found." };
  if (pet.userId !== session.user.id) return { message: "Unauthorized." };

  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });
  } catch (e) {
    console.error(e);
    return { message: "Could not edit pet." };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) return { message: "Invalid pet data." };

  const pet = await getPetById(validatedPetId.data);
  if (!pet) return { message: "Pet not found." };
  if (pet.userId !== session.user.id) return { message: "Unauthorized." };

  try {
    await prisma.pet.delete({ where: { id: validatedPetId.data } });
  } catch (e) {
    console.error(e);
    return { message: "Could not delete pet." };
  }

  revalidatePath("/app", "layout");
}

/* --- payment actions --- */

export async function createCheckoutSession() {
  const session = await checkAuth();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1Ow5h8BOMbfXGQFlCAOM6HLz",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?canceled=true`,
  });

  redirect(checkoutSession.url);
}
