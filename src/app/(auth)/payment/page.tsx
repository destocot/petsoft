"use client";

import { createCheckoutSession } from "@/actions/actions";
import { H1 } from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PaymentProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Payment({ searchParams }: PaymentProps) {
  const [isPending, startTransition] = useTransition();
  const { update, status, data: session } = useSession();
  const router = useRouter();

  const handleSuccessfulPayment = async () => {
    await update(true);
    router.replace("/app/dashboard");
  };

  return (
    <main className="flex flex-col items-center gap-y-10">
      <H1>PetSoft access requires payment</H1>
      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => await createCheckoutSession());
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}
      {searchParams.success && (
        <Button
          onClick={handleSuccessfulPayment}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          Access PetSoft
        </Button>
      )}
      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {searchParams.canceled && (
        <p className="text-sm text-red-700">
          Payment canceled. You can try again.
        </p>
      )}
    </main>
  );
}
