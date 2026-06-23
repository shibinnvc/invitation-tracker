import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  Pending: '#f59e0b',
  'By Phone': '#3b82f6',
  'Direct': '#22c55e',
};

export default function StatusPieChart({ invitees }) {
  const pending = invitees.filter((i) => i.invitationStatus === 'pending').length;
  const phone = invitees.filter((i) => i.invitationStatus === 'invited_phone').length;
  const direct = invitees.filter((i) => i.invitationStatus === 'invited_direct').length;

  const data = [
    { name: 'Pending', value: pending },
    { name: 'By Phone', value: phone },
    { name: 'Direct', value: direct },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${v} people`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
