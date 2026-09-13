'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  LogIn,
  Search,
  Filter,
  RefreshCw,
  Key,
  Lock,
  Unlock,
  Smartphone,
  Laptop,
  Plus,
  X,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { useUserAuditStore, type UserSessionItem, type SessionAuditLog } from '@/stores/useUserAuditStore';
import { showMagicToast } from '@/lib/magic-motion';
import { getApiUrl } from '@/lib/api-client';
import type { Role } from '@chenille/shared';

export const UsersManagementView: React.FC = () => {
  const {
    users,
    auditLogs,
    isLoading,
    fetchUsers,
    fetchAuditLogs,
    forceLogoutUser,
    toggleUserStatus,
    resetPasswordRequest,
    recordAuditLog,
  } = useUserAuditStore();

  // 1. Initial Load & Real-Time Auto-Sync Polling (Every 3 seconds)
  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();

    const interval = setInterval(() => {
      fetchUsers();
      fetchAuditLogs();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchUsers, fetchAuditLogs]);

  // 2. Instant Cross-Tab & Window Focus Synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'chenille_user_session_sync' || e.key === 'chenille_auth_storage') {
        fetchUsers();
        fetchAuditLogs();
      }
    };

    const handleFocus = () => {
      fetchUsers();
      fetchAuditLogs();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchUsers();
        fetchAuditLogs();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchUsers, fetchAuditLogs]);

  const [activeSubTab, setActiveSubTab] = useState<'USERS' | 'LOGS'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState<'ALL' | SessionAuditLog['eventType']>('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('CUSTOMER_MEMBER');

  // KPI Metrics
  const totalUsers = users.length;
  const onlineUsers = users.filter((u) => u.isOnline).length;
  const timeoutLogsCount = auditLogs.filter((l) => l.eventType === 'LOGOUT_TIMEOUT_15MIN').length;
  const todayLoginsCount = auditLogs.filter((l) => l.eventType === 'LOGIN_SUCCESS').length;

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery);
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchQuery]);

  // Filtered Audit Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchEvent = eventTypeFilter === 'ALL' || log.eventType === eventTypeFilter;
      const matchSearch =
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery);
      return matchEvent && matchSearch;
    });
  }, [auditLogs, eventTypeFilter, searchQuery]);

  const handleForceLogout = (userItem: UserSessionItem) => {
    if (!userItem.isOnline) {
      showMagicToast('Pengguna Sedang Offline', `${userItem.name} tidak memiliki sesi aktif.`, 'ℹ️');
      return;
    }
    forceLogoutUser(userItem.id);
    showMagicToast(
      'Sesi Diputuskan Paksa! 🛑',
      `Sesi login ${userItem.name} berhasil di-revoke secara paksa dari sistem.`,
      '👋'
    );
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showMagicToast('Form Belum Lengkap', 'Nama dan Email pengguna wajib diisi.', '⚠️');
      return;
    }

    const phone = newUserPhone.trim() || '0812' + Math.floor(10000000 + Math.random() * 90000000);

    try {
      const res = await fetch(getApiUrl('/api/v1/admin/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          phone,
          role: newUserRole,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showMagicToast('Pengguna Ditambahkan! ✨', `${newUserName} berhasil disimpan ke database Supabase.`, '🎉');
        setIsAddUserModalOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPhone('');
        fetchUsers();
        fetchAuditLogs();
      } else {
        showMagicToast('Gagal Menambah Akun', json.error || 'Terjadi kesalahan sistem.', '⚠️');
      }
    } catch (err: any) {
      showMagicToast('Gagal Menambah Akun', err.message, '⚠️');
    }
  };

  const exportAuditLogsToCsv = () => {
    const headers = ['Timestamp', 'Pengguna', 'Role', 'Tipe Aktivitas', 'Perangkat', 'IP Address', 'Keterangan'];
    const rows = auditLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.eventType}"`,
      `"${l.device}"`,
      `"${l.ipAddress}"`,
      `"${l.notes}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_Sesi_Chenille_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMagicToast('Ekspor Log Berhasil 📥', 'File CSV log aktivitas pengguna telah diunduh.', '📊');
  };

  return (
    <div className="space-y-6 admin-view-fade">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-rose-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              Audit Trail Keamanan
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Auto-Sync (3s)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1.5 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Pengawasan Pengguna & Sesi 15 Menit</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Pantau akun yang sedang login, riwayat keluar-masuk, dan proteksi auto-logout tidak aktif 15 menit.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              fetchUsers();
              fetchAuditLogs();
              showMagicToast('Data Diperbarui 🔄', 'Daftar pengguna & log sesi berhasil disinkronkan dari Supabase.', '✨');
            }}
            disabled={isLoading}
            className="px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Sinkronkan dengan Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun</span>
          </button>

          <button
            onClick={exportAuditLogsToCsv}
            className="px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Unduh log ke format CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Users */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">Total Akun</span>
            <span className="text-xl font-black text-stone-900">{totalUsers}</span>
            <span className="text-[10px] text-stone-500 block">Owner, Staff & Member</span>
          </div>
        </div>

        {/* Card 2: Live Online Users */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex items-center gap-3.5 relative overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 relative">
            <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">Sedang Online</span>
            <span className="text-xl font-black text-emerald-600 flex items-center gap-1.5">
              {onlineUsers} Sesi
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </span>
            <span className="text-[10px] text-emerald-700 block">Aktif berinteraksi</span>
          </div>
        </div>

        {/* Card 3: Today's Logins */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">Login Hari Ini</span>
            <span className="text-xl font-black text-stone-900">{todayLoginsCount} Kali</span>
            <span className="text-[10px] text-stone-500 block">Sesi terverifikasi</span>
          </div>
        </div>

        {/* Card 4: 15-Min Inactivity Auto-Timeouts */}
        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">Auto-Timeout 15M</span>
            <span className="text-xl font-black text-amber-600">{timeoutLogsCount} Sesi</span>
            <span className="text-[10px] text-amber-700 block">Keamanan inaktif terjamin</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS & FILTERS BAR */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Tab Selector */}
        <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('USERS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'USERS'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Akun & Sesi Aktif ({filteredUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('LOGS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'LOGS'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Log Audit Login & Logout ({filteredLogs.length})</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, IP..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {activeSubTab === 'USERS' ? (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Peran</option>
              <option value="SUPER_ADMIN">👑 Super Admin</option>
              <option value="FLORIST_STAFF">🌷 Florist Staff</option>
              <option value="CUSTOMER_MEMBER">🌸 Member Pelanggan</option>
            </select>
          ) : (
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Event</option>
              <option value="LOGIN_SUCCESS">🟢 Login Berhasil</option>
              <option value="LOGOUT_TIMEOUT_15MIN">🟡 Timeout 15 Menit</option>
              <option value="LOGOUT_MANUAL">⚪ Logout Manual</option>
              <option value="FORCE_LOGOUT_ADMIN">🛑 Force Logout</option>
            </select>
          )}
        </div>
      </div>

      {/* TAB 1: USERS & ACTIVE SESSIONS TABLE */}
      {activeSubTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Pengguna</th>
                  <th className="py-3.5 px-4">Hak Akses (Role)</th>
                  <th className="py-3.5 px-4">Status Sesi</th>
                  <th className="py-3.5 px-4">Perangkat & IP</th>
                  <th className="py-3.5 px-4">Aktivitas Terakhir</th>
                  <th className="py-3.5 px-4 text-right">Aksi Keamanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400 font-medium">
                      Tidak ada pengguna yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-2xl bg-stone-100 border border-stone-200/80 text-base flex items-center justify-center shadow-2xs">
                            {item.avatarEmoji}
                          </span>
                          <div>
                            <span className="font-extrabold text-stone-900 block leading-snug">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-stone-400 block">{item.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] tracking-wide ${
                            item.role === 'SUPER_ADMIN'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : item.role === 'FLORIST_STAFF'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {item.role === 'SUPER_ADMIN'
                            ? '👑 SUPER ADMIN'
                            : item.role === 'FLORIST_STAFF'
                            ? '🌷 STAFF FLORIST'
                            : '🌸 MEMBER'}
                        </span>
                      </td>

                      {/* Online Status */}
                      <td className="py-3.5 px-4">
                        {item.isOnline ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Online Sekarang</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                            <span>Offline</span>
                          </div>
                        )}
                      </td>

                      {/* Device & IP */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="font-semibold text-stone-700 block">{item.currentDevice}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{item.ipAddress}</span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-stone-600 font-medium">
                          {item.lastActiveText}
                        </span>
                      </td>

                      {/* Security Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {item.isOnline && (
                            <button
                              onClick={() => handleForceLogout(item)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                              title="Keluarkan sesi ini secara paksa"
                            >
                              Tendang Sesi 🛑
                            </button>
                          )}

                          <button
                            onClick={() => {
                              resetPasswordRequest(item.id);
                              showMagicToast('Link Reset Terkirim 🔑', `Tautan reset dikirimkan ke WhatsApp ${item.phone}.`, '📱');
                            }}
                            className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 rounded-lg text-[11px] transition-colors cursor-pointer"
                            title="Kirim link reset kata sandi via WhatsApp"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              toggleUserStatus(item.id);
                              showMagicToast(
                                item.status === 'ACTIVE' ? 'Akun Dikunci 🔒' : 'Akun Diaktifkan 🔓',
                                `Status akun ${item.name} telah diubah.`,
                                '🛡️'
                              );
                            }}
                            className={`p-1.5 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                              item.status === 'ACTIVE'
                                ? 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                            }`}
                            title={item.status === 'ACTIVE' ? 'Kunci akun pengguna ini' : 'Buka kunci akun'}
                          >
                            {item.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS STREAM TABLE */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50/50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Riwayat Keluar-Masuk & Auto-Timeout 15 Menit (Live Stream Audit Log)</span>
            <span className="text-[11px] text-stone-400 font-mono">100 Log Terbaru</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Waktu (Timestamp)</th>
                  <th className="py-3 px-4">Event Aktivitas</th>
                  <th className="py-3 px-4">Pengguna Terkait</th>
                  <th className="py-3 px-4">Keterangan / Alasan Sesi</th>
                  <th className="py-3 px-4">Perangkat & IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400 font-medium">
                      Tidak ada rekaman log audit yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                        {log.timestamp}
                      </td>

                      {/* Event Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.eventType === 'LOGIN_SUCCESS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black">
                            <LogIn className="w-3 h-3 text-emerald-600" />
                            LOGIN BERHASIL
                          </span>
                        )}
                        {log.eventType === 'LOGOUT_TIMEOUT_15MIN' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-black animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            TIMEOUT 15 MENIT
                          </span>
                        )}
                        {log.eventType === 'LOGOUT_MANUAL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-extrabold">
                            <LogOut className="w-3 h-3 text-stone-500" />
                            LOGOUT MANUAL
                          </span>
                        )}
                        {log.eventType === 'FORCE_LOGOUT_ADMIN' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-black">
                            <Shield className="w-3 h-3 text-rose-600" />
                            FORCE LOGOUT
                          </span>
                        )}
                        {log.eventType === 'LOGIN_FAILED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            GAGAL / RESET
                          </span>
                        )}
                      </td>

                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{log.userName}</span>
                        <span className="text-[10px] text-stone-400 uppercase font-mono">{log.userRole}</span>
                      </td>

                      {/* Notes / Reason */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <span className="text-[11px] text-stone-700 leading-relaxed block">
                          {log.notes}
                        </span>
                        {log.sessionDurationMinutes !== undefined && log.sessionDurationMinutes > 0 && (
                          <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                            Durasi Sesi: {log.sessionDurationMinutes} Menit
                          </span>
                        )}
                      </td>

                      {/* Device & IP */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-stone-700 block text-[11px]">{log.device}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{log.ipAddress}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: DAFTAR AKUN BARU */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Tambah Pengguna Sistem Baru</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Rania Azzahra"
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Contoh: rania@chenilleatelier.com"
                  required
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="Contoh: 081298765432"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Peran & Hak Akses (Role) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CUSTOMER_MEMBER">🌸 Member Pelanggan</option>
                  <option value="FLORIST_STAFF">🌷 Staff Florist (Produksi & Pesanan)</option>
                  <option value="SUPER_ADMIN">👑 Super Admin (Akses Penuh)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white font-black rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
