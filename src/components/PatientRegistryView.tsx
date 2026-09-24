import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  RotateCcw,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  FileSpreadsheet,
  MapPin,
  Clock,
  Activity,
  Users,
} from 'lucide-react';
import { Patient, UserRole } from '../types';
import {
  maskIdCard,
  formatFullIdCard,
  formatThaiDate,
  getSmivBadge,
  getTreatmentStatusBadge,
  exportToCSV,
  getCurrentFiscalYear,
  getAvailableFiscalYears,
} from '../utils/formatters';

interface PatientRegistryViewProps {
  patients: Patient[];
  userRole: UserRole;
  onViewPatient: (patientId: string) => void;
  onEditPatient: (patient: Patient) => void;
  onAddNewPatient: () => void;
  onDeletePatient: (patientId: string) => void;
}

export const PatientRegistryView: React.FC<PatientRegistryViewProps> = ({
  patients,
  userRole,
  onViewPatient,
  onEditPatient,
  onAddNewPatient,
  onDeletePatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [unitFilter, setUnitFilter] = useState('ทั้งหมด');
  const [fiscalYearFilter, setFiscalYearFilter] = useState('ทั้งหมด');
  const [unmaskedIds, setUnmaskedIds] = useState<Record<string, boolean>>({});

  const currentFiscalYear = getCurrentFiscalYear();
  const availableFiscalYears = useMemo(() => {
    return getAvailableFiscalYears(2566, patients.map((p) => p.fiscalYear));
  }, [patients]);

  const toggleUnmask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnmaskedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClear = () => {
    setSearchTerm('');
    setStatusFilter('ทั้งหมด');
    setUnitFilter('ทั้งหมด');
    setFiscalYearFilter('ทั้งหมด');
  };

  // Filter patients
  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return patients.filter((p) => {
      if (p.isDeleted) return false;

      if (fiscalYearFilter !== 'ทั้งหมด' && p.fiscalYear !== fiscalYearFilter) return false;
      if (statusFilter !== 'ทั้งหมด' && p.treatmentStatus !== statusFilter) return false;
      if (unitFilter !== 'ทั้งหมด' && p.serviceUnit !== unitFilter) return false;

      if (!term) return true;

      const fullName = `${p.prefix}${p.firstName} ${p.lastName}`.toLowerCase();
      const matchName = fullName.includes(term);
      const matchHN = p.hn ? p.hn.toLowerCase().includes(term) : false;
      const matchIdCard = p.idCard.includes(term);
      const matchUnit = p.serviceUnit.toLowerCase().includes(term);
      const matchSubdistrict = p.subdistrict.toLowerCase().includes(term);
      const matchVillage = p.villageName.toLowerCase().includes(term);
      const matchAddress = `${p.houseNo} ${p.moo} ${p.villageName}`.toLowerCase().includes(term);

      return matchName || matchHN || matchIdCard || matchUnit || matchSubdistrict || matchVillage || matchAddress;
    });
  }, [patients, searchTerm, statusFilter, unitFilter, fiscalYearFilter]);

  const handleExportCSV = () => {
    const exportRows = filteredPatients.map((p, idx) => ({
      ลำดับ: idx + 1,
      HN: p.hn,
      เลขบัตรประชาชน: p.idCard,
      คำนำหน้า: p.prefix,
      ชื่อ: p.firstName,
      นามสกุล: p.lastName,
      อายุ: p.age,
      เพศ: p.gender,
      เบอร์โทร: p.phone,
      บ้านเลขที่: p.houseNo,
      หมู่: p.moo,
      หมู่บ้าน: p.villageName,
      ตำบล: p.subdistrict,
      อำเภอ: p.district,
      จังหวัด: p.province,
      วันที่เริ่มบำบัด: p.admitDate,
      ปีงบประมาณ: p.fiscalYear,
      หน่วยบริการ: p.serviceUnit,
      ประเภทสารเสพติด: p.drugCategory,
      สารเสพติดหลัก: p.primaryDrugName,
      รูปแบบการบำบัด: p.treatmentModel,
      สถานะการบำบัด: p.treatmentStatus,
      ระดับ_SMIV: p.smiv.level,
      การติดตามเสร็จสิ้น: `${p.followUps.filter((f) => f.completed).length}/7`,
      Retention: p.isRetained ? 'คงอยู่' : 'หลุดการบำบัด',
      Remission: p.isRemission ? 'หยุดเสพต่อเนื่อง' : 'ยังไม่เข้าเกณฑ์',
    }));
    exportToCSV(`ทะเบียนผู้ป่วยบำบัดยาเสพติด_รพ_กรงปินัง_${new Date().toISOString().slice(0, 10)}`, exportRows);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>ทะเบียนผู้ป่วยยาเสพติด</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {filteredPatients.length} ราย
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ข้อมูลเวชระเบียนและประวัติการบำบัดรักษา โรงพยาบาลกรงปินัง และเครือข่าย รพ.สต.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            title="ส่งออกไฟล์ Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">ส่งออก CSV</span>
          </button>

          <button
            type="button"
            onClick={onAddNewPatient}
            className="py-2.5 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มผู้ป่วย</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {/* Main search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด้วย ชื่อ-นามสกุล, เลขบัตรประชาชน 13 หลัก, HN, ที่อยู่, รพ.สต., หมู่บ้าน..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            />
          </div>

          {/* Quick filter status */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ทั้งหมด">ทุกสถานะการบำบัด</option>
              <option value="อยู่ระหว่างการบำบัด">อยู่ระหว่างการบำบัด</option>
              <option value="ครบเกณฑ์">ครบเกณฑ์</option>
              <option value="ขาดนัด">ขาดนัด</option>
              <option value="เข้าสู่กระบวนการบำบัด">เข้าสู่กระบวนการบำบัด</option>
              <option value="จำหน่าย">จำหน่าย</option>
            </select>

            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ทั้งหมด">ทุกหน่วยบริการ/รพ.สต.</option>
              <option value="โรงพยาบาลกรงปินัง">รพ.กรงปินัง</option>
              <option value="รพ.สต.สะเอะ">รพ.สต.สะเอะ</option>
              <option value="รพ.สต.กรงปินัง">รพ.สต.กรงปินัง</option>
              <option value="รพ.สต.ปุโรง">รพ.สต.ปุโรง</option>
              <option value="รพ.สต.ห้วยกระทิง">รพ.สต.ห้วยกระทิง</option>
            </select>

            <select
              value={fiscalYearFilter}
              onChange={(e) => setFiscalYearFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ทั้งหมด">ทุกปีงบประมาณ</option>
              {availableFiscalYears.map((y) => (
                <option key={y} value={y}>
                  ปีงบ {y} {y === String(currentFiscalYear) ? '(ปัจจุบัน)' : ''}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleClear}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              title="ล้างการค้นหา"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PATIENT LIST: DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">ลำดับ</th>
                <th className="py-3 px-3">ชื่อ - นามสกุล</th>
                <th className="py-3 px-3">เลขบัตร ปชช.</th>
                <th className="py-3 px-3">HN</th>
                <th className="py-3 px-2 text-center">อายุ/เพศ</th>
                <th className="py-3 px-3">ตำบล / รพ.สต.</th>
                <th className="py-3 px-3">สารเสพติด</th>
                <th className="py-3 px-3">เริ่มบำบัด / ปีงบ</th>
                <th className="py-3 px-3">สถานะบำบัด</th>
                <th className="py-3 px-3 text-center">ติดตาม (7 ครั้ง)</th>
                <th className="py-3 px-3 text-center">SMI-V</th>
                <th className="py-3 px-3">วันนัดถัดไป</th>
                <th className="py-3 px-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-16 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-slate-700">
                        {patients.length === 0
                          ? 'ระบบพร้อมใช้งานใหม่ — ยังไม่มีข้อมูลผู้ป่วยในระบบ'
                          : 'ไม่พบข้อมูลผู้ป่วยตามเงื่อนไขที่ระบุ'}
                      </div>
                      <p className="text-xs text-slate-400">
                        {patients.length === 0
                          ? 'ข้อมูลทดสอบถูกนำออกเรียบร้อยแล้ว ท่านสามารถเริ่มต้นลงทะเบียนผู้ป่วยจริงได้ทันที'
                          : 'ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองด้านบน'}
                      </p>
                      {patients.length === 0 && (
                        <button
                          type="button"
                          onClick={onAddNewPatient}
                          className="mt-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>ลงทะเบียนผู้ป่วยรายแรก</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => {
                  const smivBadge = getSmivBadge(patient.smiv.level);
                  const isUnmasked = !!unmaskedIds[patient.id];
                  const completedRounds = patient.followUps.filter((f) => f.completed).length;

                  // Find next appointment
                  const upcomingAppointment = patient.appointments.find(
                    (a) => a.status === 'นัดใกล้ถึง' || a.status === 'มาตามนัด'
                  );

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-sky-50/40 transition-colors cursor-pointer group"
                      onClick={() => onViewPatient(patient.id)}
                    >
                      <td className="py-3 px-3 text-center text-slate-400 font-mono">
                        {index + 1}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {patient.prefix}
                        {patient.firstName} {patient.lastName}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {isUnmasked
                              ? formatFullIdCard(patient.idCard)
                              : maskIdCard(patient.idCard)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleUnmask(patient.id, e)}
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                            title={isUnmasked ? 'ซ่อนเลขบัตร' : 'แสดงเลขบัตร'}
                          >
                            {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-medium text-sky-700 whitespace-nowrap">
                        {patient.hn && patient.hn !== '-' ? patient.hn : '-'}
                      </td>

                      <td className="py-3 px-2 text-center text-slate-600 whitespace-nowrap">
                        {patient.age} ปี / {patient.gender === 'ชาย' ? 'ช' : 'ญ'}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">ต.{patient.subdistrict}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {patient.serviceUnit}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-medium text-slate-700 block truncate max-w-[130px]" title={patient.primaryDrugName}>
                          {patient.primaryDrugName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {patient.drugCategory.split('/')[0]}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        <div>{formatThaiDate(patient.admitDate)}</div>
                        {patient.fiscalYear && (
                          <span className="inline-block text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                            ปีงบ {patient.fiscalYear}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getTreatmentStatusBadge(patient.treatmentStatus)}`}>
                          {patient.treatmentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`font-bold font-mono text-xs ${completedRounds === 7 ? 'text-emerald-700' : 'text-sky-700'}`}>
                          {completedRounds} / 7
                        </span>
                        <div className="w-12 bg-slate-100 rounded-full h-1 mx-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full ${completedRounds === 7 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                            style={{ width: `${(completedRounds / 7) * 100}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${smivBadge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${smivBadge.dot}`} />
                          {patient.smiv.level}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {upcomingAppointment ? (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                            <Calendar className="w-3 h-3 text-teal-600" />
                            <span>{formatThaiDate(upcomingAppointment.date)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewPatient(patient.id)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="ดูข้อมูล"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditPatient(patient)}
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {userRole === 'ADMIN' && (
                            <button
                              type="button"
                              onClick={() => {
                                const hnLabel = patient.hn && patient.hn !== '-' ? `HN: ${patient.hn} ` : '';
                                if (window.confirm(`ยืนยันการลบข้อมูลผู้ป่วย ${hnLabel}(${patient.prefix}${patient.firstName} ${patient.lastName})?`)) {
                                  onDeletePatient(patient.id);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="ลบข้อมูล"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PATIENT LIST: MOBILE CARDS (Mobile-First Display) */}
      <div className="lg:hidden space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="font-semibold text-slate-700 text-sm">
              {patients.length === 0
                ? 'ระบบพร้อมใช้งาน — ยังไม่มีข้อมูลผู้ป่วย'
                : 'ไม่พบข้อมูลผู้ป่วยตามเงื่อนไขที่ระบุ'}
            </div>
            <p className="text-xs text-slate-400">
              {patients.length === 0
                ? 'ข้อมูลทดสอบถูกนำออกแล้ว สามารถลงทะเบียนผู้ป่วยใหม่ได้ทันที'
                : 'ลองปรับตัวกรองหรือคำค้นหา'}
            </p>
            {patients.length === 0 && (
              <button
                type="button"
                onClick={onAddNewPatient}
                className="mt-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>ลงทะเบียนผู้ป่วยใหม่</span>
              </button>
            )}
          </div>
        ) : (
          filteredPatients.map((patient, index) => {
            const smivBadge = getSmivBadge(patient.smiv.level);
            const isUnmasked = !!unmaskedIds[patient.id];
            const completedRounds = patient.followUps.filter((f) => f.completed).length;

            return (
              <div
                key={patient.id}
                onClick={() => onViewPatient(patient.id)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all active:bg-slate-50 cursor-pointer space-y-2.5"
              >
                {/* Header: Name, HN, SMI-V */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {index + 1}. {patient.prefix}{patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono flex-wrap">
                      {patient.hn && patient.hn !== '-' && (
                        <>
                          <span className="font-semibold text-sky-700 font-sans">HN: {patient.hn}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>{patient.age} ปี ({patient.gender})</span>
                      {patient.fiscalYear && (
                        <>
                          <span>·</span>
                          <span className="text-teal-700 font-sans font-medium">ปีงบ {patient.fiscalYear}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${smivBadge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${smivBadge.dot}`} />
                    SMI-V {patient.smiv.level}
                  </span>
                </div>

                {/* ID Card with mask toggle */}
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl font-mono text-slate-600">
                  <span>
                    เลขบัตร: {isUnmasked ? formatFullIdCard(patient.idCard) : maskIdCard(patient.idCard)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => toggleUnmask(patient.id, e)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                  >
                    {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Area & Drug Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">ต.{patient.subdistrict} ({patient.serviceUnit})</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate font-medium text-slate-700">{patient.primaryDrugName}</span>
                  </div>
                </div>

                {/* Status & Follow-up Progress */}
                <div className="flex items-center justify-between pt-1">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getTreatmentStatusBadge(patient.treatmentStatus)}`}>
                    {patient.treatmentStatus}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400">ติดตาม:</span>
                    <span className={`font-bold font-mono ${completedRounds === 7 ? 'text-emerald-700' : 'text-sky-700'}`}>
                      {completedRounds}/7 ครั้ง
                    </span>
                  </div>
                </div>

                {/* Card footer buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-sky-600 font-semibold" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onViewPatient(patient.id)}
                    className="flex items-center gap-1 hover:underline"
                  >
                    <span>ดูรายละเอียด</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditPatient(patient)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      แก้ไข
                    </button>
                    {userRole === 'ADMIN' && (
                      <button
                        type="button"
                        onClick={() => {
                          const hnLabel = patient.hn && patient.hn !== '-' ? `HN: ${patient.hn} ` : '';
                          if (window.confirm(`ยืนยันการลบข้อมูลผู้ป่วย ${hnLabel}(${patient.prefix}${patient.firstName} ${patient.lastName})?`)) {
                            onDeletePatient(patient.id);
                          }
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
