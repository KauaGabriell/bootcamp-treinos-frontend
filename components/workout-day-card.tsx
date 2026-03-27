import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Timer, Dumbbell, Zap } from 'lucide-react';

interface WorkoutDayCardProps {
  workoutPlanId: string;
  workoutDayId: string;
  name: string;
  weekDay: string;
  coverImageUrl?: string | null;
  durationInSeconds: number;
  exercisesCount: number;
  isRest?: boolean;
}

export function WorkoutDayCard({
  workoutPlanId,
  workoutDayId,
  name,
  weekDay,
  coverImageUrl,
  durationInSeconds,
  exercisesCount,
  isRest = false,
}: WorkoutDayCardProps) {
  // Versão Rest Day (100% fiel ao Figma CSS)
  if (isRest) {
    return (
      <div className="flex flex-col justify-between items-start p-5 w-full h-[110px] bg-[#F1F1F1] rounded-[12px] border-none">
        <div className="flex flex-row justify-center items-center gap-[6px]">
          <div className="flex flex-row justify-center items-center px-[10px] py-[5px] gap-1 bg-black/10 backdrop-blur-[4px] rounded-full">
            <Calendar className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            <span className="text-black text-[12px] font-semibold uppercase leading-none font-[family-name:var(--font-inter-tight)]">
              {weekDay}
            </span>
          </div>
        </div>

        {/* Frame 35: Title Section */}
        <div className="flex flex-row items-center gap-2">
          <Zap className="w-5 h-5 text-[#2B54FF] fill-[#2B54FF]" />
          <h3 className="text-black text-[24px] font-semibold leading-[105%] font-[family-name:var(--font-inter-tight)]">
            {name === 'Rest Day' ? 'Dia de Descanso' : name}
          </h3>
        </div>
        </div>
        );
        }

  // Versão Workout Day (Mantendo a fidelidade anterior)
  return (
    <Link 
      href={`/workout-plans/${workoutPlanId}/days/${workoutDayId}`} 
      className="block relative h-[200px] w-full rounded-[12px] overflow-hidden group"
    >
      <Image
        src={coverImageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"}
        alt={name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex justify-start">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              {weekDay}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-white text-2xl font-semibold font-[family-name:var(--font-inter-tight)]">
            {name}
          </h3>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/70 text-xs">
                {Math.floor(durationInSeconds / 60)}min
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/70 text-xs">
                {exercisesCount} exercícios
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
