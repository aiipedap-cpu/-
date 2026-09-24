import { Patient, User, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'admin123',
    name: 'นางสาวนูรียะห์ มะแอ',
    role: 'ADMIN',
    position: 'พยาบาลวิชาชีพชำนาญการ',
    department: 'กลุ่มงานจิตเวชและยาเสพติด รพ.กรงปินัง',
    active: true,
    isActive: true,
    phone: '073-238-123 ต่อ 104',
    lastLogin: '2026-09-23 09:15',
  },
  {
    id: 'usr-2',
    username: 'staff',
    password: 'staff123',
    name: 'นายซูฮัยมี ยามา',
    role: 'STAFF',
    position: 'นักวิชาการสาธารณสุขปฏิบัติการ',
    department: 'รพ.สต.สะเอะ อ.กรงปินัง',
    active: true,
    isActive: true,
    phone: '081-968-4521',
    lastLogin: '2026-09-22 14:30',
  },
  {
    id: 'usr-3',
    username: 'nurse',
    password: 'nurse123',
    name: 'นางฟาตีมะห์ ดาโอ๊ะ',
    role: 'STAFF',
    position: 'พยาบาลวิชาชีพ',
    department: 'คลินิกบำบัดฟื้นฟูยาเสพติด รพ.กรงปินัง',
    active: true,
    isActive: true,
    phone: '089-734-1188',
    lastLogin: '2026-09-23 08:45',
  },
  {
    id: 'usr-4',
    username: 'director',
    password: 'pass123',
    name: 'นพ.อับดุลเลาะห์ สมาน',
    role: 'ADMIN',
    position: 'ผู้อำนวยการโรงพยาบาล',
    department: 'ฝ่ายบริหาร โรงพยาบาลกรงปินัง',
    active: true,
    isActive: true,
    phone: '073-238-123 ต่อ 101',
    lastLogin: '2026-09-20 11:00',
  },
];

// ข้อมูลผู้ป่วยเริ่มต้น: ว่างเปล่าสำหรับเปิดใช้งานระบบใหม่จริง
export const INITIAL_PATIENTS: Patient[] = [];

// บันทึกความปลอดภัยเริ่มต้นสำหรับการเปิดใช้งานระบบใหม่
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-init-1',
    timestamp: '2026-09-23 08:00:00',
    userId: 'usr-1',
    userName: 'นางสาวนูรียะห์ มะแอ',
    role: 'ADMIN',
    userRole: 'ADMIN',
    action: 'เริ่มต้นระบบใหม่ (System Launch)',
    target: 'ระบบทะเบียนและติดตามผู้ป่วยบำบัดยาเสพติด รพ.กรงปินัง',
    details: 'ล้างข้อมูลทดสอบและเปิดใช้งานระบบใหม่สำหรับบันทึกข้อมูลจริงอย่างเป็นทางการ',
    ipAddress: '192.168.10.45',
  },
];
