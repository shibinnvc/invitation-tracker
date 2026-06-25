import { useState, useMemo } from 'react';
import { Search, UserPlus, ChevronDown, ChevronUp, Pencil, Trash2, Users, Phone, UserCheck, FileDown, StickyNote } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { StatusBadge, ChanceBadge } from '../components/StatusBadge';
import ExportPdfModal from '../components/ExportPdfModal';

const STATUS_CYCLE = ['pending', 'invited_phone', 'invited_direct'];

function InviteeRow({ invitee, onEdit, onCycleStatus, onDelete }) {
  return (
    <div className="px-4 py-3 hover:bg-rose-50/50 transition-colors border-b border-gray-50 last:border-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
          <span className="text-rose-700 font-semibold text-sm">
            {invitee.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm break-words flex items-center gap-1.5">
            {invitee.name}
            {invitee.notes && (
              <span
                title={invitee.notes}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex-shrink-0"
              >
                <StickyNote className="w-2.5 h-2.5" />
              </span>
            )}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {invitee.subcategoryName && (
              <span className="text-xs text-gray-400">{invitee.subcategoryName} •</span>
            )}
            {invitee.phone && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <Phone className="w-3 h-3" />{invitee.phone}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(invitee)}
            className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(invitee)}
            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap mt-2 pl-12">
        <StatusBadge
          status={invitee.invitationStatus}
          onClick={() => onCycleStatus(invitee)}
        />
        <ChanceBadge chance={invitee.chanceToAttend} />
        <span className="flex items-center gap-0.5 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
          <Users className="w-3 h-3" />{invitee.guestsCount || 1}
        </span>
      </div>
    </div>
  );
}

function CategorySection({ category, invitees, onEdit, onCycleStatus, onDelete }) {
  const [open, setOpen] = useState(true);

  if (invitees.length === 0) return null;

  const invited = invitees.filter(
    (i) => i.invitationStatus === 'invited_phone' || i.invitationStatus === 'invited_direct'
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">{category.name}</span>
          <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {invitees.length}
          </span>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full hidden sm:inline">
            {invited} invited
          </span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="border-t border-gray-100">
          {invitees.map((inv) => (
            <InviteeRow
              key={inv.id}
              invitee={inv}
              onEdit={onEdit}
              onCycleStatus={onCycleStatus}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InviteList({ onAddMember, onEditMember }) {
  const { categories, invitees, updateInvitee, deleteInvitee } = useData();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterChance, setFilterChance] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showExport, setShowExport] = useState(false);

  // Subcategory options depend on the selected category (or all categories).
  const subcategoryOptions = useMemo(() => {
    const source = filterCategory
      ? categories.filter((c) => c.id === filterCategory)
      : categories;
    const names = new Set();
    source.forEach((c) => (c.subcategories || []).forEach((s) => s.name && names.add(s.name)));
    return [...names].sort();
  }, [categories, filterCategory]);

  const filtered = useMemo(() => {
    return invitees.filter((inv) => {
      if (search && !inv.name?.toLowerCase().includes(search.toLowerCase()) &&
          !inv.phone?.includes(search)) return false;
      if (filterCategory && inv.categoryId !== filterCategory) return false;
      if (filterSubcategory && inv.subcategoryName !== filterSubcategory) return false;
      if (filterStatus && inv.invitationStatus !== filterStatus) return false;
      if (filterChance && inv.chanceToAttend !== filterChance) return false;
      return true;
    });
  }, [invitees, search, filterCategory, filterSubcategory, filterStatus, filterChance]);

  const grouped = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      invitees: filtered.filter((i) => i.categoryId === cat.id),
    }));
  }, [categories, filtered]);

  const ungrouped = useMemo(() => {
    const catIds = new Set(categories.map((c) => c.id));
    return filtered.filter((i) => !catIds.has(i.categoryId));
  }, [filtered, categories]);

  async function handleCycleStatus(invitee) {
    const idx = STATUS_CYCLE.indexOf(invitee.invitationStatus);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    await updateInvitee(invitee.id, { invitationStatus: next });
  }

  async function handleDelete(invitee) {
    setConfirmDelete(invitee);
  }

  async function confirmDeleteAction() {
    if (confirmDelete) {
      await deleteInvitee(confirmDelete.id);
      setConfirmDelete(null);
    }
  }

  const hasFilters = search || filterCategory || filterSubcategory || filterStatus || filterChance;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invite List</h1>
          <p className="text-gray-500 text-sm mt-0.5">{invitees.length} total members</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExport(true)}
            disabled={invitees.length === 0}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold px-3 py-2 rounded-xl transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={onAddMember}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(''); }}
            className="flex-1 min-w-[130px] px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-rose-400"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {subcategoryOptions.length > 0 && (
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-rose-400"
            >
              <option value="">All Subcategories</option>
              {subcategoryOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-rose-400"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="invited_phone">By Phone</option>
            <option value="invited_direct">Direct</option>
          </select>

          <select
            value={filterChance}
            onChange={(e) => setFilterChance(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-rose-400"
          >
            <option value="">All Chances</option>
            <option value="confirmed">Confirmed</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="declined">Declined</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterSubcategory(''); setFilterStatus(''); setFilterChance(''); }}
              className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tip */}
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" />
          Tap a status badge to cycle: Pending → Phone → Direct
        </p>
      </div>

      {/* Results count when filtering */}
      {hasFilters && (
        <p className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* List */}
      <div className="space-y-3">
        {grouped.map(({ category, invitees: catInvitees }) => (
          <CategorySection
            key={category.id}
            category={category}
            invitees={catInvitees}
            onEdit={onEditMember}
            onCycleStatus={handleCycleStatus}
            onDelete={handleDelete}
          />
        ))}

        {ungrouped.length > 0 && (
          <CategorySection
            category={{ id: '__other', name: 'Other' }}
            invitees={ungrouped}
            onEdit={onEditMember}
            onCycleStatus={handleCycleStatus}
            onDelete={handleDelete}
          />
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{hasFilters ? 'No results found' : 'No members yet'}</p>
          {!hasFilters && (
            <button
              onClick={onAddMember}
              className="mt-3 text-rose-600 font-medium text-sm hover:underline"
            >
              + Add your first member
            </button>
          )}
        </div>
      )}

      {/* PDF export */}
      {showExport && (
        <ExportPdfModal
          invitees={filtered}
          categories={categories}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Remove Member?</h3>
            <p className="text-gray-500 text-sm mb-5">
              Are you sure you want to remove <strong>{confirmDelete.name}</strong> from the list?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
