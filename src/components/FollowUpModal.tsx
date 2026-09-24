import React, { useState } from 'react';
import { X, Save, CheckCircle2 } from 'lucide-react';
import { FollowUpRecord, FollowUpMethod, FollowUpDrugStatus } from '../types';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: FollowUpRecord) => void;
  defaultRound?: number;
  currentOfficerName?: string;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultRound = 1,
  currentOfficerName = 'เจ้าหน้าที่ผู้รับผิดชอบ',
}) => {
  const [round, setRound] = useState<number>(defaultRound);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState<FollowUpMethod>('เยี่ยมบ้าน');
  const [officer, setOfficer] = useState<string>(currentOfficerName);
  const [patientStatus, setPatientStatus] = useState<string>('สภาพจิตใจแจ่มใส ให้ความร่วมมือดี ครอบครัวให้การดูแล');
  const [drugStatus, setDrugStatus] = useState<FollowUpDrugStatus>('หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)');
  const [urineTestResult, setUrineTestResult] = useState<'ลบ (Negative)' | 'บวก (Positive)' | 'ไม่ได้ตรวจ'>('ลบ (Negative)');
  const [symptoms, setSymptoms] = useState<string>('ไม่มีอาการถอนยา หรืออาการทางจิต');
  const [nextAppointmentDate, setNextAppointmentDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('กำกับเรื่องการรับประทานยาและส่งเสริมกิจกรรมในครอบครัว');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      round: Number(round),
      date,
      method,
      officer,
      patientStatus,
      drugStatus,
      urineTestResult,
      symptoms,
      nextAppointmentDate: nextAppointmentDate || undefined,
      notes,
      completed: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 to-sky-700 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>บันทึกการติดตามผู้ป่วย (ระบบ 7 ครั้งใน 12 เดือน)</span>
            </h3>
            <p className="text-xs text-teal-100">
              บันทึกผลการติดตามทางคลินิกและชุมชน รพ.กรงปินัง
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">ติดตามครั้งที่ *</label>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
              >
                <option value={1}>ครั้งที่ 1 (เดือนที่ 1)</option>
                <option value={2}>ครั้งที่ 2 (เดือนที่ 2)</option>
                <option value={3}>ครั้งที่ 3 (เดือนที่ 3)</option>
                <option value={4}>ครั้งที่ 4 (เดือนที่ 6)</option>
                <option value={5}>ครั้งที่ 5 (เดือนที่ 9)</option>
                <option value={6}>ครั้งที่ 6 (เดือนที่ 11)</option>
                <option value={7}>ครั้งที่ 7 (เดือนที่ 12 ครบเกณฑ์)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่ติดตาม *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">วิธีติดตาม *</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as FollowUpMethod)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="มาพบที่โรงพยาบาล">มาพบที่โรงพยาบาล</option>
                <option value="เยี่ยมบ้าน">เยี่ยมบ้าน</option>
                <option value="โทรศัพท์">โทรศัพท์</option>
                <option value="LINE/ช่องทางออนไลน์">LINE / ช่องทางออนไลน์</option>
                <option value="ประสาน รพ.สต.">ประสาน รพ.สต.</option>
                <option value="ประสานชุมชน">ประสานชุมชน / ผู้นำท้องถิ่น</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">ผู้ติดตาม *</label>
              <input
                type="text"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                required
                placeholder="ระบุชื่อเจ้าหน้าที่"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">การใช้สารเสพติด *</label>
              <select
                value={drugStatus}
                onChange={(e) => setDrugStatus(e.target.value as FollowUpDrugStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)">หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)</option>
                <option value="ลดปริมาณการเสพ">ลดปริมาณการเสพ</option>
                <option value="กลับมาเสพซ้ำ (Relapse)">กลับมาเสพซ้ำ (Relapse)</option>
                <option value="ปฏิเสธการตรวจ">ปฏิเสธการตรวจ</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">ผลตรวจปัสสาวะ *</label>
              <select
                value={urineTestResult}
                onChange={(e) => setUrineTestResult(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ลบ (Negative)">ลบ (Negative - ไม่พบสาร)</option>
                <option value="บวก (Positive)">บวก (Positive - พบสาร)</option>
                <option value="ไม่ได้ตรวจ">ไม่ได้ตรวจ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">สถานะผู้ป่วย / อาการสำคัญ</label>
            <input
              type="text"
              value={patientStatus}
              onChange={(e) => setPatientStatus(e.target.value)}
              placeholder="เช่น สภาพจิตใจปกติ ไม่มีพฤติกรรมก้าวร้าว"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">อาการสำคัญ / ภาวะถอนยา</label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="เช่น หลับได้ปกติ ไม่มีหูแว่ว"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">การนัดหมายครั้งถัดไป</label>
              <input
                type="date"
                value={nextAppointmentDate}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">หมายเหตุ / แผนการดูแล</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="บันทึกเพิ่มเติมหรือคำแนะนำที่ให้แก่ผู้ป่วยและญาติ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกผลการติดตาม</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
