import { useState } from 'react'
import api from '../api/axios'
import { languages } from '../data/translations'
import { useLanguage } from '../contexts/LanguageContext'
export default function Profile(){
 const user=JSON.parse(localStorage.getItem('cropsaver_user')||'null'),{language,setLanguage,t}=useLanguage()
 const [selected,setSelected]=useState(language),[message,setMessage]=useState(''),[error,setError]=useState('')
 const save=async()=>{try{const token=localStorage.getItem('cropsaver_token');const r=await api.patch('/auth/language',{language:selected},{headers:{Authorization:`Bearer ${token}`}});localStorage.setItem('cropsaver_user',JSON.stringify(r.data));setLanguage(selected);setMessage(t.saved);setError('')}catch(e){setError(e.response?.data?.detail||'Could not save language.')}}
 if(!user)return null
 return <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6 space-y-6"><h1 className="text-2xl font-bold text-leaf-700">👤 {t.profile}</h1>
 <div className="space-y-2 text-sm"><p><strong>{t.name}:</strong> {user.name}</p>{user.phone&&<p><strong>{t.mobile}:</strong> {user.phone}</p>}{user.email&&<p><strong>{t.email}:</strong> {user.email}</p>}<p><strong>{t.state}:</strong> {user.state}</p></div>
 <div className="border-t pt-5"><label className="block text-sm font-semibold mb-2">🌐 {t.changeLanguage}</label><select value={selected} onChange={e=>setSelected(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 bg-white">{languages.map(x=><option key={x.code} value={x.code}>{x.label} — {x.region}</option>)}</select><button onClick={save} className="mt-3 w-full bg-leaf-700 text-white rounded-xl py-2.5">{t.saveLanguage}</button>{message&&<p className="text-green-700 mt-2">{message}</p>}{error&&<p className="text-red-700 mt-2">{error}</p>}</div>
 </div>
}
