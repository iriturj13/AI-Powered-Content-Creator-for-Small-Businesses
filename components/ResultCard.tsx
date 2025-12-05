import React, { useState } from 'react';
import { Copy, Check, Hash, Instagram, Image as ImageIcon } from 'lucide-react';
import { GeneratedCaption } from '../types';

interface ResultCardProps {
  option: GeneratedCaption;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ option, index }) => {
  const [copied, setCopied] = useState(false);

  const fullText = `${option.title}\n\n${option.caption}\n\n${option.hashtags.join(' ')}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="bg-white px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-medium text-slate-800 flex items-center gap-2">
          {/* Keep Instagram pink as it's the brand color */}
          <Instagram className="w-5 h-5 text-pink-600" />
          Option {index + 1}
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {option.caption.length} chars
        </span>
      </div>

      {option.imageBase64 && (
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 border-b border-slate-100 group">
            <img 
                src={`data:image/png;base64,${option.imageBase64}`} 
                alt={option.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> AI Generated
            </div>
        </div>
      )}
      
      <div className="p-5 flex-grow space-y-5">
        <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Title Strategy</h4>
            <p className="font-medium text-slate-900 text-lg">{option.title}</p>
        </div>
        
        <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Caption</h4>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{option.caption}</p>
        </div>

        <div>
           <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1">
             <Hash className="w-3 h-3" /> Hashtags
           </h4>
           <div className="flex flex-wrap gap-1.5">
             {option.hashtags.map((tag, i) => (
               <span key={i} className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                 {tag}
               </span>
             ))}
           </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-sm ${
            copied 
              ? 'bg-green-600 text-white border border-transparent' 
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Caption
            </>
          )}
        </button>
      </div>
    </div>
  );
};