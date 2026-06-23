export const STATUS_LABELS = {
  pending: 'Pending',
  invited_phone: 'Phone',
  invited_direct: 'Direct',
};

export const CHANCE_LABELS = {
  confirmed: 'Confirmed',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  declined: 'Declined',
};

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  invited_phone: 'bg-blue-100 text-blue-700 border border-blue-200',
  invited_direct: 'bg-green-100 text-green-700 border border-green-200',
};

const chanceStyles = {
  confirmed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  high: 'bg-teal-100 text-teal-700 border border-teal-200',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  low: 'bg-orange-100 text-orange-700 border border-orange-200',
  declined: 'bg-red-100 text-red-700 border border-red-200',
};

export function StatusBadge({ status, onClick, small }) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium whitespace-nowrap
        ${small ? 'text-xs' : 'text-xs'}
        ${statusStyles[status] || 'bg-gray-100 text-gray-600'}
        ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-transform select-none' : ''}
      `}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function ChanceBadge({ chance, small }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium whitespace-nowrap
        ${small ? 'text-xs' : 'text-xs'}
        ${chanceStyles[chance] || 'bg-gray-100 text-gray-600'}
      `}
    >
      {CHANCE_LABELS[chance] || chance}
    </span>
  );
}
