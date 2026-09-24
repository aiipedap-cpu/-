import React, { useState, useMemo } from 'react';
import { Award, CheckCircle2, XCircle, Filter, Sparkles, Activity } from 'lucide-react';
import { Patient } from '../types';
import { formatThaiDate, getTreatmentStatusBadge, getCurrentFiscalYear, getAvailableFiscalYears } from '../utils/formatters';

interface RemissionRateViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const RemissionRateView: React.FC<RemissionRateViewProps> = ({
  patients,
  onSelectPatient,
}) => {
  const [subdistrictFilter, setSubdistrictFilter] = useState('ทั้งหมด');
  const [fiscalYear, setFiscalYear] = useState('ทั้งหมด');
  const [activeTab, setActiveTab] = useState<'all' | 'remission' | 'nonRemission'>('all');

  const currentFiscalYear = getCurrentFiscalYear();
  const availableFiscalYears = useMemo(() => {
    return getAvailableFiscalYears(2566, patients.map((p) => p.fiscalYear));
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.isDeleted) return false;
      if (subdistrictFilter !== 'ทั้งหมด' && p.subdistrict !== subdistrictFilter) return false;
      if (fiscalYear !== 'ทั้งหมด' && p.fiscalYear !== fiscalYear) return false;
      return true;
    });
  }, [patients, subdistrictFilter, fiscalYear]);

  const total = filteredPatients.length;
  const remissionList = filteredPatients.filter((p) => p.isRemission);
  const nonRemissionList = filteredPatients.filter((p) => !p.isRemission);
  const remissionPercentage = total > 0 ? Math.round((remissionList.length / total) * 100) : 0;

  // Milestone breakdown
  const milestoneCounts = useMemo(() => {
    return {
      m3: filteredPatients.filter((p) => (p.remissionMonths || 0) >= 3).length,
      m6: filteredPatients.filter((p) => (p.remissionMonths || 0) >= 6).length,
      m9: filteredPatients.filter((p) => (p.remissionMonths || 0) >= 9).length,
      m12: filteredPatients.filter((p) => (p.remissionMonths || 0) >= 12).length,
    };
  }, [filteredPatients]);

  const displayedList =
    activeTab === 'remission'
      ? remissionList
      : activeTab === 'nonRemission'
      ? nonRemissionList
      : filteredPatients;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>ตัวชี้วัดความสำเร็จการบำบัดรักษาฟื้นฟูสภาพ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              อัตราการหยุดเสพต่อเนื่อง (Remission Rate)
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl leading-relaxed">
              เกณฑ์ชี้วัด: ผู้ป่วยบำบัดยาเสพติดที่สามารถหยุดเสพสารเสพติดได้อย่างต่อเนื่อง (ผลตรวจปัสสาวะลบสม่ำเสมอ) ไม่น้อยกว่าร้อยละ 60
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0">
            <span className="text-xs text-indigo-200 block">อัตราหยุดเสพต่อเนื่อง</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">
              {remissionPercentage}%
            </div>
            <span className="text-[11px] text-indigo-100">
              {remissionList.length} จาก {total} ราย
            </span>
          </div>
        </div>
      </div>

      {/* Cohort Milestone Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">หยุดเสพ ≥ 3 เดือน</span>
          <div className="text-2xl font-bold text-indigo-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m3 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m3}/{total} ราย</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">หยุดเสพ ≥ 6 เดือน</span>
          <div className="text-2xl font-bold text-indigo-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m6 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m6}/{total} ราย</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">หยุดเสพ ≥ 9 เดือน</span>
          <div className="text-2xl font-bold text-indigo-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m9 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m9}/{total} ราย</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">หยุดเสพครบ 12 เดือน</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m12 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m12}/{total} ราย</span>
        </div>
      </div>

      {/* Tabs and filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('remission')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg transition-colors ${
              activeTab === 'remission' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            หยุดเสพต่อเนื่อง ({remissionList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nonRemission')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg transition-colors ${
              activeTab === 'nonRemission' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ยังไม่เข้าเกณฑ์ / Relapse ({nonRemissionList.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 outline-none"
          >
            <option value="ทั้งหมด">ทุกปีงบประมาณ</option>
            {availableFiscalYears.map((y) => (
              <option key={y} value={y}>
                ปีงบ {y} {y === String(currentFiscalYear) ? '(ปัจจุบัน)' : ''}
              </option>
            ))}
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

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-3">ชื่อ - นามสกุล</th>
                <th className="py-3 px-3">HN</th>
                <th className="py-3 px-3">ตำบล / รพ.สต.</th>
                <th className="py-3 px-3">สารเสพติดหลัก</th>
                <th className="py-3 px-3 text-center">หยุดเสพต่อเนื่อง (เดือน)</th>
                <th className="py-3 px-3">สถานะ Remission</th>
                <th className="py-3 px-3">ผลตรวจปัสสาวะล่าสุด</th>
                <th className="py-3 px-3 text-center">ดูเวชระเบียน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    ไม่พบข้อมูลผู้ป่วย
                  </td>
                </tr>
              ) : (
                displayedList.map((patient) => {
                  const latestFollowUp = patient.followUps
                    .filter((f) => f.completed)
                    .slice(-1)[0];

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {patient.prefix}{patient.firstName} {patient.lastName}
                      </td>

                      <td className="py-3 px-3 font-mono text-sky-700 whitespace-nowrap">
                        {patient.hn && patient.hn !== '-' ? patient.hn : '-'}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span>ต.{patient.subdistrict} ({patient.serviceUnit})</span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                        {patient.primaryDrugName}
                      </td>

                      <td className="py-3 px-3 text-center font-bold font-mono text-indigo-700">
                        {patient.remissionMonths || 0} เดือน
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {patient.isRemission ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Remission (หยุดเสพต่อเนื่อง)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>ยังไม่เข้าเกณฑ์</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-slate-600">
                          {latestFollowUp ? latestFollowUp.urineTestResult : 'ยังไม่มีผลตรวจ'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient.id);
                          }}
                          className="text-sky-600 hover:text-sky-800 font-semibold"
                        >
                          ดูข้อมูล
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
