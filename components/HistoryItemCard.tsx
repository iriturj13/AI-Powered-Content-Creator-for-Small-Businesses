import React from 'react';
import { Clock, PenTool, ShieldCheck, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryItemCardProps {
  item: HistoryItem;
  onRestore: (item: HistoryItem) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ 
  item, 
  onRestore, 
  selectable = false,
  selected = false,
  onToggleSelection 
}) => {
  const date = new Date(item.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const isGenerate = item.type === 'generate';
  const showCheckbox = selectable && isGenerate;
  
  // Helper to extract a summary title
  const getTitle = () => {
    if (isGenerate) {
      return item.data.formData?.businessName || "Marketing Campaign";
    }
    return "Safety Audit Report";
  };

  // Helper to extract snippet
  const getSnippet = () => {
    if (isGenerate) {
      return `${item.data.formData?.productName} - ${item.data.formData?.goal}`;
    }
    const issuesCount = item.data.auditResult?.issues.length || 0;
    const safeText = issuesCount === 0 ? "No issues found." : `${issuesCount} potential issues identified.`;
    return `${safeText} "${item.data.auditInput?.substring(0, 50)}..."`;
  };

  return (
    <div className={`bg-white rounded-lg border p-4 transition-all duration-200 group relative
        ${selected 
            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30' 
            : 'border-slate-200 hover:shadow-md hover:border-slate-300'}
    `}>
      <div className="flex items-start gap-4">
        {showCheckbox && (
            <div className="pt-1">
                <input 
                    type="checkbox" 
                    checked={selected}
                    onChange={() => onToggleSelection && onToggleSelection(item.id)}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
            </div>
        )}

        <div className="flex-grow flex items-start justify-between gap-4">
          <div className="flex items-start gap-3" onClick={() => showCheckbox && onToggleSelection && onToggleSelection(item.id)}>
            <div className={`p-2 rounded-full shrink-0 ${isGenerate ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
              {isGenerate ? <PenTool className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className={showCheckbox ? "cursor-pointer" : ""}>
              <h4 className="font-medium text-slate-800">{getTitle()}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-2">
                <Clock className="w-3 h-3" /> {date}
              </p>
              <p className="text-sm text-slate-600 line-clamp-2">{getSnippet()}</p>
            </div>
          </div>
          
          <button
            onClick={() => onRestore(item)}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors flex items-center gap-1 shrink-0"
          >
            View <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};