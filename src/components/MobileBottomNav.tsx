import React from 'react';
import { Home, Users, Calendar, AlertTriangle, Menu } from 'lucide-react';
import { NavigationPage } from '../types';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenDrawer: () => void;
  urgentCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenDrawer,
  urgentCount = 0,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
            currentPage === 'dashboard'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ภาพรวม</span>
        </button>

        {/* Patients Registry */}
        <button
          type="button"
          onClick={() => onNavigate('patients')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
            currentPage === 'patients' || currentPage === 'patient-profile'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ทะเบียน</span>
        </button>

        {/* Appointments */}
        <button
          type="button"
          onClick={() => onNavigate('appointments')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
            currentPage === 'appointments'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">นัดหมาย</span>
        </button>

        {/* SMI-V Risk */}
        <button
          type="button"
          onClick={() => onNavigate('smiv')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 ${
            currentPage === 'smiv'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">SMI-V</span>
          {urgentCount > 0 && (
            <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
          )}
        </button>

        {/* Full Menu Drawer */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 hover:text-slate-800 font-medium"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">เมนู</span>
        </button>
      </div>
    </nav>
  );
};
