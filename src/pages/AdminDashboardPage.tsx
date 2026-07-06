import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Lawyer, Profile, Case, Consultation } from '../types';
import {
  Users,
  Scale,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  TrendingUp,
  FileText,
  Calendar,
  IndianRupee,
} from 'lucide-react';

interface LawyerWithProfile extends Lawyer {
  profiles: Profile;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    pendingLawyers: 0,
    activeCases: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
  });
  const [pendingLawyers, setPendingLawyers] = useState<LawyerWithProfile[]>([]);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, lawyersRes, pendingRes, casesRes, consultsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('lawyers').select('id', { count: 'exact' }),
        supabase.from('lawyers').select('*, profiles(*)').eq('verification_status', 'pending'),
        supabase.from('cases').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('consultations').select('id, status', { count: 'exact' }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalLawyers: lawyersRes.count || 0,
        pendingLawyers: pendingRes.data?.length || 0,
        activeCases: casesRes.data?.filter(c => c.status !== 'closed').length || 0,
        totalConsultations: consultsRes.count || 0,
        pendingConsultations: consultsRes.data?.filter(c => c.status === 'pending').length || 0,
      });

      setPendingLawyers(pendingRes.data || []);
      setRecentCases(casesRes.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLawyer = async (lawyerId: string, approve: boolean) => {
    try {
      await supabase
        .from('lawyers')
        .update({
          verification_status: approve ? 'verified' : 'rejected',
          is_verified: approve,
        })
        .eq('id', lawyerId);

      setPendingLawyers(pendingLawyers.filter((l) => l.id !== lawyerId));
      setStats({ ...stats, pendingLawyers: stats.pendingLawyers - 1 });
    } catch (err) {
      console.error('Error updating lawyer:', err);
    }
  };

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className=" mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-secondary-500 mt-1">Manage lawyers, cases, and platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalUsers}</p>
                <p className="text-xs text-secondary-500">Users</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalLawyers}</p>
                <p className="text-xs text-secondary-500">Lawyers</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.pendingLawyers}</p>
                <p className="text-xs text-secondary-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.activeCases}</p>
                <p className="text-xs text-secondary-500">Active Cases</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalConsultations}</p>
                <p className="text-xs text-secondary-500">Consultations</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.pendingConsultations}</p>
                <p className="text-xs text-secondary-500">Pending Consults</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card overflow-hidden">
          <div className="flex border-b border-secondary-100">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'lawyers', label: 'Lawyer Verification' },
              { id: 'cases', label: 'Cases' },
              { id: 'reports', label: 'Reports' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-secondary-500 hover:text-secondary-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Pending Lawyers Summary */}
                  <div className="p-6 bg-warning-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-secondary-900">Pending Lawyer Approvals</h3>
                      <Link to="/admin/lawyers" className="text-sm link">View all</Link>
                    </div>
                    {pendingLawyers.length === 0 ? (
                      <p className="text-secondary-500">No pending approvals</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingLawyers.slice(0, 3).map((lawyer) => (
                          <div key={lawyer.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium text-secondary-900">{lawyer.profiles?.full_name}</p>
                              <p className="text-xs text-secondary-500">{lawyer.specialization?.[0]}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVerifyLawyer(lawyer.id, true)}
                                className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleVerifyLawyer(lawyer.id, false)}
                                className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Cases */}
                  <div className="p-6 bg-secondary-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-secondary-900">Recent Cases</h3>
                      <Link to="/admin/cases" className="text-sm link">View all</Link>
                    </div>
                    <div className="space-y-3">
                      {recentCases.slice(0, 5).map((caseItem) => (
                        <div key={caseItem.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-secondary-900 truncate">{caseItem.title}</p>
                            <p className="text-xs text-secondary-500">{caseItem.case_type}</p>
                          </div>
                          <span className={`badge ${caseItem.status === 'pending' ? 'badge-warning' : 'badge-primary'}`}>
                            {caseItem.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lawyers' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search lawyers..."
                      className="input pl-12"
                    />
                  </div>
                </div>

                {pendingLawyers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-12 h-12 text-success-500 mx-auto mb-4" />
                    <p className="text-secondary-600">All lawyers have been reviewed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingLawyers.map((lawyer) => (
                      <div key={lawyer.id} className="p-4 border border-secondary-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold">
                            {lawyer.profiles?.full_name?.charAt(0) || 'L'}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">{lawyer.profiles?.full_name}</p>
                            <p className="text-sm text-secondary-500">{lawyer.bar_registration_number}</p>
                            <p className="text-xs text-secondary-400">{lawyer.specialization?.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/lawyer/${lawyer.id}`} className="btn btn-secondary btn-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <button
                            onClick={() => handleVerifyLawyer(lawyer.id, true)}
                            className="btn btn-success btn-sm bg-success-600 text-white hover:bg-success-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyLawyer(lawyer.id, false)}
                            className="btn btn-error btn-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cases' && (
              <div className="space-y-4">
                {recentCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-4 border border-secondary-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">{caseItem.title}</p>
                      <p className="text-sm text-secondary-500">{caseItem.case_type}</p>
                      <p className="text-xs text-secondary-400">Created: {new Date(caseItem.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge ${caseItem.status === 'pending' ? 'badge-warning' : caseItem.status === 'closed' ? 'badge-error' : 'badge-primary'}`}>
                      {caseItem.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <button className="card p-6 text-left hover:shadow-card-hover transition-all">
                    <TrendingUp className="w-8 h-8 text-primary-600 mb-3" />
                    <h4 className="font-semibold text-secondary-900">Platform Analytics</h4>
                    <p className="text-sm text-secondary-500">User growth, engagement metrics</p>
                  </button>
                  <button className="card p-6 text-left hover:shadow-card-hover transition-all">
                    <IndianRupee className="w-8 h-8 text-success-600 mb-3" />
                    <h4 className="font-semibold text-secondary-900">Revenue Report</h4>
                    <p className="text-sm text-secondary-500">Subscriptions, consultation fees</p>
                  </button>
                  <button className="card p-6 text-left hover:shadow-card-hover transition-all">
                    <FileText className="w-8 h-8 text-accent-600 mb-3" />
                    <h4 className="font-semibold text-secondary-900">Case Statistics</h4>
                    <p className="text-sm text-secondary-500">Case types, completion rates</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
