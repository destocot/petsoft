import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { BackgroundPattern } from "@/components/background-pattern";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BackgroundPattern />
      <div className="mx-auto flex min-h-screen max-w-[1050px] flex-col px-4">
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
