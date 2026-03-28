'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useQueryState, parseAsBoolean, parseAsString } from 'nuqs';
import { Sparkles, X, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Streamdown } from 'streamdown';

// No AI SDK v6, UIMessage usa "parts" (array de TextUIPart, ToolUIPart, etc.)
// e NÃO possui a propriedade "content". Extraímos o texto das TextUIParts.
function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('');
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useQueryState('chat_open', parseAsBoolean.withDefault(false));
  const [initialMessage, setInitialMessage] = useQueryState('chat_initial_message', parseAsString);
  
  const [inputValue, setInputValue] = useState('');
  const initialMessageSentRef = useRef(false);

  // Estabilidade referencial: mesma instância do transport em todos os renders,
  // evitando que o useChat perca o estado interno (this.state) do transport.
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
      console.error('Erro no stream da IA:', error);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Tratamento de Mensagem Inicial
  useEffect(() => {
    if (isOpen && initialMessage && !initialMessageSentRef.current && typeof sendMessage === 'function') {
      initialMessageSentRef.current = true;
      const msg = initialMessage;
      setInitialMessage(null);
      sendMessage({ text: msg });
    }

    if (!isOpen) {
      initialMessageSentRef.current = false;
    }
  }, [isOpen, initialMessage, sendMessage, setInitialMessage]);

  // 2. Scroll Automático
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] font-[family-name:var(--font-inter-tight)]">
      <div className="w-full max-w-[361px] h-[625px] bg-white rounded-[20px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-[#F1F1F1] shrink-0">
          <div className="flex items-center gap-2 flex-1 justify-center pl-8">
            <div className="w-[42px] h-[42px] flex items-center justify-center bg-[#2B54FF]/[0.08] border border-[#2B54FF]/[0.08] rounded-full">
              <Sparkles className="w-[18px] h-[18px] text-[#2B54FF]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-black leading-tight">Coach AI</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#24D500]" />
                <span className="text-[12px] text-[#2B54FF] font-normal uppercase leading-none">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-[#656565]" />
          </button>
        </header>

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scroll-smooth"
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col gap-3 mt-auto">
              <button 
                onClick={() => sendMessage({ text: "Monte meu plano de treino" })}
                className="w-fit bg-[#E2E9FE] px-4 py-2 rounded-full text-[14px] text-black hover:bg-[#d5e0fe] transition-colors text-left"
              >
                Monte meu plano de treino
              </button>
            </div>
          )}

          {messages.map((m, index) => (
            <div 
              key={`${m.id}-${index}`} 
              className={`flex flex-col ${m.role === 'user' ? 'items-end pl-12' : 'items-start pr-12'}`}
            >
              <div 
                className={`p-3 rounded-[12px] text-[14px] leading-relaxed ${
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
            <div className="flex items-start pr-12 animate-in fade-in duration-300">
              <div className="p-3 rounded-[12px] bg-[#F1F1F1] flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#2B54FF] rounded-full animate-bounce [animation-duration:0.8s]" />
                <div className="w-1.5 h-1.5 bg-[#2B54FF] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-[#2B54FF] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={handleFormSubmit}
          className="p-4 border-t border-[#F1F1F1] bg-white shrink-0"
        >
          <div className="relative flex items-center gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte qualquer coisa..."
              className="w-full h-11 bg-[#F1F1F1] border-none rounded-full px-5 pr-12 text-[14px] placeholder:text-[#999999] outline-none focus:ring-2 focus:ring-[#2B54FF]/20"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-1.5 w-8 h-8 bg-[#2B54FF] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
