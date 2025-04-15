interface SalahRekamActionsProps {
    onAjukan: () => void;
    onRekapitulasi: () => void;
  }
  
  export default function SalahRekamActions({
    onAjukan,
    onRekapitulasi,
  }: SalahRekamActionsProps) {
    return (
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={onAjukan}
          className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Ajukan
        </button>
        <button
          onClick={onRekapitulasi}
          className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Rekapitulasi
        </button>
      </div>
    );
  }