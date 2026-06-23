import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const BAR_COLORS = [
  '#f43f5e', '#e11d48', '#be123c', '#fb7185', '#fda4af',
  '#f97316', '#3b82f6', '#8b5cf6',
];

export default function CategoryBarChart({ categories, invitees }) {
  const data = categories.map((cat, i) => ({
    name: cat.name.replace("'s Friends", '').replace("Friends", '').trim(),
    total: invitees.filter((inv) => inv.categoryId === cat.id).length,
    color: BAR_COLORS[i % BAR_COLORS.length],
  })).filter((d) => d.total > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 32 }}>
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={72} />
        <Tooltip formatter={(v) => [`${v} people`, 'Count']} />
        <Bar dataKey="total" radius={[0, 6, 6, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
          <LabelList dataKey="total" position="right" style={{ fontSize: 12, fill: '#6b7280' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
