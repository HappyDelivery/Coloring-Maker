import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, RefreshCcw, Sliders, ArrowLeft, Wand2 } from 'lucide-react';
import { processImageToSketch } from '../utils/imageProcessing';

interface ProcessingEditorProps {
  imageFile: File;
  onReset: () => void;
}

const ProcessingEditor: React.FC<ProcessingEditorProps> = ({ imageFile, onReset }) => {
  // Sliders
  const [thickness, setThickness] = useState<number>(10);      // Line Thickness
  const [cleanliness, setCleanliness] = useState<number>(85);  // Cleanliness (Default higher for better first impression)
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Load original image
  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setOriginalImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Process image function
  const applyEffect = useCallback(() => {
    if (!originalImageUrl || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size (limit max size for performance)
      const MAX_WIDTH = 1200;
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;
        width = MAX_WIDTH;
        height = img.height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original temporarily
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Process
      setTimeout(() => {
        if (ctx) {
            processImageToSketch(ctx, width, height, thickness, cleanliness);
        }
        setIsProcessing(false);
      }, 50);
    };
    
    img.src = originalImageUrl;
  }, [originalImageUrl, thickness, cleanliness]);

  // Trigger processing when image loads or slider changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      applyEffect();
    }, 150);
    return () => clearTimeout(timer);
  }, [applyEffect]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = '나만의_색칠공부_도안.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
      <button 
        onClick={onReset}
        className="mb-8 px-5 py-2 bg-white rounded-full shadow-sm flex items-center text-gray-500 hover:text-pastelPink transition-all font-bold border-2 border-transparent hover:border-pastelPink"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        다른 사진 고르기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Section (Left Side) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-[2rem] shadow-lg border-b-8 border-pastelBlue/20 sticky top-6">
            <h3 className="text-2xl font-bold text-gray-700 mb-8 flex items-center">
              <span className="p-2 bg-pastelBlue/20 rounded-xl mr-3">
                <Sliders className="w-6 h-6 text-pastelBlue" />
              </span>
              도안 꾸미기
            </h3>

            {/* Slider 1: Line Thickness */}
            <div className="mb-8">
              <label className="flex items-center text-gray-600 font-bold mb-3 text-lg">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-2">🖊️</span>
                선 두께
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-full mb-2 accent-pastelBlue"
                />
                <div className="flex justify-between text-sm text-gray-400 font-bold px-1">
                  <span>얇게</span>
                  <span>두껍게</span>
                </div>
              </div>
            </div>

            {/* Slider 2: Cleanliness */}
            <div className="mb-8">
              <label className="flex items-center text-gray-600 font-bold mb-3 text-lg">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-2">✨</span>
                깔끔하게
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cleanliness}
                  onChange={(e) => setCleanliness(Number(e.target.value))}
                  className="w-full mb-2 accent-pastelPink"
                />
                <div className="flex justify-between text-sm text-gray-400 font-bold px-1">
                  <span>원본처럼</span>
                  <span>하얗게</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-pastelBlue hover:bg-pastelBlueHover text-white text-xl rounded-2xl font-bold shadow-md border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
              >
                <Download className="w-6 h-6 mr-3" />
                도안 저장하기
              </button>
              
              <button
                onClick={applyEffect}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-white border-2 border-gray-100 text-gray-500 hover:bg-gray-50 text-lg rounded-2xl font-bold transition-all flex items-center justify-center"
              >
                <RefreshCcw className={`w-5 h-5 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? '변환 중...' : '다시 그리기'}
              </button>
            </div>

            {/* Tip Box - Improved Alignment */}
            <div className="mt-8 p-6 bg-pastelYellow/20 rounded-3xl border-2 border-pastelYellow/50">
              <h4 className="font-extrabold text-gray-700 mb-4 flex items-center text-xl">
                <span>💡</span> <span className="ml-2">꿀팁!</span>
              </h4>
              <ul className="text-gray-600 space-y-5">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-pastelPink text-white rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-sm mt-0.5">1</div>
                  <div className="flex flex-col">
                    <p className="font-bold text-gray-800 text-base tracking-tight leading-tight break-keep">
                      '깔끔하게'를 <span className="text-pastelBlue font-extrabold">80% 이상</span> 올리면
                    </p>
                    <p className="text-gray-500 font-bold text-sm mt-1 leading-tight break-keep">
                      회색 배경이 싹 사라져요!
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-pastelPink text-white rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-sm mt-0.5">2</div>
                  <div className="flex flex-col">
                    <p className="font-bold text-gray-800 text-base tracking-tight leading-tight break-keep">
                      선이 너무 얇나요?
                    </p>
                    <p className="text-gray-500 font-bold text-sm mt-1 leading-tight break-keep">
                      '선 두께'를 오른쪽으로 쓱쓱!
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Canvas Section (Right Side) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
           <div className="relative bg-white p-3 rounded-[2.5rem] shadow-xl border-[6px] border-white transform rotate-1 hover:rotate-0 transition-transform duration-500 ring-1 ring-gray-100">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-40 h-10 bg-pastelPink/20 rotate-1 rounded-sm backdrop-blur-sm z-20 border border-white/40"></div>
              
              <div className="overflow-hidden rounded-[2rem] bg-gray-50 relative min-h-[500px] flex items-center justify-center border-2 border-dashed border-gray-200">
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-20 h-20 border-8 border-pastelBlue/30 border-t-pastelBlue rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wand2 className="w-8 h-8 text-pastelPink animate-pulse" />
                      </div>
                    </div>
                    <p className="text-pastelBlue font-bold text-xl mt-6 animate-pulse">마법을 부리는 중... ✨</p>
                  </div>
                )}
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full h-auto object-contain mx-auto shadow-sm"
                />
              </div>
           </div>
           
           {originalImageUrl && (
             <div className="mt-8 flex justify-center">
               <div className="bg-white p-3 rounded-2xl shadow-md border-b-4 border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer group">
                 <p className="text-center text-sm text-gray-400 font-bold mb-2 group-hover:text-pastelBlue transition-colors">원본 사진</p>
                 <img src={originalImageUrl} alt="Original" className="h-32 rounded-xl object-cover ring-2 ring-gray-100" />
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingEditor;