import React, { useState } from 'react';
import { Sparkles, Coffee, AlertCircle } from 'lucide-react';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { generateMarketingCopy } from './services/geminiService';
import { MarketingFormData, GeneratedCaption } from './types';

const INITIAL_DATA: MarketingFormData = {
  businessName: "The Daily Grind Coffee Shop",
  productName: "Maple Pecan Dream Latte",
  productDescription: "A rich espresso combined with steamed milk, sweet maple syrup, and a nutty pecan swirl, topped with a dollop of whipped cream and crushed pecans.",
  targetAudience: "Coffee enthusiasts, people looking for comforting and indulgent fall beverages, locals in the city.",
  goal: "Announce the new latte on Instagram, generate excitement, and encourage customers to visit to try it.",
  hashtags: "#MaplePecanLatte #FallVibes #CozyDrinks #CoffeeLover #TheDailyGrind #NewDrinkAlert",
  city: "Seattle"
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<MarketingFormData>(INITIAL_DATA);
  const [results, setResults] = useState<GeneratedCaption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await generateMarketingCopy(formData);
      setResults(response.options);
    } catch (err) {
      setError("Failed to generate content. Please check your API key and try again.");
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
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-indigo-500" />
              Campaign Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

          {!results && !loading && !error && (
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

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
              {results.map((option, index) => (
                <div key={index} className="flex flex-col h-full">
                  <ResultCard option={option} index={index} />
                </div>
              ))}
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
