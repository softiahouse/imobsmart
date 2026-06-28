import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { OnboardingTour } from "@/components/onboarding-tour";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-64 pb-24 md:pb-0">
        <AppHeader />
        <div className="px-4 md:px-6">
          {children}
        </div>
      </main>
      <BottomNav />
      <OnboardingTour />
    </div>
  );
}
