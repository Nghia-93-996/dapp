import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="lang-switcher" ref={dropdownRef}>
            <button
                className="lang-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change language"
            >
                <span className="lang-flag">{currentLang.flag}</span>
                <span className="lang-code">{currentLang.label}</span>
                <svg
                    className={`lang-chevron ${isOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="lang-dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-option ${lang.code === i18n.language ? 'active' : ''}`}
                            onClick={() => handleChange(lang.code)}
                        >
                            <span className="lang-flag">{lang.flag}</span>
                            <span className="lang-option-name">{lang.name}</span>
                            {lang.code === i18n.language && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
