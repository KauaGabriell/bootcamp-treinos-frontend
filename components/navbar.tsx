'use client';

import Link from 'next/link';
import { Home, Calendar, Sparkles, BarChart2, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  workoutLink?: string;
}

export function Navbar({ workoutLink = '#' }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-[#f1f1f1] px-6 py-4 rounded-t-[20px] flex items-center justify-between z-50">
      <Link href="/" className="p-3">
        <Home className={`w-6 h-6 ${isActive('/') ? 'text-black' : 'text-[#999999]'}`} />
      </Link>
      
      <Link href={workoutLink} className="p-3">
        <Calendar className={`w-6 h-6 ${pathname.includes('/workout-plans') ? 'text-black' : 'text-[#999999]'}`} />
      </Link>

      <div className="bg-[#2b54ff] p-4 rounded-full -mt-10 shadow-lg shadow-[#2b54ff]/20 cursor-pointer active:scale-95 transition-transform">
        <Sparkles className="w-6 h-6 text-white" />
      </div>

      <Link href="/stats" className="p-3">
        <BarChart2 className={`w-6 h-6 ${isActive('/stats') ? 'text-black' : 'text-[#999999]'}`} />
      </Link>

      <Link href="/profile" className="p-3">
        <User className={`w-6 h-6 ${isActive('/profile') ? 'text-black' : 'text-[#999999]'}`} />
      </Link>
    </nav>
  );
}
