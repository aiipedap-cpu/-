import React, { useState, useMemo } from 'react';
import {
  CalendarX2,
  AlertTriangle,
  Phone,
  Home,
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
  FileSpreadsheet,
  Clock,
  Send,
} from 'lucide-react';
import { Patient } from '../types';
import { formatThaiDate, getSmivBadge, exportToCSV } from '../utils/formatters';

interface MissedAppointmentReportViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onRecordFollowUp: (patientId: string) => void;
}

export const MissedAppointmentReportView: React.FC<MissedAppointmentReportViewProps> = ({
  patients,
  onSelectPatient,
  onRecordFollowUp,
}) => {
  const [subdistrictFilter, setSubdistrictFilter] = useState('ทั้งหมด');
  const [urgencyFilter, setUrgencyFilter] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all missed patients
  const missedPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.isDeleted) return false;
      return p.isMissed || p.treatmentStatus === 'ขาดนัด' || (p.missedCount && p.missedCount > 0);
    });
  }, [patients]);

  const filtered = useMemo(() => {
    return missedPatients.filter((p) => {
      if (subdistrictFilter !== 'ทั้งหมด' && p.subdistrict !== subdistrictFilter) return false;

      if (urgencyFilter === 'เร่งด่วน') {
        if (p.smiv.level !== 'แดง' && (p.daysMissed || 0) < 14) return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const fullName = `${p.prefix}${p.firstName} ${p.lastName}`.toLowerCase();
        const matchHn = p.hn ? p.hn.toLowerCase().includes(term) : false;
        const matchPhone = (p.phone || '').includes(term);
        if (!fullName.includes(term) && !matchHn && !matchPhone) return false;
      }

      return true;
    });
  }, [missedPatients, subdistrictFilter, urgencyFilter, searchTerm]);

  // Urgent counts
  const urgentCount = missedPatients.filter(
    (p) => p.smiv.level === 'แดง' || (p.daysMissed && p.daysMissed > 14)
  ).length;

  const handleExportCSV = () => {
    const rows = filtered.map((p, idx) => ({
      ลำดับ: idx + 1,
      HN: p.hn || '-',
      ชื่อ_สกุล: `${p.prefix}${p.firstName} ${p.lastName}`,
      เบอร์โทร: p.phone,
      ที่อยู่: `ม.${p.moo} ${p.villageName} ต.${p.subdistrict}`,
      รพ_สต: p.serviceUnit,
      ขาดมาแล้ว_วัน: p.daysMissed || 0,
      จำนวนครั้งที่ขาด: p.missedCount || 1,
      ระดับ_SMIV: p.smiv.level,
      การจัดการ: p.smiv.managementPlan,
    }));
    exportToCSV(`รายงานผู้ป่วยขาดนัด_รพ_กรงปินัง_${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-rose-700 text-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider">
              <CalendarX2 className="w-4 h-4" />
              <span>การบริหารจัดการผู้ป่วยขาดนัดและการติดตามเชิงรุก</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              รายงานผู้ป่วยขาดนัดและไม่มารับการรักษาต่อเนื่อง
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
              ติดตามผู้ป่วยขาดการติดต่อเกิน 7-14 วัน เพื่อป้องกันการหลุดจากระบบ (Drop-out) และเฝ้าระวังอาการทางจิตกำเริบในชุมชน
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="py-2.5 px-4 bg-white text-amber-900 hover:bg-amber-50 font-semibold rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ส่งออกรายงาน</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert if high risk missed */}
      {urgentCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800">
            <span className="font-bold">เคสขาดนัดที่ต้องเข้าติดตามเร่งด่วน {urgentCount} ราย:</span> มีผู้ป่วยที่ขาดนัดและมีระดับความเสี่ยง SMI-V สูง (สีแดง/ส้ม) หรือขาดนัดเกิน 14 วัน กรุณาประสานทีม อสม. และฝ่ายปกครองเพื่อเยี่ยมบ้านทันที
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือเบอร์โทร..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 outline-none"
          >
            <option value="ทั้งหมด">ทุกระดับความเร่งด่วน</option>
            <option value="เร่งด่วน">เฉพาะเคสเร่งด่วน (SMI-V แดง / ขาด &gt; 14 วัน)</option>
          </select>

          <select
            value={subdistrictFilter}
            onChange={(e) => setSubdistrictFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 outline-none"
          >
            <option value="ทั้งหมด">ทุกตำบล</option>
            <option value="สะเอะ">ตำบลสะเอะ</option>
            <option value="กรงปินัง">ตำบลกรงปินัง</option>
            <option value="ปุโรง">ตำบลปุโรง</option>
            <option value="ห้วยกระทิง">ตำบลห้วยกระทิง</option>
          </select>
        </div>
      </div>

      {/* Missed Patients List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-200">
            ไม่พบผู้ป่วยขาดนัดตามเงื่อนไขที่เลือก
          </div>
        ) : (
          filtered.map((patient) => {
            const badge = getSmivBadge(patient.smiv.level);
            const isUrgent = patient.smiv.level === 'แดง' || (patient.daysMissed && patient.daysMissed > 14);

            return (
              <div
                key={patient.id}
                className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all shadow-xs ${
                  isUrgent
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <CalendarX2 className="w-5 h-5 text-amber-700" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-800">
                          {patient.prefix}{patient.firstName} {patient.lastName}
                        </h3>
                        {patient.hn && patient.hn !== '-' && (
                          <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                            HN: {patient.hn}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>ต.{patient.subdistrict} ({patient.serviceUnit})</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {patient.phone || 'ไม่มีเบอร์โทร'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                      SMI-V: {patient.smiv.level}
                    </span>

                    <button
                      type="button"
                      onClick={() => onRecordFollowUp(patient.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ลงบันทึกการติดตาม</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectPatient(patient.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                    >
                      ดูข้อมูล
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">ระยะเวลาที่ขาดนัด:</span>
                    <span className="text-sm font-bold text-rose-700 font-mono">
                      {patient.daysMissed || 0} วัน
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">จำนวนครั้งที่ขาดนัด:</span>
                    <span className="font-bold text-slate-800">
                      {patient.missedCount || 1} ครั้ง
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">ที่อยู่ติดต่อ:</span>
                    <span className="text-slate-700">
                      ม.{patient.moo} {patient.villageName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">การติดตามล่าสุด:</span>
                    <span className="text-slate-600">
                      {patient.followUps.length > 0 ? formatThaiDate(patient.followUps.slice(-1)[0].date) : '-'}
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
