import React from 'react';
import { Settings2, Key } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedModel: string;
  apiKey: string;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
}

function Settings({ 
  isOpen, 
  onToggle, 
  selectedModel, 
  apiKey, 
  onModelChange, 
  onApiKeyChange 
}: SettingsProps) {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onModelChange(e.target.value);
    if (e.target.value === 'default') {
      onApiKeyChange('');
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-custom-medium-gray hover:text-custom-darkest transition-colors text-sm touch-manipulation"
      >
        <Settings2 className="w-4 h-4" />
        <span>Settings</span>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-3 pb-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm text-custom-medium-gray">AI Model:</label>
            <select
              className="bg-white text-custom-darkest border border-custom-gray-blue rounded px-3 py-2 text-sm w-full sm:w-auto min-h-[40px] touch-manipulation"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <option value="default">Default</option>
              <option value="gpt4">ChatGPT (GPT-4)</option>
            </select>
          </div>

          {selectedModel !== 'default' && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label className="text-sm text-custom-medium-gray">Model API Key:</label>
                <div className="relative flex-1">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full bg-white text-custom-darkest border border-custom-gray-blue rounded px-3 py-2 text-sm pr-8 min-h-[40px]"
                  />
                  <Key className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-custom-light-gray" />
                </div>
              </div>
              {selectedModel === 'gpt4' && (
                <a 
                  href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-custom-primary hover:text-custom-primary-dark transition-colors inline-flex items-center gap-1 touch-manipulation"
                >
                  Get your ChatGPT API key ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;