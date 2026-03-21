interface ConsistencyIndicatorProps {
  days: {
    label: string;
    completed: boolean;
    started: boolean;
  }[];
}

export function ConsistencyIndicator({ days }: ConsistencyIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full border border-[#f1f1f1] rounded-[12px] p-5 bg-white">
      {days.map((day, index) => (
        <div key={index} className="flex flex-col items-center gap-[6px]">
          <div
            className={`w-5 h-5 rounded-[6px] border ${
              day.completed
                ? 'bg-[#2b54ff] border-[#2b54ff]'
                : day.started
                ? 'bg-[#d5dffe] border-[#d5dffe]'
                : 'bg-white border-[#f1f1f1]'
            }`}
          />
          <span className="text-[12px] text-[#656565] font-[family-name:var(--font-inter-tight)] uppercase">
            {day.label}
          </span>
        </div>
      ))}
    </div>
  );
}
