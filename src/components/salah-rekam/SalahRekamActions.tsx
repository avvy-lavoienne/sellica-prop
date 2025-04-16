import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SummarizeIcon from "@mui/icons-material/Summarize";

interface SalahRekamActionsProps {
  onAjukan: () => void;
  onRekapitulasi: () => void;
  activeMode: "form" | "table" | "none"; // Tambah prop untuk mode aktif
}

export default function SalahRekamActions({
  onAjukan,
  onRekapitulasi,
  activeMode,
}: SalahRekamActionsProps) {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAjukan}
        sx={{
          px: 3,
          py: 1,
          borderRadius: "0.375rem",
          backgroundColor: activeMode === "form" ? "#3b82f6" : "#4f46e5", // Biru lebih terang saat aktif
          "&:hover": {
            backgroundColor: activeMode === "form" ? "#2563eb" : "#4338ca",
          },
          textTransform: "none",
          fontSize: "1rem",
        }}
      >
        Ajukan
      </Button>
      <Button
        variant="contained"
        startIcon={<SummarizeIcon />}
        onClick={onRekapitulasi}
        sx={{
          px: 3,
          py: 1,
          borderRadius: "0.375rem",
          backgroundColor: activeMode === "table" ? "#22c55e" : "#16a34a", // Hijau lebih terang saat aktif
          "&:hover": {
            backgroundColor: activeMode === "table" ? "#16a34a" : "#15803d",
          },
          textTransform: "none",
          fontSize: "1rem",
        }}
      >
        Rekapitulasi
      </Button>
    </div>
  );
}