interface ProfileFormProps {
  isEditing: boolean;
  formData: { name: string; nip: string; position: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ name: string; nip: string; position: string }>
  >;
  profile: { name: string; nip: string; position: string };
}

export default function ProfileForm({
  isEditing,
  formData,
  setFormData,
  profile,
}: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        ) : (
          <p className="mt-1 text-gray-900">{profile.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">NIP</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.nip}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <p className="mt-1 text-gray-900">{profile.nip || "-"}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Jabatan</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        ) : (
          <p className="mt-1 text-gray-900">{profile.position || "-"}</p>
        )}
      </div>
    </div>
  );
}