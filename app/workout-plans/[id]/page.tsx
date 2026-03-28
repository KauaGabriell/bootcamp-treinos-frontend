import { getWorkoutPlan } from '@/app/_lib/api/fetch-generated';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { WorkoutDayCard } from '@/components/workout-day-card';


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutPlanPage({ params }: PageProps) {
  const { id } = await params;
  
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/login');

  const response = await getWorkoutPlan(id);

  if (response.status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
        <h1 className="text-xl font-bold">Erro ao carregar plano</h1>
        <p className="text-zinc-500">Não conseguimos encontrar os detalhes deste plano de treino.</p>
        <Link href="/" className="mt-4 text-[#2b54ff] font-semibold">Voltar para a Home</Link>
      </div>
    );
  }

  const plan = response.data;
  const mainCoverImage = "/images/mainCoverImage.png";

  const dayNamesPt: Record<string, string> = {
    MONDAY: 'SEG',
    TUESDAY: 'TER',
    WEDNESDAY: 'QUA',
    THURSDAY: 'QUI',
    FRIDAY: 'SEX',
    SATURDAY: 'SAB',
    SUNDAY: 'DOM',
  };

  return (
    <main className="min-h-screen bg-white pb-40">
      {/* Banner Section (Figma node 3606-80) */}
      <section className="relative w-full h-[296px] overflow-hidden rounded-b-[20px]">
        <Image
          src={mainCoverImage}
          alt={plan.name}
          fill
          className="object-cover"
          priority
        />
        {/* Figma Linear Gradient: 244.87deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100% */}
        <div className="absolute inset-0 bg-[linear-gradient(244.87deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />
        
        {/* Banner Content Container (Auto Layout: space-between, padding 20px 20px 40px) */}
        <div className="absolute inset-0 flex flex-col justify-between items-start p-[20px_20px_40px] z-10">
          {/* Logo Fit.ai (Using SVG from public) */}
          <div className="relative w-[44px] h-[19px]">
            <Image 
              src="/images/fitai-logo.svg" 
              alt="Fit.ai" 
              fill 
              className="object-contain invert brightness-0" 
            />
          </div>

          {/* Frame 33: Bottom Section */}
          <div className="w-full flex items-end justify-between">
            <div className="flex flex-col items-start gap-3">
              {/* Account Type Badge (Plan Name / Objective) */}
              <div className="h-[26px] px-[10px] py-[5px] bg-[#2B54FF] rounded-full flex items-center justify-center gap-1">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-[12px] h-[12px] border-[1.2px] border-white rounded-full" />
                </div>
                <span className="text-white text-[12px] font-semibold uppercase leading-none font-[family-name:var(--font-inter-tight)]">
                  {plan.name}
                </span>
              </div>

              {/* Plano de Treino Label */}
              <h1 className="text-white text-[24px] font-semibold leading-[105%] font-[family-name:var(--font-inter-tight)]">
                Plano de Treino
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-10 mt-10">
        {/* Workout Days List */}
        <section className="px-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-black font-[family-name:var(--font-inter-tight)]">
              Dias da Semana
            </h2>
            <span className="text-[14px] text-[#656565] font-[family-name:var(--font-inter-tight)] font-medium">
              7 Dias
            </span>
          </div>
          
          <div className="flex flex-col gap-4">
            {plan.workoutDays.map((day) => (
              <WorkoutDayCard
                key={day.id}
                workoutPlanId={plan.id}
                workoutDayId={day.id}
                name={day.name}
                weekDay={dayNamesPt[day.weekDay] || day.weekDay}
                coverImageUrl={day.coverImageUrl}
                durationInSeconds={day.estimatedDurationInSeconds}
                exercisesCount={day.exercisesCount}
                isRest={day.isRest}
              />
            ))}
          </div>
        </section>
      </div>

      <Navbar />
    </main>
  );
}
