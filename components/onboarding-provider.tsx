'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getMe, listWorkoutPlans, ListWorkoutPlansActive } from '@/app/_lib/api/fetch-generated';
import { authClient } from '@/app/_lib/auth-client';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verifyOnboarding() {
      // Ignora páginas de login e o próprio onboarding
      if (pathname === '/login' || pathname === '/onboarding') {
        setIsVerifying(false);
        return;
      }

      if (isPending) return;

      if (!session) {
        setIsVerifying(false);
        return;
      }

      try {
        const [meResponse, plansResponse] = await Promise.all([
          getMe(),
          listWorkoutPlans({ active: ListWorkoutPlansActive.true })
        ]);

        const hasBioData = meResponse.status === 200 && 
                          meResponse.data && 
                          meResponse.data.weightInGrams && 
                          meResponse.data.heightInCentimeters;

        const hasActivePlan = plansResponse.status === 200 && 
                             Array.isArray(plansResponse.data) && 
                             plansResponse.data.length > 0;

        if (!hasBioData || !hasActivePlan) {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Falha na verificação de onboarding:', error);
      } finally {
        setIsVerifying(false);
      }
    }

    verifyOnboarding();
  }, [pathname, session, isPending, router]);

  if (isVerifying && pathname !== '/login' && pathname !== '/onboarding') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#2B54FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
