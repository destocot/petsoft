"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PetFormBtn } from "@/components/pet-form-btn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { TPetForm, petFormSchema } from "@/lib/validations";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export const PetForm = ({ actionType, onFormSubmission }: PetFormProps) => {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: selectedPet?.name,
      ownerName: selectedPet?.ownerName,
      imageUrl: selectedPet?.imageUrl,
      age: selectedPet?.age,
      notes: selectedPet?.notes,
    },
  });

  return (
    <form
      action={async () => {
        const result = await trigger();
        if (!result) return;

        const petData = petFormSchema.safeParse(getValues());
        if (!petData.success) return;

        onFormSubmission();

        if (actionType === "add") {
          await handleAddPet(petData.data);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData.data);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <span className="text-red-500">{errors.ownerName.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <span className="text-red-500">{errors.imageUrl.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && (
            <span className="text-red-500">{errors.age.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} rows={3} />
          {errors.notes && (
            <span className="text-red-500">{errors.notes.message}</span>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
};
