import React, { useState, useEffect } from 'react';
import { HospitalLogo } from './HospitalLogo';
import { User, LogOut, Menu, X, Shield, Clock, Bell, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  urgentCount?: number;
  onQuickNavigateUrgent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onToggleSidebar,
  isSidebarOpen,
  urgentCount = 0,
  onQuickNavigateUrgent,
}) => {
  // Session countdown demo (30 mins)
  const [sessionMinutes, setSessionMinutes] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes((prev) => (prev > 1 ? prev - 1 : 30));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & System Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5">
              <HospitalLogo size="sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight leading-tight line-clamp-1">
                    ระบบทะเบียนและติดตามผู้ป่วยบำบัดยาเสพติด
                  </h1>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
                  <span>โรงพยาบาลกรงปินัง</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 hidden sm:inline">กลุ่มงานจิตเวชและยาเสพติด</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Urgent Alerts, User Profile Badge, Session & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent Alert indicator */}
            {urgentCount > 0 && (
              <button
                type="button"
                onClick={onQuickNavigateUrgent}
                className="relative p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                title="มีผู้ป่วยต้องติดตามเร่งด่วน"
              >
                <Bell className="w-5 h-5 animate-bounce" />
                <span className="hidden sm:inline text-xs font-semibold text-rose-700">
                  เร่งด่วน ({urgentCount})
                </span>
                <span className="sm:hidden absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
              </button>
            )}

            {/* Session Time indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 py-1.5 px-2.5 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>เซสชัน: {sessionMinutes} นาที</span>
            </div>

            {/* User Info & Role Badge */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-sm">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {currentUser.role === 'ADMIN' ? 'ผู้ดูแลระบบ (ADMIN)' : 'เจ้าหน้าที่ (STAFF)'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {currentUser.department}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 sm:py-1.5 sm:px-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors text-xs font-medium flex items-center gap-1.5"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
