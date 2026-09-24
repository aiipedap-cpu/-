export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  position: string;
  department: string;
  active: boolean;
  isActive?: boolean;
  phone: string;
  lastLogin?: string;
}

export type Gender = 'ชาย' | 'หญิง' | 'อื่นๆ';

export type Subdistrict = 'สะเอะ' | 'กรงปินัง' | 'ปุโรง' | 'ห้วยกระทิง';

export type ServiceUnit =
  | 'โรงพยาบาลกรงปินัง'
  | 'รพ.สต.สะเอะ'
  | 'รพ.สต.กรงปินัง'
  | 'รพ.สต.ปุโรง'
  | 'รพ.สต.ห้วยกระทิง'
  | 'หน่วยบริการอื่น';

export type DrugCategory =
  | 'ยาบ้า/เมทแอมเฟตามีน'
  | 'เฮโรอีน'
  | 'กัญชา'
  | 'พืชกระท่อม/น้ำต้ม'
  | 'ยาไอซ์'
  | 'สารระเหย'
  | 'อื่นๆ';

export type TreatmentModel =
  | 'ผู้ป่วยนอก (OPD)'
  | 'ผู้ป่วยใน (IPD)'
  | 'ชุมชนล้อมรักษ์ (CBTx)'
  | 'มินิธัญญารักษ์';

export type TreatmentStatus =
  | 'เข้าสู่กระบวนการบำบัด'
  | 'อยู่ระหว่างการบำบัด'
  | 'ครบเกณฑ์'
  | 'ขาดนัด'
  | 'จำหน่าย'
  | 'ส่งต่อ'
  | 'ไม่ประสงค์รับการบำบัด';

export type FollowUpMethod =
  | 'มาพบที่โรงพยาบาล'
  | 'เยี่ยมบ้าน'
  | 'โทรศัพท์'
  | 'LINE/ช่องทางออนไลน์'
  | 'ประสาน รพ.สต.'
  | 'ประสานชุมชน';

export type FollowUpDrugStatus =
  | 'หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)'
  | 'ลดปริมาณการเสพ'
  | 'กลับมาเสพซ้ำ (Relapse)'
  | 'ปฏิเสธการตรวจ';

export interface FollowUpRecord {
  round: number; // 1 to 7
  date: string;
  method: FollowUpMethod;
  officer: string;
  patientStatus: string;
  drugStatus: FollowUpDrugStatus;
  urineTestResult: 'ลบ (Negative)' | 'บวก (Positive)' | 'ไม่ได้ตรวจ';
  symptoms: string;
  nextAppointmentDate?: string;
  notes: string;
  completed: boolean;
}

export type AppointmentStatus =
  | 'มาตามนัด'
  | 'นัดใกล้ถึง'
  | 'ขาดนัดและอยู่ระหว่างติดตาม'
  | 'ขาดนัดเร่งด่วน';

export interface AppointmentRecord {
  id: string;
  date: string;
  roundNumber: number;
  serviceUnit: ServiceUnit;
  officer: string;
  status: AppointmentStatus;
  notes: string;
}

export type SmivLevel = 'เขียว' | 'เหลือง' | 'ส้ม' | 'แดง';

export interface SmivAssessment {
  level: SmivLevel;
  evaluationDate: string;
  evaluator: string;
  warningSignals: string[]; // 5 สัญญาณเตือน เช่น หูแว่ว ประสาทหลอน ก้าวร้าว ข่มขู่ ไม่หลับไม่นอน
  oasScore?: number; // Overt Aggression Scale
  managementPlan: string;
  notes: string;
}

export interface Patient {
  id: string;
  hn?: string;
  idCard: string;
  prefix: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  age: number;
  gender: Gender;
  phone: string;
  
  // Address
  houseNo: string;
  moo: string;
  villageName: string;
  subdistrict: Subdistrict;
  district: string;
  province: string;

  // Treatment Data
  admitDate: string;
  fiscalYear: string;
  serviceUnit: ServiceUnit;
  drugCategory: DrugCategory;
  primaryDrugName: string;
  treatmentModel: TreatmentModel;
  treatmentStatus: TreatmentStatus;

  // 7 Follow-ups in 12 months
  followUps: FollowUpRecord[];
  
  // Appointments
  appointments: AppointmentRecord[];

  // SMI-V
  smiv: SmivAssessment;

  // Retention & Remission
  isRetained: boolean;
  retentionMonths: number;
  isRemission: boolean;
  remissionMonths: number;

  // Missed Appointments Details
  isMissed: boolean;
  missedCount: number;
  lastMissedDate?: string;
  daysMissed?: number;
  contactable?: boolean;
  followedUp?: boolean;
  missedResponsibleOfficer?: string;

  // General
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  userRole?: UserRole;
  action: string;
  target?: string;
  details: string;
  ipAddress?: string;
}

export type NavigationPage =
  | 'dashboard'
  | 'patients'
  | 'patient-profile'
  | 'patient-add'
  | 'appointments'
  | 'smiv'
  | 'retention'
  | 'remission'
  | 'missed'
  | 'reports'
  | 'users'
  | 'audit-log'
  | 'settings';
