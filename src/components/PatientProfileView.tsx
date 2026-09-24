import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  UserCheck,
  Calendar,
  AlertTriangle,
  Printer,
  Phone,
  MapPin,
  Clock,
  Activity,
  ShieldAlert,
  CheckCircle2,
  CalendarX2,
  TrendingUp,
  Award,
  FileText,
  Plus,
  Eye,
  EyeOff,
  Hospital,
  ChevronRight,
} from 'lucide-react';
import { Patient, UserRole } from '../types';
import {
  maskIdCard,
  formatFullIdCard,
  formatThaiDate,
  getSmivBadge,
  getTreatmentStatusBadge,
  getAppointmentStatusBadge,
} from '../utils/formatters';

interface PatientProfileViewProps {
  patient: Patient;
  userRole: UserRole;
  onBack: () => void;
  onEdit: () => void;
  onOpenFollowUpModal: (roundNumber?: number) => void;
  onOpenAppointmentModal: () => void;
  onOpenSmivModal: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  userRole,
  onBack,
  onEdit,
  onOpenFollowUpModal,
  onOpenAppointmentModal,
  onOpenSmivModal,
}) => {
  const [showFullId, setShowFullId] = useState(false);

  const completedFollowUps = patient.followUps.filter((f) => f.completed).length;
  const smivBadge = getSmivBadge(patient.smiv.level);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Actions Bar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="กลับหน้ารายการ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                ข้อมูลผู้ป่วยรายบุคคล
              </h2>
              {patient.hn && patient.hn !== '-' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-semibold">
                  HN: {patient.hn}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              กลุ่มงานจิตเวชและยาเสพติด โรงพยาบาลกรงปินัง
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>พิมพ์ข้อมูล</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAppointmentModal()}
            className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs sm:text-sm font-medium rounded-xl border border-teal-200 flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>เพิ่มนัดหมาย</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenFollowUpModal()}
            className="py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs sm:text-sm font-medium rounded-xl border border-sky-200 flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>บันทึกการติดตาม</span>
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>แก้ไขข้อมูล</span>
          </button>
        </div>
      </div>

      {/* PRINT HEADER (Visible only in print) */}
      <div className="hidden print-only text-center pb-4 border-b border-black mb-6">
        <h1 className="text-xl font-bold">โรงพยาบาลกรงปินัง อำเภอกรงปินัง จังหวัดยะลา</h1>
        <h2 className="text-base font-semibold">เวชระเบียนและบันทึกการติดตามผู้ป่วยบำบัดยาเสพติด (CBTx / OPD)</h2>
        <p className="text-xs">พิมพ์ข้อมูลเมื่อ: {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      {/* PATIENT SUMMARY HERO BANNER */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-teal-700 text-white p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20">
              {patient.firstName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-bold">
                  {patient.prefix}{patient.firstName} {patient.lastName}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                  {patient.gender} · อายุ {patient.age} ปี
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-sky-100">
                {patient.hn && patient.hn !== '-' && (
                  <>
                    <span>HN: <strong className="text-white font-mono">{patient.hn}</strong></span>
                    <span>·</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  เลขบัตร:
                  <span className="font-mono">
                    {showFullId ? formatFullIdCard(patient.idCard) : maskIdCard(patient.idCard)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFullId(!showFullId)}
                    className="p-0.5 text-sky-200 hover:text-white"
                  >
                    {showFullId ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {patient.phone || '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border bg-white/90 ${smivBadge.bg}`}>
              SMI-V: {patient.smiv.level} ({smivBadge.desc})
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-500/30 text-teal-100 border border-teal-300/30">
              สถานะ: {patient.treatmentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* CORE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: ข้อมูลส่วนบุคคล */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>ข้อมูลส่วนบุคคล</span>
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">คำนำหน้า-ชื่อ-สกุล:</span>
              <span className="font-semibold text-slate-800">{patient.prefix}{patient.firstName} {patient.lastName}</span>
            </div>
            {patient.hn && patient.hn !== '-' && (
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">HN โรงพยาบาล:</span>
                <span className="font-mono font-semibold text-sky-700">{patient.hn}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">เลขประจำตัวประชาชน:</span>
              <span className="font-mono text-slate-700">
                {showFullId ? formatFullIdCard(patient.idCard) : maskIdCard(patient.idCard)}
              </span>
            </div>
            {patient.birthDate && (
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">วันเดือนปีเกิด:</span>
                <span className="text-slate-700">{formatThaiDate(patient.birthDate)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">อายุ / เพศ:</span>
              <span className="text-slate-700">{patient.age} ปี / {patient.gender}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">เบอร์โทรศัพท์ติดต่อ:</span>
              <span className="font-medium text-slate-800">{patient.phone || 'ไม่ได้ระบุ'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: ข้อมูลที่อยู่ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>ข้อมูลที่อยู่</span>
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">บ้านเลขที่ / หมู่:</span>
              <span className="font-semibold text-slate-800">บ้านเลขที่ {patient.houseNo || '-'} หมู่ที่ {patient.moo || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">หมู่บ้าน/ชุมชน:</span>
              <span className="text-slate-700">{patient.villageName || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">ตำบล:</span>
              <span className="font-medium text-slate-800">ตำบล{patient.subdistrict}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">อำเภอ:</span>
              <span className="text-slate-700">อำเภอกรงปินัง</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">จังหวัด:</span>
              <span className="text-slate-700">จังหวัดยะลา</span>
            </div>
          </div>
        </div>

        {/* Card 3: ข้อมูลการบำบัด & สารเสพติด */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>ข้อมูลการบำบัดและสารเสพติด</span>
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">วันที่เริ่มบำบัด:</span>
              <span className="font-semibold text-slate-800">{formatThaiDate(patient.admitDate)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">ปีงบประมาณ:</span>
              <span className="font-semibold text-slate-800">ปีงบประมาณ พ.ศ. {patient.fiscalYear || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">หน่วยบริการหลัก:</span>
              <span className="font-medium text-teal-700">{patient.serviceUnit}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">สารเสพติดหลัก:</span>
              <span className="font-semibold text-slate-800">{patient.primaryDrugName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">ประเภทสาร:</span>
              <span className="text-slate-700">{patient.drugCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">รูปแบบการบำบัด:</span>
              <span className="text-slate-700">{patient.treatmentModel}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">สถานะปัจจุบัน:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getTreatmentStatusBadge(patient.treatmentStatus)}`}>
                {patient.treatmentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: TIMELINE การติดตาม 7 ครั้งใน 12 เดือน */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                Timeline การติดตาม 7 ครั้งใน 12 เดือน
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${completedFollowUps === 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                {completedFollowUps === 7 ? 'ติดตามครบ 7 ครั้ง 🎉' : `ติดตามแล้ว ${completedFollowUps} / 7 ครั้ง`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              เกณฑ์กระทรวงสาธารณสุข: ติดตามผลการบำบัดรักษา 7 ครั้งภายในระยะเวลา 1 ปี (ครั้งที่ 1-7)
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenFollowUpModal()}
            className="py-2 px-3.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>บันทึกการติดตามรอบใหม่</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span>ความก้าวหน้าการติดตาม</span>
            <span className="font-mono font-bold text-sky-700">
              {Math.round((completedFollowUps / 7) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completedFollowUps === 7 ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-500 to-teal-500'
              }`}
              style={{ width: `${(completedFollowUps / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Timeline items 1 to 7 */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {[1, 2, 3, 4, 5, 6, 7].map((roundNum) => {
            const record = patient.followUps.find((f) => f.round === roundNum);
            const isCompleted = record && record.completed;

            return (
              <div key={roundNum} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : roundNum}
                </div>

                {/* Content Box */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-white border-dashed border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      ครั้งที่ {roundNum} {roundNum === 7 && '(ประเมินครบเกณฑ์ 12 เดือน)'}
                    </span>

                    {isCompleted ? (
                      <span className="text-xs text-slate-500 font-mono">
                        วันที่ติดตาม: {formatThaiDate(record.date)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        ยังไม่ถึงกำหนด / รอการติดตาม
                      </span>
                    )}
                  </div>

                  {isCompleted ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[11px]">วิธีติดตาม:</span>
                        <span className="font-medium">{record.method}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">ผู้ติดตาม:</span>
                        <span className="font-medium">{record.officer}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">การใช้สารเสพติด:</span>
                        <span className="font-medium text-emerald-700">{record.drugStatus}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">ผลตรวจปัสสาวะ:</span>
                        <span className="font-medium">{record.urineTestResult}</span>
                      </div>

                      <div className="col-span-full pt-1 border-t border-slate-200/60 mt-1">
                        <span className="text-slate-400 block text-[11px]">อาการ / ผลการติดตาม:</span>
                        <p className="text-slate-700 mt-0.5">{record.patientStatus || record.symptoms}</p>
                        {record.notes && (
                          <p className="text-slate-500 text-[11px] mt-0.5">หมายเหตุ: {record.notes}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenFollowUpModal(roundNum)}
                      className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>คลิกเพื่อบันทึกผลการติดตามครั้งที่ {roundNum}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADDITIONAL CLINICAL CARDS (SMI-V, Appointments, Retention, Remission) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card: SMI-V / Risk Monitoring */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>SMI-V / การประเมินความเสี่ยง</span>
            </h4>
            <button
              type="button"
              onClick={onOpenSmivModal}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              ประเมินซ้ำ
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">ระดับความเสี่ยง:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${smivBadge.bg}`}>
                {patient.smiv.level} ({smivBadge.desc})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">วันที่ประเมินล่าสุด:</span>
              <span className="text-slate-700">{formatThaiDate(patient.smiv.evaluationDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">ผู้ประเมิน:</span>
              <span className="text-slate-700">{patient.smiv.evaluator}</span>
            </div>
            <div className="pt-2 border-t border-slate-50">
              <span className="text-slate-500 block mb-1">สัญญาณเตือน / อาการเสี่ยง:</span>
              {patient.smiv.warningSignals && patient.smiv.warningSignals.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-rose-700">
                  {patient.smiv.warningSignals.map((sig, i) => (
                    <li key={i}>{sig}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-emerald-700">ไม่มีสัญญาณเตือนรุนแรง</span>
              )}
            </div>
            <div className="pt-1">
              <span className="text-slate-500 block mb-0.5">แผนการจัดการ:</span>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {patient.smiv.managementPlan || 'ติดตามตามนัดปกติ'}
              </p>
            </div>
          </div>
        </div>

        {/* Card: Retention & Remission Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>ตัวชี้วัด Retention & Remission</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Retention */}
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Retention Status</span>
              </div>
              <p className="text-base font-bold text-teal-700">
                {patient.isRetained ? 'คงอยู่ในระบบ' : 'หลุดการบำบัด'}
              </p>
              <p className="text-[11px] text-teal-600">
                ระยะเวลาคงอยู่: {patient.retentionMonths || 0} เดือน
              </p>
            </div>

            {/* Remission */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Remission Status</span>
              </div>
              <p className="text-base font-bold text-indigo-700">
                {patient.isRemission ? 'เข้าเกณฑ์ Remission' : 'ยังไม่เข้าเกณฑ์'}
              </p>
              <p className="text-[11px] text-indigo-600">
                หยุดเสพต่อเนื่อง: {patient.remissionMonths || 0} เดือน
              </p>
            </div>
          </div>

          {/* Missed Appointment Status */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">ประวัติการขาดนัด:</span>
              {patient.isMissed ? (
                <span className="text-rose-600 font-bold">
                  ขาดนัด ({patient.missedCount} ครั้ง / ขาดมาแล้ว {patient.daysMissed || 0} วัน)
                </span>
              ) : (
                <span className="text-emerald-700 font-medium">ไม่มีประวัติขาดนัด มาตรงตามกำหนด</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APPOINTMENT HISTORY TABLE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>ประวัติการนัดหมายและการมาตามนัด</span>
          </h4>
          <button
            type="button"
            onClick={onOpenAppointmentModal}
            className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มนัดหมาย</span>
          </button>
        </div>

        {patient.appointments.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">ยังไม่มีประวัติการนัดหมาย</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">วันนัดหมาย</th>
                  <th className="py-2.5 px-3">นัดครั้งที่</th>
                  <th className="py-2.5 px-3">หน่วยบริการ</th>
                  <th className="py-2.5 px-3">ผู้รับผิดชอบ</th>
                  <th className="py-2.5 px-3">สถานะ</th>
                  <th className="py-2.5 px-3">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.appointments.map((apt) => {
                  const badge = getAppointmentStatusBadge(apt.status);
                  return (
                    <tr key={apt.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {formatThaiDate(apt.date)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">ครั้งที่ {apt.roundNumber}</td>
                      <td className="py-2.5 px-3 text-slate-600">{apt.serviceUnit}</td>
                      <td className="py-2.5 px-3 text-slate-600">{apt.officer}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{apt.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
