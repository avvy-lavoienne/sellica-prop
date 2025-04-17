import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { motion } from "framer-motion";

enum ActiveMode {
  Form = "form",
  Table = "table",
  None = "none",
}

interface DuplicateOperatorActionsProps {
  onAjukan: () => void;
  onRekapitulasi: () => void;
  activeMode: ActiveMode;
}

export default function DuplicateOperatorActions({
  onAjukan,
  onRekapitulasi,
  activeMode,
}: DuplicateOperatorActionsProps) {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAjukan}
          aria-label="Ajukan data duplikat operator"
          sx={{
            px: 3,
            py: 1,
            borderRadius: "0.375rem",
            backgroundColor: activeMode === ActiveMode.Form ? "#3b82f6" : "#4f46e5",
            "&:hover": {
              backgroundColor: activeMode === ActiveMode.Form ? "#2563eb" : "#4338ca",
            },
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Ajukan
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          startIcon={<SummarizeIcon />}
          onClick={onRekapitulasi}
          aria-label="Lihat rekapitulasi data duplikat operator"
          sx={{
            px: 3,
            py: 1,
            borderRadius: "0.375rem",
            backgroundColor: activeMode === ActiveMode.Table ? "#22c55e" : "#16a34a",
            "&:hover": {
              backgroundColor: activeMode === ActiveMode.Table ? "#16a34a" : "#15803d",
            },
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Rekapitulasi
        </Button>
      </motion.div>
    </div>
  );
}