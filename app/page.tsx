"use client";

import { authClient } from "@/app/_lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8 text-center">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-primary">
            {session.user?.name?.[0]}
          </span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Bem-vindo ao FIT.AI, {session.user?.name}!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Você está logado como {session.user?.email}
          </p>
        </div>

        <Button 
          variant="destructive"
          onClick={async () => {
            await authClient.signOut();
            router.push("/login");
          }}
          className="w-full rounded-full"
        >
          Sair do Aplicativo
        </Button>
      </div>
    </main>
  );
}
