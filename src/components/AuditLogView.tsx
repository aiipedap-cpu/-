import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, Filter, Clock, User, Download, FileSpreadsheet } from 'lucide-react';
import { AuditLog } from '../types';
import { exportToCSV, formatThaiDate } from '../utils/formatters';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ทั้งหมด');

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (actionFilter !== 'ทั้งหมด' && !l.action.includes(actionFilter)) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchUser = l.userName.toLowerCase().includes(term);
        const matchAction = l.action.toLowerCase().includes(term);
        const matchDetails = l.details.toLowerCase().includes(term);
        if (!matchUser && !matchAction && !matchDetails) return false;
      }
      return true;
    });
  }, [logs, actionFilter, searchTerm]);

  const handleExport = () => {
    const rows = filteredLogs.map((l) => ({
      วันเวลา: l.timestamp,
      ผู้ใช้: l.userName,
      บทบาท: l.userRole || l.role,
      กิจกรรม: l.action,
      รายละเอียด: l.details,
      IP_Address: l.ipAddress || '-',
    }));
    exportToCSV(`Audit_Log_ระบบยาเสพติด_รพ_กรงปินัง_${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                บันทึกกิจกรรมความปลอดภัยในระบบ (Security Audit Trail)
              </h2>
              <p className="text-xs text-slate-500">
                ประวัติการเข้าถึงข้อมูลเวชระเบียนผู้ป่วยตามมาตรฐาน พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="py-2.5 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>ส่งออกบันทึก (CSV)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อผู้ใช้, กิจกรรม, หรือ HN ผู้ป่วย..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm outline-none"
        >
          <option value="ทั้งหมด">ทุกประเภทกิจกรรม</option>
          <option value="เข้าสู่ระบบ">เข้าสู่ระบบ (Login)</option>
          <option value="เพิ่มผู้ป่วย">เพิ่มผู้ป่วยใหม่</option>
          <option value="บันทึกติดตาม">บันทึกติดตาม 7 ครั้ง</option>
          <option value="ประเมิน SMI-V">ประเมิน SMI-V</option>
          <option value="แก้ไข">แก้ไขข้อมูล</option>
          <option value="ลบ">ลบข้อมูล</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">วันและเวลา</th>
                <th className="py-3 px-3">ผู้ดำเนินการ</th>
                <th className="py-3 px-3">สิทธิ์</th>
                <th className="py-3 px-3">กิจกรรม (Action)</th>
                <th className="py-3 px-4">รายละเอียด</th>
                <th className="py-3 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    ไม่พบบันทึกกิจกรรม
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {log.userName}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          (log.userRole || log.role) === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {log.userRole || log.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {log.details}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.ipAddress || '192.168.1.10'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
