import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  PhoneCall,
  Ambulance,
  Shield,
  Clock,
} from 'lucide-react';
import { Patient, SmivLevel } from '../types';
import { formatThaiDate, getSmivBadge } from '../utils/formatters';

interface SmivRiskDashboardViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onOpenSmivModal: (patientId: string) => void;
}

export const SmivRiskDashboardView: React.FC<SmivRiskDashboardViewProps> = ({
  patients,
  onSelectPatient,
  onOpenSmivModal,
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('ทั้งหมด');
  const [subdistrictFilter, setSubdistrictFilter] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.isDeleted) return false;
      if (levelFilter !== 'ทั้งหมด' && p.smiv.level !== levelFilter) return false;
      if (subdistrictFilter !== 'ทั้งหมด' && p.subdistrict !== subdistrictFilter) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const fullName = `${p.prefix}${p.firstName} ${p.lastName}`.toLowerCase();
        const matchHn = p.hn ? p.hn.toLowerCase().includes(term) : false;
        const matchSignals = p.smiv.warningSignals?.some((s) => s.toLowerCase().includes(term));
        if (!fullName.includes(term) && !matchHn && !matchSignals) return false;
      }

      return true;
    });
  }, [patients, levelFilter, subdistrictFilter, searchTerm]);

  // Counts by level
  const counts = useMemo(() => {
    const list = patients.filter((p) => !p.isDeleted);
    return {
      all: list.length,
      red: list.filter((p) => p.smiv.level === 'แดง').length,
      orange: list.filter((p) => p.smiv.level === 'ส้ม').length,
      yellow: list.filter((p) => p.smiv.level === 'เหลือง').length,
      green: list.filter((p) => p.smiv.level === 'เขียว').length,
    };
  }, [patients]);

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>ระบบเฝ้าระวังผู้ป่วยจิตเวชยาเสพติดที่มีความเสี่ยงสูงต่อความรุนแรง</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              SMI-V / Risk Monitoring เครือข่าย อ.กรงปินัง
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
              ติดตามและคัดกรอง 5 สัญญาณเตือน เพื่อป้องกันภาวะคลุ้มคลั่ง ทำร้ายตนเองและผู้อื่น พร้อมประสานงาน รพ.สต., ตำรวจภูธรกรงปินัง และฝ่ายปกครอง
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shrink-0">
            <Ambulance className="w-8 h-8 text-rose-300" />
            <div className="text-xs">
              <div className="font-bold text-white">เบอร์สายด่วนฉุกเฉิน</div>
              <div className="text-rose-200">สภ.กรงปินัง: 191 / 073-238-191</div>
              <div className="text-rose-200">EMS รพ.กรงปินัง: 1669</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 SMI-V Level Interactive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Red */}
        <button
          type="button"
          onClick={() => setLevelFilter('แดง')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            levelFilter === 'แดง'
              ? 'bg-rose-100/90 border-rose-500 ring-2 ring-rose-400 shadow-sm'
              : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">🔴 ระดับสีแดง</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{counts.red} ราย</div>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
            เร่งด่วน: เสี่ยงสูงต่อความรุนแรง
          </p>
        </button>

        {/* Orange */}
        <button
          type="button"
          onClick={() => setLevelFilter('ส้ม')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            levelFilter === 'ส้ม'
              ? 'bg-orange-100/90 border-orange-500 ring-2 ring-orange-400 shadow-sm'
              : 'bg-orange-50/80 border-orange-200 hover:bg-orange-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-900">🟠 ระดับสีส้ม</span>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{counts.orange} ราย</div>
          <p className="text-[11px] text-orange-700 mt-0.5">
            เสี่ยงสูง: วางแผนติดตามร่วม
          </p>
        </button>

        {/* Yellow */}
        <button
          type="button"
          onClick={() => setLevelFilter('เหลือง')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            levelFilter === 'เหลือง'
              ? 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-400 shadow-sm'
              : 'bg-amber-50/80 border-amber-200 hover:bg-amber-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">🟡 ระดับสีเหลือง</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{counts.yellow} ราย</div>
          <p className="text-[11px] text-amber-700 mt-0.5">
            ปานกลาง: ควรติดตามใกล้ชิด
          </p>
        </button>

        {/* Green */}
        <button
          type="button"
          onClick={() => setLevelFilter('เขียว')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            levelFilter === 'เขียว'
              ? 'bg-emerald-100/90 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
              : 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">🟢 ระดับสีเขียว</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{counts.green} ราย</div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            ต่ำ: ติดตามตามรอบนัดปกติ
          </p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อผู้ป่วย, HN, อาการ/สัญญาณเตือน..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm outline-none"
          >
            <option value="ทั้งหมด">ทุกระดับความเสี่ยง ({counts.all})</option>
            <option value="แดง">🔴 ระดับสีแดง ({counts.red})</option>
            <option value="ส้ม">🟠 ระดับสีส้ม ({counts.orange})</option>
            <option value="เหลือง">🟡 ระดับสีเหลือง ({counts.yellow})</option>
            <option value="เขียว">🟢 ระดับสีเขียว ({counts.green})</option>
          </select>

          <select
            value={subdistrictFilter}
            onChange={(e) => setSubdistrictFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm outline-none"
          >
            <option value="ทั้งหมด">ทุกตำบล</option>
            <option value="สะเอะ">ต.สะเอะ</option>
            <option value="กรงปินัง">ต.กรงปินัง</option>
            <option value="ปุโรง">ต.ปุโรง</option>
            <option value="ห้วยกระทิง">ต.ห้วยกระทิง</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-200">
            ไม่พบผู้ป่วยตามเงื่อนไขที่เลือก
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const badge = getSmivBadge(patient.smiv.level);
            const isRed = patient.smiv.level === 'แดง';

            return (
              <div
                key={patient.id}
                className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all shadow-xs ${
                  isRed
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      SMI-V: {patient.smiv.level} ({badge.desc})
                    </span>

                    <h3 className="text-sm sm:text-base font-bold text-slate-800">
                      {patient.prefix}{patient.firstName} {patient.lastName}
                    </h3>
                    {patient.hn && patient.hn !== '-' && (
                      <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        HN: {patient.hn}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenSmivModal(patient.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                    >
                      ประเมินซ้ำ
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPatient(patient.id)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <span>ดูเวชระเบียน</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">พื้นที่รับผิดชอบ:</span>
                    <span className="font-semibold text-slate-700">
                      ต.{patient.subdistrict} ({patient.serviceUnit})
                    </span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      {patient.villageName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">สัญญาณเตือนที่ตรวจพบ:</span>
                    {patient.smiv.warningSignals && patient.smiv.warningSignals.length > 0 ? (
                      <span className="font-medium text-rose-700">
                        {patient.smiv.warningSignals.join(', ')}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">ไม่พบสัญญาณเตือนรุนแรง</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">แผนการจัดการและส่งต่อ:</span>
                    <span className="font-medium text-slate-800">
                      {patient.smiv.managementPlan || 'ติดตามตามนัดปกติ'}
                    </span>
                    <span className="text-slate-400 block text-[10px] mt-0.5">
                      ประเมินล่าสุด: {formatThaiDate(patient.smiv.evaluationDate)} โดย {patient.smiv.evaluator}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
