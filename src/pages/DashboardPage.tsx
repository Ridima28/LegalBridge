import { Link } from 'react-router-dom';
import { dummyCases, dummyLawyers } from '../lib/dummy-data';
import {
  Plus,
  FolderOpen,
  Calendar,
  Bookmark,
  Bell,
  TrendingUp,
  FileText,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  // Use dummy data
  const cases = dummyCases.slice(0, 3);
  const savedLawyers = dummyLawyers.slice(0, 3);
  const notifications = [
    { id: '1', title: 'New lawyer matching your case', message: 'Adv. Rajesh Kumar has been recommended for your property dispute.', created_at: new Date().toISOString() },
    { id: '2', title: 'Case status updated', message: 'Your case "Property Boundary Dispute" is now pending review.', created_at: new Date().toISOString() },
  ];

  const stats = {
    totalCases: dummyCases.length,
    activeConsultations: 2,
    savedLawyers: savedLawyers.length,
    unreadNotifications: notifications.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'analyzing': return 'badge-primary';
      case 'reviewed': return 'badge-accent';
      case 'in_progress': return 'badge-primary';
      case 'completed': return 'badge-success';
      case 'confirmed': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'bg-secondary-100 text-secondary-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
              Welcome to LexMatch AI!
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1">
              Here's what's happening with your legal cases
            </p>
          </div>
          <Link to="/case/new" className="btn btn-primary">
            <Plus className="w-5 h-5" />
            Start New Case
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-secondary-900 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.totalCases}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Cases</p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-secondary-900 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.activeConsultations}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Active Consultations</p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-secondary-900 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.savedLawyers}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Saved Lawyers</p>
            </div>
          </div>
        </div>

        <div className="card dark:bg-secondary-900 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center relative">
              <Bell className="w-6 h-6 text-warning-600" />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full text-white text-xs flex items-center justify-center">
                  {stats.unreadNotifications}
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.unreadNotifications}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Unread Notifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2">
          <div className="card dark:bg-secondary-900">
            <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-secondary-700">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary-600" />
                Recent Cases
              </h2>
              <Link to="/dashboard/cases" className="text-sm link">
                View all
              </Link>
            </div>

            {cases.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">You haven't submitted any cases yet</p>
                <Link to="/case/new" className="btn btn-primary btn-sm">
                  Submit Your First Case
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
                {cases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    to={`/case/${caseItem.id}/analysis`}
                    className="block p-4 sm:p-6 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary-900 dark:text-white truncate">{caseItem.title}</h3>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                          {caseItem.case_type} | {caseItem.state || 'Not specified'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`badge ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-secondary-400">
                            {new Date(caseItem.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Consultations */}
          <div className="card dark:bg-secondary-900 mt-6">
            <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-secondary-700">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-success-600" />
                Upcoming Consultations
              </h2>
            </div>

            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">No upcoming consultations</p>
              <Link to="/lawyers" className="btn btn-secondary btn-sm">
                Browse Lawyers
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Case Analysis */}
          <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">AI Case Analysis</h3>
            </div>
            <p className="text-primary-100 text-sm mb-4">
              Get instant AI-powered analysis of your legal case with recommendations and estimated costs.
            </p>
            <Link to="/case/new" className="btn bg-white text-primary-700 hover:bg-primary-50 w-full">
              Analyze New Case
            </Link>
          </div>

          {/* Saved Lawyers */}
          <div className="card dark:bg-secondary-900">
            <div className="flex items-center justify-between p-4 border-b border-secondary-100 dark:border-secondary-700">
              <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent-600" />
                Saved Lawyers
              </h3>
              <Link to="/dashboard/saved" className="text-sm link">View all</Link>
            </div>

            <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
              {savedLawyers.slice(0, 3).map((lawyer) => (
                <Link
                  key={lawyer.id}
                  to={`/lawyer/${lawyer.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {lawyer.profiles.full_name?.charAt(0) || 'L'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 dark:text-white truncate">
                      {lawyer.profiles.full_name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {lawyer.specialization?.[0]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card dark:bg-secondary-900">
            <div className="flex items-center justify-between p-4 border-b border-secondary-100 dark:border-secondary-700">
              <h3 className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-warning-600" />
                Notifications
              </h3>
            </div>

            <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
              {notifications.slice(0, 2).map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 bg-primary-50 dark:bg-primary-900/20"
                >
                  <p className="font-medium text-secondary-900 dark:text-white text-sm">{notification.title}</p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{notification.message}</p>
                  <p className="text-xs text-secondary-400 mt-2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
