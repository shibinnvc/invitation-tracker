import { Users, CheckCircle, Clock, Star, UserPlus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import StatCard from '../components/StatCard';
import StatusPieChart from '../components/charts/StatusPieChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import { useMemo } from 'react';

export default function Dashboard({ onAddMember }) {
  const { invitees, categories } = useData();

  const stats = useMemo(() => {
    const total = invitees.length;
    const invited = invitees.filter(
      (i) => i.invitationStatus === 'invited_phone' || i.invitationStatus === 'invited_direct'
    ).length;
    const pending = invitees.filter((i) => i.invitationStatus === 'pending').length;
    const totalPeople = invitees.reduce(
      (sum, i) => sum + (Number(i.guestsCount) || 1),
      0
    );

    return { total, invited, pending, totalPeople };
  }, [invitees]);

  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const members = invitees.filter((i) => i.categoryId === cat.id);
      const invited = members.filter(
        (i) => i.invitationStatus === 'invited_phone' || i.invitationStatus === 'invited_direct'
      ).length;
      const pending = members.filter((i) => i.invitationStatus === 'pending').length;
      return { ...cat, total: members.length, invited, pending };
    }).filter((c) => c.total > 0);
  }, [categories, invitees]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Wedding Invitation Tracker</p>
        </div>
        <button
          onClick={onAddMember}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Invitees" value={stats.total} icon={Users} color="blue" />
        <StatCard label="Already Invited" value={stats.invited} icon={CheckCircle} color="green" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="Total People" value={stats.totalPeople} icon={Star} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Invitation Status</h2>
          <StatusPieChart invitees={invitees} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-3">By Category</h2>
          <CategoryBarChart categories={categories} invitees={invitees} />
        </div>
      </div>

      {/* Category Summary Cards */}
      {categoryStats.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Category Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="font-semibold text-gray-800 text-sm truncate">{cat.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">{cat.total}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">{cat.invited}</p>
                    <p className="text-xs text-gray-400">Invited</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-600">{cat.pending}</p>
                    <p className="text-xs text-gray-400">Pending</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                    style={{ width: cat.total ? `${(cat.invited / cat.total) * 100}%` : '0%' }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {cat.total ? Math.round((cat.invited / cat.total) * 100) : 0}% invited
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {invitees.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No members added yet</p>
          <p className="text-sm mt-1">Click "Add Member" to get started</p>
        </div>
      )}
    </div>
  );
}
