import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";

export const GetStartedBtn = async () => {
  const session = await auth();

  return (
    <Button asChild>
      <Link href={session?.user ? "/app/dashboard" : "/signup"}>
        Get started
      </Link>
    </Button>
  );
};
