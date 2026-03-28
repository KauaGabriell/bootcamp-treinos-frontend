'use client';

import { startWorkoutSession, completeWorkoutSession } from '@/app/_lib/api/fetch-generated';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface WorkoutActionButtonsProps {
  workoutPlanId: string;
  workoutDayId: string;
  activeSessionId?: string | null;
  isCompleted?: boolean;
  variant?: 'floating' | 'card';
}

export function WorkoutActionButtons({
  workoutPlanId,
  workoutDayId,
  activeSessionId,
  isCompleted,
  variant = 'floating',
}: WorkoutActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await startWorkoutSession(workoutPlanId, workoutDayId);
      router.refresh();
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!activeSessionId) return;
    setLoading(true);
    try {
      await completeWorkoutSession(workoutPlanId, workoutDayId, activeSessionId, {
        completedAt: dayjs().toISOString(),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to complete session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'card') {
    if (isCompleted) {
      return (
        <div className="flex flex-row justify-center items-center gap-2 w-[113px] h-[30px] p-[8px_16px] bg-[#24D500] rounded-[100px]">
          <span className="text-white text-[12px] font-bold uppercase tracking-wide">
            Concluído
          </span>
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      );
    }

    if (activeSessionId) {
      return (
        <div className="flex flex-row justify-center items-center gap-2 w-[130px] h-[30px] p-[8px_16px] bg-white/20 backdrop-blur-md border border-white/10 rounded-[100px]">
          <span className="text-white text-[12px] font-bold uppercase tracking-wide italic">
            Em andamento
          </span>
        </div>
      );
    }

    return (
      <Button 
        onClick={handleStart} 
        disabled={loading}
        className={cn(
          "flex flex-row justify-center items-center gap-2",
          "w-[113px] h-[30px] p-[8px_16px] bg-[#2B54FF] hover:bg-[#2B54FF]/90 rounded-[100px]",
          "text-white text-[12px] font-bold uppercase tracking-wide",
          "border-none shadow-none transition-all active:scale-95 shrink-0"
        )}
      >
        {loading ? '...' : 'Iniciar'}
      </Button>
    );
  }

  if (isCompleted || !activeSessionId) {
    return null;
  }

  return (
    <div className="fixed bottom-[104px] left-1/2 -translate-x-1/2 w-full max-w-[393px] px-5 z-40">
      <Button 
        onClick={handleComplete} 
        disabled={loading}
        className="w-full h-[42px] rounded-full bg-white border border-[#F1F1F1] text-[#656565] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 text-[14px] shadow-sm hover:bg-[#F1F1F1]/50"
      >
        {loading ? 'Finalizando...' : 'Marcar como concluído'}
      </Button>
    </div>
  );
}
