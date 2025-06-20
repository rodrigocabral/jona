'use client';

import { BookOpen, Calendar, Heart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentPage: 'connections' | 'agenda' | 'diary' | 'communities';
}

const navigationItems = [
  {
    id: 'connections',
    label: 'Conexões',
    icon: Heart,
    href: '/dashboard',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: Calendar,
    href: '/agenda',
  },
  {
    id: 'diary',
    label: 'Diário',
    icon: BookOpen,
    href: '/diary',
  },
  {
    id: 'communities',
    label: 'Comunidades',
    icon: Users,
    href: '/communities',
  },
];

export default function BottomNavigation({
  currentPage,
}: BottomNavigationProps) {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = item.id === currentPage;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all',
                isActive
                  ? 'text-jona-green-600 bg-jona-green-50'
                  : 'text-gray-500 hover:text-jona-green-600'
              )}
              aria-label={item.label}
            >
              <Icon
                className={cn('w-5 h-5', isActive && 'text-jona-green-600')}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-jona-green-600' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
