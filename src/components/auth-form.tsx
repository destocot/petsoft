"use client";

import { logIn, signUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AuthFormBtn } from "./auth-form-btn";
import { useFormState } from "react-dom";

type AuthFormProps = { type: "login" | "signup" };

export const AuthForm = ({ type }: AuthFormProps) => {
  const action = type === "login" ? logIn : signUp;
  const [error, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction}>
      <div className="mb-4 space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="mb-4 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <AuthFormBtn type={type} />
      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </form>
  );
};
