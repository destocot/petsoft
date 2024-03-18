"use server";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { delay } from "@/lib/utils";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(pet: PetEssentials) {
  await delay(500);

  try {
    await prisma.pet.create({ data: pet });
  } catch (e) {
    console.error(e);
    return { message: "Could not add pet." };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
  await delay(500);

  try {
    await prisma.pet.update({ where: { id: petId }, data: newPetData });
  } catch (e) {
    console.error(e);
    return { message: "Could not edit pet." };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await delay(500);

  try {
    await prisma.pet.delete({ where: { id: petId } });
  } catch (e) {
    console.error(e);
    return { message: "Could not delete pet." };
  }

  revalidatePath("/app", "layout");
}
