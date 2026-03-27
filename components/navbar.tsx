import Link from 'next/link';
import { Home, Calendar, Sparkles, BarChart2, User } from 'lucide-react';
import { getHomeDate } from '@/app/_lib/api/fetch-generated';
import dayjs from 'dayjs';

export async function Navbar() {
  const today = dayjs().format('YYYY-MM-DD');
  
  // Buscamos os dados da home para saber o link do treino de hoje
  const response = await getHomeDate(today);

  const homeData = response.status === 200 ? response.data : null;

  const workoutLink = homeData?.todayWorkoutDay 
    ? `/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}/days/${homeData.todayWorkoutDay.id}`
    : '#';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f1f1f1] px-6 py-4 rounded-t-[20px] flex items-center justify-between z-50">
      <Link href="/" className="p-3">
        <Home className="w-6 h-6 text-black" />
      </Link>
      
      <Link href={workoutLink} className="p-3">
        <Calendar className="w-6 h-6 text-[#656565]" />
      </Link>

      <div className="bg-[#2b54ff] p-4 rounded-full -mt-10 shadow-lg shadow-[#2b54ff]/20">
        <Sparkles className="w-6 h-6 text-white" />
      </div>

      <button className="p-3">
        <BarChart2 className="w-6 h-6 text-[#656565]" />
      </button>

      <button className="p-3">
        <User className="w-6 h-6 text-[#656565]" />
      </button>
    </nav>
  );
}
