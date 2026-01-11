"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CO2Receipt, ReceiptData } from "./CO2Receipt";

export function ReceiptScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        processReceipt(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Callback ref to handle video element mounting
  const videoRefCallback = useCallback((video: HTMLVideoElement | null) => {
    if (video && streamRef.current) {
      video.srcObject = streamRef.current;
      video.onloadedmetadata = () => {
        video.play()
          .then(() => {
            setCameraReady(true);
          })
          .catch((err) => {
            console.error("Error playing video:", err);
          });
      };
    }
  }, []);

  const startCamera = async () => {
    try {
      setCameraLoading(true);
      setCameraReady(false);
      
      // Get the stream first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      streamRef.current = stream;
      
      // Now show the camera UI - the callback ref will connect the stream
      setShowCamera(true);
      setCameraLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraLoading(false);
      setShowCamera(false);
      alert("Could not access camera. Please use file upload instead.");
    }
  };

  // Store video element ref for capture
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  
  const combinedVideoRef = useCallback((video: HTMLVideoElement | null) => {
    videoElementRef.current = video;
    videoRefCallback(video);
  }, [videoRefCallback]);

  const capturePhoto = useCallback(() => {
    const video = videoElementRef.current;
    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setImage(imageData);
        stopCamera();
        processReceipt(imageData);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraReady(false);
  }, []);

  const processReceipt = async (imageData: string) => {
    setIsLoading(true);
    
    try {
      // Send to Flask backend
      const response = await fetch("http://localhost:5000/api/analyze-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        const data = await response.json();
        setReceiptData(data);
      } else {
        // Fallback mock data if backend fails
        setReceiptData(getMockData());
      }
    } catch (error) {
      console.error("Error processing receipt:", error);
      // Use mock data for demo purposes
      setReceiptData(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockData = (): ReceiptData => ({
    storeName: "EcoMart Groceries",
    date: new Date().toLocaleDateString(),
    items: [
      { name: "Organic Bananas", quantity: 1, co2: 0.48 },
      { name: "Whole Milk 1L", quantity: 2, co2: 3.2 },
      { name: "Ground Beef 500g", quantity: 1, co2: 13.5 },
      { name: "Rice 1kg", quantity: 1, co2: 2.7 },
      { name: "Fresh Tomatoes", quantity: 1, co2: 0.9 },
      { name: "Cheddar Cheese 200g", quantity: 1, co2: 2.1 },
      { name: "Eggs (12 pack)", quantity: 1, co2: 1.6 },
      { name: "Bread Loaf", quantity: 1, co2: 0.8 },
    ],
    totalCO2: 25.28,
    comparison: "Equivalent to driving 102 km in a car",
  });

  const reset = () => {
    setImage(null);
    setReceiptData(null);
    stopCamera();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!image && !showCamera && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30"
              >
                <Leaf className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Carbon Receipt
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Scan your grocery receipt to discover the carbon footprint of your purchases
              </p>
            </div>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative border-2 border-dashed border-emerald-500/50 rounded-2xl p-12 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 hover:border-emerald-500 transition-all">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-foreground">
                        Drop your receipt here
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse files
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.div>

            {/* Or divider */}
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-sm text-muted-foreground font-medium">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Camera Button */}
            <Button
              onClick={startCamera}
              disabled={cameraLoading}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 px-8 disabled:opacity-70"
            >
              {cameraLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Accessing Camera...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Take a Photo
                </>
              )}
            </Button>
          </motion.div>
        )}

        {showCamera && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-2xl overflow-hidden bg-black"
          >
            <video
              ref={combinedVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[3/4] object-cover"
              style={{ backgroundColor: "#000" }}
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-3">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                <p className="text-white/70 text-sm">Starting camera...</p>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button
                  onClick={capturePhoto}
                  size="icon"
                  className="rounded-full w-16 h-16 bg-white hover:bg-white/90"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500" />
                </Button>
                <div className="w-12" /> {/* Spacer for symmetry */}
              </div>
            </div>
          </motion.div>
        )}

        {image && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <p className="text-lg text-muted-foreground">Analyzing your receipt...</p>
              </div>
            ) : receiptData ? (
              <div className="space-y-6">
                <CO2Receipt data={receiptData} />
                <div className="flex justify-center">
                  <Button
                    onClick={reset}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    Scan Another Receipt
                  </Button>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
