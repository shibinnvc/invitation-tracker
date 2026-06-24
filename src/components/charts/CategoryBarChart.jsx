import { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react';

const BAR_COLORS = [
  '#f43f5e', '#e11d48', '#be123c', '#fb7185', '#fda4af',
  '#f97316', '#3b82f6', '#8b5cf6',
];

function truncate(s, n = 12) {
  return s && s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function YAxisTick({ x, y, payload }) {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill="#6b7280">
      {truncate(payload.value)}
    </text>
  );
}

function Chart({ data, onBarClick }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 32 }}>
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={<YAxisTick />} width={92} />
        <Tooltip
          formatter={(v) => [`${v} people`, 'Count']}
          labelFormatter={(label) => label}
        />
        <Bar
          dataKey="total"
          radius={[0, 6, 6, 0]}
          onClick={onBarClick}
          cursor={onBarClick ? 'pointer' : 'default'}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
          <LabelList dataKey="total" position="right" style={{ fontSize: 12, fill: '#6b7280' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function CategoryBarChart({ categories, invitees }) {
  const [activeCat, setActiveCat] = useState(null);

  // --- Drill-down: subcategory breakdown for the selected category ---
  if (activeCat) {
    const members = invitees.filter((i) => i.categoryId === activeCat.id);
    const subData = (activeCat.subcategories || []).map((sub, i) => ({
      name: sub.name,
      total: members.filter(
        (m) => m.subcategoryId === sub.id || m.subcategoryName === sub.name
      ).length,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));

    const unassigned = members.filter((m) => !m.subcategoryName).length;
    if (unassigned > 0) {
      subData.push({ name: 'No subcategory', total: unassigned, color: '#cbd5e1' });
    }

    const data = subData.filter((d) => d.total > 0);

    return (
      <div>
        <button
          onClick={() => setActiveCat(null)}
          className="flex items-center gap-1 text-sm text-rose-600 font-medium mb-2 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="truncate">{activeCat.name}</span>
        </button>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No subcategory breakdown yet
          </div>
        ) : (
          <Chart data={data} />
        )}
      </div>
    );
  }

  // --- Top level: one bar per category ---
  const data = categories
    .map((cat, i) => ({
      id: cat.id,
      name: cat.name,
      total: invitees.filter((inv) => inv.categoryId === cat.id).length,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }))
    .filter((d) => d.total > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <div>
      <Chart
        data={data}
        onBarClick={(entry) => {
          const cat = categories.find((c) => c.id === entry.id);
          if (cat) setActiveCat(cat);
        }}
      />
      <p className="text-xs text-gray-400 text-center mt-1">
        Tap a bar to see subcategory details
      </p>
    </div>
  );
}
