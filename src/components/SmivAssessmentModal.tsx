import React, { useState } from 'react';
import { X, ShieldAlert, Save, AlertTriangle } from 'lucide-react';
import { SmivAssessment, SmivLevel } from '../types';

interface SmivAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assessment: SmivAssessment) => void;
  currentAssessment?: SmivAssessment;
  patientName?: string;
  evaluatorName?: string;
}

export const SmivAssessmentModal: React.FC<SmivAssessmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAssessment,
  patientName,
  evaluatorName = 'เจ้าหน้าที่จิตเวชและยาเสพติด',
}) => {
  const WARNING_OPTIONS = [
    'ไม่หลับไม่นอน 1-3 วันติดต่อกัน / เดินไปมาทั้งคืน',
    'หวาดระแวง กลัวมีคนจ้องปองร้าย หรือสะกดรอยตาม',
    'หูแว่ว ได้ยินเสียงคนพูดสั่งให้ทำร้ายตนเองหรือผู้อื่น',
    'เอะอะโวยวาย อารมณ์ฉุนเฉียว ก้าวร้าว ข่มขู่คนในบ้าน',
    'พกพาอาวุธ หรือมีพฤติกรรมทำลายทรัพย์สิน/ทำร้ายร่างกาย',
    'ไม่ยอมรับประทานยาจิตเวชต่อเนื่อง ขาดยาเกิน 1 สัปดาห์',
  ];

  const [level, setLevel] = useState<SmivLevel>(currentAssessment?.level || 'เขียว');
  const [evaluationDate, setEvaluationDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState<string>(evaluatorName);
  const [warningSignals, setWarningSignals] = useState<string[]>(currentAssessment?.warningSignals || []);
  const [oasScore, setOasScore] = useState<number>(currentAssessment?.oasScore || 0);
  const [managementPlan, setManagementPlan] = useState<string>(
    currentAssessment?.managementPlan || 'ติดตามตามนัดปกติและสนับสนุนการประกอบอาชีพในชุมชน'
  );
  const [notes, setNotes] = useState<string>(currentAssessment?.notes || '');

  if (!isOpen) return null;

  const handleToggleSignal = (signal: string) => {
    setWarningSignals((prev) => {
      const exists = prev.includes(signal);
      const updated = exists ? prev.filter((s) => s !== signal) : [...prev, signal];

      // Auto adjust suggested level based on signals checked
      if (updated.length >= 3 || updated.some((s) => s.includes('พกพาอาวุธ') || s.includes('หูแว่ว'))) {
        setLevel('แดง');
        setManagementPlan('ประสานทีมกู้ชีพ สภ.กรงปินัง และผู้นำชุมชน เพื่อนำส่งแผนกจิตเวชฉุกเฉิน รพ.ศูนย์ยะลา ทันที');
      } else if (updated.length === 2) {
        setLevel('ส้ม');
        setManagementPlan('วางแผนลงเยี่ยมบ้านร่วมกับ อสม. และผู้นำท้องถิ่น เฝ้าระวังไม่ให้อาการกำเริบ');
      } else if (updated.length === 1) {
        setLevel('เหลือง');
        setManagementPlan('ติดตามอย่างใกล้ชิด ตรวจสอบการทานยาจิตเวชสม่ำเสมอ');
      } else {
        setLevel('เขียว');
        setManagementPlan('ติดตามตามนัดปกติและสนับสนุนการประกอบอาชีพในชุมชน');
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      level,
      evaluationDate,
      evaluator,
      warningSignals,
      oasScore: Number(oasScore),
      managementPlan,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>แบบประเมินความเสี่ยงจิตเวชยาเสพติด SMI-V</span>
            </h3>
            {patientName && (
              <p className="text-xs text-rose-100">ผู้ป่วย: {patientName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm overflow-y-auto max-h-[80vh]">
          {/* Warning signals checklist */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
              1. สัญญาณเตือนความเสี่ยง (5 สัญญาณเตือน SMI-V)
            </span>
            <div className="space-y-2">
              {WARNING_OPTIONS.map((sig, idx) => {
                const checked = warningSignals.includes(sig);
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      checked
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleSignal(sig)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-xs leading-relaxed">{sig}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Level Selection */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block">
              2. ผลการจัดระดับความเสี่ยง (SMI-V Level) *
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'เขียว', label: '🟢 เขียว', desc: 'ติดตามปกติ' },
                { id: 'เหลือง', label: '🟡 เหลือง', desc: 'ติดตามใกล้ชิด' },
                { id: 'ส้ม', label: '🟠 ส้ม', desc: 'เสี่ยงสูง วางแผน' },
                { id: 'แดง', label: '🔴 แดง', desc: 'เร่งด่วน จัดการทันที' },
              ].map((lvl) => {
                const active = level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id as SmivLevel)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      active
                        ? 'border-sky-500 bg-sky-50 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-800">{lvl.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Evaluator */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">วันที่ประเมิน *</label>
              <input
                type="date"
                value={evaluationDate}
                onChange={(e) => setEvaluationDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">ผู้ประเมิน *</label>
              <input
                type="text"
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Management Plan */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">แผนการจัดการความเสี่ยง (Management Plan) *</label>
            <textarea
              rows={2}
              value={managementPlan}
              onChange={(e) => setManagementPlan(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">บันทึกเพิ่มเติม</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ข้อสังเกตจากครอบครัวหรือชุมชน..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Footer Buttons */}
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
              className="py-2.5 px-5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกผลการประเมิน SMI-V</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
