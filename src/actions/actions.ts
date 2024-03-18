"use server";
import prisma from "@/lib/db";
import { delay } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const defaultImageUrl =
  "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png";

export async function addPet(formData) {
  await delay(2000);

  try {
    await prisma.pet.create({
      data: {
        name: formData.get("name"),
        ownerName: formData.get("ownerName"),
        imageUrl: formData.get("imageUrl") || defaultImageUrl,
        age: Number(formData.get("age")),
        notes: formData.get("notes"),
      },
    });
  } catch (error) {
    return { message: "Could not add pet." };
  }

  revalidatePath("/app", "layout");
}
