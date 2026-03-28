'use client';

import { authClient } from '@/app/_lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Weight, 
  Ruler, 
  BicepsFlexed, 
  User, 
  LogOut 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useEffect, useState } from 'react';
import { getHomeDate, getMe } from '@/app/_lib/api/fetch-generated';
import dayjs from 'dayjs';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [workoutLink, setWorkoutLink] = useState('#');
  
  const [metrics, setMetrics] = useState({
    weight: null as string | null,
    height: null as string | null,
    bf: null as string | null,
    age: null as string | null,
  });

  // 1. Busca Link do Treino (Consistência de Navegação)
  useEffect(() => {
    async function fetchWorkoutLink() {
      const today = dayjs().format('YYYY-MM-DD');
      const response = await getHomeDate(today);
      if (response.status === 200 && response.data.todayWorkoutDay) {
        setWorkoutLink(`/workout-plans/${response.data.todayWorkoutDay.workoutPlanId}`);
      }
    }
    fetchWorkoutLink();
  }, []);

  // 2. Busca Dados Biométricos Dinâmicos
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getMe();
        
        if (response.status === 200 && response.data) {
          const data = response.data;
          
          setMetrics({
            // Conversão de Gramas para KG (se aplicável)
            weight: data.weightInGrams 
              ? (data.weightInGrams / 1000).toFixed(1).replace('.0', '') 
              : null,
            height: data.heightInCentimeters 
              ? String(data.heightInCentimeters) 
              : null,
            // Conversão de Decimal (0.15) para Porcentagem (15%)
            bf: data.bodyFatPercentage 
              ? (data.bodyFatPercentage * 100).toFixed(1).replace('.0', '') 
              : null,
            age: data.age 
              ? String(data.age) 
              : null,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados dinâmicos:', error);
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  const user = session?.user;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen pb-32 font-[family-name:var(--font-inter-tight)]">
      {/* Header */}
      <header className="flex flex-row items-center p-5 w-full max-w-[393px] h-[56px] border-b border-gray-50">
        <h1 className="font-['Anton'] text-[22px] leading-[115%] uppercase text-black">
          Fit.ai
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center p-5 gap-5 w-full max-w-[393px]">
        {/* User Info Header */}
        <div className="flex flex-row justify-between items-center w-full h-[52px]">
          <div className="flex flex-row items-center gap-3">
            <Avatar className="w-[52px] h-[52px] border-none">
              <AvatarImage src={user?.image || undefined} alt={user?.name} className="object-cover" />
              <AvatarFallback className="bg-gray-100 font-semibold">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h2 className="text-[18px] font-semibold leading-[105%] text-black tracking-tight">
                {user?.name || 'Carregando...'}
              </h2>
              <span className="text-[14px] font-normal leading-[115%] text-black/60 mt-0.5">
                Plano Básico
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full hover:bg-gray-100 transition-colors">
            <Pencil className="w-5 h-5 text-black" />
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          {/* Weight */}
          <div className="flex flex-col items-center p-5 gap-5 bg-[#2B54FF]/[0.08] rounded-[12px]">
            <div className="w-[34px] h-[34px] flex items-center justify-center bg-[#2B54FF]/[0.08] rounded-full">
              <Weight className="w-4 h-4 text-[#2B54FF]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[24px] font-semibold leading-[115%] text-black">
                {metrics.weight || '-'}
              </span>
              <span className="text-[12px] font-normal uppercase text-[#656565] tracking-wider">Peso (kg)</span>
            </div>
          </div>

          {/* Height */}
          <div className="flex flex-col items-center p-5 gap-5 bg-[#2B54FF]/[0.08] rounded-[12px]">
            <div className="w-[34px] h-[34px] flex items-center justify-center bg-[#2B54FF]/[0.08] rounded-full">
              <Ruler className="w-4 h-4 text-[#2B54FF]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[24px] font-semibold leading-[115%] text-black">
                {metrics.height || '-'}
              </span>
              <span className="text-[12px] font-normal uppercase text-[#656565] tracking-wider">Altura (cm)</span>
            </div>
          </div>

          {/* Body Fat */}
          <div className="flex flex-col items-center p-5 gap-5 bg-[#2B54FF]/[0.08] rounded-[12px]">
            <div className="w-[34px] h-[34px] flex items-center justify-center bg-[#2B54FF]/[0.08] rounded-full">
              <BicepsFlexed className="w-4 h-4 text-[#2B54FF]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[24px] font-semibold leading-[115%] text-black">
                {metrics.bf || '-'}
              </span>
              <span className="text-[12px] font-normal uppercase text-[#656565] tracking-wider">BF (%)</span>
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col items-center p-5 gap-5 bg-[#2B54FF]/[0.08] rounded-[12px]">
            <div className="w-[34px] h-[34px] flex items-center justify-center bg-[#2B54FF]/[0.08] rounded-full">
              <User className="w-4 h-4 text-[#2B54FF]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[24px] font-semibold leading-[115%] text-black">
                {metrics.age || '-'}
              </span>
              <span className="text-[12px] font-normal uppercase text-[#656565] tracking-wider">Idade</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="flex flex-row items-center justify-center gap-2 p-2 px-4 mt-8 w-fit h-[32px] rounded-full hover:bg-red-50 group transition-all"
        >
          <span className="text-[16px] font-semibold text-[#FF3838] group-hover:text-red-600 transition-colors">Sair da conta</span>
          <LogOut className="w-4 h-4 text-[#FF3838] group-hover:text-red-600 transition-colors" />
        </Button>
      </main>

      <Navbar workoutLink={workoutLink} />
    </div>
  );
}
