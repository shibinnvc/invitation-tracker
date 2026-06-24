import { useState } from 'react';
import { X, FileDown, Share2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_LABELS = {
  pending: 'Pending',
  invited_phone: 'By Phone',
  invited_direct: 'Direct',
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const FIELDS = [
  { key: 'name', label: 'Name', get: (i) => i.name || '' },
  { key: 'phone', label: 'Phone', get: (i) => i.phone || '' },
  { key: 'category', label: 'Category', get: (i, catMap) => i.categoryName || catMap[i.categoryId] || '' },
  { key: 'subcategory', label: 'Subcategory', get: (i) => i.subcategoryName || '' },
  { key: 'status', label: 'Status', get: (i) => STATUS_LABELS[i.invitationStatus] || '' },
  { key: 'chance', label: 'Chance', get: (i) => cap(i.chanceToAttend) },
  { key: 'guests', label: 'Guests', get: (i) => String(i.guestsCount || 1) },
  { key: 'notes', label: 'Notes', get: (i) => i.notes || '' },
];

const DEFAULT_SELECTED = ['name', 'phone', 'category', 'status', 'guests'];

export default function ExportPdfModal({ invitees, categories, onClose }) {
  const [selected, setSelected] = useState(DEFAULT_SELECTED);
  const [working, setWorking] = useState(false);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const fields = FIELDS.filter((f) => selected.includes(f.key));
  const canShare = typeof navigator !== 'undefined' && !!navigator.canShare;

  function toggle(key) {
    setSelected((cur) =>
      cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]
    );
  }

  function buildDoc() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const totalGuests = invitees.reduce((s, i) => s + (Number(i.guestsCount) || 1), 0);

    doc.setFontSize(16);
    doc.setTextColor(190, 18, 60);
    doc.text('Wedding Invite List', 40, 40);

    doc.setFontSize(10);
    doc.setTextColor(110);
    const dateStr = new Date().toLocaleDateString();
    doc.text(
      `${invitees.length} members  ·  ${totalGuests} total people  ·  ${dateStr}`,
      40,
      58
    );

    autoTable(doc, {
      startY: 74,
      head: [fields.map((f) => f.label)],
      body: invitees.map((inv) => fields.map((f) => f.get(inv, catMap))),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [225, 29, 72], textColor: 255 },
      alternateRowStyles: { fillColor: [253, 242, 245] },
      margin: { left: 40, right: 40 },
    });

    return doc;
  }

  function handleDownload() {
    if (fields.length === 0) return;
    setWorking(true);
    try {
      buildDoc().save('invite-list.pdf');
      onClose();
    } finally {
      setWorking(false);
    }
  }

  async function handleShare() {
    if (fields.length === 0) return;
    setWorking(true);
    try {
      const blob = buildDoc().output('blob');
      const file = new File([blob], 'invite-list.pdf', { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Wedding Invite List' });
        onClose();
      } else {
        buildDoc().save('invite-list.pdf');
        onClose();
      }
    } catch (err) {
      // User cancelled the share sheet or sharing failed — keep modal open.
      if (err?.name !== 'AbortError') console.error('Share failed:', err);
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            Export PDF
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Choose fields to include</p>
            <p className="text-xs text-gray-400 mb-3">
              {invitees.length} member{invitees.length !== 1 ? 's' : ''} will be exported
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.map((f) => {
                const on = selected.includes(f.key);
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggle(f.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      on
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                        on ? 'bg-rose-600 border-rose-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      {on && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    {f.label}
                  </button>
                );
              })}
            </div>
            {fields.length === 0 && (
              <p className="text-red-500 text-xs mt-2">Select at least one field.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleDownload}
              disabled={working || fields.length === 0 || invitees.length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Download
            </button>
            {canShare && (
              <button
                onClick={handleShare}
                disabled={working || fields.length === 0 || invitees.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
