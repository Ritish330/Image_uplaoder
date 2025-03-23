import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionState(result.state);
      
      result.addEventListener('change', () => {
        setPermissionState(result.state);
        if (result.state === 'granted') {
          initializeCamera();
        }
      });
      
      return result.state;
    } catch (err) {
      console.error("Error checking camera permission:", err);
      return 'prompt';
    }
  };

  const initializeCamera = async () => {
    try {
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setError(null);
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Unable to access camera. ";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        const permission = await checkCameraPermission();
        if (permission === 'denied') {
          errorMessage = "Camera access was blocked. Please allow camera access in your browser settings and refresh the page.";
        } else if (permission === 'prompt') {
          errorMessage = "Camera permission was dismissed. Please click 'Try Again' to request camera access.";
        }
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera device found. Please connect a camera and try again.";
      } else if (err.name === 'NotReadableError') {
        errorMessage = "Camera is already in use by another application. Please close other applications using the camera and try again.";
      } else {
        errorMessage += "Please check your camera connection and try again.";
      }
      
      setError(errorMessage);
      setStream(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (isOpen) {
      (async () => {
        const permission = await checkCameraPermission();
        if (!mounted) return;

        if (permission === 'granted') {
          initializeCamera();
        } else if (permission === 'denied') {
          setError("Camera access is blocked. Please allow camera access in your browser settings and refresh the page.");
        } else {
          initializeCamera();
        }
      })();
    }
    
    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
      onClose();
    }
  };

  const handleRetry = async () => {
    const permission = await checkCameraPermission();
    
    if (permission === 'denied') {
      setError("Camera access is blocked. Please allow camera access in your browser settings and refresh the page.");
      return;
    }
    
    initializeCamera();
  };

  const getErrorInstructions = () => {
    if (permissionState === 'denied') {
      return (
        <ol className="text-sm text-white/80 text-left mt-4 space-y-2">
          <li>1. Click the camera icon in your browser's address bar</li>
          <li>2. Select "Allow" for camera access</li>
          <li>3. Refresh the page</li>
          <li>4. Try again</li>
        </ol>
      );
    } else if (permissionState === 'prompt') {
      return (
        <ol className="text-sm text-white/80 text-left mt-4 space-y-2">
          <li>1. Click the "Try Again" button below</li>
          <li>2. When prompted, click "Allow" to enable camera access</li>
        </ol>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-xl p-4 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Camera</h3>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-white mb-4">{error}</p>
                  {getErrorInstructions()}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleRetry}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {!error && stream && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleCapture}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};