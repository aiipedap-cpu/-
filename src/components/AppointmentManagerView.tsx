import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Search, CheckCircle2, Clock, CalendarX2, AlertOctagon, User, Plus } from 'lucide-react';
import { Patient, AppointmentStatus, ServiceUnit } from '../types';
import { formatThaiDate, getAppointmentStatusBadge } from '../utils/formatters';

interface AppointmentManagerViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onOpenAppointmentModal: (patientId?: string) => void;
}

export const AppointmentManagerView: React.FC<AppointmentManagerViewProps> = ({
  patients,
  onSelectPatient,
  onOpenAppointmentModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ทั้งหมด');
  const [unitFilter, setUnitFilter] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract all appointments flattened with patient details
  const allAppointments = useMemo(() => {
    const list: Array<{
      patient: Patient;
      appointmentId: string;
      date: string;
      roundNumber: number;
      serviceUnit: ServiceUnit;
      officer: string;
      status: AppointmentStatus;
      notes: string;
    }> = [];

    patients.forEach((p) => {
      if (p.isDeleted) return;
      p.appointments.forEach((apt) => {
        list.push({
          patient: p,
          appointmentId: apt.id,
          date: apt.date,
          roundNumber: apt.roundNumber,
          serviceUnit: apt.serviceUnit,
          officer: apt.officer,
          status: apt.status,
          notes: apt.notes,
        });
      });
    });

    // Sort by date ascending
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [patients]);

  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((item) => {
      if (statusFilter !== 'ทั้งหมด' && item.status !== statusFilter) return false;
      if (unitFilter !== 'ทั้งหมด' && item.serviceUnit !== unitFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const fullName = `${item.patient.prefix}${item.patient.firstName} ${item.patient.lastName}`.toLowerCase();
        const matchHN = item.patient.hn ? item.patient.hn.toLowerCase().includes(term) : false;
        const matchOfficer = item.officer.toLowerCase().includes(term);
        if (!fullName.includes(term) && !matchHN && !matchOfficer) return false;
      }
      return true;
    });
  }, [allAppointments, statusFilter, unitFilter, searchTerm]);

  // Counts by status
  const counts = useMemo(() => {
    return {
      all: allAppointments.length,
      upcoming: allAppointments.filter((a) => a.status === 'นัดใกล้ถึง').length,
      attended: allAppointments.filter((a) => a.status === 'มาตามนัด').length,
      missedFollowUp: allAppointments.filter((a) => a.status === 'ขาดนัดและอยู่ระหว่างติดตาม').length,
      missedUrgent: allAppointments.filter((a) => a.status === 'ขาดนัดเร่งด่วน').length,
    };
  }, [allAppointments]);

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>ตารางนัดหมายและติดตามผู้ป่วย</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ระบบติดตามการมาตามนัด การขาดนัด และวางแผนตรวจปัสสาวะ/พบแพทย์
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAppointmentModal()}
          className="py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มนัดหมายใหม่</span>
        </button>
      </div>

      {/* 4 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('นัดใกล้ถึง')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            statusFilter === 'นัดใกล้ถึง'
              ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
              : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">🟡 นัดใกล้ถึง</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{counts.upcoming}</div>
          <span className="text-[11px] text-amber-600">นัดใน 7-14 วันข้างหน้า</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('มาตามนัด')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            statusFilter === 'มาตามนัด'
              ? 'bg-emerald-100/70 border-emerald-400 ring-2 ring-emerald-300'
              : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">🟢 มาตามนัด</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{counts.attended}</div>
          <span className="text-[11px] text-emerald-600">รับบริการเรียบร้อย</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('ขาดนัดและอยู่ระหว่างติดตาม')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            statusFilter === 'ขาดนัดและอยู่ระหว่างติดตาม'
              ? 'bg-orange-100/70 border-orange-400 ring-2 ring-orange-300'
              : 'bg-orange-50/70 border-orange-200 hover:bg-orange-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-800">🟠 ขาดนัดอยู่ระหว่างติดตาม</span>
            <CalendarX2 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{counts.missedFollowUp}</div>
          <span className="text-[11px] text-orange-600">กำลังประสาน อสม./ชุมชน</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('ขาดนัดเร่งด่วน')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            statusFilter === 'ขาดนัดเร่งด่วน'
              ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
              : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">🔴 ขาดนัดเร่งด่วน</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{counts.missedUrgent}</div>
          <span className="text-[11px] text-rose-600">ขาดเกิน 14-30 วัน</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือผู้รับผิดชอบ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm outline-none"
          >
            <option value="ทั้งหมด">ทุกสถานะนัดหมาย ({counts.all})</option>
            <option value="นัดใกล้ถึง">🟡 นัดใกล้ถึง</option>
            <option value="มาตามนัด">🟢 มาตามนัด</option>
            <option value="ขาดนัดและอยู่ระหว่างติดตาม">🟠 ขาดนัดและอยู่ระหว่างติดตาม</option>
            <option value="ขาดนัดเร่งด่วน">🔴 ขาดนัดเร่งด่วน</option>
          </select>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm outline-none"
          >
            <option value="ทั้งหมด">ทุกหน่วยบริการ</option>
            <option value="โรงพยาบาลกรงปินัง">รพ.กรงปินัง</option>
            <option value="รพ.สต.สะเอะ">รพ.สต.สะเอะ</option>
            <option value="รพ.สต.กรงปินัง">รพ.สต.กรงปินัง</option>
            <option value="รพ.สต.ปุโรง">รพ.สต.ปุโรง</option>
            <option value="รพ.สต.ห้วยกระทิง">รพ.สต.ห้วยกระทิง</option>
          </select>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">วันที่นัดหมาย</th>
                <th className="py-3 px-3">ชื่อ - นามสกุล</th>
                <th className="py-3 px-3">HN</th>
                <th className="py-3 px-3 text-center">นัดครั้งที่</th>
                <th className="py-3 px-3">หน่วยบริการ</th>
                <th className="py-3 px-3">ผู้รับผิดชอบ</th>
                <th className="py-3 px-3">สถานะ</th>
                <th className="py-3 px-4">หมายเหตุ</th>
                <th className="py-3 px-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    ไม่พบรายการนัดหมายตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item) => {
                  const badge = getAppointmentStatusBadge(item.status);
                  return (
                    <tr
                      key={item.appointmentId}
                      onClick={() => onSelectPatient(item.patient.id)}
                      className="hover:bg-sky-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatThaiDate(item.date)}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {item.patient.prefix}{item.patient.firstName} {item.patient.lastName}
                      </td>

                      <td className="py-3 px-3 font-mono font-medium text-sky-700 whitespace-nowrap">
                        {item.patient.hn && item.patient.hn !== '-' ? item.patient.hn : '-'}
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        ครั้งที่ {item.roundNumber}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {item.serviceUnit}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {item.officer}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {item.notes || '-'}
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(item.patient.id);
                          }}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-lg text-xs"
                        >
                          ดูเวชระเบียน
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
