import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { motion } from "framer-motion";

interface TableSortButtonsProps {
  column: "tanggal_pengajuan" | "is_ready_to_record";
  sortBy: "tanggal_pengajuan" | "is_ready_to_record";
  sortOrder: "asc" | "desc";
  onSort: (column: "tanggal_pengajuan" | "is_ready_to_record") => void;
  disabled?: boolean;
}

export default function TableSortButtons({
  column,
  sortBy,
  sortOrder,
  onSort,
  disabled = false,
}: TableSortButtonsProps) {
  const isActive = sortBy === column;
  const isAscending = sortOrder === "asc";

  return (
    <motion.div
      className="inline-block ml-2"
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
    >
      <IconButton
        size="small"
        onClick={() => onSort(column)}
        disabled={disabled}
        aria-label={`Urutkan berdasarkan ${column === "tanggal_pengajuan" ? "tanggal pengajuan" : "status"} ${
          isActive && isAscending ? "menurun" : "menaik"
        }`}
      >
        {isActive && isAscending ? (
          <ArrowUpwardIcon fontSize="small" />
        ) : (
          <ArrowDownwardIcon fontSize="small" />
        )}
      </IconButton>
    </motion.div>
  );
}