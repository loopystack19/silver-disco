'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, UserRole } from '@/types/user';
import { Search, Shield, ShieldOff, Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function UsersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, roleFilter, verifiedFilter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        setUsers(await response.json());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        (u.location && u.location.toLowerCase().includes(searchLower))
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (verifiedFilter) {
      filtered = filtered.filter(u =>
        verifiedFilter === 'verified' ? u.isVerified : !u.isVerified
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      farmer: 'bg-green-100 text-green-800',
      student: 'bg-blue-100 text-blue-800',
      learner: 'bg-purple-100 text-purple-800',
      buyer: 'bg-orange-100 text-orange-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role];
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007F4E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    farmers: users.filter(u => u.role === 'farmer').length,
    students: users.filter(u => u.role === 'student').length,
    learners: users.filter(u => u.role === 'learner').length,
    buyers: users.filter(u => u.role === 'buyer').length,
    verified: users.filter(u => u.isVerified).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">View and manage all platform users</p>
            </div>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-xs text-green-700">Farmers</div>
            <div className="text-2xl font-bold text-green-800">{stats.farmers}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-xs text-blue-700">Students</div>
            <div className="text-2xl font-bold text-blue-800">{stats.students}</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4">
            <div className="text-xs text-purple-700">Learners</div>
            <div className="text-2xl font-bold text-purple-800">{stats.learners}</div>
          </div>
          <div className="bg-orange-50 rounded-lg shadow p-4">
            <div className="text-xs text-orange-700">Buyers</div>
            <div className="text-2xl font-bold text-orange-800">{stats.buyers}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg shadow p-4">
            <div className="text-xs text-emerald-700">Verified</div>
            <div className="text-2xl font-bold text-emerald-800">{stats.verified}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Roles</option>
              <option value="farmer">Farmer</option>
              <option value="student">Student</option>
              <option value="learner">Learner</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found matching your filters
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone && (
                        <div className="flex items-center gap-1 mb-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isVerified ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">Not Verified</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
