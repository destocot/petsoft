import "server-only";
import { auth } from "@/lib/auth-no-edge";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Pet, User } from "@prisma/client";

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getPetById(petId: Pet["id"]) {
  return await prisma.pet.findUnique({ where: { id: petId } });
}

export async function getPetsByUserId(userId: User["id"]) {
  return await prisma.pet.findMany({ where: { userId } });
}
