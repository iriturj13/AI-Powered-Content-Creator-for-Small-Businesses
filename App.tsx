import React, { useState } from 'react';
import { Sparkles, Coffee, AlertCircle, PenTool, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { AuditResultCard } from './components/AuditResultCard';
import { generateMarketingCopy, auditMarketingCopy } from './services/geminiService';
import { MarketingFormData, GeneratedCaption, AuditResponse } from './types';

const INITIAL_DATA: MarketingFormData = {
  businessName: "The Daily Grind Coffee Shop",
  productName: "Maple Pecan Dream Latte",
  productDescription: "A rich espresso combined with steamed milk, sweet maple syrup, and a nutty pecan swirl, topped with a dollop of whipped cream and crushed pecans.",
  targetAudience: "Coffee enthusiasts, people looking for comforting and indulgent fall beverages, locals in the city.",
  goal: "Announce the new latte on Instagram, generate excitement, and encourage customers to visit to try it.",
  hashtags: "#MaplePecanLatte #FallVibes #CozyDrinks #CoffeeLover #TheDailyGrind #NewDrinkAlert",
  city: "Seattle"
};

type AppMode = 'generate' | 'audit';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('generate');
  
  // Generation State
  const [formData, setFormData] = useState<MarketingFormData>(INITIAL_DATA);
  const [genResults, setGenResults] = useState<GeneratedCaption[] | null>(null);
  
  // Audit State
  const [auditInput, setAuditInput] = useState<string>("Attention all coffee lovers! ☕️ Our new 'Vibe Coffee' blend is the perfect pick-me-up. Made for busy professionals who need to power through their day. Get yours now and join the elite club of high-achievers! #CoffeeLife #ProductivityHacks #EliteStatus");
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);

  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError("Failed to audit content. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              SocialSip
            </h1>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setMode('generate')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                mode === 'generate' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Generate
            </button>
            <button
              onClick={() => setMode('audit')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                mode === 'audit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Audit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            
            {mode === 'generate' ? (
              <>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-indigo-500" />
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
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
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
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Goal</label>
                    <textarea
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
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
                 <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  Audit Content
                </h2>
                <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg mb-4 leading-relaxed">
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
                      className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
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

        {/* Right Column: Results */}
        <div className="lg:col-span-8 xl:col-span-9">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Empty States */}
          {!loading && !error && (
            <>
              {mode === 'generate' && !genResults && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to Create Magic?</h3>
                  <p className="text-slate-500 max-w-md">
                    Fill out the details on the left and hit generate to see 3 unique, engaging Instagram captions powered by AI.
                  </p>
                </div>
              )}

              {mode === 'audit' && !auditResult && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                   <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Responsible AI Auditor</h3>
                  <p className="text-slate-500 max-w-md">
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
          {loading && (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 h-[400px] flex flex-col gap-4 animate-pulse">
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
