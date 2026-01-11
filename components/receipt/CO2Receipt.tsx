"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, TreeDeciduous, Car, Flame, Star, Award, Trophy, Medal, Info, X } from "lucide-react";

export interface ReceiptItem {
  name: string;
  quantity: number;
  co2: number; // kg CO2
}

export interface ReceiptData {
  storeName: string;
  date: string;
  items: ReceiptItem[];
}

interface CO2ReceiptProps {
  data: ReceiptData;
}

// Rating thresholds based on total CO2 per item count
interface Rating {
  grade: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  message: string;
}

export function CO2Receipt({ data }: CO2ReceiptProps) {
  const [showLegend, setShowLegend] = useState(false);

  // Calculate total CO2 from items
  const totalCO2 = useMemo(() => {
    return data.items.reduce((sum, item) => sum + (item.co2 * item.quantity), 0);
  }, [data.items]);

  // Calculate average CO2 per item for rating
  const avgCO2PerItem = useMemo(() => {
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems > 0 ? totalCO2 / totalItems : 0;
  }, [data.items, totalCO2]);

  // Generate comparison text
  const comparison = useMemo(() => {
    const kmDriven = (totalCO2 / 0.21).toFixed(0); // ~0.21 kg CO2 per km for average car
    return `Equivalent to driving ${kmDriven} km in a car`;
  }, [totalCO2]);

  // Get rating based on average CO2 per item
  const getRating = (): Rating => {
    const chatbotTip = "Click the chatbot in the bottom right corner to learn how to improve!";
    
    if (avgCO2PerItem < 1) {
      return {
        grade: "A+",
        label: "Excellent",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50",
        icon: <Trophy className="w-8 h-8" />,
        message: chatbotTip,
      };
    } else if (avgCO2PerItem < 2) {
      return {
        grade: "A",
        label: "Great",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-gradient-to-r from-green-100 to-lime-100 dark:from-green-900/50 dark:to-lime-900/50",
        icon: <Award className="w-8 h-8" />,
        message: chatbotTip,
      };
    } else if (avgCO2PerItem < 3) {
      return {
        grade: "B",
        label: "Good",
        color: "text-lime-600 dark:text-lime-400",
        bgColor: "bg-gradient-to-r from-lime-100 to-yellow-100 dark:from-lime-900/50 dark:to-yellow-900/50",
        icon: <Medal className="w-8 h-8" />,
        message: chatbotTip,
      };
    } else if (avgCO2PerItem < 5) {
      return {
        grade: "C",
        label: "Average",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50",
        icon: <Star className="w-8 h-8" />,
        message: chatbotTip,
      };
    } else if (avgCO2PerItem < 8) {
      return {
        grade: "D",
        label: "Below Average",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50",
        icon: <Flame className="w-8 h-8" />,
        message: chatbotTip,
      };
    } else {
      return {
        grade: "F",
        label: "Needs Work",
        color: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-900/50 dark:to-red-900/50",
        icon: <Flame className="w-8 h-8" />,
        message: chatbotTip,
      };
    }
  };

  const rating = getRating();

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
            className="flex justify-between font-mono text-xs uppercase tracking-wider pb-2 border-b border-dotted border-stone-300 dark:border-stone-700"
          >
            <span className="text-stone-500 dark:text-stone-400">Item</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">CO₂ (kg)</span>
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
              {totalCO2.toFixed(2)} kg
            </span>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm font-mono text-stone-500 dark:text-stone-400">
            <span>Avg per item: {avgCO2PerItem.toFixed(2)} kg</span>
            <span>{data.items.length} items scanned</span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mx-6 border-t-2 border-dashed border-stone-300 dark:border-stone-700" />

        {/* Rating Section */}
        <motion.div
          variants={itemVariants}
          className="py-6 px-6"
        >
          <div className={`${rating.bgColor} rounded-xl p-5 relative`}>
            {/* Info button */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-800 transition-colors"
              aria-label="Show rating legend"
            >
              <Info className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            </button>

            {/* Legend Popup */}
            <AnimatePresence>
              {showLegend && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-12 right-3 z-20 w-64 bg-white dark:bg-stone-800 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-mono text-sm font-bold text-stone-700 dark:text-stone-200">Rating Scale</h4>
                    <button
                      onClick={() => setShowLegend(false)}
                      className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      <X className="w-3 h-3 text-stone-500" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-emerald-600">A+</span>
                      <span className="text-stone-600 dark:text-stone-400">{"< 1 kg avg (Excellent)"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-green-600">A</span>
                      <span className="text-stone-600 dark:text-stone-400">1-2 kg avg (Great)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-lime-600">B</span>
                      <span className="text-stone-600 dark:text-stone-400">2-3 kg avg (Good)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-amber-600">C</span>
                      <span className="text-stone-600 dark:text-stone-400">3-5 kg avg (Average)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-orange-600">D</span>
                      <span className="text-stone-600 dark:text-stone-400">5-8 kg avg (Below Avg)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-rose-600">F</span>
                      <span className="text-stone-600 dark:text-stone-400">{"> 8 kg avg (Needs Work)"}</span>
                    </div>
                  </div>
                  <p className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-500 dark:text-stone-400">
                    Based on average CO₂ per item
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
              {/* Grade Circle */}
              <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-white dark:bg-stone-800 shadow-lg flex items-center justify-center ${rating.color}`}>
                <span className="text-2xl font-bold font-mono">{rating.grade}</span>
              </div>
              
              {/* Rating Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={rating.color}>{rating.icon}</span>
                  <span className={`font-bold text-lg ${rating.color}`}>
                    {rating.label}
                  </span>
                </div>
                <p className="font-mono text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {rating.message}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="font-mono text-sm text-stone-600 dark:text-stone-400">
                {comparison}
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
