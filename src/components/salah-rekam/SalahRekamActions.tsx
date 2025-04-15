import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SummarizeIcon from "@mui/icons-material/Summarize";

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
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAjukan}
        sx={{
          px: 3,
          py: 1,
          borderRadius: "0.375rem",
          backgroundColor: "#4f46e5", // indigo-600
          "&:hover": {
            backgroundColor: "#4338ca", // indigo-700
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
          backgroundColor: "#16a34a", // green-600
          "&:hover": {
            backgroundColor: "#15803d", // green-700
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