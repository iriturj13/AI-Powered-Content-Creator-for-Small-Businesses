import React from 'react';
import { ShieldAlert, ShieldCheck, Info, CheckCircle, Copy, Check, Quote } from 'lucide-react';
import { AuditResponse } from '../types';

interface AuditResultCardProps {
  result: AuditResponse;
  originalText?: string;
}

export const AuditResultCard: React.FC<AuditResultCardProps> = ({ result, originalText }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.revisedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const hasIssues = result.issues.length > 0;

  return (
    <div className="space-y-6 animate-fade-in-up bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      
      {originalText && (
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
             <Quote className="w-3 h-3" /> Original Text
          </h4>
          <p className="text-slate-900 text-sm italic line-clamp-3">"{originalText}"</p>
        </div>
      )}

      {/* Status Header */}
      <div className={`mx-4 mt-4 p-4 rounded-lg border flex items-start gap-4 ${
        hasIssues 
          ? 'bg-orange-50 border-orange-200 text-orange-800' 
          : 'bg-green-50 border-green-200 text-green-800'
      }`}>
        <div className={`p-2 rounded-full flex-shrink-0 ${hasIssues ? 'bg-orange-100' : 'bg-green-100'}`}>
          {hasIssues ? <ShieldAlert className="w-6 h-6 text-orange-600" /> : <ShieldCheck className="w-6 h-6 text-green-600" />}
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">
            {hasIssues ? 'Potential Issues Detected' : 'Content Looks Safe'}
          </h3>
          <p className="opacity-90 text-sm">
            {hasIssues 
              ? `We found ${result.issues.length} potential concern${result.issues.length > 1 ? 's' : ''}.`
              : 'No significant issues found based on our safety guidelines.'}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Issues List */}
        {hasIssues && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
              <h3 className="font-medium text-slate-800 flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-indigo-600" />
                Analysis
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {result.issues.map((issue, index) => (
                <div key={index} className="p-4 hover:bg-slate-50 transition-colors bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide border border-slate-200">
                      {issue.category}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900 text-sm mb-1">"{issue.concern}"</p>
                  <p className="text-slate-600 text-xs leading-relaxed">{issue.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revised Content */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-medium text-slate-800 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Suggested Revision
            </h3>
          </div>
          <div className="p-4 bg-white">
            <div className="bg-white p-3 rounded-md border border-slate-200 text-slate-900 italic text-sm leading-relaxed whitespace-pre-wrap">
              {result.revisedContent}
            </div>
            <div className="mt-3 flex justify-end">
               <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border shadow-sm font-medium text-xs transition-all duration-200 ${
                  copied 
                    ? 'bg-green-600 text-white border-transparent' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};