"use client";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { motion } from "framer-motion";

interface PengajuanBulananActionsProps {
  onAjukan: () => void;
  onRekapitulasi: () => void;
  activeMode: "none" | "form" | "table";
}

export default function PengajuanBulananActions({
  onAjukan,
  onRekapitulasi,
  activeMode,
}: PengajuanBulananActionsProps) {
  return (
    <div className="flex space-x-4 mb-6">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={activeMode === "form" ? "contained" : "outlined"}
          startIcon={<AddIcon />}
          onClick={onAjukan}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
          aria-label="Ajukan pengajuan baru"
        >
          Ajukan
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={activeMode === "table" ? "contained" : "outlined"}
          startIcon={<SummarizeIcon />}
          onClick={onRekapitulasi}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
          aria-label="Lihat rekapitulasi pengajuan"
        >
          Rekapitulasi
        </Button>
      </motion.div>
    </div>
  );
}