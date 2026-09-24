import React, { useState, useMemo } from 'react';
import { TrendingUp, Award, Filter, CheckCircle2, XCircle, Search, Users } from 'lucide-react';
import { Patient } from '../types';
import { formatThaiDate, getTreatmentStatusBadge, getCurrentFiscalYear, getAvailableFiscalYears } from '../utils/formatters';

interface RetentionRateViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const RetentionRateView: React.FC<RetentionRateViewProps> = ({
  patients,
  onSelectPatient,
}) => {
  const [subdistrictFilter, setSubdistrictFilter] = useState('ทั้งหมด');
  const [fiscalYear, setFiscalYear] = useState('ทั้งหมด');
  const [activeTab, setActiveTab] = useState<'all' | 'retained' | 'dropped'>('all');

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
  const retainedList = filteredPatients.filter((p) => p.isRetained);
  const droppedList = filteredPatients.filter((p) => !p.isRetained);
  const retentionPercentage = total > 0 ? Math.round((retainedList.length / total) * 100) : 0;

  // Cohort milestone breakdown (3, 6, 9, 12 months)
  const milestoneCounts = useMemo(() => {
    return {
      m3: filteredPatients.filter((p) => (p.retentionMonths || 0) >= 3).length,
      m6: filteredPatients.filter((p) => (p.retentionMonths || 0) >= 6).length,
      m9: filteredPatients.filter((p) => (p.retentionMonths || 0) >= 9).length,
      m12: filteredPatients.filter((p) => (p.retentionMonths || 0) >= 12).length,
    };
  }, [filteredPatients]);

  const displayedList =
    activeTab === 'retained'
      ? retainedList
      : activeTab === 'dropped'
      ? droppedList
      : filteredPatients;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 text-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>ตัวชี้วัดกระทรวงสาธารณสุข ด้านการบำบัดรักษาฟื้นฟูยาเสพติด</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              อัตราการคงอยู่ในระบบบำบัด (Retention Rate)
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
              เป้าหมายกระทรวงสาธารณสุข: ผู้ป่วยบำบัดยาเสพติดคงอยู่ในระบบการบำบัดรักษาต่อเนื่องไม่น้อยกว่าร้อยละ 70
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0">
            <span className="text-xs text-teal-200 block">อัตราคงอยู่ในระบบปัจจุบัน</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">
              {retentionPercentage}%
            </div>
            <span className="text-[11px] text-teal-100">
              {retainedList.length} จาก {total} ราย
            </span>
          </div>
        </div>
      </div>

      {/* Cohort Milestone Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">คงอยู่ ≥ 3 เดือน</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m3 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m3}/{total} ราย</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">คงอยู่ ≥ 6 เดือน</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m6 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m6}/{total} ราย</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">คงอยู่ ≥ 9 เดือน</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m9 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m9}/{total} ราย</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">คงอยู่ครบ 12 เดือน</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {total > 0 ? Math.round((milestoneCounts.m12 / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{milestoneCounts.m12}/{total} ราย</span>
        </div>
      </div>

      {/* Filter and Tab controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs */}
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
            onClick={() => setActiveTab('retained')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg transition-colors ${
              activeTab === 'retained' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            คงอยู่ในระบบ ({retainedList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dropped')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg transition-colors ${
              activeTab === 'dropped' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            หลุดการบำบัด ({droppedList.length})
          </button>
        </div>

        {/* Filter selects */}
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
                <th className="py-3 px-3">สารเสพติด</th>
                <th className="py-3 px-3">วันที่เริ่มบำบัด</th>
                <th className="py-3 px-3 text-center">คงอยู่ (เดือน)</th>
                <th className="py-3 px-3">สถานะ Retention</th>
                <th className="py-3 px-3">สถานะการบำบัด</th>
                <th className="py-3 px-3 text-center">ดูเวชระเบียน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    ไม่พบข้อมูลผู้ป่วย
                  </td>
                </tr>
              ) : (
                displayedList.map((patient) => (
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

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span>{patient.primaryDrugName}</span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                      {formatThaiDate(patient.admitDate)}
                    </td>

                    <td className="py-3 px-3 text-center font-bold font-mono text-slate-800">
                      {patient.retentionMonths || 0} เดือน
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {patient.isRetained ? (
                        <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>คงอยู่ในระบบ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-semibold border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>หลุดการบำบัด</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getTreatmentStatusBadge(patient.treatmentStatus)}`}>
                        {patient.treatmentStatus}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
