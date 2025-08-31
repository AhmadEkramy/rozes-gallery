import React, { useEffect, useState } from 'react';
import { LanguageContext, translations } from './language-context';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');

  useEffect(() => {
    // Only update the language attribute
    document.documentElement.lang = language.toLowerCase();

    // Store the language preference
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Initialize language from localStorage or default to EN
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as 'EN' | 'AR';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'AR' : 'EN');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['EN']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
