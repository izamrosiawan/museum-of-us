import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center gap-1 bg-surface-container/60 p-1 rounded-full border border-outline-variant/30 text-xs">
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded-full transition-all duration-300 ${
          currentLanguage === 'en'
            ? 'bg-charcoal text-warm-cream font-medium shadow-sm'
            : 'text-muted-taupe hover:text-charcoal'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('id')}
        className={`px-3 py-1 rounded-full transition-all duration-300 ${
          currentLanguage === 'id'
            ? 'bg-charcoal text-warm-cream font-medium shadow-sm'
            : 'text-muted-taupe hover:text-charcoal'
        }`}
      >
        ID
      </button>
    </div>
  );
};
