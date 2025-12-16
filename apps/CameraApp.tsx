import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

export const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or not available.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {error ? (
            <div className="text-white text-center">
                <p className="mb-4">{error}</p>
                <p className="text-sm text-gray-500">Please allow camera permissions in your browser.</p>
            </div>
        ) : (
            <>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="h-full w-full object-cover"
                />
                <div className="absolute bottom-8 w-full flex justify-center items-center gap-8">
                     <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-md">
                        <RefreshCw className="text-white" size={20} />
                     </div>
                     <div className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-lg cursor-pointer active:scale-95 transition-transform"></div>
                     <div className="w-12 h-12 bg-gray-800/50 rounded-full backdrop-blur-md"></div>
                </div>
            </>
        )}
    </div>
  );
};
