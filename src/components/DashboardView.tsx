import React, { useState, useMemo } from 'react';
import {
  Users,
  Activity,
  CheckCircle2,
  CalendarX2,
  AlertOctagon,
  TrendingUp,
  Award,
  Filter,
  RefreshCw,
  PlusCircle,
  Calendar,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Patient, NavigationPage, Subdistrict, ServiceUnit, DrugCategory, TreatmentStatus } from '../types';
import { getCurrentFiscalYear, getAvailableFiscalYears } from '../utils/formatters';

interface DashboardViewProps {
  patients: Patient[];
  onNavigate: (page: NavigationPage) => void;
  onSelectPatient: (patientId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  onNavigate,
  onSelectPatient,
}) => {
  // Filter States
  const [fiscalYear, setFiscalYear] = useState<string>('ทั้งหมด');
  const [subdistrict, setSubdistrict] = useState<string>('ทั้งหมด');
  const [serviceUnit, setServiceUnit] = useState<string>('ทั้งหมด');
  const [treatmentStatus, setTreatmentStatus] = useState<string>('ทั้งหมด');
  const [drugCategory, setDrugCategory] = useState<string>('ทั้งหมด');
  const [ageRange, setAgeRange] = useState<string>('ทั้งหมด');
  const [gender, setGender] = useState<string>('ทั้งหมด');

  const currentFiscalYear = getCurrentFiscalYear();
  const availableFiscalYears = useMemo(() => {
    return getAvailableFiscalYears(2566, patients.map((p) => p.fiscalYear));
  }, [patients]);

  // Clear filters
  const resetFilters = () => {
    setFiscalYear('ทั้งหมด');
    setSubdistrict('ทั้งหมด');
    setServiceUnit('ทั้งหมด');
    setTreatmentStatus('ทั้งหมด');
    setDrugCategory('ทั้งหมด');
    setAgeRange('ทั้งหมด');
    setGender('ทั้งหมด');
  };

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.isDeleted) return false;
      if (fiscalYear !== 'ทั้งหมด' && p.fiscalYear !== fiscalYear) return false;
      if (subdistrict !== 'ทั้งหมด' && p.subdistrict !== subdistrict) return false;
      if (serviceUnit !== 'ทั้งหมด' && p.serviceUnit !== serviceUnit) return false;
      if (treatmentStatus !== 'ทั้งหมด' && p.treatmentStatus !== treatmentStatus) return false;
      if (drugCategory !== 'ทั้งหมด' && p.drugCategory !== drugCategory) return false;
      if (gender !== 'ทั้งหมด' && p.gender !== gender) return false;

      if (ageRange !== 'ทั้งหมด') {
        if (ageRange === '< 20' && p.age >= 20) return false;
        if (ageRange === '20-29' && (p.age < 20 || p.age > 29)) return false;
        if (ageRange === '30-39' && (p.age < 30 || p.age > 39)) return false;
        if (ageRange === '40+' && p.age < 40) return false;
      }

      return true;
    });
  }, [patients, fiscalYear, subdistrict, serviceUnit, treatmentStatus, drugCategory, ageRange, gender]);

  // Calculations for KPI Cards
  const totalCount = filteredPatients.length;
  const inTreatmentCount = filteredPatients.filter((p) => p.treatmentStatus === 'อยู่ระหว่างการบำบัด').length;
  const completedCriteriaCount = filteredPatients.filter((p) => p.treatmentStatus === 'ครบเกณฑ์').length;
  const missedCount = filteredPatients.filter((p) => p.isMissed || p.treatmentStatus === 'ขาดนัด').length;
  
  // Urgent follow-up needed: SMI-V Red or Orange, or Missed > 14 days
  const urgentCount = filteredPatients.filter(
    (p) => p.smiv.level === 'แดง' || p.smiv.level === 'ส้ม' || (p.isMissed && (p.daysMissed || 0) > 14)
  ).length;

  // Retention Rate: (Retained / Total) * 100
  const retainedCount = filteredPatients.filter((p) => p.isRetained).length;
  const retentionRate = totalCount > 0 ? Math.round((retainedCount / totalCount) * 100) : 0;

  // Remission Rate: (Remission / Total) * 100
  const remissionCount = filteredPatients.filter((p) => p.isRemission).length;
  const remissionRate = totalCount > 0 ? Math.round((remissionCount / totalCount) * 100) : 0;

  // Breakdown by Service Unit
  const unitStats = useMemo(() => {
    const counts: Record<string, number> = {
      'รพ.กรงปินัง': 0,
      'รพ.สต.สะเอะ': 0,
      'รพ.สต.กรงปินัง': 0,
      'รพ.สต.ปุโรง': 0,
      'รพ.สต.ห้วยกระทิง': 0,
    };
    filteredPatients.forEach((p) => {
      if (p.serviceUnit === 'โรงพยาบาลกรงปินัง') counts['รพ.กรงปินัง']++;
      else if (counts[p.serviceUnit] !== undefined) counts[p.serviceUnit]++;
    });
    return counts;
  }, [filteredPatients]);

  // Breakdown by Drug Category
  const drugStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredPatients.forEach((p) => {
      counts[p.drugCategory] = (counts[p.drugCategory] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredPatients]);

  // SMI-V Breakdown
  const smivStats = useMemo(() => {
    return {
      เขียว: filteredPatients.filter((p) => p.smiv.level === 'เขียว').length,
      เหลือง: filteredPatients.filter((p) => p.smiv.level === 'เหลือง').length,
      ส้ม: filteredPatients.filter((p) => p.smiv.level === 'ส้ม').length,
      แดง: filteredPatients.filter((p) => p.smiv.level === 'แดง').length,
    };
  }, [filteredPatients]);

  // Follow-up rounds completion counts (1-7)
  const roundStats = useMemo(() => {
    const rounds = [0, 0, 0, 0, 0, 0, 0];
    filteredPatients.forEach((p) => {
      const completedRounds = p.followUps.filter((f) => f.completed).length;
      for (let i = 0; i < completedRounds && i < 7; i++) {
        rounds[i]++;
      }
    });
    return rounds;
  }, [filteredPatients]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-sky-800 via-sky-700 to-teal-700 text-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>ภาพรวมข้อมูลงานยาเสพติดและฟื้นฟูสภาพ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
            Dashboard งานยาเสพติด โรงพยาบาลกรงปินัง
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl leading-relaxed">
            ระบบติดตามการบำบัดรักษา 7 ครั้งใน 12 เดือน เฝ้าระวังผู้ป่วยจิตเวชยาเสพติด SMI-V และตัวชี้วัด Retention & Remission Rate
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('patient-add')}
            className="py-2.5 px-4 bg-white text-sky-800 hover:bg-sky-50 font-semibold rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-sky-600" />
            <span>เพิ่มผู้ป่วย</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('appointments')}
            className="py-2.5 px-4 bg-sky-600/60 hover:bg-sky-600 text-white font-medium rounded-xl text-xs sm:text-sm border border-sky-400/40 flex items-center gap-2 transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>ตารางนัดหมาย</span>
          </button>
        </div>
      </div>

      {/* Ready for Production Empty Banner */}
      {patients.length === 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                ระบบพร้อมเปิดใช้งานจริง (Ready for Production)
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                ข้อมูลทดสอบระบบถูกนำออกเรียบร้อยแล้ว ยังไม่มีประวัติผู้ป่วยในฐานข้อมูล ท่านสามารถเริ่มต้นบันทึกเวชระเบียนผู้ป่วยจริงรายแรกได้ทันที
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('patient-add')}
            className="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ลงทะเบียนผู้ป่วยใหม่</span>
          </button>
        </div>
      )}

      {/* FILTER SECTION */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Filter className="w-4 h-4 text-sky-600" />
            <span>ตัวกรองข้อมูล Dashboard (Filter)</span>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-medium hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรองทั้งหมด</span>
          </button>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 text-xs">
          {/* ปีงบประมาณ */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">ปีงบประมาณ</label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              {availableFiscalYears.map((y) => (
                <option key={y} value={y}>
                  {y} {y === String(currentFiscalYear) ? '(ปัจจุบัน)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* ตำบล */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">ตำบล</label>
            <select
              value={subdistrict}
              onChange={(e) => setSubdistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="สะเอะ">ตำบลสะเอะ</option>
              <option value="กรงปินัง">ตำบลกรงปินัง</option>
              <option value="ปุโรง">ตำบลปุโรง</option>
              <option value="ห้วยกระทิง">ตำบลห้วยกระทิง</option>
            </select>
          </div>

          {/* รพ.สต. */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">หน่วยบริการ / รพ.สต.</label>
            <select
              value={serviceUnit}
              onChange={(e) => setServiceUnit(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="โรงพยาบาลกรงปินัง">โรงพยาบาลกรงปินัง</option>
              <option value="รพ.สต.สะเอะ">รพ.สต.สะเอะ</option>
              <option value="รพ.สต.กรงปินัง">รพ.สต.กรงปินัง</option>
              <option value="รพ.สต.ปุโรง">รพ.สต.ปุโรง</option>
              <option value="รพ.สต.ห้วยกระทิง">รพ.สต.ห้วยกระทิง</option>
              <option value="หน่วยบริการอื่น">หน่วยบริการอื่น</option>
            </select>
          </div>

          {/* สถานะการบำบัด */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">สถานะการบำบัด</label>
            <select
              value={treatmentStatus}
              onChange={(e) => setTreatmentStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="เข้าสู่กระบวนการบำบัด">เข้าสู่กระบวนการบำบัด</option>
              <option value="อยู่ระหว่างการบำบัด">อยู่ระหว่างการบำบัด</option>
              <option value="ครบเกณฑ์">ครบเกณฑ์</option>
              <option value="ขาดนัด">ขาดนัด</option>
              <option value="จำหน่าย">จำหน่าย</option>
              <option value="ส่งต่อ">ส่งต่อ</option>
            </select>
          </div>

          {/* สารเสพติด */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">ประเภทสารเสพติด</label>
            <select
              value={drugCategory}
              onChange={(e) => setDrugCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="ยาบ้า/เมทแอมเฟตามีน">ยาบ้า/เมทแอมเฟตามีน</option>
              <option value="เฮโรอีน">เฮโรอีน</option>
              <option value="กัญชา">กัญชา</option>
              <option value="พืชกระท่อม/น้ำต้ม">พืชกระท่อม/น้ำต้ม</option>
              <option value="ยาไอซ์">ยาไอซ์</option>
              <option value="สารระเหย">สารระเหย</option>
            </select>
          </div>

          {/* ช่วงอายุ */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">ช่วงอายุ</label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="< 20">ต่ำกว่า 20 ปี</option>
              <option value="20-29">20 - 29 ปี</option>
              <option value="30-39">30 - 39 ปี</option>
              <option value="40+">40 ปีขึ้นไป</option>
            </select>
          </div>

          {/* เพศ */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">เพศ</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>
        </div>

        {/* Filter status summary */}
        <div className="mt-3 pt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            แสดงผลลัพธ์ตามตัวกรอง: <strong className="text-slate-800">{totalCount}</strong> ราย จากทั้งหมด {patients.length} ราย
          </span>
          {(fiscalYear !== 'ทั้งหมด' || subdistrict !== 'ทั้งหมด' || serviceUnit !== 'ทั้งหมด' || treatmentStatus !== 'ทั้งหมด' || drugCategory !== 'ทั้งหมด') && (
            <span className="text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded">
              ✓ กำลังใช้ตัวกรอง
            </span>
          )}
        </div>
      </div>

      {/* 7 SUMMARY CARDS (Mobile: 1-col, Tablet: 2-col, Desktop: 4/3-col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. ผู้ป่วยทั้งหมด */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ผู้ป่วยทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{totalCount}</span>
            <span className="text-xs text-slate-500">ราย</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-600 flex items-center gap-1 font-medium">
            <span>ดูทะเบียนผู้ป่วยทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 2. อยู่ระหว่างการบำบัด */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">อยู่ระหว่างการบำบัด</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">{inTreatmentCount}</span>
            <span className="text-xs text-slate-500">
              ราย ({totalCount > 0 ? Math.round((inTreatmentCount / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 flex items-center gap-1 font-medium">
            <span>OPD / IPD / CBTx / มินิธัญญารักษ์</span>
          </div>
        </div>

        {/* 3. ครบเกณฑ์ติดตาม */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ครบเกณฑ์ติดตาม</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">{completedCriteriaCount}</span>
            <span className="text-xs text-slate-500">
              ราย ({totalCount > 0 ? Math.round((completedCriteriaCount / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <span>ติดตามครบ 7 ครั้งใน 12 เดือน</span>
          </div>
        </div>

        {/* 4. ขาดนัด */}
        <div
          onClick={() => onNavigate('missed')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ขาดนัด</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarX2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700">{missedCount}</span>
            <span className="text-xs text-slate-500">
              ราย ({totalCount > 0 ? Math.round((missedCount / totalCount) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 flex items-center gap-1 font-medium">
            <span>ดูรายงานและบันทึกติดตาม</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 5. ต้องติดตามเร่งด่วน (SMI-V Red / High Risk) */}
        <div
          onClick={() => onNavigate('smiv')}
          className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">ต้องติดตามเร่งด่วน</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-700">{urgentCount}</span>
            <span className="text-xs text-rose-600">ราย</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
            <span>SMI-V ระดับสีแดง/ส้ม</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 6. Retention Rate */}
        <div
          onClick={() => onNavigate('retention')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Retention Rate</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-700">{retentionRate}%</span>
            <span className="text-xs text-slate-400">เป้าหมาย 70%</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                retentionRate >= 70 ? 'bg-teal-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(retentionRate, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-teal-600 font-medium flex items-center justify-between">
            <span>คงอยู่ในระบบ {retainedCount}/{totalCount} ราย</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 7. Remission Rate */}
        <div
          onClick={() => onNavigate('remission')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Remission Rate</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-700">{remissionRate}%</span>
            <span className="text-xs text-slate-400">เป้าหมาย 60%</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                remissionRate >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(remissionRate, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-indigo-600 font-medium flex items-center justify-between">
            <span>หยุดเสพต่อเนื่อง {remissionCount}/{totalCount} ราย</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* VISUAL ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: ติดตาม 7 ครั้งใน 12 เดือน (Progress Funnel) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                ความก้าวหน้าการติดตาม 7 ครั้งใน 12 เดือน
              </h3>
              <p className="text-xs text-slate-500">
                สัดส่วนผู้ป่วยที่ได้รับการติดตามครบในแต่ละรอบ
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
              เกณฑ์ สธ.
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'ครั้งที่ 1 (เดือนที่ 1)', count: roundStats[0] },
              { label: 'ครั้งที่ 2 (เดือนที่ 2)', count: roundStats[1] },
              { label: 'ครั้งที่ 3 (เดือนที่ 3)', count: roundStats[2] },
              { label: 'ครั้งที่ 4 (เดือนที่ 6)', count: roundStats[3] },
              { label: 'ครั้งที่ 5 (เดือนที่ 9)', count: roundStats[4] },
              { label: 'ครั้งที่ 6 (เดือนที่ 11)', count: roundStats[5] },
              { label: 'ครั้งที่ 7 (เดือนที่ 12 ครบเกณฑ์)', count: roundStats[6] },
            ].map((round, idx) => {
              const percent = totalCount > 0 ? Math.round((round.count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{round.label}</span>
                    <span className="text-slate-500 font-mono">
                      {round.count} ราย ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === 6 ? 'bg-emerald-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module 2: SMI-V Risk Level & Quick Action */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  ระดับความเสี่ยงจิตเวชยาเสพติด (SMI-V Risk)
                </h3>
                <p className="text-xs text-slate-500">
                  จำแนกตามความเร่งด่วนในการดูแลและส่งต่อ
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('smiv')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SMI-V Color Bars */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div
                onClick={() => onNavigate('smiv')}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">🟢 เขียว</span>
                  <span className="text-lg font-bold text-emerald-700">{smivStats.เขียว}</span>
                </div>
                <p className="text-[11px] text-emerald-600 mt-1">ติดตามตามปกติ</p>
              </div>

              <div
                onClick={() => onNavigate('smiv')}
                className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800">🟡 เหลือง</span>
                  <span className="text-lg font-bold text-amber-700">{smivStats.เหลือง}</span>
                </div>
                <p className="text-[11px] text-amber-600 mt-1">ควรติดตามใกล้ชิด</p>
              </div>

              <div
                onClick={() => onNavigate('smiv')}
                className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-800">🟠 ส้ม</span>
                  <span className="text-lg font-bold text-orange-700">{smivStats.ส้ม}</span>
                </div>
                <p className="text-[11px] text-orange-600 mt-1">เสี่ยง ต้องวางแผนติดตาม</p>
              </div>

              <div
                onClick={() => onNavigate('smiv')}
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-800">🔴 แดง</span>
                  <span className="text-lg font-bold text-red-700">{smivStats.แดง}</span>
                </div>
                <p className="text-[11px] text-red-600 mt-1">เร่งด่วน จัดการทันที</p>
              </div>
            </div>
          </div>

          {/* Urgent Cases Alert preview */}
          {smivStats.แดง > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <span className="font-bold">แจ้งเตือนเร่งด่วน:</span> มีผู้ป่วย SMI-V ระดับสีแดง {smivStats.แดง} ราย ที่ต้องเข้าแทรกแซงร่วมกับ รพ.สต. และเจ้าหน้าที่ความปลอดภัย
                <button
                  type="button"
                  onClick={() => onNavigate('smiv')}
                  className="block mt-1 font-bold text-rose-700 underline"
                >
                  คลิกเพื่อดูรายชื่อผู้ป่วยระดับสีแดง →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AREA & DRUG BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ผู้ป่วยจำแนกตามหน่วยบริการ / รพ.สต. */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              จำนวนผู้ป่วยจำแนกตามหน่วยบริการ / รพ.สต.
            </h3>
            <span className="text-xs text-slate-400">อ.กรงปินัง</span>
          </div>

          <div className="space-y-3">
            {Object.entries(unitStats).map(([unitName, count]) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={unitName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{unitName}</span>
                    <span className="font-mono text-slate-500">
                      {count} ราย ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ประเภทสารเสพติดหลัก */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              จำแนกตามประเภทสารเสพติดหลัก
            </h3>
            <span className="text-xs text-slate-400">สถิติสะสม</span>
          </div>

          <div className="space-y-3">
            {drugStats.map(([category, count]) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="font-mono text-slate-500">
                      {count} ราย ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
