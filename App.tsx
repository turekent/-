import React, { useState, useCallback, useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { AppStep, EditMode, InputType, ProcessConfig, PresetItem } from './types';
import { Shirt, Scissors, Wand2, RefreshCw, ArrowLeft, Download, Share2, AlertCircle, Sparkles, X, Loader2, PenLine, ZoomIn, User } from 'lucide-react';
import { CLOTHES_PRESETS, HAIR_PRESETS } from './constants';
import { generateTryOnImage, analyzeImage } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD_USER);
  const [userImage, setUserImage] = useState<string | null>(null);
  
  // Configuration State
  const [editMode, setEditMode] = useState<EditMode>(EditMode.CLOTHING);
  const [inputType, setInputType] = useState<InputType>(InputType.PRESET);
  const [textDescription, setTextDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');
  
  // Result State
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Reset description when mode changes to avoid stale descriptions
  useEffect(() => {
    if (inputType === InputType.IMAGE && !referenceImage) {
        setTextDescription('');
    }
  }, [editMode, inputType]);

  // Filter Presets
  const currentPresets = (editMode === EditMode.CLOTHING ? CLOTHES_PRESETS : HAIR_PRESETS)
    .filter(p => p.gender === selectedGender || p.gender === 'unisex');

  const handleUserImageSelect = (base64: string) => {
    setUserImage(base64);
  };

  const handleReferenceImageSelect = async (base64: string) => {
    setReferenceImage(base64);
    
    // Trigger auto-analysis if in Image Input mode
    if (inputType === InputType.IMAGE) {
        setIsAnalyzing(true);
        setTextDescription(''); // Clear previous
        try {
            const description = await analyzeImage(base64, editMode);
            setTextDescription(description);
        } catch (err) {
            console.error("Analysis failed", err);
            // Don't block user, just let them type manually if they want
        } finally {
            setIsAnalyzing(false);
        }
    }
  };

  const handleStartConfig = () => {
    if (userImage) setStep(AppStep.CONFIGURATION);
  };

  const handlePresetSelect = (item: PresetItem) => {
    setSelectedPresetId(item.id);
    setTextDescription(item.description); // Use preset description as text prompt backup
  };

  const handleGenerate = async () => {
    if (!userImage) return;

    setIsGenerating(true);
    setError(null);
    setStep(AppStep.PROCESSING);

    try {
      const config: ProcessConfig = {
        userImage,
        mode: editMode,
        inputType,
        referenceImage: referenceImage || undefined,
        textDescription,
        presetId: selectedPresetId || undefined,
      };

      const result = await generateTryOnImage(config);
      setResultImage(result);
      setStep(AppStep.RESULT);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "生成失败，请重试");
      setStep(AppStep.CONFIGURATION); // Go back to config on error
    } finally {
      setIsGenerating(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!resultImage) return;

    try {
      // Convert base64 to Blob
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const file = new File([blob], "mirror-ai-style.png", { type: "image/png" });

      // Check if Web Share API is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'MirrorAI 试衣间',
          text: '看看我的AI新造型！',
          files: [file],
        });
      } else {
        // Fallback: Download
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = `mirror-ai-${Date.now()}.png`;
        link.click();
        alert("已保存图片到相册，请打开微信/QQ分享给朋友");
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Simple fallback if sharing is cancelled or fails
    }
  };

  const resetApp = () => {
    setStep(AppStep.UPLOAD_USER);
    setUserImage(null);
    setResultImage(null);
    setReferenceImage(null);
    setTextDescription('');
    setSelectedPresetId(null);
    setIsZoomed(false);
  };

  // Renders
  const renderUploadStep = () => (
    <div className="max-w-lg mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">上传你的照片</h2>
        <p className="text-slate-500 text-base leading-relaxed">
          为了获得最佳效果，请上传一张光线充足、<br/>
          五官清晰的全身或半身正面照。
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 mb-8">
        <ImageUploader 
          label="人物照片" 
          onImageSelected={handleUserImageSelect} 
          aspectRatio="aspect-[3/4]"
        />
      </div>

      <Button 
        fullWidth 
        disabled={!userImage} 
        onClick={handleStartConfig}
        className="h-14 text-lg shadow-xl shadow-brand-500/30 rounded-2xl"
      >
        下一步：选择款式
      </Button>

      {/* Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 bg-slate-100/50 py-2 rounded-full mx-auto max-w-xs">
          <AlertCircle size={12} />
          照片仅用于实时生成，处理完立即销毁
        </p>
      </div>
    </div>
  );

  const renderConfigStep = () => (
    <div className="max-w-screen-md mx-auto px-4 py-6 pb-32 animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center mb-6 sticky top-[60px] z-30 bg-slate-50/95 backdrop-blur py-2">
         <button onClick={() => setStep(AppStep.UPLOAD_USER)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 bg-white rounded-full shadow-sm border border-slate-100">
            <ArrowLeft size={20} />
         </button>
         <h2 className="text-xl font-bold text-slate-900 ml-3">定制你的形象</h2>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl mb-8 shadow-sm border border-slate-100">
        <button 
          onClick={() => { setEditMode(EditMode.CLOTHING); setInputType(InputType.PRESET); setTextDescription(''); setSelectedPresetId(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200
            ${editMode === EditMode.CLOTHING ? 'bg-brand-50 text-brand-600 shadow-sm ring-1 ring-brand-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Shirt size={18} /> 换衣服
        </button>
        <button 
          onClick={() => { setEditMode(EditMode.HAIR); setInputType(InputType.PRESET); setTextDescription(''); setSelectedPresetId(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200
            ${editMode === EditMode.HAIR ? 'bg-secondary-50 text-secondary-600 shadow-sm ring-1 ring-secondary-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Scissors size={18} /> 换发型
        </button>
      </div>

      {/* Input Method Tabs */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar items-center">
        {[
            { id: InputType.PRESET, label: '推荐模板' },
            { id: InputType.IMAGE, label: '上传图片' },
            { id: InputType.TEXT, label: '文字描述' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setInputType(tab.id as InputType)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm
                    ${inputType === tab.id 
                        ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-1' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                    }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-5 shadow-lg shadow-slate-200/50 min-h-[400px]">
        
        {inputType === InputType.PRESET && (
          <>
            {/* Gender Filter */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-slate-100 p-1 rounded-full">
                <button 
                  onClick={() => setSelectedGender('female')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedGender === 'female' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  女士
                </button>
                <button 
                  onClick={() => setSelectedGender('male')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedGender === 'male' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  男士
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {currentPresets.map(preset => (
                <div 
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 aspect-[3/4]
                      ${selectedPresetId === preset.id 
                          ? 'ring-4 ring-brand-500 ring-offset-2 shadow-xl transform scale-[1.02]' 
                          : 'ring-1 ring-slate-200 hover:ring-brand-300 hover:shadow-md'
                      }
                  `}
                >
                  <img src={preset.imageUrl} alt={preset.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8 flex flex-col justify-end h-3/4">
                      <p className="text-white font-bold text-sm leading-tight mb-1">{preset.name}</p>
                      {selectedPresetId === preset.id && (
                          <p className="text-white/80 text-[10px] line-clamp-3 animate-in fade-in leading-relaxed">
                              {preset.description}
                          </p>
                      )}
                  </div>
                  {/* Selected Indicator */}
                  {selectedPresetId === preset.id && (
                      <div className="absolute top-3 right-3 bg-brand-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in">
                          <Sparkles size={12} fill="currentColor" />
                      </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {inputType === InputType.IMAGE && (
          <div className="max-w-sm mx-auto">
             <p className="text-sm text-slate-500 mb-5 text-center bg-slate-50 py-2 rounded-lg">
                {editMode === EditMode.CLOTHING ? '上传你想试穿的衣服照片或模特图。' : '上传你想尝试的发型参考图。'}
             </p>
             <ImageUploader 
                label={editMode === EditMode.CLOTHING ? "衣服/模特图" : "发型参考图"}
                onImageSelected={handleReferenceImageSelect}
                aspectRatio="aspect-square"
             />

             {/* AI Description & Confirmation Section */}
             {(referenceImage || isAnalyzing) && (
                <div className="mt-6 pt-6 border-t border-dashed border-slate-200 animate-in fade-in">
                    <div className="flex items-center justify-between mb-3">
                         <label className="text-sm font-bold text-brand-600 flex items-center gap-2">
                             <Sparkles size={16} /> 
                             AI 细节分析 (可修改)
                         </label>
                         {isAnalyzing && (
                             <div className="flex items-center gap-1.5 text-xs text-brand-500 font-medium bg-brand-50 px-2 py-1 rounded-full">
                                 <Loader2 size={12} className="animate-spin" /> 深度解析中...
                             </div>
                         )}
                    </div>
                    
                    <div className="relative group">
                        <textarea
                            className="w-full p-4 text-sm text-slate-700 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-all leading-relaxed shadow-inner min-h-[120px]"
                            rows={5}
                            placeholder={isAnalyzing ? "AI正在分析..." : "请确认或修改AI识别到的特征..."}
                            value={textDescription}
                            onChange={(e) => setTextDescription(e.target.value)}
                            disabled={isAnalyzing}
                        />
                        {!isAnalyzing && textDescription && (
                            <div className="absolute bottom-3 right-3 text-slate-400 pointer-events-none bg-white/80 p-1 rounded-lg">
                                <PenLine size={16} />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 px-1">
                       * 描述越准确，{editMode === EditMode.CLOTHING ? '试穿' : '换发型'}效果越好。
                    </p>
                </div>
             )}
          </div>
        )}

        {inputType === InputType.TEXT && (
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                    {editMode === EditMode.CLOTHING ? "描述你想穿的衣服" : "描述你想要的发型"}
                </label>
                <textarea
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm min-h-[160px] shadow-inner bg-slate-50"
                    placeholder={editMode === EditMode.CLOTHING ? "例如：一件红色的丝绸晚礼服，露肩设计，高贵典雅..." : "例如：亚麻色的大波浪卷发，带有空气刘海，温柔知性..."}
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                />
            </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-2xl flex items-center gap-3 border border-red-100 shadow-sm">
              <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 w-full px-4 z-20 pointer-events-none">
          <div className="max-w-screen-md mx-auto pointer-events-auto">
             <Button 
                fullWidth 
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={
                    (inputType === InputType.IMAGE && (!referenceImage || isAnalyzing)) || // Wait for analysis
                    (inputType === InputType.TEXT && !textDescription.trim()) ||
                    (inputType === InputType.PRESET && !selectedPresetId)
                }
                className="shadow-2xl shadow-brand-500/40 h-16 text-lg font-bold rounded-2xl border-2 border-white/20 backdrop-blur-sm"
                icon={!isGenerating ? <Wand2 size={22} /> : undefined}
             >
                {isGenerating ? '正在生成...' : '立即生成'}
             </Button>
          </div>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in fade-in duration-500">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 animate-pulse-slow rounded-full"></div>
        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-brand-200 border border-white">
           <RefreshCw size={56} className="text-brand-500 animate-spin" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">正在施展魔法...</h2>
      <p className="text-slate-500 max-w-xs leading-relaxed">
        AI正在为你{editMode === EditMode.CLOTHING ? '量身试穿新衣' : '精心设计发型'}，<br/>
        大约需要 10-20 秒，请耐心等待。
      </p>
    </div>
  );

  // Comparison / Zoom Modal
  const renderZoomModal = () => {
     if (!isZoomed || !resultImage || !userImage) return null;

     // Dynamic style to focus on upper body for Hairstyle mode
     // "object-cover object-top" ensures the head is at the top and fills the width/height gracefully.
     const imgStyle = editMode === EditMode.HAIR 
        ? "object-cover object-top" 
        : "object-contain";

     return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
           {/* Toolbar */}
           <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-white/90 font-medium text-lg">
                  {editMode === EditMode.HAIR ? "发型细节对比" : "细节对比"}
              </span>
              <button 
                 onClick={() => setIsZoomed(false)}
                 className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
              >
                 <X size={24} />
              </button>
           </div>

           {/* Comparison View - Split Screen Left/Right */}
           <div className="flex-1 flex flex-row items-center justify-center overflow-hidden w-full h-full pt-16 pb-8 px-2 gap-1">
              {/* Original */}
              <div className="flex-1 h-full relative flex items-center justify-center bg-zinc-900 rounded-l-2xl overflow-hidden border-r border-white/10">
                 <img src={userImage} className={`w-full h-full transition-transform duration-300 ${imgStyle}`} alt="Original" />
                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-white text-xs font-bold border border-white/10 z-10">
                    原图
                 </div>
              </div>
              
              {/* Result */}
              <div className="flex-1 h-full relative flex items-center justify-center bg-zinc-900 rounded-r-2xl overflow-hidden">
                 <img src={resultImage} className={`w-full h-full transition-transform duration-300 ${imgStyle}`} alt="Result" />
                 <div className="absolute top-4 left-4 bg-brand-600/80 backdrop-blur px-3 py-1 rounded-lg text-white text-xs font-bold border border-white/10 z-10">
                    效果图
                 </div>
              </div>
           </div>
           
           <div className="text-center pb-6 text-white/50 text-xs">
              {editMode === EditMode.HAIR 
                 ? "已优化视角以展示头部细节" 
                 : "可双指缩放查看更多细节"}
           </div>
        </div>
     );
  };

  const renderResultStep = () => {
    const currentRefImage = (() => {
      if (inputType === InputType.PRESET && selectedPresetId) {
        const presets = editMode === EditMode.CLOTHING ? CLOTHES_PRESETS : HAIR_PRESETS;
        return presets.find(p => p.id === selectedPresetId)?.imageUrl;
      }
      if (inputType === InputType.IMAGE) {
        return referenceImage;
      }
      return null; 
    })();

    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 animate-in slide-in-from-right-8 duration-300">
        {renderZoomModal()}
        
        <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-slate-50/90 backdrop-blur py-2">
          <button onClick={() => setStep(AppStep.CONFIGURATION)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 bg-white rounded-full shadow-sm border border-slate-100">
             <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-900">生成结果</h2>
          <button onClick={resetApp} className="text-sm font-medium text-slate-500 hover:text-brand-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            重置
          </button>
        </div>

        {/* Result Image Card */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 mb-6">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer" onClick={() => setIsZoomed(true)}>
            {resultImage && (
                <img 
                    src={resultImage} 
                    alt="Result" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            )}
            
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition-all">
                <ZoomIn size={14} /> 点击放大对比细节
            </div>
            </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">原始照片</p>
              <div className="aspect-square w-20 h-20 rounded-xl overflow-hidden bg-slate-100 ring-4 ring-slate-50">
                 {userImage && <img src={userImage} className="w-full h-full object-cover" alt="Original" />}
              </div>
           </div>
           
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
               <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">参考样式</p>
               {currentRefImage ? (
                   <div className="aspect-square w-20 h-20 rounded-xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 relative group">
                      <img src={currentRefImage} className="w-full h-full object-cover" alt="Reference" />
                   </div>
               ) : (
                   <div className="aspect-square w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 text-xs text-center p-2">
                       文字描述
                   </div>
               )}
           </div>
        </div>
        
        {inputType === InputType.IMAGE && textDescription && (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-8 mx-1">
                <div className="flex items-center gap-2 mb-2 text-brand-600 text-xs font-bold uppercase tracking-wide">
                    <Sparkles size={12} /> AI 描述
                </div>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {textDescription}
                </p>
            </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 px-2">
           <Button 
              variant="secondary" 
              fullWidth 
              icon={<Share2 size={20} />}
              className="h-14 rounded-2xl shadow-lg shadow-secondary-500/20"
              onClick={handleShare}
           >
              发送给朋友 (分享)
           </Button>
           <Button 
              variant="primary" 
              fullWidth 
              icon={<RefreshCw size={20} />}
              className="h-14 rounded-2xl shadow-lg shadow-brand-500/20"
              onClick={() => setStep(AppStep.CONFIGURATION)}
           >
              再试一次
           </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10 selection:bg-brand-100 selection:text-brand-900">
      <AppHeader />
      <main className="pt-4">
        {step === AppStep.UPLOAD_USER && renderUploadStep()}
        {step === AppStep.CONFIGURATION && renderConfigStep()}
        {step === AppStep.PROCESSING && renderProcessingStep()}
        {step === AppStep.RESULT && renderResultStep()}
      </main>
    </div>
  );
};

export default App;