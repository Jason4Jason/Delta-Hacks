"use client";

import { useEffect, useState } from "react";
import DynamicChat from "../components/chat/DynamicChat";
import { getWidgetConfig } from "../lib/chat-config";
import { useIsMobile } from "../hooks/use-mobile";
import { ReceiptScanner } from "@/components/receipt";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get widget configuration for positioning
  const widgetConfig = getWidgetConfig();
  
  const getWidgetPositionStyles = () => {
    const { position, offset } = widgetConfig;
    
    // Adjust positioning for mobile
    const mobileOffset = {
      x: isMobile ? Math.max(offset.x, 16) : offset.x,
      y: isMobile ? Math.max(offset.y, 16) : offset.y,
    };
    
    switch (position) {
      case 'bottom-right':
        return { 
          bottom: `${mobileOffset.y}px`, 
          right: `${mobileOffset.x}px` 
        };
      case 'bottom-left':
        return { 
          bottom: `${mobileOffset.y}px`, 
          left: `${mobileOffset.x}px` 
        };
      case 'top-right':
        return { 
          top: `${mobileOffset.y}px`, 
          right: `${mobileOffset.x}px` 
        };
      case 'top-left':
        return { 
          top: `${mobileOffset.y}px`, 
          left: `${mobileOffset.x}px` 
        };
      default:
        return { 
          bottom: isMobile ? '16px' : '24px', 
          right: isMobile ? '16px' : '24px' 
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-stone-950 dark:via-stone-900 dark:to-emerald-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content - Receipt Scanner App */}
      <main className="relative container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <ReceiptScanner />
      </main>

      {/* Chat Widget - Fixed in corner */}
      {mounted && (
        <div 
          className="fixed z-[1000] safe-area-bottom safe-area-right"
          style={{
            ...getWidgetPositionStyles(),
            zIndex: widgetConfig.zIndex
          }}
        >
          <DynamicChat />
        </div>
      )}
    </div>
  );
}
