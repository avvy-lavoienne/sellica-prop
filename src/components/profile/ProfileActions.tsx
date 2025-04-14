interface ProfileActionsProps {
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileActions({
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
}: ProfileActionsProps) {
  return (
    <div className="mt-6 flex justify-center space-x-4">
      {isEditing ? (
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Batal
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Edit Profil
        </button>
      )}
    </div>
  );
}