import { createContext, useContext, useMemo, useState } from 'react'
import { translations } from '../data/translations'
const Context = createContext(null)
export function LanguageProvider({ children }) {
  const [language, setValue] = useState(() => localStorage.getItem('cropsaver_language') || 'en')
  const setLanguage = (v) => { localStorage.setItem('cropsaver_language', v); setValue(v) }
  const t = useMemo(() => translations[language] || translations.en, [language])
  return <Context.Provider value={{ language, setLanguage, t }}>{children}</Context.Provider>
}
export const useLanguage = () => useContext(Context)
