import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}