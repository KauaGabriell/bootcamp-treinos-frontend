'use client';

import { startWorkoutSession, completeWorkoutSession } from '@/app/_lib/api/fetch-generated';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

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
        <span className="text-white/70 text-[14px] font-semibold font-[family-name:var(--font-inter-tight)]">
          Concluído
        </span>
      );
    }

    if (activeSessionId) {
      return (
        <span className="text-white/70 text-[14px] font-semibold font-[family-name:var(--font-inter-tight)] italic">
          Em andamento...
        </span>
      );
    }

    return (
      <Button 
        onClick={handleStart} 
        disabled={loading}
        className={cn(
          "flex flex-row justify-center items-center gap-2",
          "w-[113px] h-[30px] p-[8px_16px] bg-[#2B54FF] hover:bg-[#2B54FF]/90 rounded-[100px]",
          "text-white text-[12px] font-bold font-[family-name:var(--font-inter-tight)] uppercase tracking-wide",
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
    <div className="fixed bottom-[104px] left-0 right-0 px-5 z-40">
      <Button 
        onClick={handleComplete} 
        disabled={loading}
        className="w-full h-[38px] rounded-full bg-white border border-[#F1F1F1] text-[#656565] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 text-[14px] shadow-none hover:bg-[#F1F1F1]/50"
      >
        {loading ? 'Finalizando...' : 'Marcar como concluído'}
      </Button>
    </div>
  );
}
