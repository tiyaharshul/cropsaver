import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { languages } from '../data/translations'
import { useLanguage } from '../contexts/LanguageContext'
export default function LanguageSelect() {
 const navigate=useNavigate(), {language,setLanguage}=useLanguage()
 const [selected,setSelected]=useState(language)
 const go=()=>{setLanguage(selected);localStorage.setItem('cropsaver_language_chosen','true');navigate('/login')}
 return <div className="min-h-[75vh] flex items-center justify-center"><div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-7">
  <div className="text-center mb-6"><div className="text-5xl mb-3">🌱</div><h1 className="text-2xl font-bold text-leaf-700">CropSaver</h1><p className="font-semibold mt-3">अपनी भाषा चुनें</p><p className="text-sm text-gray-500">Choose your language</p></div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">{languages.map(x=><button type="button" key={x.code} onClick={()=>setSelected(x.code)} className={`text-left border rounded-xl p-3 ${selected===x.code?'border-leaf-700 bg-leaf-50':'border-gray-200'}`}><div className="font-semibold">{x.label}</div><div className="text-xs text-gray-500">{x.region}</div></button>)}</div>
  <button onClick={go} className="w-full mt-6 bg-leaf-700 text-white rounded-xl py-3 font-semibold">Continue / आगे बढ़ें</button>
 </div></div>
}
