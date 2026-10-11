import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function ConfirmModal({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
          <motion.div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: .92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 8 }} transition={{ type: "spring", stiffness: 380, damping: 28 }} className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4"><LogOut size={19} /></div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: "Manrope" }}>{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600">{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
