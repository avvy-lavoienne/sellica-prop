import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onDetail?: () => void;
  showDetailButton?: boolean;
  isDetailOpen?: boolean;
}

export default function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  const buttonClasses = "p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
  const editButtonClasses = `${buttonClasses} bg-blue-500 hover:bg-blue-600 focus:ring-blue-500`;
  const deleteButtonClasses = `${buttonClasses} bg-red-500 hover:bg-red-600 focus:ring-red-500`;

  const handleEditClick = () => {
    console.log("Edit button clicked");
    onEdit();
  };

  const handleDeleteClick = () => {
    console.log("Delete button clicked");
    onDelete();
  };

  return (
    <div className="flex space-x-2">
      <button onClick={handleEditClick} className={editButtonClasses} title="Edit">
        <PencilIcon className="h-5 w-5" />
      </button>
      <button onClick={handleDeleteClick} className={deleteButtonClasses} title="Delete">
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}