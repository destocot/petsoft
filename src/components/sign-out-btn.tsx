"use client";
import { logOut } from "@/actions/actions";
import { Button } from "./ui/button";
import { useTransition } from "react";

export const SignOutBtn = () => {
  const [isPending, startTransition] = useTransition();

  const handleSignout = () => {
    startTransition(() => {
      logOut();
    });
  };

  return (
    <Button disabled={isPending} onClick={handleSignout}>
      Sign out
    </Button>
  );
};
