import { HelpCircle, Zap } from 'lucide-react';

interface ExerciseItemProps {
  name: string;
  sets: number;
  reps: number;
  order: number;
  restTimeInSeconds: number;
}

export function ExerciseItem({ name, sets, reps, restTimeInSeconds }: Omit<ExerciseItemProps, 'order'>) {
  return (
    <div className="flex items-center justify-between p-5 bg-white border border-[#f1f1f1] rounded-[12px] shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[16px] font-semibold text-black font-[family-name:var(--font-inter-tight)] leading-tight">
            {name}
          </span>
          
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-[#f1f1f1] rounded-full">
              <span className="text-[12px] text-[#656565] font-[family-name:var(--font-inter-tight)] font-semibold uppercase">
                {sets} séries
              </span>
            </div>
            
            <div className="px-2 py-0.5 bg-[#f1f1f1] rounded-full">
              <span className="text-[12px] text-[#656565] font-[family-name:var(--font-inter-tight)] font-semibold uppercase">
                {reps} reps
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#f1f1f1] rounded-full">
              <Zap className="w-3.5 h-3.5 text-[#656565] fill-[#656565]" />
              <span className="text-[12px] text-[#656565] font-[family-name:var(--font-inter-tight)] font-semibold uppercase">
                {restTimeInSeconds}S
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <button className="text-[#656565] hover:text-[#2b54ff] transition-colors p-1">
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
