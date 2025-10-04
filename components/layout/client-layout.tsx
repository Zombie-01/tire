"use client";

import { useEffect, useState } from "react";
import { Header } from "./header";
import { BottomNavigation } from "./bottom-navigation";
import { OnboardingSlider } from "@/components/ui/onboarding-slider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seenOnboarding = localStorage.getItem("hasSeenOnboarding") === "true";
    setHasSeenOnboarding(seenOnboarding);
  }, []);

  if (!hasSeenOnboarding) {
    return <OnboardingSlider />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
}
