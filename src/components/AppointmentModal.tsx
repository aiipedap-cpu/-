import React, { useState } from 'react';
import { X, Calendar, Save } from 'lucide-react';
import { AppointmentRecord, ServiceUnit, AppointmentStatus } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AppointmentRecord) => void;
  patientName?: string;
  defaultUnit?: ServiceUnit;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientName,
  defaultUnit = 'โรงพยาบาลกรงปินัง',
}) => {
  const [date, setDate] = useState<string>(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10));
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [serviceUnit, setServiceUnit] = useState<ServiceUnit>(defaultUnit);
  const [officer, setOfficer] = useState<string>('พยาบาลวิชาชีพ / จนท.รพ.สต.');
  const [status, setStatus] = useState<AppointmentStatus>('นัดใกล้ถึง');
  const [notes, setNotes] = useState<string>('นัดติดตามอาการและตรวจปัสสาวะ');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `apt-${Date.now()}`,
      date,
      roundNumber: Number(roundNumber),
      serviceUnit,
      officer,
      status,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-gradient-to-r from-sky-700 to-teal-700 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>บันทึกการนัดหมาย / ปรับปรุงสถานะนัด</span>
            </h3>
            {patientName && (
              <p className="text-xs text-sky-100">ผู้ป่วย: {patientName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่นัดหมาย *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">นัดครั้งที่ *</label>
              <select
                value={roundNumber}
                onChange={(e) => setRoundNumber(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>ครั้งที่ {num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">หน่วยบริการที่นัด *</label>
              <select
                value={serviceUnit}
                onChange={(e) => setServiceUnit(e.target.value as ServiceUnit)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="โรงพยาบาลกรงปินัง">โรงพยาบาลกรงปินัง</option>
                <option value="รพ.สต.สะเอะ">รพ.สต.สะเอะ</option>
                <option value="รพ.สต.กรงปินัง">รพ.สต.กรงปินัง</option>
                <option value="รพ.สต.ปุโรง">รพ.สต.ปุโรง</option>
                <option value="รพ.สต.ห้วยกระทิง">รพ.สต.ห้วยกระทิง</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">สถานะนัดหมาย *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
              >
                <option value="นัดใกล้ถึง">🟡 นัดใกล้ถึง</option>
                <option value="มาตามนัด">🟢 มาตามนัด</option>
                <option value="ขาดนัดและอยู่ระหว่างติดตาม">🟠 ขาดนัดและอยู่ระหว่างติดตาม</option>
                <option value="ขาดนัดเร่งด่วน">🔴 ขาดนัดเร่งด่วน</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">ผู้รับผิดชอบนัดหมาย</label>
            <input
              type="text"
              value={officer}
              onChange={(e) => setOfficer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">หมายเหตุการนัดหมาย</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุสิ่งที่ต้องตรวจ หรือคำแนะนำการเตรียมตัว..."
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
              className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกนัดหมาย</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
