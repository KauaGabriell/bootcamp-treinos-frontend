'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Sparkles, ArrowUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';

// No AI SDK v6, UIMessage usa "parts" (array de TextUIPart, etc.)
function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('');
}
import Link from 'next/link';

export default function OnboardingPage() {
  const [inputValue, setInputValue] = useState('');
  
  // Estabilidade referencial: mesma instância do transport entre renders
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
        credentials: 'include',
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (error) => {
      console.error('Onboarding: Erro no stream da IA:', error);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-send initial message
  const initialSent = useRef(false);
  useEffect(() => {
    if (!initialSent.current && typeof sendMessage === 'function') {
      initialSent.current = true;
      sendMessage({ text: "Olá! Quero começar meu plano de treino." });
    }
  }, [sendMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue('');
  };

  return (
    <div className="flex flex-col items-start bg-white h-screen w-full max-w-[393px] mx-auto overflow-hidden font-[family-name:var(--font-inter-tight)] relative isolate">
      {/* Header */}
      <header className="box-border flex flex-row items-center p-5 gap-2.5 w-full h-[82px] border-b border-[#F1F1F1] shrink-0 z-0">
        <div className="flex flex-row items-center gap-2 flex-1 justify-center">
          <div className="box-border flex flex-row justify-center items-center p-3 gap-2 w-[42px] h-[42px] bg-[#2B54FF]/[0.08] border border-[#2B54FF]/[0.08] rounded-full shrink-0">
            <Sparkles className="w-[18px] h-[18px] text-[#2B54FF]" />
          </div>
          <div className="flex flex-col justify-center items-start gap-1.5 w-[66px] h-8 shrink-0">
            <span className="w-[66px] h-[17px] font-semibold text-[16px] leading-[105%] text-black">
              Coach AI
            </span>
            <div className="flex flex-row items-center gap-1 w-[45px] h-[9px] shrink-0">
              <div className="w-2 h-2 bg-[#24D500] rounded-full" />
              <span className="w-[33px] h-[9px] font-normal text-[12px] leading-[115%] uppercase text-[#2B54FF]">
                Online
              </span>
            </div>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="text-[#2B54FF] text-[14px] font-semibold hover:underline shrink-0"
        >
          Acessar FIT.AI
        </Link>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full p-5 flex flex-col gap-3 scroll-smooth z-10"
      >
        {messages.map((m, index) => (
          <div 
            key={`${m.id}-${index}`} 
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`flex flex-row items-center p-3 gap-2.5 rounded-[12px] text-[14px] leading-[140%] max-w-[85%] ${
                m.role === 'user' 
                  ? 'bg-[#2B54FF] text-white shadow-sm' 
                  : 'bg-[#F1F1F1] text-black'
              }`}
            >
              <Streamdown>{getMessageText(m.parts)}</Streamdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="p-3 rounded-[12px] bg-[#F1F1F1] flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#2B54FF] rounded-full animate-bounce [animation-duration:0.8s]" />
              <div className="w-1.5 h-1.5 bg-[#2B54FF] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-[#2B54FF] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full bg-white border-t border-[#F1F1F1] p-5 shrink-0 z-[3]">
        <form 
          onSubmit={handleFormSubmit}
          className="flex flex-row justify-center items-center gap-2 w-full h-[42px]"
        >
          <div className="box-border flex flex-row items-center p-[12px_16px] gap-3 bg-[#F1F1F1] border border-[#F1F1F1] rounded-full flex-1 h-[41px]">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte qualquer coisa..."
              className="bg-transparent border-none outline-none text-[14px] leading-[17px] text-[#656565] w-full placeholder:text-[#656565]"
            />
          </div>
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex flex-row justify-center items-center p-2.5 gap-2.5 w-[42px] h-[42px] bg-[#2B54FF] rounded-full shrink-0 disabled:opacity-50 transition-all active:scale-95"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
