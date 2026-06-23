export default function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  };
  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    amber: 'text-amber-500',
    purple: 'text-purple-500',
    rose: 'text-rose-500',
  };

  return (
    <div className={`rounded-2xl border-2 p-4 flex items-center gap-4 bg-white ${colors[color]}`}>
      <div className={`rounded-xl p-3 ${colors[color]}`}>
        <Icon className={`w-7 h-7 ${iconColors[color]}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-3xl font-bold mt-0.5 ${iconColors[color]}`}>{value}</p>
      </div>
    </div>
  );
}
