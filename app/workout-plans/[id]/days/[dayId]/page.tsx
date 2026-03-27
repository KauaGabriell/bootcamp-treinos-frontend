import { getWorkoutDayDetails, getWorkoutPlan } from '@/app/_lib/api/fetch-generated';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Timer, Dumbbell, Calendar } from 'lucide-react';
import Link from 'next/link';
import { ExerciseItem } from '@/components/exercise-item';
import { WorkoutActionButtons } from '@/components/workout-action-buttons';
import { Navbar } from '@/components/navbar';

interface PageProps {
  params: Promise<{
    id: string;
    dayId: string;
  }>;
}

export default async function WorkoutDayPage({ params }: PageProps) {
  const { id, dayId } = await params;
  
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/login');

  const [response, planResponse] = await Promise.all([
    getWorkoutDayDetails(id, dayId),
    getWorkoutPlan(id)
  ]);

  if (response.status !== 200 || planResponse.status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
        <h1 className="text-xl font-bold">Erro ao carregar treino</h1>
        <p className="text-zinc-500">Não conseguimos encontrar os detalhes deste dia de treino.</p>
        <Link href="/" className="mt-4 text-[#2b54ff] font-semibold">Voltar para a Home</Link>
      </div>
    );
  }

  const workoutDay = response.data;
  

  // Lógica de sessões
  const activeSession = workoutDay.sessions.find(s => !s.completedAt);
  const completedSession = workoutDay.sessions.find(s => s.completedAt);

  const dayNamesFull: Record<string, string> = {
    MONDAY: 'Segunda-feira',
    TUESDAY: 'Terça-feira',
    WEDNESDAY: 'Quarta-feira',
    THURSDAY: 'Quinta-feira',
    FRIDAY: 'Sexta-feira',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  const dayNamePt = dayNamesFull[workoutDay.weekDay] || workoutDay.weekDay;

  return (
    <main className="min-h-screen bg-white pb-40">
      {/* Top Navigation */}
      <div className="px-5 pt-[60px] pb-6 flex items-center justify-center relative">
        <Link href="/" className="absolute left-5 flex items-center justify-center w-10 h-10 rounded-full bg-[#f1f1f1] text-black hover:bg-zinc-200 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-[18px] font-semibold text-black font-[family-name:var(--font-inter-tight)]">
          Treino de Hoje
        </h2>
      </div>

      {/* Main Workout Card */}
      <section className="px-5">
        <div className="relative h-[240px] w-full overflow-hidden rounded-[16px] shadow-sm">
          <Image
            src={workoutDay.coverImageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"}
            alt={workoutDay.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
          
          {/* Day Pill (Top Left) */}
          <div className="absolute top-4 left-5 z-20">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px] text-white font-bold uppercase tracking-wider">
                {dayNamePt}
              </span>
            </div>
          </div>

          {/* Content inside Card */}
          <div className="absolute bottom-6 left-5 right-5 z-10 flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-[24px] font-bold font-[family-name:var(--font-inter-tight)] leading-tight tracking-tight">
                {workoutDay.name}
              </h1>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-white/70" />
                  <span className="text-white/70 text-sm font-[family-name:var(--font-inter-tight)]">
                    {Math.floor(workoutDay.estimatedDurationInSeconds / 60)}min
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-white/70" />
                  <span className="text-white/70 text-sm font-[family-name:var(--font-inter-tight)]">
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>

            <WorkoutActionButtons
              workoutPlanId={id}
              workoutDayId={dayId}
              activeSessionId={activeSession?.id}
              isCompleted={!!completedSession}
              variant="card"
            />
          </div>
        </div>
      </section>

      {/* Exercises List */}
      <section className="px-5 mt-10 flex flex-col gap-4">
        <h2 className="text-[18px] font-semibold text-black font-[family-name:var(--font-inter-tight)]">
          Exercícios
        </h2>
        
        <div className="flex flex-col gap-3">
          {workoutDay.exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              restTimeInSeconds={exercise.restTimeInSeconds}
            />
          ))}
        </div>
      </section>

      {/* Action Floating Container */}
      <WorkoutActionButtons
        workoutPlanId={id}
        workoutDayId={dayId}
        activeSessionId={activeSession?.id}
        isCompleted={!!completedSession}
        variant="floating"
      />

      <Navbar />
    </main>
  );
}
