import React, { useState, useRef, useEffect, useCallback } from 'react';
import { identifyGarbage, GarbageIdentificationResult } from '../services/geminiService';
import { IconCamera, IconArrowLeft, IconUpload, IconRecycle, IconTrash } from './Icons';
import { GarbageType } from '../types';

interface ScanPageProps {
  onScanComplete: (item: { 
    name: string;
    type: GarbageType;
    points: number;
    image: string;
    description?: string;
  }) => void;
  onBack: () => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ onScanComplete, onBack }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraInitializing, setIsCameraInitializing] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraReady(false);
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
        if (imagePreview) {
            if (streamRef.current) stopCamera();
            return;
        }

        setIsCameraInitializing(true);
        setIsCameraReady(false);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraReady(true);
            }
        } catch (err) {
            console.warn("Environment camera not found, trying default camera.", err);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraReady(true);
                }
            } catch (fallbackErr) {
                setError("Could not access camera. Please ensure permissions are granted.");
                console.error("Error accessing camera:", fallbackErr);
            }
        } finally {
            setIsCameraInitializing(false);
        }
    };

    startCamera();

    return () => {
        stopCamera();
    };
  }, [imagePreview, stopCamera]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      stopCamera();
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const base64Data = imagePreview.split(',')[1];
      const result = await identifyGarbage(base64Data);
      
      // Map the API response to the expected format
      onScanComplete({
          name: result.itemName,
          type: result.garbageType,
          points: result.points,
          image: imagePreview,
          description: result.description
      });

      onBack();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
      fileInputRef.current?.click();
  };
  
  const resetScan = () => {
      setImagePreview(null);
      setError(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
        setIsCapturing(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImagePreview(dataUrl);
            stopCamera();
        }
        setTimeout(() => setIsCapturing(false), 100);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="absolute top-4 left-4 z-20">
        <button onClick={onBack} className="p-2 rounded-full bg-black bg-opacity-40 text-white hover:bg-opacity-60 transition">
            <IconArrowLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 relative flex justify-center items-center overflow-hidden">
        <div className="w-full h-full">
            {imagePreview ? (
              <img src={imagePreview} alt="Garbage preview" className="w-full h-full object-contain" />
            ) : (
              <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
              />
            )}
        </div>

        {isCapturing && <div className="absolute inset-0 bg-white opacity-70 animate-pulse"></div>}

        {!imagePreview && isCameraInitializing && !error && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <p className="text-white">Starting camera...</p>
            </div>
        )}
      </div>

      <div className="p-4 bg-black bg-opacity-30">
        {error && <p className="text-red-400 text-center mb-4 font-medium">{error}</p>}
        
        {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                <p className="text-white mt-4 text-lg font-semibold">Analyzing...</p>
            </div>
        )}

        <div className="w-full flex justify-center items-center">
          {imagePreview ? (
              <div className="flex w-full items-center justify-around">
                  <button
                      onClick={resetScan}
                      disabled={isLoading}
                      className="flex flex-col items-center text-white font-medium disabled:opacity-50"
                  >
                      <div className="w-16 h-16 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center transition shadow-md">
                          <IconTrash className="h-7 w-7" />
                      </div>
                      <span className="mt-2">Retake</span>
                  </button>
                  <button
                      onClick={handleIdentify}
                      disabled={isLoading}
                      className="flex flex-col items-center text-white font-medium disabled:opacity-50"
                  >
                      <div className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-transform transform hover:scale-105 shadow-lg">
                         <IconRecycle className="h-10 w-10"/>
                      </div>
                       <span className="mt-2">{isLoading ? 'Identifying...' : 'Identify'}</span>
                  </button>
              </div>
          ) : (
            <div className="flex w-full items-center justify-around">
                <div className="w-16 h-16"></div> 
                <button
                    onClick={handleCapture}
                    disabled={!isCameraReady || isLoading || !!error}
                    className="w-20 h-20 rounded-full bg-white p-1 flex items-center justify-center transition-transform transform active:scale-90 shadow-lg disabled:opacity-50 disabled:scale-100"
                    aria-label="Capture image"
                >
                  <div className="w-full h-full rounded-full border-4 border-black"></div>
                </button>
                <button
                    onClick={triggerFileInput}
                    disabled={isLoading}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-70 disabled:opacity-50"
                    aria-label="Upload from library"
                >
                    <IconUpload className="h-7 w-7 text-white" />
                </button>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default ScanPage;