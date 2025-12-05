import React from 'react';
import { ShieldAlert, ShieldCheck, Info, CheckCircle, Copy, Check } from 'lucide-react';
import { AuditResponse } from '../types';

interface AuditResultCardProps {
  result: AuditResponse;
}

export const AuditResultCard: React.FC<AuditResultCardProps> = ({ result }) => {
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
    <div className="space-y-6 animate-fade-in-up">
      {/* Status Header */}
      <div className={`p-4 rounded-xl border flex items-start gap-4 ${
        hasIssues 
          ? 'bg-amber-50 border-amber-200 text-amber-900' 
          : 'bg-green-50 border-green-200 text-green-900'
      }`}>
        <div className={`p-2 rounded-full ${hasIssues ? 'bg-amber-100' : 'bg-green-100'}`}>
          {hasIssues ? <ShieldAlert className="w-6 h-6 text-amber-600" /> : <ShieldCheck className="w-6 h-6 text-green-600" />}
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">
            {hasIssues ? 'Potential Issues Detected' : 'Content Looks Safe'}
          </h3>
          <p className="opacity-90">
            {hasIssues 
              ? `We found ${result.issues.length} potential concern${result.issues.length > 1 ? 's' : ''} in your content that may violate responsible AI principles.`
              : 'No significant issues found related to fairness, safety, or neutrality.'}
          </p>
        </div>
      </div>

      {/* Issues List */}
      {hasIssues && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" />
              Detailed Analysis
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {result.issues.map((issue, index) => (
              <div key={index} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                    {issue.category}
                  </span>
                </div>
                <h4 className="font-medium text-slate-900 mb-1">"{issue.concern}"</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{issue.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revised Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Suggested Revision
          </h3>
        </div>
        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 italic leading-relaxed whitespace-pre-wrap">
            {result.revisedContent}
          </div>
          <div className="mt-4 flex justify-end">
             <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Revision
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
