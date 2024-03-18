import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { BackgroundPattern } from "@/components/background-pattern";
import PetContextProvider from "@/context/pet-context-provider";
import { Pet } from "@/lib/types";

const url = "https://bytegrad.com/course-assets/projects/petsoft/api/pets";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not fetch pets");

  const data: Array<Pet> = await response.json();

  return (
    <>
      <BackgroundPattern />
      <div className="mx-auto flex min-h-screen max-w-[1050px] flex-col px-4">
        <AppHeader />
        <PetContextProvider data={data}>{children}</PetContextProvider>
        <AppFooter />
      </div>
    </>
  );
}
