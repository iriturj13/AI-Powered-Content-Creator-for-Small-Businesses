import React, { useState, useEffect } from 'react';
import { Sparkles, Coffee, AlertCircle, PenTool, ShieldCheck, History as HistoryIcon, Trash2, CheckSquare, Layers } from 'lucide-react';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { AuditResultCard } from './components/AuditResultCard';
import { HistoryItemCard } from './components/HistoryItemCard';
import { generateMarketingCopy, auditMarketingCopy, auditBatchMarketingCopy } from './services/geminiService';
import { getHistory, saveHistoryItem, clearHistory } from './services/historyService';
import { MarketingFormData, GeneratedCaption, AuditResponse, HistoryItem, AuditResultItem } from './types';

const INITIAL_DATA: MarketingFormData = {
  businessName: "The Daily Grind Coffee Shop",
  productName: "Maple Pecan Dream Latte",
  productDescription: "A rich espresso combined with steamed milk, sweet maple syrup, and a nutty pecan swirl, topped with a dollop of whipped cream and crushed pecans.",
  targetAudience: "Coffee enthusiasts, people looking for comforting and indulgent fall beverages, locals in the city.",
  goal: "Announce the new latte on Instagram, generate excitement, and encourage customers to visit to try it.",
  hashtags: "#MaplePecanLatte #FallVibes #CozyDrinks #CoffeeLover #TheDailyGrind #NewDrinkAlert",
  city: "Seattle"
};

type AppMode = 'generate' | 'audit' | 'history' | 'bulk-results';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('generate');
  
  // Generation State
  const [formData, setFormData] = useState<MarketingFormData>(INITIAL_DATA);
  const [genResults, setGenResults] = useState<GeneratedCaption[] | null>(null);
  
  // Audit State
  const [auditInput, setAuditInput] = useState<string>("Attention all coffee lovers! ☕️ Our new 'Vibe Coffee' blend is the perfect pick-me-up. Made for busy professionals who need to power through their day. Get yours now and join the elite club of high-achievers! #CoffeeLife #ProductivityHacks #EliteStatus");
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [bulkAuditResults, setBulkAuditResults] = useState<AuditResultItem[] | null>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<Set<string>>(new Set());

  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGenResults(null);

    try {
      const response = await generateMarketingCopy(formData);
      setGenResults(response.options);

      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        type: 'generate',
        timestamp: Date.now(),
        data: {
          formData: { ...formData }, // Clone to avoid ref issues
          genResults: response.options
        }
      };
      saveHistoryItem(newItem);
      setHistoryItems(prev => [newItem, ...prev]);

    } catch (err) {
      setError("Failed to generate content. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditInput.trim()) return;
    
    setLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const response = await auditMarketingCopy(auditInput);
      setAuditResult(response);

      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        type: 'audit',
        timestamp: Date.now(),
        data: {
          auditInput: auditInput,
          auditResult: response
        }
      };
      saveHistoryItem(newItem);
      setHistoryItems(prev => [newItem, ...prev]);

    } catch (err) {
      setError("Failed to audit content. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    if (item.type === 'generate') {
      if (item.data.formData) setFormData(item.data.formData);
      if (item.data.genResults) setGenResults(item.data.genResults);
      setMode('generate');
    } else if (item.type === 'audit') {
      if (item.data.auditInput) setAuditInput(item.data.auditInput);
      if (item.data.auditResult) setAuditResult(item.data.auditResult);
      setMode('audit');
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHistorySelection = (id: string) => {
    setSelectedHistoryIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkAudit = async () => {
    if (selectedHistoryIds.size === 0) return;

    setLoading(true);
    setError(null);
    setBulkAuditResults(null);
    setMode('bulk-results');

    // Gather all captions from selected history items
    const allCaptions: string[] = [];
    historyItems.forEach(item => {
      if (selectedHistoryIds.has(item.id) && item.type === 'generate' && item.data.genResults) {
        item.data.genResults.forEach(res => {
          allCaptions.push(res.caption);
        });
      }
    });

    if (allCaptions.length === 0) {
      setError("No valid captions found in selected items.");
      setLoading(false);
      return;
    }

    // Limit to reasonable amount to prevent huge prompt
    const captionsToAudit = allCaptions.slice(0, 15); 

    try {
      const results = await auditBatchMarketingCopy(captionsToAudit);
      setBulkAuditResults(results);
    } catch (err) {
      setError("Failed to perform bulk audit. Please check API limits and try again.");
      setMode('history'); // Go back on error
    } finally {
      setLoading(false);
      setSelectedHistoryIds(new Set()); // Clear selection
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      clearHistory();
      setHistoryItems([]);
      setSelectedHistoryIds(new Set());
    }
  };

  // Base input class - ensuring bg-white to prevent dark/transparent issues
  const inputClass = "w-full bg-white text-slate-900 rounded-md border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400";
  const textareaClass = "w-full bg-white text-slate-900 rounded-md border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none placeholder-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMode('generate')}>
            {/* Logo Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-sm">
               <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-medium text-slate-700 hidden sm:block">
              Social<span className="font-bold text-indigo-600">Sip</span>
            </h1>
          </div>
          
          <div className="flex space-x-1 bg-transparent">
            <button
              onClick={() => setMode('generate')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                mode === 'generate' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Generate</span>
            </button>
            <button
              onClick={() => setMode('audit')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                mode === 'audit' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Audit</span>
            </button>
            <button
              onClick={() => setMode('history')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                mode === 'history' || mode === 'bulk-results' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Input Forms */}
        {(mode === 'generate' || mode === 'audit') && (
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24">
              
              {mode === 'generate' ? (
                <>
                  <h2 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-indigo-600" />
                    Campaign Details
                  </h2>
                  
                  <form onSubmit={handleGenSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="For local hashtags"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Product Description</label>
                      <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleInputChange}
                        rows={4}
                        className={textareaClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                      <textarea
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        rows={2}
                        className={textareaClass}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Goal</label>
                      <textarea
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        rows={2}
                        className={textareaClass}
                      />
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        isLoading={loading}
                        variant="primary"
                      >
                        {loading ? 'Thinking...' : 'Generate Captions'}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Audit Content
                  </h2>
                  <div className="p-3 bg-indigo-50 text-indigo-800 text-xs rounded mb-4 leading-relaxed border border-indigo-100">
                    The AI Auditor evaluates content for fairness, safety, and neutrality, helping you avoid bias or misleading claims.
                  </div>
                  <form onSubmit={handleAuditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Content to Analyze</label>
                      <textarea
                        value={auditInput}
                        onChange={(e) => setAuditInput(e.target.value)}
                        rows={12}
                        placeholder="Paste your marketing copy here..."
                        className={textareaClass}
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        isLoading={loading}
                        variant="primary"
                      >
                        {loading ? 'Auditing...' : 'Audit Content'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right Column: Results OR Full History View */}
        <div className={mode === 'history' || mode === 'bulk-results' ? 'col-span-1 lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'}>
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200 mb-6 shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* History View */}
          {mode === 'history' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4">
                     <h2 className="text-2xl font-normal text-slate-800 flex items-center gap-2">
                        <HistoryIcon className="w-6 h-6 text-indigo-600" />
                        Activity History
                     </h2>
                     {selectedHistoryIds.size > 0 && (
                        <div className="flex items-center gap-2 animate-fade-in">
                            <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                                {selectedHistoryIds.size} selected
                            </span>
                            <Button variant="primary" onClick={handleBulkAudit} className="!py-1.5 !px-3 !text-sm flex items-center gap-2 !rounded-full">
                                <ShieldCheck className="w-4 h-4" /> Audit Selected
                            </Button>
                        </div>
                     )}
                 </div>
                 {historyItems.length > 0 && (
                    <button 
                      onClick={handleClearHistory}
                      className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-full transition-colors flex items-center gap-2 font-medium"
                    >
                       <Trash2 className="w-4 h-4" /> Clear History
                    </button>
                 )}
              </div>

              {historyItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                    <HistoryIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No history yet</h3>
                  <p className="text-slate-500 max-w-sm mb-6 text-sm">
                    Your generated captions and audits will appear here. Start by creating something!
                  </p>
                  <Button variant="primary" onClick={() => setMode('generate')}>
                    Create New Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedHistoryIds.size === 0 && (
                    <div className="text-sm text-slate-500 mb-2 flex items-center gap-2 bg-indigo-50 p-2 rounded border border-indigo-100">
                        <CheckSquare className="w-4 h-4 text-indigo-600" /> Select multiple items to perform a bulk safety audit.
                    </div>
                  )}
                  {historyItems.map((item) => (
                    <HistoryItemCard 
                      key={item.id} 
                      item={item} 
                      onRestore={handleRestoreHistory} 
                      selectable={true}
                      selected={selectedHistoryIds.has(item.id)}
                      onToggleSelection={handleToggleHistorySelection}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bulk Audit Results View */}
          {mode === 'bulk-results' && (
             <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-normal text-slate-800 flex items-center gap-2 mb-2">
                            <Layers className="w-6 h-6 text-indigo-600" />
                            Bulk Audit Results
                        </h2>
                        <p className="text-slate-500">
                            Analysis for captions from selected history items.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setMode('history')}>
                        Back to History
                    </Button>
                </div>

                {loading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 h-[300px] flex flex-col gap-4 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-24 bg-slate-200 rounded w-full mt-4"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/2 mt-auto"></div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {bulkAuditResults?.map((result, idx) => (
                            <AuditResultCard key={idx} result={result} originalText={result.originalText} />
                        ))}
                    </div>
                )}
             </div>
          )}

          {/* Empty States for Generate/Audit */}
          {!loading && !error && mode !== 'history' && mode !== 'bulk-results' && (
            <>
              {mode === 'generate' && !genResults && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-lg bg-white">
                  <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">Ready to Create?</h3>
                  <p className="text-slate-500 max-w-sm">
                    Fill out the details on the left and hit generate to see 3 unique, engaging Instagram captions powered by AI.
                  </p>
                </div>
              )}

              {mode === 'audit' && !auditResult && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 rounded-lg bg-white">
                   <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">Responsible AI Auditor</h3>
                  <p className="text-slate-500 max-w-sm">
                    Paste your marketing copy on the left to check for bias, harmful language, or misleading claims.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Generate Results */}
          {mode === 'generate' && genResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
              {genResults.map((option, index) => (
                <div key={index} className="flex flex-col h-full">
                  <ResultCard option={option} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* Audit Results */}
          {mode === 'audit' && auditResult && (
            <div className="max-w-3xl mx-auto">
              <AuditResultCard result={auditResult} />
            </div>
          )}
          
          {/* Loading Skeleton */}
          {loading && (mode === 'generate' || mode === 'audit') && (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 h-[400px] flex flex-col gap-4 animate-pulse shadow-sm">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mt-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="mt-auto h-10 bg-slate-200 rounded w-full"></div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;