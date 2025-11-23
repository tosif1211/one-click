'use client';

import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { UserCog } from 'lucide-react';
import  NavigationLinks  from './NavigationLinks';

function LayoutSidebar() {
  const { open: isOpen } = useSidebar();

  return (
    <>
      <aside
        className={`hidden md:flex flex-col border-r bg-card transition-[width] duration-300 relative ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center p-4 space-y-2">
            <UserCog className={`text-primary ${isOpen ? 'h-12 w-12' : 'h-8 w-8'}`} />
            <div className={`text-center pt-2 ${!isOpen ? 'hidden' : ''}`}>
              <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary">One Click</h3>
            </div>
          </div>
          <NavigationLinks />
        </div>
      </aside>
    </>
  );
}

export default LayoutSidebar;
