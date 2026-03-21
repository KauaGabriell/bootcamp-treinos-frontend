'use client';

import Image from 'next/image';
import { authClient } from '@/app/_lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

// URL do asset original do Figma - Mantendo para conveniência
const imgLoginBg = 'https://www.figma.com/api/mcp/asset/e8161770-88c7-4232-9134-c621ecb03afb';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isPending || session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center">
      {/* Background Image - Otimizada com priority */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imgLoginBg}
          alt="Background training"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
      </div>

      {/* Logo FIT.AI - Carregando do arquivo local public/images/fitai-logo.svg */}
      <div className="relative z-20 mt-[48px] shrink-0 w-[85px] h-[39px]">
        <Image
          src="/images/fitai-logo.svg"
          alt="FIT.AI"
          width={85}
          height={39}
          priority
          className="object-contain"
        />
      </div>

      {/* Container Azul - Responsivo (100% largura) */}
      <div className="relative z-20 flex-1 w-full flex flex-col justify-end items-center">
        <div className="w-full bg-[#2b54ff] rounded-t-[20px] px-5 pt-12 pb-10 flex flex-col items-center gap-[60px] shadow-2xl">
          <div className="flex flex-col gap-6 items-center w-full max-w-[402px]">
            {/* Título: Inter Tight, SemiBold, Leading 1.05 */}
            <h1 className="text-white text-[32px] font-[family-name:var(--font-inter-tight)] font-semibold leading-[1.05] text-center tracking-tight">
              O app que vai transformar a forma como você treina.
            </h1>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="bg-white hover:bg-zinc-100 text-black border-none rounded-full h-[38px] px-6 py-[12px] flex gap-2 items-center shrink-0 transition-all active:scale-95 shadow-sm"
            >
              <div className="relative w-4 h-4">
                <Image
                  src="/images/google-icon.svg"
                  alt="Google"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-[14px] font-sans">
                Fazer login com Google
              </span>
            </Button>
          </div>

          {/* Rodapé: Inter Tight Regular, 12px, 70% opacity */}
          <p className="text-[12px] text-white/70 font-[family-name:var(--font-inter-tight)] font-normal">
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>
      </div>
    </main>
  );
}
