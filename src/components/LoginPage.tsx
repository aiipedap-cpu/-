import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ShieldCheck, HeartHandshake, Building2, Stethoscope, AlertCircle } from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
  users: UserType[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const foundUser = users.find(
        (u) =>
          u.username.toLowerCase() === trimmedUser &&
          u.password === password &&
          u.active
      );

      if (foundUser) {
        setIsLoading(false);
        onLogin(foundUser);
      } else {
        setIsLoading(false);
        setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      }
    }, 600);
  };

  const handleQuickLogin = (demoUsername: string, demoPass: string) => {
    setUsername(demoUsername);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-100 overflow-hidden">
      {/* Serene Medical & Healing Background Illustration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft gradient backdrop */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />

        {/* Vector Background Graphic: Gentle Hospital, Medical Caduceus, Care Waves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 900"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,288L48,272C96,256,192,224,288,229.3C384,235,480,277,576,282.7C672,288,768,256,864,224C960,192,1056,160,1152,165.3C1248,171,1344,213,1392,234.7L1440,256L1440,900L1392,900C1344,900,1248,900,1152,900C1056,900,960,900,864,900C768,900,672,900,576,900C480,900,384,900,288,900C192,900,96,900,48,900L0,900Z"
            fill="url(#grad1)"
          />
          {/* Subtle Hospital Facade Silhouette */}
          <rect x="120" y="480" width="180" height="260" rx="6" fill="#0284c7" fillOpacity="0.15" />
          <rect x="150" y="520" width="30" height="40" rx="3" fill="#ffffff" fillOpacity="0.6" />
          <rect x="210" y="520" width="30" height="40" rx="3" fill="#ffffff" fillOpacity="0.6" />
          <rect x="150" y="590" width="30" height="40" rx="3" fill="#ffffff" fillOpacity="0.6" />
          <rect x="210" y="590" width="30" height="40" rx="3" fill="#ffffff" fillOpacity="0.6" />
          <circle cx="210" cy="460" r="16" fill="#0d9488" fillOpacity="0.25" />
          <path d="M206 460h8M210 456v8" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right side Rehabilitation & Healing Hands contour */}
          <path
            d="M1250,520 C1200,480 1150,510 1120,560 C1100,600 1130,660 1180,680 C1230,700 1300,660 1320,610 Z"
            fill="#0ea5e9"
            fillOpacity="0.12"
          />
        </svg>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8 z-10 transition-all">
        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <HospitalLogo size="xl" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
            ระบบทะเบียนและติดตามผู้ป่วยบำบัดยาเสพติด
          </h2>
          <p className="text-sm font-semibold text-teal-700 mt-1 flex items-center justify-center gap-1.5">
            <Building2 className="w-4 h-4" />
            โรงพยาบาลกรงปินัง
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            อำเภอกรงปินัง จังหวัดยะลา
          </p>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-xs text-rose-600 mt-0.5">โปรดตรวจสอบชื่อผู้ใช้งานและรหัสผ่าน หรือติดต่อผู้ดูแลระบบ</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="ระบุชื่อผู้ใช้งาน"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="ระบุรหัสผ่าน"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            สำหรับบุคลากรที่ได้รับอนุญาตเท่านั้น
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            ข้อมูลเวชระเบียนผู้ป่วยได้รับการคุ้มครองตาม พ.ร.บ. ข้อมูลข่าวสาร และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </p>
        </div>

        {/* Quick Demo Access Buttons for Evaluators */}
        <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
            <span>⚡ ทดสอบระบบด่วน (Quick Demo Accounts):</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="py-1.5 px-2.5 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 rounded-lg text-slate-700 text-left transition-all"
            >
              <div className="font-semibold text-sky-700 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" />
                สิทธิ์ ADMIN
              </div>
              <div className="text-[10px] text-slate-500 font-mono">admin / admin123</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('staff', 'staff123')}
              className="py-1.5 px-2.5 bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 rounded-lg text-slate-700 text-left transition-all"
            >
              <div className="font-semibold text-teal-700 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                สิทธิ์ STAFF
              </div>
              <div className="text-[10px] text-slate-500 font-mono">staff / staff123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
