import React from 'react';
import { Sparkles, Share2 } from 'lucide-react';

export const AppHeader: React.FC = () => {
  
  const copyToClipboard = async (text: string) => {
    // 1. Try Modern API (Navigator Clipboard)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Navigator clipboard failed, trying fallback.', err);
      }
    }

    // 2. Fallback for Legacy Browsers / WebViews / Non-Secure Contexts
    // (Creates a hidden textarea to select and copy)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Ensure it's not visible but part of the DOM
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed', err);
      return false;
    }
  };

  const handleShareApp = async () => {
    const currentUrl = window.location.href;
    
    // Check if we are in a blob/preview environment
    if (currentUrl.startsWith('blob:')) {
      alert("⚠️ 当前处于预览模式，链接无法直接分享。\n\n请点击浏览器右上角的“在新标签页打开”或部署后，再使用分享功能。");
      return;
    }

    const marketingText = `变！变！变！ - 你的专属AI形象顾问 ✨\n一键试穿潮流新衣 👗，尝试百变发型 💇‍♀️！\n\n点击立即体验 👇\n${currentUrl}`;
    
    const success = await copyToClipboard(marketingText);

    if (success) {
        alert("APP链接已复制！\n快去粘贴分享给朋友吧~");
    } else {
        alert("自动复制失败，请点击浏览器右上角进行分享，或手动复制地址栏链接。");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-brand-500 to-purple-600 text-white p-1.5 rounded-lg shadow-sm">
            <Sparkles size={18} />
          </div>
          <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">
            变！变！变！
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleShareApp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-bold hover:bg-brand-100 transition-colors active:scale-95"
          >
            <Share2 size={14} />
            分享软件
          </button>
        </div>
      </div>
    </header>
  );
};