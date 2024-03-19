"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type AuthFormBtnProps = { type: "login" | "signup" };

export const AuthFormBtn = ({ type }: AuthFormBtnProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {type === "login" ? "Log In" : "Sign Up"}
    </Button>
  );
};
