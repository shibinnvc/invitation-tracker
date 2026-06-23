import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronUp, Lock, Eye, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { v4 as uuidv4 } from 'uuid';

function InlineInput({ defaultValue = '', onSave, onCancel, placeholder }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onSave(val); if (e.key === 'Escape') onCancel(); }}
        placeholder={placeholder}
        className="flex-1 px-3 py-1.5 border border-rose-300 rounded-lg text-sm focus:outline-none focus:border-rose-500"
      />
      <button onClick={() => onSave(val)} disabled={!val.trim()} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-40">
        <Check className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function CategoryCard({ category, invitees }) {
  const { updateCategory, deleteCategory } = useData();
  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [addingSub, setAddingSub] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);

  const memberCount = invitees.filter((i) => i.categoryId === category.id).length;

  async function saveName(name) {
    if (!name.trim()) return;
    await updateCategory(category.id, { name: name.trim() });
    setEditingName(false);
  }

  async function addSubcategory(name) {
    if (!name.trim()) return;
    const subs = [...(category.subcategories || []), { id: uuidv4(), name: name.trim() }];
    await updateCategory(category.id, { subcategories: subs });
    setAddingSub(false);
  }

  async function editSubcategory(subId, name) {
    if (!name.trim()) return;
    const subs = (category.subcategories || []).map((s) =>
      s.id === subId ? { ...s, name: name.trim() } : s
    );
    await updateCategory(category.id, { subcategories: subs });
    setEditingSubId(null);
  }

  async function deleteSubcategory(subId) {
    const subs = (category.subcategories || []).filter((s) => s.id !== subId);
    await updateCategory(category.id, { subcategories: subs });
  }

  async function handleDeleteCategory() {
    if (memberCount > 0) return;
    await deleteCategory(category.id);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        {editingName ? (
          <div className="flex-1">
            <InlineInput
              defaultValue={category.name}
              onSave={saveName}
              onCancel={() => setEditingName(false)}
              placeholder="Category name"
            />
          </div>
        ) : (
          <>
            <button onClick={() => setOpen((o) => !o)} className="flex-1 flex items-center gap-2 text-left">
              <span className="font-semibold text-gray-800">{category.name}</span>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">{memberCount}</span>
              {(category.subcategories || []).length > 0 && (
                <span className="text-xs text-gray-400">
                  {(category.subcategories || []).length} sub{(category.subcategories || []).length !== 1 ? 's' : ''}
                </span>
              )}
              {open ? <ChevronUp className="w-4 h-4 text-gray-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />}
            </button>
            <button onClick={() => setEditingName(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDeleteCategory}
              disabled={memberCount > 0}
              title={memberCount > 0 ? 'Remove all members first' : 'Delete category'}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Subcategories</p>

          {(category.subcategories || []).map((sub) => (
            <div key={sub.id}>
              {editingSubId === sub.id ? (
                <InlineInput
                  defaultValue={sub.name}
                  onSave={(name) => editSubcategory(sub.id, name)}
                  onCancel={() => setEditingSubId(null)}
                  placeholder="Subcategory name"
                />
              ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <span className="text-sm text-gray-700">{sub.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingSubId(sub.id)} className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteSubcategory(sub.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {addingSub ? (
            <InlineInput
              onSave={addSubcategory}
              onCancel={() => setAddingSub(false)}
              placeholder="New subcategory name"
            />
          ) : (
            <button
              onClick={() => setAddingSub(true)}
              className="flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 font-medium mt-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subcategory
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SetupPage() {
  const { categories, invitees, addCategory, updatePin, getPin } = useData();
  const [addingCat, setAddingCat] = useState(false);
  const [pinSection, setPinSection] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState(null);
  const [showPins, setShowPins] = useState(false);
  const [savingPin, setSavingPin] = useState(false);

  async function handleAddCategory(name) {
    if (!name.trim()) return;
    await addCategory(name.trim());
    setAddingCat(false);
  }

  async function handleChangePin(e) {
    e.preventDefault();
    setSavingPin(true);
    setPinMsg(null);
    try {
      const stored = await getPin();
      if (currentPin !== stored) {
        setPinMsg({ type: 'error', text: 'Current PIN is incorrect.' });
        return;
      }
      if (newPin.length < 4) {
        setPinMsg({ type: 'error', text: 'New PIN must be at least 4 digits.' });
        return;
      }
      if (newPin !== confirmPin) {
        setPinMsg({ type: 'error', text: 'New PINs do not match.' });
        return;
      }
      await updatePin(newPin);
      setPinMsg({ type: 'success', text: 'PIN changed successfully!' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } finally {
      setSavingPin(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Setup</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage categories, subcategories and app settings</p>
      </div>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-700">Categories</h2>
          <button
            onClick={() => setAddingCat(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>

        {addingCat && (
          <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-4 mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">New Category Name</p>
            <InlineInput
              onSave={handleAddCategory}
              onCancel={() => setAddingCat(false)}
              placeholder="e.g. Office Colleagues"
            />
          </div>
        )}

        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} invitees={invitees} />
          ))}
          {categories.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-6">No categories yet</p>
          )}
        </div>
      </section>

      {/* PIN Change */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setPinSection((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span className="font-semibold text-gray-800">Change PIN</span>
          </div>
          {pinSection ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {pinSection && (
          <form onSubmit={handleChangePin} className="border-t border-gray-100 px-5 py-4 space-y-3">
            {[
              { label: 'Current PIN', val: currentPin, setter: setCurrentPin },
              { label: 'New PIN', val: newPin, setter: setNewPin },
              { label: 'Confirm New PIN', val: confirmPin, setter: setConfirmPin },
            ].map(({ label, val, setter }) => (
              <div key={label}>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
                <div className="relative">
                  <input
                    type={showPins ? 'text' : 'password'}
                    inputMode="numeric"
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full pr-10 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 tracking-widest"
                    maxLength={8}
                  />
                </div>
              </div>
            ))}

            <button type="button" onClick={() => setShowPins((s) => !s)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPins ? 'Hide' : 'Show'} PINs
            </button>

            {pinMsg && (
              <p className={`text-sm rounded-lg px-3 py-2 ${pinMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {pinMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={savingPin || !currentPin || !newPin || !confirmPin}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {savingPin ? 'Saving…' : 'Change PIN'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
