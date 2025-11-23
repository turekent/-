import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Image as ImageIcon, X, SwitchCamera, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  label: string;
  onImageSelected: (base64: string) => void;
  aspectRatio?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelected, aspectRatio = 'aspect-[3/4]' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const nativeCameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      // Reset states
      setIsCameraOpen(false);
      setCameraError(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  // Paste event listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
             processFile(blob);
          }
          break; // Only process the first image found
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setCameraError(false);
    if (inputRef.current) inputRef.current.value = '';
    if (nativeCameraRef.current) nativeCameraRef.current.value = '';
  };

  // --- Camera Logic ---
  const startCamera = async () => {
    setCameraError(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      // Instead of auto-clicking (which is blocked in async context), show fallback UI
      setCameraError(true);
      // We still try to fallback if allowed, but usually this throws if user interaction is stale
      try {
         nativeCameraRef.current?.click();
      } catch (e) {
         // Ignore specific click error, UI will handle it
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setTimeout(() => startCamera(), 100);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPreview(dataUrl);
        onImageSelected(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      
      {preview ? (
        <div className={`relative w-full ${aspectRatio} bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 group`}>
          <img src={preview} alt="Preview" className="w-full h-full object-contain bg-black" />
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          className={`relative w-full ${aspectRatio} rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center p-6 cursor-pointer outline-none overflow-hidden
            ${isDragOver ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white hover:border-brand-300 hover:bg-slate-50'}
            ${cameraError ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {cameraError ? (
            <div className="text-center animate-in fade-in">
               <div className="bg-red-100 p-4 rounded-full mb-3 text-red-500 inline-flex">
                  <AlertCircle size={24} />
               </div>
               <p className="text-sm font-bold text-slate-900">无法直接调用摄像头</p>
               <p className="text-xs text-slate-500 mt-1 mb-4">可能是权限被拒绝或浏览器不支持</p>
               <Button 
                  variant="primary" 
                  className="text-xs py-2 bg-red-500 hover:bg-red-600 border-none shadow-none"
                  onClick={(e) => {
                     e.stopPropagation();
                     nativeCameraRef.current?.click();
                  }}
               >
                  使用系统相机/相册
               </Button>
            </div>
          ) : (
            <>
              <div className="bg-brand-50 p-4 rounded-full mb-3 text-brand-600">
                <Upload size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-900 text-center">点击、粘贴或拖拽上传</p>
              <p className="text-xs text-slate-500 text-center mt-1">支持 JPG, PNG</p>
            </>
          )}
          
          {/* Hidden Inputs */}
          <input 
              type="file" 
              ref={inputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
          />
          <input 
              type="file" 
              ref={nativeCameraRef} 
              className="hidden" 
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
          />
        </div>
      )}

      {/* Buttons Row */}
      {!preview && !cameraError && (
         <div className="mt-3 flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 py-2 text-xs" 
              icon={<Camera size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
            >
              拍摄全身照
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 py-2 text-xs" 
              icon={<ImageIcon size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              相册上传
            </Button>
         </div>
      )}

      {/* Camera Overlay Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in slide-in-from-bottom-10 duration-200">
           <div className="absolute top-4 right-4 z-20">
              <button onClick={stopCamera} className="text-white p-2 bg-white/10 rounded-full backdrop-blur">
                 <X size={24} />
              </button>
           </div>
           
           <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`w-full h-full object-contain ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-20 pb-safe">
                 <button 
                    onClick={switchCamera}
                    className="p-4 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition"
                 >
                    <SwitchCamera size={24} />
                 </button>
                 
                 <button 
                    onClick={takePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/20 transition active:scale-95"
                 >
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                 </button>

                 <div className="w-14"></div>
              </div>
           </div>
           <div className="bg-black text-white text-center py-2 text-xs pb-safe">
              请保持全身或半身在画面内
           </div>
        </div>
      )}
    </div>
  );
};