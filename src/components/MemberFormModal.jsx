import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Phone, Users, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', style: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'invited_phone', label: 'By Phone', style: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'invited_direct', label: 'Direct', style: 'bg-green-100 text-green-700 border-green-300' },
];

const CHANCE_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'declined', label: 'Declined' },
];

export default function MemberFormModal({ invitee, onClose }) {
  const { categories, addInvitee, updateInvitee } = useData();
  const isEdit = !!invitee;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      categoryId: '',
      subcategoryId: '',
      invitationStatus: 'pending',
      guestsCount: 1,
      chanceToAttend: 'medium',
      notes: '',
    },
  });

  useEffect(() => {
    if (invitee) {
      reset({
        name: invitee.name || '',
        phone: invitee.phone || '',
        categoryId: invitee.categoryId || '',
        subcategoryId: invitee.subcategoryId || '',
        invitationStatus: invitee.invitationStatus || 'pending',
        guestsCount: invitee.guestsCount || 1,
        chanceToAttend: invitee.chanceToAttend || 'medium',
        notes: invitee.notes || '',
      });
    }
  }, [invitee, reset]);

  const selectedCategoryId = watch('categoryId');
  const selectedStatus = watch('invitationStatus');
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const subcategories = selectedCategory?.subcategories || [];

  async function onSubmit(data) {
    const cat = categories.find((c) => c.id === data.categoryId);
    const sub = cat?.subcategories?.find((s) => s.id === data.subcategoryId);

    const payload = {
      ...data,
      guestsCount: Number(data.guestsCount) || 1,
      categoryName: cat?.name || '',
      subcategoryName: sub?.name || '',
    };

    if (!data.subcategoryId) {
      payload.subcategoryId = '';
      payload.subcategoryName = '';
    }

    if (isEdit) {
      await updateInvitee(invitee.id, payload);
    } else {
      await addInvitee(payload);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Member' : 'Add Member'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter full name"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('phone')}
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm"
              />
            </div>
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('categoryId', { required: 'Category required' })}
                onChange={(e) => {
                  setValue('categoryId', e.target.value);
                  setValue('subcategoryId', '');
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm bg-white"
              >
                <option value="">Select…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>

            {subcategories.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subcategory</label>
                <select
                  {...register('subcategoryId')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm bg-white"
                >
                  <option value="">None</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Invitation Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Invitation Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('invitationStatus', opt.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                    selectedStatus === opt.value
                      ? opt.style + ' border-opacity-100 scale-[1.03] shadow-sm'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guests Count + Chance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Guests (incl. self)</span>
              </label>
              <input
                {...register('guestsCount', { min: 1 })}
                type="number"
                min={1}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Chance to Come</label>
              <select
                {...register('chanceToAttend')}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm bg-white"
              >
                {CHANCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Notes</span>
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Any extra info…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              isEdit ? 'Save Changes' : 'Add Member'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
