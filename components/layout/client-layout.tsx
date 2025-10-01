'use client';

import { useAuth } from '@/lib/auth-context';
import { Header } from './header';
import { BottomNavigation } from './bottom-navigation';
import { OnboardingSlider } from '@/components/ui/onboarding-slider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();

  if (!state.hasSeenOnboarding) {
    return <OnboardingSlider />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}