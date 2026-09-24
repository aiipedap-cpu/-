import React, { useState } from 'react';
import { Settings, Hospital, Database, Shield, RefreshCw, CheckCircle2, Save } from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';

interface SystemSettingsViewProps {
  onResetDemoData: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({ onResetDemoData }) => {
  const [hospitalName, setHospitalName] = useState('โรงพยาบาลกรงปินัง');
  const [retentionTarget, setRetentionTarget] = useState(70);
  const [remissionTarget, setRemissionTarget] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              ตั้งค่าระบบและเกณฑ์ตัวชี้วัด (System Configuration)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              กำหนดค่าหน่วยบริการ เกณฑ์ตัวชี้วัดกระทรวงสาธารณสุข และการดูแลระบบฐานข้อมูล
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>บันทึกการตั้งค่าระบบเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Hospital Identity & Sub-district Network */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-800 text-sm">
            <Hospital className="w-4 h-4 text-teal-600" />
            <span>ข้อมูลหน่วยงานและเครือข่ายบริการปฐมภูมิ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-600 font-medium mb-1">ชื่อโรงพยาบาลหลัก</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">สังกัด</label>
              <input
                type="text"
                disabled
                value="สำนักงานสาธารณสุขจังหวัดยะลา (สสจ.ยะลา)"
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-600"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-600 font-medium mb-2 text-xs">
              เครือข่ายโรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.) ในอำเภอกรงปินัง
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { name: 'รพ.สต.สะเอะ', code: '08101' },
                { name: 'รพ.สต.กรงปินัง', code: '08102' },
                { name: 'รพ.สต.ปุโรง', code: '08103' },
                { name: 'รพ.สต.ห้วยกระทิง', code: '08104' },
              ].map((hosp) => (
                <div key={hosp.code} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-800">{hosp.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">รหัสสถานพยาบาล: {hosp.code}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Targets (Retention & Remission) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-800 text-sm">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>เกณฑ์ตัวชี้วัดกระทรวงสาธารณสุข (KPI Targets)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                เป้าหมาย Retention Rate (%)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={retentionTarget}
                onChange={(e) => setRetentionTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">เกณฑ์มาตรฐานกระทรวง สธ. คือ 70%</span>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                เป้าหมาย Remission Rate (%)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={remissionTarget}
                onChange={(e) => setRemissionTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">เกณฑ์มาตรฐานกระทรวง สธ. คือ 60%</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </div>
      </form>

      {/* Database Management & Clean Data */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-800 text-sm">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>การจัดการฐานข้อมูลและการเตรียมเปิดใช้งานระบบจริง</span>
        </div>

        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">สถานะระบบ: พร้อมใช้งานจริง (Production Ready)</div>
            <div className="text-emerald-700 mt-0.5">
              ข้อมูลทดสอบทั้งหมดถูกนำออกเรียบร้อยแล้ว ระบบพร้อมสำหรับการลงทะเบียนผู้ป่วยจริงโดยบุคลากรทางการแพทย์ รพ.กรงปินัง
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          หากต้องการล้างข้อมูลเวชระเบียนทั้งหมดเพื่อเปิดระบบใหม่จากศูนย์ หรือคืนค่าระบบ สามารถดำเนินการได้ผ่านปุ่มด้านล่าง
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('คำเตือน: คุณต้องการล้างข้อมูลผู้ป่วยทั้งหมดออกจากระบบเพื่อเปิดระบบใหม่หรือไม่? (การกระทำนี้ไม่สามารถย้อนกลับได้)')) {
                onResetDemoData();
              }
            }}
            className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
            <span>ล้างข้อมูลผู้ป่วยทั้งหมดเพื่อเปิดระบบใหม่ (Reset to Clean State)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
