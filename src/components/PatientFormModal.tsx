import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, User, MapPin, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { Patient, Subdistrict, ServiceUnit, DrugCategory, TreatmentModel, TreatmentStatus, Gender, SmivLevel } from '../types';
import { getCurrentFiscalYear, getFiscalYearFromDate, getAvailableFiscalYears } from '../utils/formatters';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: Partial<Patient>) => void;
  editPatient?: Patient | null;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editPatient,
}) => {
  // Form State
  const [prefix, setPrefix] = useState('นาย');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [hn, setHn] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<Gender>('ชาย');
  const [phone, setPhone] = useState('');

  // Address
  const [houseNo, setHouseNo] = useState('');
  const [moo, setMoo] = useState('1');
  const [villageName, setVillageName] = useState('');
  const [subdistrict, setSubdistrict] = useState<Subdistrict>('กรงปินัง');
  const [district, setDistrict] = useState('กรงปินัง');
  const [province, setProvince] = useState('ยะลา');

  // Treatment Data
  const [admitDate, setAdmitDate] = useState(new Date().toISOString().slice(0, 10));
  const [fiscalYear, setFiscalYear] = useState<string>(() => String(getCurrentFiscalYear()));
  const [serviceUnit, setServiceUnit] = useState<ServiceUnit>('โรงพยาบาลกรงปินัง');
  const [drugCategory, setDrugCategory] = useState<DrugCategory>('ยาบ้า/เมทแอมเฟตามีน');
  const [primaryDrugName, setPrimaryDrugName] = useState('ยาบ้า (เม็ด)');
  const [treatmentModel, setTreatmentModel] = useState<TreatmentModel>('ชุมชนล้อมรักษ์ (CBTx)');
  const [treatmentStatus, setTreatmentStatus] = useState<TreatmentStatus>('เข้าสู่กระบวนการบำบัด');
  const [smivLevel, setSmivLevel] = useState<SmivLevel>('เขียว');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentFiscalYear = getCurrentFiscalYear();
  const availableFiscalYears = useMemo(() => {
    return getAvailableFiscalYears(2566, editPatient?.fiscalYear ? [editPatient.fiscalYear] : []);
  }, [editPatient]);

  useEffect(() => {
    if (editPatient) {
      setPrefix(editPatient.prefix || 'นาย');
      setFirstName(editPatient.firstName || '');
      setLastName(editPatient.lastName || '');
      setIdCard(editPatient.idCard || '');
      setHn(editPatient.hn || '');
      setBirthDate(editPatient.birthDate || '');
      setAge(editPatient.age || 30);
      setGender(editPatient.gender || 'ชาย');
      setPhone(editPatient.phone || '');

      setHouseNo(editPatient.houseNo || '');
      setMoo(editPatient.moo || '1');
      setVillageName(editPatient.villageName || '');
      setSubdistrict(editPatient.subdistrict || 'กรงปินัง');
      setDistrict(editPatient.district || 'กรงปินัง');
      setProvince(editPatient.province || 'ยะลา');

      setAdmitDate(editPatient.admitDate || new Date().toISOString().slice(0, 10));
      setFiscalYear(editPatient.fiscalYear || getFiscalYearFromDate(editPatient.admitDate));
      setServiceUnit(editPatient.serviceUnit || 'โรงพยาบาลกรงปินัง');
      setDrugCategory(editPatient.drugCategory || 'ยาบ้า/เมทแอมเฟตามีน');
      setPrimaryDrugName(editPatient.primaryDrugName || '');
      setTreatmentModel(editPatient.treatmentModel || 'ชุมชนล้อมรักษ์ (CBTx)');
      setTreatmentStatus(editPatient.treatmentStatus || 'อยู่ระหว่างการบำบัด');
      setSmivLevel(editPatient.smiv?.level || 'เขียว');
      setNotes(editPatient.notes || '');
    } else {
      // Defaults for new patient
      setPrefix('นาย');
      setFirstName('');
      setLastName('');
      setHn('');
      setIdCard('');
      setBirthDate('');
      setAge(30);
      setGender('ชาย');
      setPhone('');
      setHouseNo('');
      setMoo('1');
      setVillageName('');
      setSubdistrict('กรงปินัง');
      setDistrict('กรงปินัง');
      setProvince('ยะลา');
      const todayStr = new Date().toISOString().slice(0, 10);
      setAdmitDate(todayStr);
      setFiscalYear(getFiscalYearFromDate(todayStr));
      setServiceUnit('โรงพยาบาลกรงปินัง');
      setDrugCategory('ยาบ้า/เมทแอมเฟตามีน');
      setPrimaryDrugName('ยาบ้า (เม็ด)');
      setTreatmentModel('ชุมชนล้อมรักษ์ (CBTx)');
      setTreatmentStatus('เข้าสู่กระบวนการบำบัด');
      setSmivLevel('เขียว');
      setNotes('');
    }
    setErrors({});
  }, [editPatient, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'กรุณาระบุชื่อ';
    if (!lastName.trim()) errs.lastName = 'กรุณาระบุนามสกุล';
    if (!age || age < 1 || age > 120) errs.age = 'กรุณาระบุอายุให้ถูกต้อง (1-120 ปี)';

    const cleanId = idCard.replace(/\D/g, '');
    if (!cleanId || cleanId.length !== 13) {
      errs.idCard = 'กรุณาระบุเลขบัตรประชาชน 13 หลัก';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const patientData: Partial<Patient> = {
      prefix,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      idCard: idCard.replace(/\D/g, ''),
      hn: editPatient?.hn || hn.trim() || '-',
      birthDate: editPatient?.birthDate || birthDate || '',
      age: Number(age),
      gender,
      phone: phone.trim(),
      houseNo: houseNo.trim(),
      moo: moo.trim(),
      villageName: villageName.trim(),
      subdistrict,
      district,
      province,
      admitDate,
      fiscalYear,
      serviceUnit,
      drugCategory,
      primaryDrugName: primaryDrugName.trim() || drugCategory,
      treatmentModel,
      treatmentStatus,
      notes: notes.trim(),
      smiv: editPatient?.smiv
        ? { ...editPatient.smiv, level: smivLevel }
        : {
            level: smivLevel,
            evaluationDate: admitDate,
            evaluator: 'เจ้าหน้าที่ผู้รับลงทะเบียน',
            warningSignals: [],
            oasScore: 0,
            managementPlan: 'ติดตามตามนัดปกติและประเมินซ้ำตามรอบ',
            notes: 'การประเมินแรกรับเข้าสู่ระบบบำบัด',
          },
      followUps: editPatient?.followUps || [],
      appointments: editPatient?.appointments || [],
      isRetained: editPatient ? editPatient.isRetained : true,
      retentionMonths: editPatient ? editPatient.retentionMonths : 1,
      isRemission: editPatient ? editPatient.isRemission : false,
      remissionMonths: editPatient ? editPatient.remissionMonths : 0,
      isMissed: editPatient ? editPatient.isMissed : false,
      missedCount: editPatient ? editPatient.missedCount : 0,
    };

    onSave(patientData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-700 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              {editPatient ? 'แก้ไขข้อมูลผู้ป่วยยาเสพติด' : 'เพิ่มข้อมูลผู้ป่วยใหม่'}
            </h2>
            <p className="text-xs text-sky-100 mt-0.5">
              ระบบทะเบียนและติดตามผู้ป่วยบำบัดยาเสพติด โรงพยาบาลกรงปินัง
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Area */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* หมวดที่ 1: ข้อมูลส่วนบุคคล */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm pb-2 border-b border-slate-200">
              <User className="w-4 h-4 text-sky-600" />
              <span>1. ข้อมูลส่วนบุคคล (Personal Information)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* คำนำหน้า */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">คำนำหน้า *</label>
                <select
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="ด.ช.">ด.ช.</option>
                  <option value="ด.ญ.">ด.ญ.</option>
                </select>
              </div>

              {/* ชื่อ */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อ *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ชื่อผู้ป่วย"
                  className={`w-full bg-white border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.firstName ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                  }`}
                />
                {errors.firstName && <span className="text-[11px] text-rose-500">{errors.firstName}</span>}
              </div>

              {/* นามสกุล */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">นามสกุล *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="นามสกุล"
                  className={`w-full bg-white border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.lastName ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                  }`}
                />
                {errors.lastName && <span className="text-[11px] text-rose-500">{errors.lastName}</span>}
              </div>

              {/* เพศ */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">เพศ *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              {/* เลขบัตรประชาชน 13 หลัก */}
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-1">เลขบัตรประชาชน 13 หลัก *</label>
                <input
                  type="text"
                  maxLength={17}
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  placeholder="เช่น 1950400128912"
                  className={`w-full bg-white border rounded-lg p-2.5 font-mono outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.idCard ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                  }`}
                />
                {errors.idCard && <span className="text-[11px] text-rose-500">{errors.idCard}</span>}
              </div>

              {/* อายุ */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">อายุ (ปี) *</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age || ''}
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="ระบุอายุ"
                  className={`w-full bg-white border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.age ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                  }`}
                />
                {errors.age && <span className="text-[11px] text-rose-500">{errors.age}</span>}
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08x-xxx-xxxx"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* หมวดที่ 2: ที่อยู่ */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>2. ข้อมูลที่อยู่ (Address)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">บ้านเลขที่</label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="45/2"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">หมู่ที่</label>
                <input
                  type="text"
                  value={moo}
                  onChange={(e) => setMoo(e.target.value)}
                  placeholder="1"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-1">ชุมชน / หมู่บ้าน</label>
                <input
                  type="text"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="เช่น บ้านสะเอะใน"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ตำบล *</label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value as Subdistrict)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="กรงปินัง">กรงปินัง</option>
                  <option value="สะเอะ">สะเอะ</option>
                  <option value="ปุโรง">ปุโรง</option>
                  <option value="ห้วยกระทิง">ห้วยกระทิง</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">อำเภอ</label>
                <input
                  type="text"
                  value={district}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* หมวดที่ 3: ข้อมูลการบำบัด */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm pb-2 border-b border-slate-200">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>3. ข้อมูลการบำบัดรักษา (Treatment Information)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">วันที่เข้ารับการบำบัด *</label>
                <input
                  type="date"
                  value={admitDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setAdmitDate(newDate);
                    // Automatically suggest fiscal year based on admission date if new patient
                    if (!editPatient && newDate) {
                      setFiscalYear(getFiscalYearFromDate(newDate));
                    }
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ปีงบประมาณ</label>
                <select
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {availableFiscalYears.map((y) => (
                    <option key={y} value={y}>
                      {y} {y === String(currentFiscalYear) ? '(ปีปัจจุบัน)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">หน่วยบริการ / รพ.สต. ที่รับผิดชอบ *</label>
                <select
                  value={serviceUnit}
                  onChange={(e) => setServiceUnit(e.target.value as ServiceUnit)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="โรงพยาบาลกรงปินัง">โรงพยาบาลกรงปินัง</option>
                  <option value="รพ.สต.สะเอะ">รพ.สต.สะเอะ</option>
                  <option value="รพ.สต.กรงปินัง">รพ.สต.กรงปินัง</option>
                  <option value="รพ.สต.ปุโรง">รพ.สต.ปุโรง</option>
                  <option value="รพ.สต.ห้วยกระทิง">รพ.สต.ห้วยกระทิง</option>
                  <option value="หน่วยบริการอื่น">หน่วยบริการอื่น</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ประเภทสารเสพติดหลัก *</label>
                <select
                  value={drugCategory}
                  onChange={(e) => setDrugCategory(e.target.value as DrugCategory)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ยาบ้า/เมทแอมเฟตามีน">ยาบ้า/เมทแอมเฟตามีน</option>
                  <option value="เฮโรอีน">เฮโรอีน</option>
                  <option value="กัญชา">กัญชา</option>
                  <option value="พืชกระท่อม/น้ำต้ม">พืชกระท่อม/น้ำต้ม</option>
                  <option value="ยาไอซ์">ยาไอซ์</option>
                  <option value="สารระเหย">สารระเหย</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อสารเสพติดที่ระบุ</label>
                <input
                  type="text"
                  value={primaryDrugName}
                  onChange={(e) => setPrimaryDrugName(e.target.value)}
                  placeholder="เช่น ยาบ้า, น้ำต้มพืชกระท่อม"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">รูปแบบการบำบัด *</label>
                <select
                  value={treatmentModel}
                  onChange={(e) => setTreatmentModel(e.target.value as TreatmentModel)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ชุมชนล้อมรักษ์ (CBTx)">ชุมชนล้อมรักษ์ (CBTx)</option>
                  <option value="ผู้ป่วยนอก (OPD)">ผู้ป่วยนอก (OPD)</option>
                  <option value="มินิธัญญารักษ์">มินิธัญญารักษ์</option>
                  <option value="ผู้ป่วยใน (IPD)">ผู้ป่วยใน (IPD)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">สถานะการบำบัด *</label>
                <select
                  value={treatmentStatus}
                  onChange={(e) => setTreatmentStatus(e.target.value as TreatmentStatus)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="เข้าสู่กระบวนการบำบัด">เข้าสู่กระบวนการบำบัด</option>
                  <option value="อยู่ระหว่างการบำบัด">อยู่ระหว่างการบำบัด</option>
                  <option value="ครบเกณฑ์">ครบเกณฑ์ (7 ครั้ง 12 เดือน)</option>
                  <option value="ขาดนัด">ขาดนัด</option>
                  <option value="จำหน่าย">จำหน่าย</option>
                  <option value="ส่งต่อ">ส่งต่อ</option>
                  <option value="ไม่ประสงค์รับการบำบัด">ไม่ประสงค์รับการบำบัด</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ระดับความเสี่ยง SMI-V</label>
                <select
                  value={smivLevel}
                  onChange={(e) => setSmivLevel(e.target.value as SmivLevel)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                >
                  <option value="เขียว">🟢 เขียว (ติดตามตามปกติ)</option>
                  <option value="เหลือง">🟡 เหลือง (ควรติดตามใกล้ชิด)</option>
                  <option value="ส้ม">🟠 ส้ม (เสี่ยงสูง วางแผนติดตาม)</option>
                  <option value="แดง">🔴 แดง (เร่งด่วน จัดการทันที)</option>
                </select>
              </div>

              <div className="col-span-full">
                <label className="block text-slate-600 font-medium mb-1">หมายเหตุเพิ่มเติม</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="บันทึกข้อสังเกต หรือข้อมูลการส่งต่อ..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูลผู้ป่วย</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
