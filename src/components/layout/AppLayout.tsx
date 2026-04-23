import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0 overflow-x-hidden">
        <div className="container max-w-5xl py-8 md:py-10 px-4 md:px-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
};