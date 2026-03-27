import { redirect } from 'next/navigation';
import { authClient } from '@/app/_lib/auth-client';
import { headers } from 'next/headers';
import { getStats } from '../_lib/api/fetch-generated';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Flame, CheckCircle, Percent, Hourglass } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';

dayjs.locale('pt-br');

// Helper para formatar segundos em XhYm
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h${minutes}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect('/login');

  // Últimos 5 meses (mês atual + 4 anteriores)
  const currentMonth = dayjs().startOf('month');
  const fourMonthsAgo = currentMonth.subtract(4, 'month');
  
  const from = fourMonthsAgo.startOf('month').format('YYYY-MM-DD');
  const to = dayjs().endOf('month').format('YYYY-MM-DD');

  const response = await getStats({ from, to });

  if (response.status !== 200) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-red-500 font-medium font-[family-name:var(--font-inter-tight)]">
          Erro ao carregar estatísticas.
        </p>
      </div>
    );
  }

  const stats = response.data;
  const hasStreak = stats.workoutStreak > 0;

  // Banner background dinâmico
  const imgBanner = hasStreak ? "/images/stats-banner.png" : "/images/stats0banner.png";

  const months = [
    fourMonthsAgo,
    currentMonth.subtract(3, 'month'),
    currentMonth.subtract(2, 'month'),
    currentMonth.subtract(1, 'month'),
    currentMonth,
  ];

  return (
    <main className="min-h-screen bg-white pb-32 flex flex-col items-center max-w-[393px] mx-auto overflow-hidden">
      {/* Header */}
      <header className="w-[393px] h-[56px] flex flex-row items-center p-5 gap-[142px] shrink-0 self-stretch">
        <span className="w-11 h-[19px] font-[family-name:var(--font-anton)] font-normal text-[22px] leading-[115%] uppercase text-black shrink-0 flex items-center">
          FIT.AI
        </span>
      </header>

      {/* Frame (Banner Container) */}
      <section className="w-[393px] h-[210px] px-5 flex flex-col items-start shrink-0 self-stretch">
        {/* Banner Card */}
        <div 
          className="w-[353px] h-[210px] rounded-[12px] flex flex-col justify-center items-center p-[40px_20px] gap-6 shrink-0 self-stretch relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${imgBanner})` }}
        >
          {/* Frame 40 */}
          <div className={cn("flex flex-col items-center p-0 gap-3 shrink-0", hasStreak ? "w-[147px] h-[130px]" : "w-[130px] h-[130px]")}>
            {/* Frame 39 (Icon Circle) */}
            <div className="box-border flex flex-col items-start p-3 gap-[10px] w-14 h-14 bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.12)] backdrop-blur-[4px] rounded-[99px] shrink-0 flex-none">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <Flame className={cn(
                  "w-[24.8px] h-8 shrink-0",
                  hasStreak ? "text-[#F06100] fill-[#F06100]" : "text-white fill-white"
                )} />
              </div>
            </div>

            <div className={cn("flex flex-col justify-center items-center p-0 gap-1 shrink-0 flex-none", hasStreak ? "w-[147px] h-[62px]" : "w-[130px] h-[62px]")}>
              <h2 className={cn("h-[46px] font-[family-name:var(--font-inter-tight)] font-semibold text-[48px] leading-[95%] text-center text-white shrink-0", hasStreak ? "w-[147px]" : "w-[130px]")}>
                {stats.workoutStreak}
              </h2>
              <p className="w-[111px] h-3 font-[family-name:var(--font-inter-tight)] font-normal text-[16px] leading-[115%] text-white opacity-60 shrink-0">
                Sequência Atual
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedules Section */}
      <section className="w-[393px] flex flex-col items-start p-5 gap-3 shrink-0 self-stretch">
        <div className="w-[353px] h-[25px] flex flex-row items-center p-0 gap-3 shrink-0 self-stretch">
          <h3 className="w-[106px] h-[25px] font-[family-name:var(--font-inter-tight)] font-semibold text-[18px] leading-[140%] text-black shrink-0">
            Consistência
          </h3>
        </div>

        {/* Frame 9 (Horizontal Month Container) - Ajustado para 5 meses */}
        <div className="box-border w-[353px] h-[227px] flex flex-row items-start p-5 gap-3 shrink-0 self-stretch border border-[#F1F1F1] rounded-[12px] overflow-hidden">
          {months.map((month, mIdx) => {
            const monthStart = month.startOf('month');
            
            // Gerar 30 dias para formar a grade 3x10
            const days = Array.from({ length: 30 }, (_, i) => monthStart.add(i, 'day'));
            
            // Dividir em 3 colunas de 10 dias
            const columns = [
              days.slice(0, 10),
              days.slice(10, 20),
              days.slice(20, 30),
            ];

            return (
              <div key={mIdx} className="flex flex-col justify-center items-start p-0 gap-1.5 shrink-0">
                <span className="h-[17px] font-[family-name:var(--font-inter-tight)] font-normal text-[12px] leading-[140%] text-[#656565] shrink-0 capitalize">
                  {month.format('MMM')}
                </span>
                
                {/* Grade de 3 colunas */}
                <div className="flex flex-row items-start p-0 gap-1 shrink-0 h-[164px]">
                  {columns.map((column, colIdx) => (
                    <div key={colIdx} className="flex flex-col items-start p-0 gap-1 shrink-0">
                      {column.map((day, dIdx) => {
                        const isCurrentMonth = day.month() === month.month();
                        const dateKey = day.format('YYYY-MM-DD');
                        const dayStatus = stats.consistencyByDay[dateKey];
                        
                        if (!isCurrentMonth) {
                          // Se o dia não pertence ao mês (ex: 31 em mês de 30), renderizamos vazio para manter a grade
                          return <div key={dIdx} className="w-[14px] h-[14px] shrink-0" />;
                        }

                        let cellClass = "border border-[#F1F1F1]";
                        if (dayStatus?.workoutDayCompleted) {
                          cellClass = "bg-[#2B54FF] border-[#2B54FF]";
                        } else if (dayStatus?.workoutDayStarted) {
                          cellClass = "bg-[#D5DFFE] border-[#D5DFFE]";
                        }

                        return (
                          <div
                            key={dIdx}
                            className={cn(
                              "w-[14px] h-[14px] rounded-[4px] shrink-0 transition-colors",
                              cellClass
                            )}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Cards Section */}
        <div className="flex flex-col items-start p-0 gap-3 w-[353px] shrink-0 self-stretch mt-3">
          <div className="flex flex-row items-center p-0 gap-3 w-[353px] h-[134px] shrink-0 self-stretch">
            {/* Treinos Feitos */}
            <div className="flex flex-col items-center p-5 gap-5 w-[170.5px] h-[134px] bg-[rgba(43,84,255,0.08)] rounded-[12px] shrink-0 grow self-stretch">
              <div className="flex flex-row items-center p-[9px] gap-[7.5px] w-[34px] h-[34px] bg-[rgba(43,84,255,0.08)] rounded-[99px] shrink-0">
                <CheckCircle className="w-4 h-4 text-[#2B54FF]" />
              </div>
              <div className="flex flex-col justify-center items-center p-0 gap-1.5 w-[72px] h-10 shrink-0">
                <span className="w-auto h-[17px] font-[family-name:var(--font-inter-tight)] font-semibold text-[24px] leading-[115%] text-black shrink-0">
                  {stats.completedWorkoutsCount}
                </span>
                <span className="w-[72px] h-[17px] font-[family-name:var(--font-inter-tight)] font-normal text-[12px] leading-[140%] text-[#656565] shrink-0 text-center">
                  Treinos feitos
                </span>
              </div>
            </div>

            {/* Taxa de Conclusão */}
            <div className="flex flex-col items-center p-5 gap-5 w-[170.5px] h-[134px] bg-[rgba(43,84,255,0.08)] rounded-[12px] shrink-0 grow self-stretch">
              <div className="flex flex-row items-center p-[9px] gap-[7.5px] w-[34px] h-[34px] bg-[rgba(43,84,255,0.08)] rounded-[99px] shrink-0">
                <Percent className="w-4 h-4 text-[#2B54FF]" />
              </div>
              <div className="flex flex-col items-center p-0 gap-1.5 w-[48px] h-10 shrink-0">
                <span className="w-auto h-[17px] font-[family-name:var(--font-inter-tight)] font-semibold text-[24px] leading-[115%] text-black shrink-0">
                  {Math.round(stats.conclusionRate * 100)}%
                </span>
                <span className="w-[96px] h-[17px] font-[family-name:var(--font-inter-tight)] font-normal text-[12px] leading-[140%] text-[#656565] shrink-0 text-center">
                  Taxa de conclusão
                </span>
              </div>
            </div>
          </div>

          {/* Tempo Total */}
          <div className="flex flex-col items-center p-5 gap-5 w-[353px] h-[134px] bg-[rgba(43,84,255,0.08)] rounded-[12px] shrink-0 self-stretch">
            <div className="flex flex-row items-center p-[9px] gap-[7.5px] w-[34px] h-[34px] bg-[rgba(43,84,255,0.08)] rounded-[99px] shrink-0">
              <Hourglass className="w-4 h-4 text-[#2B54FF]" />
            </div>
            <div className="flex flex-col justify-center items-center p-0 gap-1.5 w-full h-10 shrink-0">
              <span className="w-auto h-[17px] font-[family-name:var(--font-inter-tight)] font-semibold text-[24px] leading-[115%] text-black shrink-0" style={{ leadingTrim: 'both', textEdge: 'cap' }}>
                {formatTime(stats.totalTimeInSeconds)}
              </span>
              <span className="w-auto h-[17px] font-[family-name:var(--font-inter-tight)] font-normal text-[12px] leading-[140%] text-[#656565] shrink-0 text-center whitespace-nowrap">
                Tempo total dedicado
              </span>
            </div>
          </div>
        </div>
      </section>

      <Navbar />
    </main>
  );
}
