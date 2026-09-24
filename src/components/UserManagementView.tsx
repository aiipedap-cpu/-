import React, { useState } from 'react';
import { UserCog, Plus, Shield, User, Edit, Check, X, Lock, KeyRound } from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { formatThaiDate } from '../utils/formatters';

interface UserManagementViewProps {
  users: UserType[];
  onAddUser: (user: Omit<UserType, 'id'>) => void;
  onUpdateUser: (user: UserType) => void;
  onToggleStatus: (userId: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onToggleStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Form State
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STAFF');
  const [department, setDepartment] = useState('กลุ่มงานจิตเวชและยาเสพติด');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const openAddModal = () => {
    setEditingUser(null);
    setUsername('');
    setName('');
    setRole('STAFF');
    setDepartment('กลุ่มงานจิตเวชและยาเสพติด');
    setPhone('');
    setPassword('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setUsername(user.username);
    setName(user.name);
    setRole(user.role);
    setDepartment(user.department);
    setPhone(user.phone || '');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) return;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        name: name.trim(),
        role,
        department: department.trim(),
        phone: phone.trim(),
      });
    } else {
      onAddUser({
        username: username.trim().toLowerCase(),
        name: name.trim(),
        role,
        position: role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่บำบัด',
        department: department.trim(),
        phone: phone.trim(),
        active: true,
        isActive: true,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                จัดการผู้ใช้งานระบบ (User Management)
              </h2>
              <p className="text-xs text-slate-500">
                กำหนดสิทธิ์การเข้าถึงข้อมูลผู้ป่วย (ADMIN / STAFF) รพ.กรงปินัง
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มผู้ใช้งานใหม่</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3 px-3">ชื่อผู้ใช้ (Username)</th>
                <th className="py-3 px-3">บทบาท (Role)</th>
                <th className="py-3 px-3">กลุ่มงาน / สังกัด</th>
                <th className="py-3 px-3">เบอร์โทรศัพท์</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-3">เข้าสู่ระบบล่าสุด</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                        {user.name.slice(0, 1)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600">
                    {user.username}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {user.role === 'ADMIN' ? '🛡️ ผู้ดูแลระบบ (ADMIN)' : '👤 เจ้าหน้าที่ (STAFF)'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {user.department}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600">
                    {user.phone || '-'}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user.id)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                        user.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {user.active ? 'เปิดใช้งาน' : 'ระงับชั่วคราว'}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {user.lastLogin ? formatThaiDate(user.lastLogin) : 'ยังไม่เคยเข้าสู่ระบบ'}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="แก้ไขข้อมูลผู้ใช้"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-800 to-indigo-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <UserCog className="w-5 h-5" />
                <span>{editingUser ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-purple-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อผู้ใช้ (Username) *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!!editingUser}
                  placeholder="เช่น somchai.p"
                  required
                  className={`w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500 font-mono ${
                    editingUser ? 'bg-slate-100 text-slate-400' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อ - นามสกุล และตำแหน่ง *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น นางสาวอารีญา ดอเลาะ (พยาบาลวิชาชีพ)"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">บทบาท (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="STAFF">เจ้าหน้าที่ (STAFF)</option>
                    <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08x-xxx-xxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">หน่วยงาน / สังกัด *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="กลุ่มงานจิตเวชและยาเสพติด รพ.กรงปินัง">กลุ่มงานจิตเวชและยาเสพติด รพ.กรงปินัง</option>
                  <option value="กลุ่มงานการพยาบาล รพ.กรงปินัง">กลุ่มงานการพยาบาล รพ.กรงปินัง</option>
                  <option value="รพ.สต.สะเอะ">รพ.สต.สะเอะ</option>
                  <option value="รพ.สต.กรงปินัง">รพ.สต.กรงปินัง</option>
                  <option value="รพ.สต.ปุโรง">รพ.สต.ปุโรง</option>
                  <option value="รพ.สต.ห้วยกระทิง">รพ.สต.ห้วยกระทิง</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  {editingUser ? 'เปลี่ยนรหัสผ่าน (เว้นว่างหากไม่เปลี่ยน)' : 'รหัสผ่านเริ่มต้น *'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingUser ? '••••••••' : 'ระบุรหัสผ่าน'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl shadow-xs"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
