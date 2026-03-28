'use client';

import { HelpCircle, Zap } from 'lucide-react';
import { useQueryState, parseAsBoolean, parseAsString } from 'nuqs';

interface ExerciseItemProps {
  name: string;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
}

export function ExerciseItem({ name, sets, reps, restTimeInSeconds }: ExerciseItemProps) {
  const [, setChatOpen] = useQueryState('chat_open', parseAsBoolean);
  const [, setInitialMessage] = useQueryState('chat_initial_message', parseAsString);

  const handleHelpClick = async () => {
    await setInitialMessage(`Como executar o exercício ${name} corretamente?`);
    await setChatOpen(true);
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white border border-[#f1f1f1] rounded-[12px]">
      <div className="flex flex-col gap-3">
        <span className="text-[16px] font-semibold text-black leading-tight">
          {name}
        </span>
        
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-[#f1f1f1] rounded-full">
            <span className="text-[12px] text-[#656565] font-semibold uppercase leading-none">
              {sets} séries
            </span>
          </div>
          
          <div className="px-2 py-0.5 bg-[#f1f1f1] rounded-full">
            <span className="text-[12px] text-[#656565] font-semibold uppercase leading-none">
              {reps} reps
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f1f1f1] rounded-full">
            <Zap className="w-3.5 h-3.5 text-[#656565] fill-[#656565]" />
            <span className="text-[12px] text-[#656565] font-semibold uppercase leading-none">
              {restTimeInSeconds}S
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleHelpClick}
        className="text-[#656565] hover:text-[#2b54ff] transition-colors p-1"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
