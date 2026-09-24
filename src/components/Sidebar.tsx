import React from 'react';
import {
  Home,
  Users,
  UserPlus,
  Calendar,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  CalendarX2,
  FileText,
  UserCog,
  ShieldAlert,
  Settings,
  LogOut,
  Hospital,
  ChevronRight,
} from 'lucide-react';
import { NavigationPage, User } from '../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  currentUser: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  isOpen,
  onClose,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  interface NavItem {
    id: NavigationPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    adminOnly?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'ทะเบียนผู้ป่วย', icon: Users },
    { id: 'patient-add', label: 'เพิ่มผู้ป่วยใหม่', icon: UserPlus },
    { id: 'appointments', label: 'นัดหมาย / ติดตาม', icon: Calendar },
    { id: 'smiv', label: 'SMI-V / Risk', icon: AlertTriangle, badge: 'เฝ้าระวัง', badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'retention', label: 'Retention Rate', icon: TrendingUp },
    { id: 'remission', label: 'Remission Rate', icon: BarChart3 },
    { id: 'missed', label: 'รายงานขาดนัด', icon: CalendarX2 },
    { id: 'reports', label: 'รายงานงานยาเสพติด', icon: FileText },
    { id: 'users', label: 'จัดการผู้ใช้งาน', icon: UserCog, adminOnly: true },
    { id: 'audit-log', label: 'บันทึกกิจกรรม (Audit)', icon: ShieldAlert, adminOnly: true },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
  ];

  const handleItemClick = (pageId: NavigationPage) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 shadow-lg lg:shadow-none flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside Sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Hospital className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">รพ.กรงปินัง</p>
              <p className="text-[11px] text-slate-500">ระบบงานยาเสพติด (CBTx/OPD)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Current User Card */}
        <div className="p-3 mx-3 my-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-xs font-semibold text-slate-800 truncate">
            {currentUser.name}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-teal-100 text-teal-800'
              }`}
            >
              {isAdmin ? '🛡️ ผู้ดูแลระบบ (ADMIN)' : '👤 เจ้าหน้าที่ (STAFF)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {currentUser.department.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
            เมนูหลัก
          </div>

          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-100 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-sky-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 text-sky-600" />}
                  </div>
                </button>
              );
            })}
        </div>

        {/* Bottom Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400">
              เวอร์ชัน 2.4.0 (Hospital Internal Build)
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
