'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Submission {
  id: string;
  type: string;
  email: string;
  submittedBy: string;
  status: string;
  createdAt: string;
  data: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    checkAuth();
    fetchSubmissions();
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/submissions?status=${activeTab}`);
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const approveSubmission = async (id: string) => {
    if (!confirm('Approve this submission?')) return;

    try {
      const response = await fetch(`/api/submissions/${id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Submission approved!');
        fetchSubmissions();
      }
    } catch (error) {
      alert('Failed to approve submission');
    }
  };

  const rejectSubmission = async (id: string) => {
    if (!confirm('Reject this submission?')) return;

    try {
      const response = await fetch(`/api/submissions/${id}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Submission rejected');
        fetchSubmissions();
      }
    } catch (error) {
      alert('Failed to reject submission');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Businesses</p>
                <p className="text-2xl font-semibold text-gray-900">18</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{submissions.filter(s => s.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Approved Today</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({submissions.filter(s => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                  activeTab === 'approved'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                  activeTab === 'rejected'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected
              </button>
            </nav>
          </div>

          {/* Submissions List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab} submissions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.data.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {submission.data.category} " {submission.data.city}, {submission.data.island}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {submission.data.description?.substring(0, 150)}...
                        </p>
                        <div className="mt-3 flex gap-4 text-xs text-gray-500">
                          <span>Submitted by: {submission.submittedBy}</span>
                          <span>Email: {submission.email}</span>
                          <span>Date: {new Date(submission.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {activeTab === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => approveSubmission(submission.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectSubmission(submission.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Additional Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Address:</span>
                        <p className="text-gray-600">{submission.data.address}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Contact:</span>
                        <p className="text-gray-600">
                          {submission.data.phone && `Phone: ${submission.data.phone}`}
                          {submission.data.email && ` " Email: ${submission.data.email}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
