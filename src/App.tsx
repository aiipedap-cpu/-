import React, { useState, useEffect } from 'react';
import { User, Patient, NavigationPage, AuditLog, FollowUpRecord, AppointmentRecord, SmivAssessment } from './types';
import { INITIAL_USERS, INITIAL_PATIENTS, INITIAL_AUDIT_LOGS } from './data/initialData';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { PatientRegistryView } from './components/PatientRegistryView';
import { PatientProfileView } from './components/PatientProfileView';
import { PatientFormModal } from './components/PatientFormModal';
import { FollowUpModal } from './components/FollowUpModal';
import { AppointmentModal } from './components/AppointmentModal';
import { SmivAssessmentModal } from './components/SmivAssessmentModal';
import { AppointmentManagerView } from './components/AppointmentManagerView';
import { SmivRiskDashboardView } from './components/SmivRiskDashboardView';
import { RetentionRateView } from './components/RetentionRateView';
import { RemissionRateView } from './components/RemissionRateView';
import { MissedAppointmentReportView } from './components/MissedAppointmentReportView';
import { ReportsView } from './components/ReportsView';
import { UserManagementView } from './components/UserManagementView';
import { AuditLogView } from './components/AuditLogView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { getFiscalYearFromDate } from './utils/formatters';

export const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('krongpinang_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged in as Dr. Somchai (ADMIN) for smooth demo
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Current Navigation Page
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Patients Data (with local storage persistence)
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      // Force wipe out any old test records for fresh launch
      const hasLaunchedFresh = localStorage.getItem('krongpinang_fresh_launch_2026');
      if (!hasLaunchedFresh) {
        localStorage.setItem('krongpinang_fresh_launch_2026', 'true');
        localStorage.removeItem('krongpinang_patients');
        return INITIAL_PATIENTS;
      }
      const saved = localStorage.getItem('krongpinang_patients');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // System Users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('krongpinang_users_list');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Security Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('krongpinang_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Patient Selection & Modals
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [targetFollowUpRound, setTargetFollowUpRound] = useState<number | undefined>(undefined);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isSmivModalOpen, setIsSmivModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('krongpinang_patients', JSON.stringify(patients));
    } catch {
      // Ignore
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('krongpinang_users_list', JSON.stringify(users));
    } catch {
      // Ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('krongpinang_audit_logs', JSON.stringify(auditLogs));
    } catch {
      // Ignore
    }
  }, [auditLogs]);

  // Log Audit Action
  const logAudit = (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      userRole: currentUser.role,
      action,
      target: 'ระบบ',
      details,
      timestamp: new Date().toLocaleString('th-TH'),
      ipAddress: '192.168.1.10',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Login handler
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('krongpinang_user', JSON.stringify(user));
    } catch {
      // Ignore
    }
    logAudit('เข้าสู่ระบบ', `ผู้ใช้งาน ${user.name} (${user.role}) เข้าสู่ระบบสำเร็จ`);
  };

  // Logout handler
  const handleLogout = () => {
    if (currentUser) {
      logAudit('ออกจากระบบ', `ผู้ใช้งาน ${currentUser.name} ออกจากระบบ`);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('krongpinang_user');
    } catch {
      // Ignore
    }
  };

  // Navigation Helper
  const navigateTo = (page: NavigationPage) => {
    if (page === 'patient-add') {
      setEditingPatient(null);
      setIsFormModalOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select patient to view profile
  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('patient-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit patient
  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormModalOpen(true);
  };

  // Save new / edited patient
  const handleSavePatient = (data: Partial<Patient>) => {
    if (editingPatient) {
      // Edit existing
      setPatients((prev) =>
        prev.map((p) => (p.id === editingPatient.id ? ({ ...p, ...data } as Patient) : p))
      );
      const hnStr = data.hn && data.hn !== '-' ? `HN: ${data.hn} ` : '';
      logAudit('แก้ไขข้อมูลผู้ป่วย', `แก้ไขข้อมูลผู้ป่วย ${hnStr}(${data.prefix}${data.firstName} ${data.lastName})`);
    } else {
      // Create new
      const newPatient: Patient = {
        id: `pt-${Date.now()}`,
        hn: data.hn || '-',
        idCard: data.idCard || '',
        prefix: data.prefix || 'นาย',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        gender: data.gender || 'ชาย',
        birthDate: data.birthDate || '',
        age: data.age || 30,
        phone: data.phone || '',
        houseNo: data.houseNo || '',
        moo: data.moo || '1',
        villageName: data.villageName || '',
        subdistrict: data.subdistrict || 'กรงปินัง',
        district: 'กรงปินัง',
        province: 'ยะลา',
        admitDate: data.admitDate || new Date().toISOString().slice(0, 10),
        fiscalYear: data.fiscalYear || getFiscalYearFromDate(data.admitDate),
        serviceUnit: data.serviceUnit || 'โรงพยาบาลกรงปินัง',
        drugCategory: data.drugCategory || 'ยาบ้า/เมทแอมเฟตามีน',
        primaryDrugName: data.primaryDrugName || 'ยาบ้า',
        treatmentModel: data.treatmentModel || 'ชุมชนล้อมรักษ์ (CBTx)',
        treatmentStatus: data.treatmentStatus || 'เข้าสู่กระบวนการบำบัด',
        smiv: data.smiv || {
          level: 'เขียว',
          evaluationDate: new Date().toISOString().slice(0, 10),
          evaluator: currentUser?.name || 'จนท.',
          warningSignals: [],
          oasScore: 0,
          managementPlan: 'ติดตามตามนัดปกติ',
          notes: '',
        },
        followUps: [
          {
            round: 1,
            completed: false,
            date: '',
            method: 'เยี่ยมบ้าน',
            officer: '',
            patientStatus: '',
            drugStatus: 'หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)',
            urineTestResult: 'ไม่ได้ตรวจ',
            symptoms: '',
            notes: '',
          },
        ],
        appointments: [
          {
            id: `apt-${Date.now()}`,
            date: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            roundNumber: 1,
            serviceUnit: data.serviceUnit || 'โรงพยาบาลกรงปินัง',
            officer: currentUser?.name || 'พยาบาลวิชาชีพ',
            status: 'นัดใกล้ถึง',
            notes: 'นัดติดตามอาการครั้งแรก',
          },
        ],
        isRetained: true,
        retentionMonths: 1,
        isRemission: false,
        remissionMonths: 0,
        isMissed: false,
        missedCount: 0,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPatients((prev) => [newPatient, ...prev]);
      const hnStr = newPatient.hn && newPatient.hn !== '-' ? `HN: ${newPatient.hn} ` : '';
      logAudit('เพิ่มผู้ป่วยใหม่', `ลงทะเบียนผู้ป่วยใหม่ ${hnStr}(${newPatient.prefix}${newPatient.firstName} ${newPatient.lastName})`);
    }

    setIsFormModalOpen(false);
    setEditingPatient(null);
  };

  // Delete patient
  const handleDeletePatient = (patientId: string) => {
    const target = patients.find((p) => p.id === patientId);
    if (!target) return;
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    const targetHn = target.hn && target.hn !== '-' ? `HN: ${target.hn} ` : '';
    logAudit('ลบข้อมูลผู้ป่วย', `ลบข้อมูลผู้ป่วย ${targetHn}(${target.prefix}${target.firstName} ${target.lastName})`);
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
      setCurrentPage('patients');
    }
  };

  // Save follow up
  const handleSaveFollowUp = (record: FollowUpRecord) => {
    if (!selectedPatientId) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPatientId) return p;

        const updatedFollowUps = [...p.followUps];
        const existingIdx = updatedFollowUps.findIndex((f) => f.round === record.round);
        if (existingIdx >= 0) {
          updatedFollowUps[existingIdx] = record;
        } else {
          updatedFollowUps.push(record);
        }

        const completedCount = updatedFollowUps.filter((f) => f.completed).length;
        const isCompleted7 = completedCount >= 7;

        return {
          ...p,
          followUps: updatedFollowUps,
          treatmentStatus: isCompleted7 ? 'ครบเกณฑ์' : p.treatmentStatus,
          retentionMonths: Math.max(p.retentionMonths || 1, record.round * 2),
          isRemission: record.drugStatus === 'หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)',
          remissionMonths:
            record.drugStatus === 'หยุดเสพต่อเนื่อง (ผลปัสสาวะลบ)'
              ? Math.max(p.remissionMonths || 1, record.round * 2)
              : 0,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const pt = patients.find((p) => p.id === selectedPatientId);
    logAudit(
      'บันทึกติดตาม 7 ครั้ง',
      `บันทึกผลการติดตามครั้งที่ ${record.round} สำหรับ HN: ${pt?.hn} ผล: ${record.drugStatus}`
    );
  };

  // Save appointment
  const handleSaveAppointment = (record: AppointmentRecord) => {
    const targetId = selectedPatientId || patients[0]?.id;
    if (!targetId) return;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== targetId) return p;
        return {
          ...p,
          appointments: [record, ...p.appointments],
          isMissed: record.status.includes('ขาดนัด'),
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const pt = patients.find((p) => p.id === targetId);
    logAudit(
      'บันทึกนัดหมาย',
      `สร้างนัดหมายวันที่ ${record.date} สำหรับ HN: ${pt?.hn} สถานะ: ${record.status}`
    );
  };

  // Save SMI-V assessment
  const handleSaveSmiv = (assessment: SmivAssessment) => {
    if (!selectedPatientId) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPatientId) return p;
        return {
          ...p,
          smiv: assessment,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const pt = patients.find((p) => p.id === selectedPatientId);
    logAudit(
      'ประเมิน SMI-V',
      `ประเมินความเสี่ยง SMI-V HN: ${pt?.hn} ระดับ: ${assessment.level} (${assessment.warningSignals.length} สัญญาณเตือน)`
    );
  };

  // Reset Clean Data
  const handleResetDemoData = () => {
    setPatients([]);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    try {
      localStorage.setItem('krongpinang_patients', JSON.stringify([]));
      localStorage.setItem('krongpinang_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
    } catch {
      // Ignore
    }
    logAudit('ล้างข้อมูลระบบ', 'ล้างข้อมูลผู้ป่วยทั้งหมดเพื่อเปิดใช้งานระบบใหม่');
  };

  // Selected patient entity
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Urgent count across the whole system
  const urgentCount = patients.filter(
    (p) => !p.isDeleted && (p.smiv.level === 'แดง' || p.smiv.level === 'ส้ม' || (p.isMissed && (p.daysMissed || 0) > 14))
  ).length;

  // If not logged in, render Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        urgentCount={urgentCount}
        onQuickNavigateUrgent={() => navigateTo('smiv')}
      />

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 gap-6">
        {/* Sidebar for Desktop & Drawer for Mobile */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigateTo}
          currentUser={currentUser}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 lg:pl-72">
          {currentPage === 'dashboard' && (
            <DashboardView
              patients={patients}
              onNavigate={navigateTo}
              onSelectPatient={handleViewPatient}
            />
          )}

          {currentPage === 'patients' && (
            <PatientRegistryView
              patients={patients}
              userRole={currentUser.role}
              onViewPatient={handleViewPatient}
              onEditPatient={handleEditPatient}
              onAddNewPatient={() => {
                setEditingPatient(null);
                setIsFormModalOpen(true);
              }}
              onDeletePatient={handleDeletePatient}
            />
          )}

          {currentPage === 'patient-profile' && (
            selectedPatient ? (
              <PatientProfileView
                patient={selectedPatient}
                userRole={currentUser.role}
                onBack={() => setCurrentPage('patients')}
                onEdit={() => handleEditPatient(selectedPatient)}
                onOpenFollowUpModal={(roundNum) => {
                  setTargetFollowUpRound(roundNum);
                  setIsFollowUpModalOpen(true);
                }}
                onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
                onOpenSmivModal={() => setIsSmivModalOpen(true)}
              />
            ) : (
              <div className="bg-white p-8 rounded-2xl text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto mt-8">
                <p className="text-slate-600 font-medium mb-3">ยังไม่มีข้อมูลผู้ป่วยที่เลือกในระบบ</p>
                <button
                  type="button"
                  onClick={() => navigateTo('patients')}
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition-colors"
                >
                  ไปยังทะเบียนผู้ป่วย
                </button>
              </div>
            )
          )}

          {currentPage === 'appointments' && (
            <AppointmentManagerView
              patients={patients}
              onSelectPatient={handleViewPatient}
              onOpenAppointmentModal={(patientId) => {
                if (patientId) setSelectedPatientId(patientId);
                setIsAppointmentModalOpen(true);
              }}
            />
          )}

          {currentPage === 'smiv' && (
            <SmivRiskDashboardView
              patients={patients}
              onSelectPatient={handleViewPatient}
              onOpenSmivModal={(patientId) => {
                setSelectedPatientId(patientId);
                setIsSmivModalOpen(true);
              }}
            />
          )}

          {currentPage === 'retention' && (
            <RetentionRateView
              patients={patients}
              onSelectPatient={handleViewPatient}
            />
          )}

          {currentPage === 'remission' && (
            <RemissionRateView
              patients={patients}
              onSelectPatient={handleViewPatient}
            />
          )}

          {currentPage === 'missed' && (
            <MissedAppointmentReportView
              patients={patients}
              onSelectPatient={handleViewPatient}
              onRecordFollowUp={(patientId) => {
                setSelectedPatientId(patientId);
                setIsFollowUpModalOpen(true);
              }}
            />
          )}

          {currentPage === 'reports' && <ReportsView patients={patients} />}

          {currentPage === 'users' && currentUser.role === 'ADMIN' && (
            <UserManagementView
              users={users}
              onAddUser={(userData) => {
                const newUser: User = {
                  ...userData,
                  id: `usr-${Date.now()}`,
                  position: userData.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่บำบัด',
                  active: true,
                  isActive: true,
                  lastLogin: new Date().toISOString().slice(0, 10),
                };
                setUsers((prev) => [...prev, newUser]);
                logAudit('เพิ่มผู้ใช้งาน', `เพิ่มผู้ใช้งานใหม่: ${newUser.name} (${newUser.role})`);
              }}
              onUpdateUser={(updated) => {
                setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
                logAudit('แก้ไขผู้ใช้งาน', `แก้ไขข้อมูลผู้ใช้: ${updated.name}`);
              }}
              onToggleStatus={(userId) => {
                setUsers((prev) =>
                  prev.map((u) => (u.id === userId ? { ...u, active: !u.active, isActive: !u.active } : u))
                );
                logAudit('เปลี่ยนสถานะผู้ใช้', `สลับสถานะเปิดใช้งาน user ID: ${userId}`);
              }}
            />
          )}

          {currentPage === 'audit-log' && currentUser.role === 'ADMIN' && (
            <AuditLogView logs={auditLogs} />
          )}

          {currentPage === 'settings' && (
            <SystemSettingsView onResetDemoData={handleResetDemoData} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenDrawer={() => setIsSidebarOpen(true)}
        urgentCount={urgentCount}
      />

      {/* POPUP MODALS */}
      {/* Patient Add / Edit Modal */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPatient(null);
        }}
        onSave={handleSavePatient}
        editPatient={editingPatient}
      />

      {/* Follow-up 7 Rounds Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSave={handleSaveFollowUp}
        defaultRound={targetFollowUpRound || 1}
        currentOfficerName={currentUser.name}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        patientName={
          selectedPatient
            ? `${selectedPatient.prefix}${selectedPatient.firstName} ${selectedPatient.lastName}`
            : undefined
        }
        defaultUnit={selectedPatient?.serviceUnit}
      />

      {/* SMI-V Assessment Modal */}
      <SmivAssessmentModal
        isOpen={isSmivModalOpen}
        onClose={() => setIsSmivModalOpen(false)}
        onSave={handleSaveSmiv}
        currentAssessment={selectedPatient?.smiv}
        patientName={
          selectedPatient
            ? `${selectedPatient.prefix}${selectedPatient.firstName} ${selectedPatient.lastName}`
            : undefined
        }
        evaluatorName={currentUser.name}
      />
    </div>
  );
};

export default App;
