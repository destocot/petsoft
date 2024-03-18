"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type TPetContext = {
  pets: Array<Pet>;
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

type PetContextProviderProps = {
  data: Array<Pet>;
  children: React.ReactNode;
};

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState<Array<Pet>>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / action
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const exposed: TPetContext = {
    pets,
    selectedPetId,
    selectedPet,
    numberOfPets,
    handleChangeSelectedPetId,
  };

  return <PetContext.Provider value={exposed}>{children}</PetContext.Provider>;
}
