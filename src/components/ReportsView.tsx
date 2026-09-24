import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  FileSpreadsheet,
  Calendar,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  Hospital,
} from 'lucide-react';
import { Patient } from '../types';
import { exportToCSV, formatThaiDate, getCurrentFiscalYear, getAvailableFiscalYears } from '../utils/formatters';

interface ReportsViewProps {
  patients: Patient[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ patients }) => {
  const [selectedReport, setSelectedReport] = useState<string>('annual_summary');
  const currentFiscalYear = getCurrentFiscalYear();
  const availableFiscalYears = useMemo(() => {
    return getAvailableFiscalYears(2566, patients.map((p) => p.fiscalYear));
  }, [patients]);

  const [fiscalYear, setFiscalYear] = useState<string>(() => String(getCurrentFiscalYear()));

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (p.isDeleted) return false;
      if (fiscalYear !== 'ทั้งหมด' && p.fiscalYear !== fiscalYear) return false;
      return true;
    });
  }, [patients, fiscalYear]);

  // Calculations for report
  const total = filteredPatients.length;
  const inTreatment = filteredPatients.filter((p) => p.treatmentStatus === 'อยู่ระหว่างการบำบัด').length;
  const completed = filteredPatients.filter((p) => p.treatmentStatus === 'ครบเกณฑ์').length;
  const missed = filteredPatients.filter((p) => p.isMissed || p.treatmentStatus === 'ขาดนัด').length;
  const smivRed = filteredPatients.filter((p) => p.smiv.level === 'แดง').length;
  const smivOrange = filteredPatients.filter((p) => p.smiv.level === 'ส้ม').length;
  const retainedCount = filteredPatients.filter((p) => p.isRetained).length;
  const remissionCount = filteredPatients.filter((p) => p.isRemission).length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = filteredPatients.map((p, idx) => ({
      ลำดับ: idx + 1,
      HN: p.hn,
      ชื่อ_นามสกุล: `${p.prefix}${p.firstName} ${p.lastName}`,
      เลขบัตรประชาชน: p.idCard,
      อายุ: p.age,
      เพศ: p.gender,
      ตำบล: p.subdistrict,
      รพ_สต: p.serviceUnit,
      สารเสพติดหลัก: p.primaryDrugName,
      วันที่เริ่มบำบัด: p.admitDate,
      สถานะการบำบัด: p.treatmentStatus,
      การติดตามเสร็จสิ้น: `${p.followUps.filter((f) => f.completed).length}/7`,
      ระดับ_SMIV: p.smiv.level,
      Retention: p.isRetained ? 'คงอยู่' : 'หลุด',
      Remission: p.isRemission ? 'หยุดเสพต่อเนื่อง' : 'ยังไม่เข้าเกณฑ์',
    }));
    exportToCSV(`รายงานสรุปผลงานยาเสพติด_ปีงบ_${fiscalYear}_รพ_กรงปินัง`, rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Print Controls */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>ศูนย์รายงานข้อมูลและสถิติตัวชี้วัดงานยาเสพติด</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            โรงพยาบาลกรงปินัง · สำนักงานสาธารณสุขจังหวัดยะลา
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold outline-none"
          >
            {availableFiscalYears.map((y) => (
              <option key={y} value={y}>
                ปีงบประมาณ {y} {y === String(currentFiscalYear) ? '(ปีปัจจุบัน)' : ''}
              </option>
            ))}
            <option value="ทั้งหมด">รวมทุกปีงบประมาณ</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2 px-3.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน</span>
          </button>
        </div>
      </div>

      {/* REPORT SELECTION TABS */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'annual_summary', label: '1. รายงานสรุปผลงานรวม' },
          { id: 'subdistrict_breakdown', label: '2. รายงานแยกตามตำบล/รพ.สต.' },
          { id: 'smiv_summary', label: '3. รายงานเฝ้าระวัง SMI-V' },
          { id: 'followup_milestones', label: '4. ติดตาม 7 ครั้ง & Retention' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedReport(tab.id)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedReport === tab.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRINTABLE REPORT DOCUMENT */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Hospital Official Letterhead */}
        <div className="text-center pb-5 border-b-2 border-slate-800 space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold">
              กป
            </div>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            แบบรายงานสรุปผลการดำเนินงานบำบัดรักษาและฟื้นฟูสภาพผู้ติดยาเสพติด
          </h1>
          <h2 className="text-sm font-semibold text-slate-700">
            โรงพยาบาลกรงปินัง และเครือข่ายหน่วยบริการปฐมภูมิ อำเภอกรงปินัง จังหวัดยะลา
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            ประจำปีงบประมาณ พ.ศ. {fiscalYear === 'ทั้งหมด' ? `2566 - ${availableFiscalYears[0] || 'ปัจจุบัน'}` : fiscalYear} · ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH')}
          </p>
        </div>

        {/* Section 1: KPI Overview Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>ตารางที่ 1: สรุปผลตัวชี้วัดกระทรวงสาธารณสุขและผลการบำบัดรักษา</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  <th className="py-2.5 px-3 border-r border-slate-300">รายการตัวชี้วัด</th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-300">เป้าหมาย สธ.</th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-300">ผลงาน (ราย)</th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-300">ร้อยละ (%)</th>
                  <th className="py-2.5 px-3 text-center">การประเมิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">1. ผู้ป่วยบำบัดสะสมทั้งหมด</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">-</td>
                  <td className="py-2 px-3 text-center font-bold border-r border-slate-300 font-mono">{total}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">100%</td>
                  <td className="py-2 px-3 text-center text-slate-600">ปกติ</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">2. อยู่ระหว่างกระบวนการบำบัดรักษา</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">-</td>
                  <td className="py-2 px-3 text-center font-bold border-r border-slate-300 font-mono">{inTreatment}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">
                    {total > 0 ? Math.round((inTreatment / total) * 100) : 0}%
                  </td>
                  <td className="py-2 px-3 text-center text-slate-600">กำลังดูแล</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">3. ติดตามครบเกณฑ์ 7 ครั้งใน 12 เดือน</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">&ge; 60%</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700 border-r border-slate-300 font-mono">{completed}</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700 border-r border-slate-300 font-mono">
                    {total > 0 ? Math.round((completed / total) * 100) : 0}%
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700">ผ่านเกณฑ์</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">4. อัตราการคงอยู่ในระบบ (Retention Rate)</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">&ge; 70%</td>
                  <td className="py-2 px-3 text-center font-bold text-teal-700 border-r border-slate-300 font-mono">{retainedCount}</td>
                  <td className="py-2 px-3 text-center font-bold text-teal-700 border-r border-slate-300 font-mono">
                    {total > 0 ? Math.round((retainedCount / total) * 100) : 0}%
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-teal-700">
                    {total > 0 && Math.round((retainedCount / total) * 100) >= 70 ? 'ผ่านเกณฑ์' : 'เฝ้าระวัง'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">5. อัตราการหยุดเสพต่อเนื่อง (Remission Rate)</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">&ge; 60%</td>
                  <td className="py-2 px-3 text-center font-bold text-indigo-700 border-r border-slate-300 font-mono">{remissionCount}</td>
                  <td className="py-2 px-3 text-center font-bold text-indigo-700 border-r border-slate-300 font-mono">
                    {total > 0 ? Math.round((remissionCount / total) * 100) : 0}%
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-indigo-700">
                    {total > 0 && Math.round((remissionCount / total) * 100) >= 60 ? 'ผ่านเกณฑ์' : 'เฝ้าระวัง'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">6. ผู้ป่วยจิตเวชยาเสพติดเร่งด่วน (SMI-V แดง/ส้ม)</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">เข้าถึง 100%</td>
                  <td className="py-2 px-3 text-center font-bold text-rose-700 border-r border-slate-300 font-mono">{smivRed + smivOrange}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">
                    {total > 0 ? Math.round(((smivRed + smivOrange) / total) * 100) : 0}%
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-rose-700">เฝ้าระวังเข้มงวด</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-300 font-medium">7. ผู้ป่วยขาดนัด</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300">&le; 15%</td>
                  <td className="py-2 px-3 text-center font-bold text-amber-700 border-r border-slate-300 font-mono">{missed}</td>
                  <td className="py-2 px-3 text-center border-r border-slate-300 font-mono">
                    {total > 0 ? Math.round((missed / total) * 100) : 0}%
                  </td>
                  <td className="py-2 px-3 text-center text-amber-700">อยู่ระหว่างติดตาม</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Subdistrict Distribution Table */}
        <div className="space-y-3 pt-3">
          <h3 className="text-sm font-bold text-slate-800">
            ตารางที่ 2: จำแนกผู้ป่วยตามตำบลและหน่วยบริการปฐมภูมิในพื้นที่ อ.กรงปินัง
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  <th className="py-2.5 px-3 border-r border-slate-300">ตำบล</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">หน่วยบริการที่รับผิดชอบ</th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-300">ผู้ป่วยทั้งหมด</th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-300">ครบเกณฑ์ 7 ครั้ง</th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-300">SMI-V แดง</th>
                  <th className="py-2.5 px-3 text-center">ขาดนัด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {['สะเอะ', 'กรงปินัง', 'ปุโรง', 'ห้วยกระทิง'].map((sub) => {
                  const subPatients = filteredPatients.filter((p) => p.subdistrict === sub);
                  const subTotal = subPatients.length;
                  const subCompleted = subPatients.filter((p) => p.treatmentStatus === 'ครบเกณฑ์').length;
                  const subRed = subPatients.filter((p) => p.smiv.level === 'แดง').length;
                  const subMissed = subPatients.filter((p) => p.isMissed || p.treatmentStatus === 'ขาดนัด').length;

                  return (
                    <tr key={sub}>
                      <td className="py-2 px-3 border-r border-slate-300 font-semibold">ตำบล{sub}</td>
                      <td className="py-2 px-3 border-r border-slate-300 text-slate-600">รพ.สต.{sub} / รพ.กรงปินัง</td>
                      <td className="py-2 px-3 text-center font-mono font-bold border-r border-slate-300">{subTotal}</td>
                      <td className="py-2 px-3 text-center font-mono text-emerald-700 border-r border-slate-300">{subCompleted}</td>
                      <td className="py-2 px-3 text-center font-mono text-rose-700 border-r border-slate-300">{subRed}</td>
                      <td className="py-2 px-3 text-center font-mono text-amber-700">{subMissed}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Box for Official Hospital Document */}
        <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-1">
            <div className="h-12" />
            <p className="border-t border-slate-400 inline-block px-8 pt-1">
              (.......................................................................)
            </p>
            <p className="font-semibold text-slate-800">ผู้รายงานข้อมูล / พยาบาลวิชาชีพ</p>
            <p className="text-slate-500">กลุ่มงานจิตเวชและยาเสพติด โรงพยาบาลกรงปินัง</p>
          </div>

          <div className="space-y-1">
            <div className="h-12" />
            <p className="border-t border-slate-400 inline-block px-8 pt-1">
              (.......................................................................)
            </p>
            <p className="font-semibold text-slate-800">ผู้อำนวยการโรงพยาบาลกรงปินัง</p>
            <p className="text-slate-500">โรงพยาบาลกรงปินัง จังหวัดยะลา</p>
          </div>
        </div>
      </div>
    </div>
  );
};
