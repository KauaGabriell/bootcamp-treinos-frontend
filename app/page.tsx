import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import { getHomeDate } from './_lib/api/fetch-generated';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Flame } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ConsistencyIndicator } from '@/components/consistency-indicator';
import { WorkoutDayCard } from '@/components/workout-day-card';

// Imagem do Banner do Figma
const imgBanner = "https://www.figma.com/api/mcp/asset/972d2276-559c-448e-be80-0d9683004201";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/login');

  const today = dayjs().format('YYYY-MM-DD');
  const response = await getHomeDate(today);

  // Garantimos que só processaremos se a resposta for sucesso (200)
  if (response.status !== 200) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-red-500">Erro ao carregar dados da Home.</p>
      </div>
    );
  }

  const homeData = response.data;
  const workoutLink = homeData?.todayWorkoutDay 
    ? `/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}`
    : '#';

  // Calculamos o início da semana (Segunda-feira)
  // dayjs().day(1) retorna a segunda-feira da semana atual
  const startOfWeek = dayjs().startOf('week').add(1, 'day');

  const dayLabels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const dayNamesFull = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO', 'DOMINGO'];

  const consistencyDays = dayLabels.map((label, index) => {
    const dateKey = startOfWeek.add(index, 'day').format('YYYY-MM-DD');
    const status = homeData.consistencyByDay[dateKey] || { 
      workoutDayCompleted: false, 
      workoutDayStarted: false 
    };

    return {
      label,
      completed: status.workoutDayCompleted,
      started: status.workoutDayStarted,
    };
  });

  const todayNamePt = homeData.todayWorkoutDay 
    ? dayNamesFull[dayjs().day() === 0 ? 6 : dayjs().day() - 1]
    : '';

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* Banner Section */}
      <section className="relative h-[296px] w-full overflow-hidden rounded-b-[20px]">
        <Image
          src={imgBanner}
          alt="Banner"
          fill
          className="object-cover object-center scale-110"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-80" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-5 pt-8">
          <span className="font-[family-name:var(--font-inter-tight)] text-[22px] font-bold text-white uppercase tracking-tighter">
            FIT.AI
          </span>
          
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-2xl font-semibold font-[family-name:var(--font-inter-tight)]">
                Olá, {session.data.user.name.split(' ')[0]}
              </h1>
              <p className="text-white/70 text-sm font-[family-name:var(--font-inter-tight)]">
                Bora treinar hoje?
              </p>
            </div>
            
            <button className="bg-[#2b54ff] text-white px-4 py-2 rounded-full text-sm font-semibold font-[family-name:var(--font-inter-tight)] shadow-lg active:scale-95 transition-transform">
              Bora!
            </button>
          </div>
        </div>
      </section>

      {/* Consistency Section */}
      <section className="px-5 mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-black font-[family-name:var(--font-inter-tight)]">
            Consistência
          </h2>
          <button className="text-[#2b54ff] text-xs font-[family-name:var(--font-inter-tight)]">
            Ver histórico
          </button>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <ConsistencyIndicator days={consistencyDays} />
          </div>
          
          <div className="bg-[#f06100]/10 flex items-center gap-2 px-4 py-3 rounded-[12px] h-full">
            <Flame className="w-5 h-5 text-[#f06100] fill-[#f06100]" />
            <span className="text-black font-semibold text-lg font-[family-name:var(--font-inter-tight)]">
              {homeData.workoutStreak}
            </span>
          </div>
        </div>
      </section>

      {/* Today's Workout Section */}
      <section className="px-5 mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-black font-[family-name:var(--font-inter-tight)]">
            Treino de Hoje
          </h2>
          <button className="text-[#2b54ff] text-xs font-[family-name:var(--font-inter-tight)]">
            Ver treinos
          </button>
        </div>

        {homeData.todayWorkoutDay ? (
          <WorkoutDayCard
            workoutPlanId={homeData.todayWorkoutDay.workoutPlanId}
            workoutDayId={homeData.todayWorkoutDay.id}
            name={homeData.todayWorkoutDay.name}
            weekDay={todayNamePt}
            coverImageUrl={homeData.todayWorkoutDay.coverImageUrl}
            durationInSeconds={homeData.todayWorkoutDay.estimatedDurationInSeconds}
            exercisesCount={homeData.todayWorkoutDay.exercisesCount}
          />
        ) : (
          <div className="w-full h-[200px] bg-zinc-100 rounded-[12px] flex items-center justify-center border-2 border-dashed border-zinc-200">
            <p className="text-zinc-400 font-medium">Nenhum treino para hoje</p>
          </div>
        )}
      </section>

      <Navbar workoutLink={workoutLink} />
    </main>
  );
}
