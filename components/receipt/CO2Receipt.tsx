"use client";

import { motion } from "framer-motion";
import { Leaf, TreeDeciduous, Car, Flame } from "lucide-react";

export interface ReceiptItem {
  name: string;
  quantity: number;
  co2: number; // kg CO2
}

export interface ReceiptData {
  storeName: string;
  date: string;
  items: ReceiptItem[];
  totalCO2: number;
  comparison: string;
}

interface CO2ReceiptProps {
  data: ReceiptData;
}

export function CO2Receipt({ data }: CO2ReceiptProps) {
  const getCO2Color = (co2: number) => {
    if (co2 < 1) return "text-emerald-600 dark:text-emerald-400";
    if (co2 < 3) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getCO2Icon = (co2: number) => {
    if (co2 < 1) return <Leaf className="w-3 h-3" />;
    if (co2 < 3) return <TreeDeciduous className="w-3 h-3" />;
    return <Flame className="w-3 h-3" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative mx-auto max-w-md"
    >
      {/* Receipt paper effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-4 h-8 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Main receipt */}
      <div className="relative bg-[#fefcf3] dark:bg-[#1a1915] rounded-sm shadow-2xl overflow-hidden">
        {/* Torn paper top edge */}
        <div className="absolute inset-x-0 top-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDIwIDE2Ij48cGF0aCBmaWxsPSIjZmVmY2YzIiBkPSJNMCAxNmwyLTQgMiA0IDItNCAyIDQgMi00IDIgNCAyLTQgMiA0IDItNCAwLTEySDB6Ii8+PC9zdmc+')] bg-repeat-x transform -translate-y-2" />
        
        {/* Header */}
        <div className="pt-8 pb-4 px-6 text-center border-b border-dashed border-stone-300 dark:border-stone-700">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-3">
              <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-mono text-xl font-bold text-stone-800 dark:text-stone-200 tracking-wider uppercase">
              Carbon Receipt
            </h2>
            <p className="font-mono text-sm text-stone-500 dark:text-stone-400 mt-1">
              {data.storeName}
            </p>
            <p className="font-mono text-xs text-stone-400 dark:text-stone-500 mt-1">
              {data.date}
            </p>
          </motion.div>
        </div>

        {/* Items */}
        <div className="py-4 px-6 space-y-3">
          <motion.div
            variants={itemVariants}
            className="flex justify-between font-mono text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider pb-2 border-b border-dotted border-stone-300 dark:border-stone-700"
          >
            <span>Item</span>
            <span>CO₂ (kg)</span>
          </motion.div>

          {data.items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center justify-between gap-4 font-mono text-sm"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className={getCO2Color(item.co2)}>
                  {getCO2Icon(item.co2)}
                </span>
                <span className="text-stone-700 dark:text-stone-300 truncate">
                  {item.name}
                </span>
                {item.quantity > 1 && (
                  <span className="text-stone-400 dark:text-stone-500 text-xs">
                    x{item.quantity}
                  </span>
                )}
              </div>
              <span className={`font-semibold ${getCO2Color(item.co2)}`}>
                {(item.co2 * item.quantity).toFixed(2)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 border-t-2 border-dashed border-stone-300 dark:border-stone-700" />

        {/* Total */}
        <motion.div
          variants={itemVariants}
          className="py-4 px-6 space-y-3"
        >
          <div className="flex items-center justify-between font-mono">
            <span className="text-lg font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Total CO₂
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {data.totalCO2.toFixed(2)} kg
            </span>
          </div>

          {/* Comparison card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-mono text-sm text-stone-600 dark:text-stone-400">
                {data.comparison}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="py-4 px-6 bg-stone-100 dark:bg-stone-900/50 text-center border-t border-dashed border-stone-300 dark:border-stone-700"
        >
          <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
            ♻️ Make sustainable choices
          </p>
          <p className="font-mono text-xs text-stone-400 dark:text-stone-500 mt-1">
            Every small step counts
          </p>
          
          {/* Barcode decoration */}
          <div className="mt-4 flex justify-center gap-[2px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="bg-stone-800 dark:bg-stone-300"
                style={{
                  width: Math.random() > 0.5 ? "2px" : "1px",
                  height: "24px",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Torn paper bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDIwIDE2Ij48cGF0aCBmaWxsPSIjZmVmY2YzIiBkPSJNMCAwbDIgNCAyLTQgMiA0IDItNCAyIDQgMi00IDIgNCAyLTQgMiA0IDItNCAwIDEySDB6Ii8+PC9zdmc+')] bg-repeat-x transform translate-y-2" />
      </div>

      {/* Drop shadow effect */}
      <div className="absolute inset-x-4 -bottom-2 h-4 bg-stone-900/10 dark:bg-black/30 blur-lg rounded-full" />
    </motion.div>
  );
}
