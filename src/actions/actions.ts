"use server";

import prisma from "@/lib/db";
import { delay } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function addPet(pet: unknown) {
  await delay(500);

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) return { message: "Invalid pet data." };

  try {
    await prisma.pet.create({ data: validatedPet.data });
  } catch (e) {
    console.error(e);
    return { message: "Could not add pet." };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await delay(500);

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedPet.success) {
    return { message: "Invalid pet data." };
  }
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
  await delay(500);

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) return { message: "Invalid pet data." };

  try {
    await prisma.pet.delete({ where: { id: validatedPetId.data } });
  } catch (e) {
    console.error(e);
    return { message: "Could not delete pet." };
  }

  revalidatePath("/app", "layout");
}
