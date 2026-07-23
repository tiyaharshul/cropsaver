import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'
const states=['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh']
export default function Register(){
 const {language,setLanguage,t}=useLanguage(),navigate=useNavigate()
 const [f,setF]=useState({name:'',identifier:'',password:'',state:'Rajasthan'}),[error,setError]=useState(''),[loading,setLoading]=useState(false)
 const submit=async e=>{e.preventDefault();setLoading(true);setError('');try{const r=await api.post('/auth/register',{...f,language});localStorage.setItem('cropsaver_token',r.data.access_token);localStorage.setItem('cropsaver_user',JSON.stringify(r.data.user));localStorage.setItem('user_name',r.data.user.name);setLanguage(r.data.user.language);navigate('/')}catch(err){setError(err.response?.data?.detail||'Registration failed.')}finally{setLoading(false)}}
 return <div className="min-h-[70vh] flex items-center justify-center"><form onSubmit={submit} className="w-full max-w-md bg-white p-7 rounded-2xl shadow-lg space-y-4">
 <h1 className="text-2xl font-bold text-leaf-700 text-center">🌱 {t.createAccount}</h1>
 {[['name',t.name,'text'],['identifier',t.emailOrMobile,'text'],['password',t.createPassword,'password']].map(([k,l,type])=><label key={k} className="block text-sm">{l}<input type={type} minLength={k==='password'?6:undefined} className="mt-1 w-full border rounded-xl px-3 py-2.5" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} required /></label>)}
 <label className="block text-sm">{t.state}<select className="mt-1 w-full border rounded-xl px-3 py-2.5 bg-white" value={f.state} onChange={e=>setF({...f,state:e.target.value})}>{states.map(s=><option key={s}>{s}</option>)}</select></label>
 {error&&<div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}
 <button disabled={loading} className="w-full bg-leaf-700 text-white rounded-xl py-2.5">{loading?'...':t.createAccount}</button>
 <p className="text-center text-sm">{t.alreadyAccount} <Link to="/login" className="text-leaf-700 font-semibold">{t.login}</Link></p>
 </form></div>
}
