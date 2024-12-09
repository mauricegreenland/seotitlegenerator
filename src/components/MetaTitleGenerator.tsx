import React, { useState, useEffect } from 'react';
import { Copy, Wand2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import Settings from './Settings';
import Footer from './Footer';
import QueryCounter from './QueryCounter';
import { generateSEOTitles } from '../services/gemini';
import { getQueryData, getRemainingQueries, getNextResetTime } from '../services/queryCounter';

interface TitleSuggestion {
  title: string;
  characters: number;
  copied?: boolean;
}

function MetaTitleGenerator() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingQueries, setRemainingQueries] = useState(getRemainingQueries());
  const [nextReset, setNextReset] = useState(getNextResetTime());
  const [selectedModel, setSelectedModel] = useState('default');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const { lastReset } = getQueryData();
      setRemainingQueries(getRemainingQueries());
      setNextReset(lastReset + 12 * 60 * 60 * 1000);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const resetForm = () => {
    setInput('');
    setSuggestions([]);
    setError(null);
    setIsSettingsOpen(false);
  };

  const generateTitles = async (topic: string, isMore = false) => {
    if (!topic.trim()) return;
    
    if (selectedModel !== 'default' && !apiKey) {
      setError('Please enter your API key in settings to use this model.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const existingTitles = isMore ? suggestions.map(s => s.title) : [];
      const titles = await generateSEOTitles(topic, existingTitles, selectedModel, apiKey);
      const variations = titles.map(title => ({
        title,
        characters: title.length,
        copied: false
      }));

      setSuggestions(prev => isMore ? [...prev, ...variations] : variations);
      setRemainingQueries(getRemainingQueries());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      if (!isMore) setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuggestions(prev => 
        prev.map((s, i) => i === index ? { ...s, copied: true } : s)
      );
      setTimeout(() => {
        setSuggestions(prev =>
          prev.map((s, i) => i === index ? { ...s, copied: false } : s)
        );
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-custom-darkest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-custom-darkest">Meta Title Generator</h1>
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8 text-custom-dark-gray">Free (AI-Powered) SEO Titles</h2>
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto text-custom-medium-gray">
            Want more traffic from search engines? Get perfect meta titles for your content in seconds with AI-powered suggestions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <button className="px-4 sm:px-6 py-3 bg-custom-gray-blue text-custom-primary font-semibold rounded-lg border-b-2 border-custom-primary w-full sm:w-auto text-center">
            META TITLE
          </button>
          <a 
            href="https://mauricegreenland.com/free-ai-tools-for-bloggers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-6 py-3 bg-custom-off-white text-custom-medium-gray hover:text-custom-darkest rounded-lg font-semibold transition-colors w-full sm:w-auto text-center"
          >
            MORE FREE TOOLS
          </a>
        </div>

        {/* Input Section */}
        <div className="bg-custom-off-white p-4 sm:p-6 rounded-lg shadow-lg mb-6 sm:mb-8 border border-custom-gray-blue">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your topic or title"
                className="w-full px-4 py-3 rounded-lg bg-white text-custom-darkest placeholder-custom-light-gray border border-custom-gray-blue focus:border-custom-primary focus:ring-1 focus:ring-custom-primary text-base sm:text-lg"
                disabled={isLoading}
              />
              <button
                onClick={resetForm}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-custom-light-gray hover:text-custom-medium-gray hover:bg-custom-gray-blue rounded-full transition-colors touch-manipulation"
                title="Reset form"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => generateTitles(input)}
              disabled={isLoading || !input.trim() || remainingQueries === 0}
              className={`px-6 py-3 bg-custom-primary hover:bg-custom-primary-dark text-white rounded-lg flex items-center justify-center gap-2 transition-colors min-h-[48px] touch-manipulation ${
                isLoading || !input.trim() || remainingQueries === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Wand2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="whitespace-nowrap">{isLoading ? 'GENERATING...' : 'GENERATE'}</span>
            </button>
          </div>

          <div className="mt-3">
            <QueryCounter 
              remainingQueries={remainingQueries} 
              nextReset={nextReset}
              selectedModel={selectedModel}
            />
          </div>
          
          <Settings 
            isOpen={isSettingsOpen} 
            onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
            selectedModel={selectedModel}
            apiKey={apiKey}
            onModelChange={setSelectedModel}
            onApiKeyChange={setApiKey}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm sm:text-base">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-custom-off-white p-4 rounded-lg hover:bg-custom-gray-blue transition-colors border border-custom-gray-blue cursor-pointer touch-manipulation"
                onClick={() => copyToClipboard(suggestion.title, index)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-custom-darkest break-words">{suggestion.title}</h3>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className={`text-sm whitespace-nowrap ${
                      suggestion.characters >= 50 && suggestion.characters <= 60
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {suggestion.characters} characters
                    </span>
                    <button
                      className={`p-2 hover:bg-custom-gray-blue rounded-lg transition-colors touch-manipulation ${
                        suggestion.copied ? 'text-green-600' : 'text-custom-medium-gray hover:text-custom-darkest'
                      }`}
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Search Preview */}
                <div className="mt-3 p-3 sm:p-4 bg-white rounded-lg border border-custom-gray-blue">
                  <div className="text-custom-primary text-base sm:text-lg hover:underline cursor-pointer break-words">
                    {suggestion.title}
                  </div>
                  <div className="text-green-700 text-sm break-words">
                    https://yourwebsite.com/page
                  </div>
                  <div className="text-custom-medium-gray text-sm mt-1">
                    Preview of how your title will appear in search results.
                  </div>
                </div>
              </div>
            ))}

            {suggestions.length < 16 && (
              <div className="text-center mt-6 sm:mt-8">
                <button
                  onClick={() => generateTitles(input, true)}
                  disabled={isLoading || remainingQueries === 0}
                  className={`px-6 sm:px-8 py-3 bg-custom-darkest text-white rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-custom-dark-gray transition-colors min-h-[48px] touch-manipulation ${
                    isLoading || remainingQueries === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Generate More Titles</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default MetaTitleGenerator;