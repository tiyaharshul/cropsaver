import { dashboardTranslations } from './dashboardTranslations'


// =====================================================
// SUPPORTED LANGUAGES
// =====================================================

export const languages = [
  { code: 'en', label: 'English', region: 'India' },
  { code: 'hi', label: 'हिन्दी', region: 'भारत' },
  { code: 'raj', label: 'मारवाड़ी / राजस्थानी', region: 'राजस्थान' },
  { code: 'bho', label: 'भोजपुरी', region: 'उत्तर प्रदेश / बिहार' },
  { code: 'har', label: 'हरियाणवी', region: 'हरियाणा' },
  { code: 'gu', label: 'ગુજરાતી', region: 'ગુજરાત' },
  { code: 'mr', label: 'मराठी', region: 'महाराष्ट्र' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', region: 'ਪੰਜਾਬ' },
  { code: 'bn', label: 'বাংলা', region: 'পশ্চিমবঙ্গ' },
  { code: 'ta', label: 'தமிழ்', region: 'தமிழ்நாடு' },
  { code: 'te', label: 'తెలుగు', region: 'ఆంధ్రప్రదేశ్ / తెలంగాణ' },
  { code: 'kn', label: 'ಕನ್ನಡ', region: 'ಕರ್ನಾಟಕ' },
  { code: 'ml', label: 'മലയാളം', region: 'കേരളം' },
  { code: 'or', label: 'ଓଡ଼ିଆ', region: 'ଓଡ଼ିଶା' },
  { code: 'as', label: 'অসমীয়া', region: 'অসম' },
]


// =====================================================
// AI LANGUAGE NAMES
// =====================================================

export const aiLanguageNames = {
  en: 'English',
  hi: 'Hindi',
  raj: 'Rajasthani / Marwari',
  bho: 'Bhojpuri',
  har: 'Haryanvi',
  gu: 'Gujarati',
  mr: 'Marathi',
  pa: 'Punjabi',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  or: 'Odia',
  as: 'Assamese',
}


// =====================================================
// ENGLISH
// =====================================================

const en = {
  appName: 'CropSaver',

  dashboard: 'Dashboard',
  diseaseDetection: 'Disease Detection',
  cropHistory: 'Crop History',
  governmentNotices: 'Government Notices',
  nearbyExperts: 'Nearby Experts',
  aiChatbot: 'AI Chatbot',
  profile: 'Profile',
  logout: 'Logout',

  welcomeBack: 'Welcome back',
  loginHelp: 'Log in using your mobile number or email.',
  emailOrMobile: 'Email or mobile number',
  password: 'Password',
  login: 'Login',
  noAccount: "Don't have an account?",
  createAccount: 'Create account',
  name: 'Name',
  state: 'State',
  createPassword: 'Create password',
  alreadyAccount: 'Already have an account?',

  changeLanguage: 'Website language',
  saveLanguage: 'Save language',

  account: 'Account',
  mobile: 'Mobile',
  email: 'Email',
  provider: 'Login method',
  saved: 'Language saved.',

  diseaseCardDesc:
    'Upload a crop photo for instant diagnosis',

  historyCardDesc:
    'View your saved diagnosis & treatment timeline',

  noticesCardDesc:
    'Latest schemes, MSP, subsidies & deadlines',

  expertsCardDesc:
    'Find KVKs, soil labs & fertilizer shops nearby',

  chatbotCardDesc:
    'Ask anything about crops, pests & irrigation',

  cropDiseaseDetection: 'Crop Disease Detection',
  useCamera: 'Use Camera',
  closeCamera: 'Close Camera',
  capturePhoto: 'Capture Photo',
  detectDisease: 'Detect Disease',
  analyzing: 'Analyzing...',
  selectImageFirst: 'Please select an image first.',
  backendConnectionError: 'Unable to connect to backend.',

  diagnosisResult: 'Diagnosis Result',
  crop: 'Crop',
  disease: 'Disease',
  confidence: 'Confidence',
  unknownCrop: 'Unknown Crop',
  unknown: 'Unknown',

  treatmentRecommendation: 'Treatment Recommendation',
  explanation: 'Explanation',
  organicTreatment: 'Organic Treatment',
  chemicalTreatment: 'Chemical Treatment',
  dosage: 'Dosage',
  spraySchedule: 'Spray Schedule',
  recoveryTime: 'Recovery Time',
  prevention: 'Prevention',

  cropHealthHistory: 'Crop Health History',
  noHistory:
    'No history yet — try Disease Detection first.',

  governmentNoticeBoard: 'Government Notice Board',
  loadingNotices: 'Loading notices...',
  noNotices: 'No notices available.',
  noticesError: 'Could not load government notices.',
  readMore: 'Read more',

  nearbyAgricultureExperts:
    'Nearby Agriculture Experts',

  nearbyDescription:
    'Powered by OpenStreetMap — showing Krishi Vigyan Kendras, agriculture offices, soil labs and fertilizer shops near you.',

  geolocationUnsupported:
    'Geolocation is not supported by your browser.',

  locationError:
    'Could not get your location. Please allow location access.',

  nearbyFetchError:
    'Failed to fetch nearby centers.',

  loadingCenters:
    'Loading nearby centers...',

  noCenters:
    'No agriculture centers were found near your location in OpenStreetMap data.',

  thinking: 'Thinking...',
  chatPlaceholder:
    'Ask about crops, pests, weather...',
  send: 'Send',
  chatError:
    'Sorry, something went wrong.',
}


// =====================================================
// HINDI
// =====================================================

const hi = {
  ...en,

  appName: 'क्रॉपसेवर',

  dashboard: 'डैशबोर्ड',
  diseaseDetection: 'रोग पहचान',
  cropHistory: 'फसल इतिहास',
  governmentNotices: 'सरकारी सूचनाएँ',
  nearbyExperts: 'नज़दीकी विशेषज्ञ',
  aiChatbot: 'एआई चैटबॉट',
  profile: 'प्रोफ़ाइल',
  logout: 'लॉग आउट',

  welcomeBack: 'वापसी पर स्वागत है',

  loginHelp:
    'मोबाइल नंबर या ईमेल से लॉग इन करें।',

  emailOrMobile:
    'ईमेल या मोबाइल नंबर',

  password: 'पासवर्ड',
  login: 'लॉग इन करें',

  noAccount:
    'नया खाता चाहिए?',

  createAccount:
    'खाता बनाएं',

  name: 'नाम',
  state: 'राज्य',

  createPassword:
    'पासवर्ड बनाएं',

  alreadyAccount:
    'पहले से खाता है?',

  changeLanguage:
    'वेबसाइट की भाषा',

  saveLanguage:
    'भाषा सेव करें',

  account: 'खाता',
  mobile: 'मोबाइल',
  email: 'ईमेल',

  provider:
    'लॉगिन का तरीका',

  saved:
    'भाषा सेव हो गई।',

  diseaseCardDesc:
    'फसल की फोटो अपलोड करके रोग की पहचान करें',

  historyCardDesc:
    'पिछली जांच और उपचार देखें',

  noticesCardDesc:
    'नई योजनाएं, एमएसपी, सब्सिडी और अंतिम तिथियां',

  expertsCardDesc:
    'नजदीकी कृषि विशेषज्ञ और केंद्र खोजें',

  chatbotCardDesc:
    'फसल, कीट और सिंचाई के बारे में पूछें',

  cropDiseaseDetection:
    'फसल रोग पहचान',

  useCamera:
    'कैमरा इस्तेमाल करें',

  closeCamera:
    'कैमरा बंद करें',

  capturePhoto:
    'फोटो लें',

  detectDisease:
    'रोग पहचानें',

  analyzing:
    'जांच की जा रही है...',

  selectImageFirst:
    'पहले एक फोटो चुनें।',

  backendConnectionError:
    'सर्वर से कनेक्ट नहीं हो सका।',

  diagnosisResult:
    'जांच का परिणाम',

  crop: 'फसल',
  disease: 'रोग',

  confidence:
    'विश्वसनीयता',

  unknownCrop:
    'अज्ञात फसल',

  unknown:
    'अज्ञात',

  treatmentRecommendation:
    'उपचार की सलाह',

  explanation:
    'जानकारी',

  organicTreatment:
    'जैविक उपचार',

  chemicalTreatment:
    'रासायनिक उपचार',

  dosage:
    'मात्रा',

  spraySchedule:
    'छिड़काव समय',

  recoveryTime:
    'ठीक होने का समय',

  prevention:
    'बचाव',

  cropHealthHistory:
    'फसल स्वास्थ्य इतिहास',

  noHistory:
    'अभी कोई इतिहास नहीं है — पहले रोग पहचान का उपयोग करें।',

  governmentNoticeBoard:
    'सरकारी सूचना बोर्ड',

  loadingNotices:
    'सूचनाएं लोड हो रही हैं...',

  noNotices:
    'कोई सूचना उपलब्ध नहीं है।',

  noticesError:
    'सरकारी सूचनाएं लोड नहीं हो सकीं।',

  readMore:
    'और पढ़ें',

  nearbyAgricultureExperts:
    'नज़दीकी कृषि विशेषज्ञ',

  nearbyDescription:
    'OpenStreetMap की मदद से आपके पास के कृषि विज्ञान केंद्र, कृषि कार्यालय, मिट्टी जांच केंद्र और खाद की दुकानें दिखाई जाती हैं।',

  geolocationUnsupported:
    'आपका ब्राउज़र स्थान सुविधा का समर्थन नहीं करता।',

  locationError:
    'आपका स्थान नहीं मिल सका। कृपया लोकेशन की अनुमति दें।',

  nearbyFetchError:
    'नज़दीकी केंद्र नहीं मिल सके।',

  loadingCenters:
    'नज़दीकी केंद्र खोजे जा रहे हैं...',

  noCenters:
    'आपके पास कोई कृषि केंद्र नहीं मिला।',

  thinking:
    'सोच रहा हूँ...',

  chatPlaceholder:
    'फसल, कीट, मौसम के बारे में पूछें...',

  send:
    'भेजें',

  chatError:
    'क्षमा करें, कुछ गलत हो गया।',
}


// =====================================================
// GUJARATI
// =====================================================

const gu = {
  ...en,

  appName: 'ક્રોપસેવર',
  dashboard: 'ડેશબોર્ડ',
  diseaseDetection: 'રોગ ઓળખ',
  cropHistory: 'પાક ઇતિહાસ',
  governmentNotices: 'સરકારી સૂચનાઓ',
  nearbyExperts: 'નજીકના નિષ્ણાતો',
  aiChatbot: 'એઆઈ ચેટબોટ',
  profile: 'પ્રોફાઇલ',
  logout: 'લૉગ આઉટ',

  welcomeBack: 'ફરી સ્વાગત છે',

  loginHelp:
    'તમારા મોબાઇલ નંબર અથવા ઈમેલથી લૉગ ઇન કરો.',

  emailOrMobile:
    'ઈમેલ અથવા મોબાઇલ નંબર',

  password: 'પાસવર્ડ',
  login: 'લૉગ ઇન કરો',
  noAccount: 'ખાતું નથી?',
  createAccount: 'ખાતું બનાવો',

  name: 'નામ',
  state: 'રાજ્ય',
  createPassword: 'પાસવર્ડ બનાવો',

  alreadyAccount:
    'પહેલેથી ખાતું છે?',

  changeLanguage:
    'વેબસાઇટની ભાષા',

  saveLanguage:
    'ભાષા સાચવો',

  account: 'ખાતું',
  mobile: 'મોબાઇલ',
  email: 'ઈમેલ',

  provider:
    'લૉગિન પદ્ધતિ',

  saved:
    'ભાષા સાચવવામાં આવી.',

  diseaseCardDesc:
    'તાત્કાલિક નિદાન માટે પાકનો ફોટો અપલોડ કરો',

  historyCardDesc:
    'તમારા અગાઉના નિદાન અને સારવાર જુઓ',

  noticesCardDesc:
    'નવી યોજનાઓ, MSP, સબસિડી અને સમયમર્યાદા',

  expertsCardDesc:
    'નજીકના કૃષિ કેન્દ્રો અને નિષ્ણાતો શોધો',

  chatbotCardDesc:
    'પાક, જીવાત અને સિંચાઈ વિશે પ્રશ્ન પૂછો',

  cropDiseaseDetection:
    'પાક રોગ ઓળખ',

  useCamera:
    'કેમેરાનો ઉપયોગ કરો',

  closeCamera:
    'કેમેરા બંધ કરો',

  capturePhoto:
    'ફોટો લો',

  detectDisease:
    'રોગ ઓળખો',

  analyzing:
    'વિશ્લેષણ થઈ રહ્યું છે...',

  selectImageFirst:
    'પહેલા એક ફોટો પસંદ કરો.',

  backendConnectionError:
    'સર્વર સાથે જોડાઈ શકાયું નથી.',

  diagnosisResult:
    'નિદાન પરિણામ',

  crop: 'પાક',
  disease: 'રોગ',

  confidence:
    'વિશ્વસનીયતા',

  unknownCrop:
    'અજ્ઞાત પાક',

  unknown:
    'અજ્ઞાત',

  treatmentRecommendation:
    'સારવારની ભલામણ',

  explanation:
    'સમજૂતી',

  organicTreatment:
    'જૈવિક સારવાર',

  chemicalTreatment:
    'રાસાયણિક સારવાર',

  dosage:
    'માત્રા',

  spraySchedule:
    'છંટકાવ સમયપત્રક',

  recoveryTime:
    'સાજા થવાનો સમય',

  prevention:
    'નિવારણ',

  cropHealthHistory:
    'પાક આરોગ્ય ઇતિહાસ',

  noHistory:
    'હજુ સુધી કોઈ ઇતિહાસ નથી — પહેલા રોગ ઓળખનો ઉપયોગ કરો.',

  governmentNoticeBoard:
    'સરકારી સૂચના બોર્ડ',

  loadingNotices:
    'સૂચનાઓ લોડ થઈ રહી છે...',

  noNotices:
    'કોઈ સૂચના ઉપલબ્ધ નથી.',

  noticesError:
    'સરકારી સૂચનાઓ લોડ થઈ શકી નથી.',

  readMore:
    'વધુ વાંચો',

  nearbyAgricultureExperts:
    'નજીકના કૃષિ નિષ્ણાતો',

  nearbyDescription:
    'OpenStreetMap દ્વારા નજીકના કૃષિ વિજ્ઞાન કેન્દ્રો, કૃષિ કચેરીઓ, માટી પરીક્ષણ કેન્દ્રો અને ખાતરની દુકાનો બતાવવામાં આવે છે.',

  geolocationUnsupported:
    'તમારું બ્રાઉઝર સ્થાન સુવિધાને સપોર્ટ કરતું નથી.',

  locationError:
    'તમારું સ્થાન મળી શક્યું નથી. કૃપા કરીને સ્થાનની પરવાનગી આપો.',

  nearbyFetchError:
    'નજીકના કૃષિ કેન્દ્રો મેળવી શકાયા નથી.',

  loadingCenters:
    'નજીકના કેન્દ્રો શોધી રહ્યા છીએ...',

  noCenters:
    'તમારા સ્થાનની નજીક કોઈ કૃષિ કેન્દ્ર મળ્યું નથી.',

  thinking:
    'વિચારી રહ્યું છે...',

  chatPlaceholder:
    'પાક, જીવાત, હવામાન વિશે પૂછો...',

  send:
    'મોકલો',

  chatError:
    'માફ કરશો, કંઈક ખોટું થયું.',
}


// =====================================================
// MARATHI
// =====================================================

const mr = {
  ...en,

  appName: 'क्रॉपसेव्हर',
  dashboard: 'डॅशबोर्ड',
  diseaseDetection: 'रोग ओळख',
  cropHistory: 'पीक इतिहास',
  governmentNotices: 'सरकारी सूचना',
  nearbyExperts: 'जवळचे तज्ञ',
  aiChatbot: 'एआय चॅटबॉट',
  profile: 'प्रोफाइल',
  logout: 'लॉग आउट',

  cropDiseaseDetection: 'पीक रोग ओळख',
  useCamera: 'कॅमेरा वापरा',
  closeCamera: 'कॅमेरा बंद करा',
  capturePhoto: 'फोटो घ्या',
  detectDisease: 'रोग ओळखा',
  analyzing: 'विश्लेषण सुरू आहे...',
  diagnosisResult: 'निदान निकाल',
  crop: 'पीक',
  disease: 'रोग',

  treatmentRecommendation:
    'उपचार शिफारस',

  organicTreatment:
    'सेंद्रिय उपचार',

  chemicalTreatment:
    'रासायनिक उपचार',

  prevention:
    'प्रतिबंध',

  cropHealthHistory:
    'पीक आरोग्य इतिहास',

  governmentNoticeBoard:
    'सरकारी सूचना फलक',

  nearbyAgricultureExperts:
    'जवळचे कृषी तज्ञ',

  thinking:
    'विचार करत आहे...',

  send:
    'पाठवा',
}


// =====================================================
// PUNJABI
// =====================================================

const pa = {
  ...en,

  appName: 'ਕ੍ਰਾਪਸੇਵਰ',
  dashboard: 'ਡੈਸ਼ਬੋਰਡ',
  diseaseDetection: 'ਰੋਗ ਪਛਾਣ',
  cropHistory: 'ਫਸਲ ਇਤਿਹਾਸ',
  governmentNotices: 'ਸਰਕਾਰੀ ਸੂਚਨਾਵਾਂ',
  nearbyExperts: 'ਨੇੜਲੇ ਮਾਹਿਰ',
  aiChatbot: 'ਏਆਈ ਚੈਟਬੋਟ',
  profile: 'ਪ੍ਰੋਫਾਈਲ',
  logout: 'ਲਾਗ ਆਉਟ',

  cropDiseaseDetection:
    'ਫਸਲ ਰੋਗ ਪਛਾਣ',

  useCamera:
    'ਕੈਮਰਾ ਵਰਤੋ',

  closeCamera:
    'ਕੈਮਰਾ ਬੰਦ ਕਰੋ',

  capturePhoto:
    'ਫੋਟੋ ਲਓ',

  detectDisease:
    'ਰੋਗ ਪਛਾਣੋ',

  analyzing:
    'ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',

  diagnosisResult:
    'ਜਾਂਚ ਨਤੀਜਾ',

  crop: 'ਫਸਲ',
  disease: 'ਰੋਗ',

  treatmentRecommendation:
    'ਇਲਾਜ ਦੀ ਸਿਫਾਰਸ਼',

  prevention:
    'ਬਚਾਅ',

  cropHealthHistory:
    'ਫਸਲ ਸਿਹਤ ਇਤਿਹਾਸ',

  governmentNoticeBoard:
    'ਸਰਕਾਰੀ ਸੂਚਨਾ ਬੋਰਡ',

  nearbyAgricultureExperts:
    'ਨੇੜਲੇ ਖੇਤੀ ਮਾਹਿਰ',

  thinking:
    'ਸੋਚ ਰਿਹਾ ਹੈ...',

  send:
    'ਭੇਜੋ',
}


// =====================================================
// BENGALI
// =====================================================

const bn = {
  ...en,

  dashboard: 'ড্যাশবোর্ড',
  diseaseDetection: 'রোগ শনাক্তকরণ',
  cropHistory: 'ফসলের ইতিহাস',
  governmentNotices: 'সরকারি বিজ্ঞপ্তি',
  nearbyExperts: 'কাছের বিশেষজ্ঞ',
  aiChatbot: 'এআই চ্যাটবট',
  profile: 'প্রোফাইল',
  logout: 'লগ আউট',

  cropDiseaseDetection:
    'ফসলের রোগ শনাক্তকরণ',

  useCamera:
    'ক্যামেরা ব্যবহার করুন',

  closeCamera:
    'ক্যামেরা বন্ধ করুন',

  capturePhoto:
    'ছবি তুলুন',

  detectDisease:
    'রোগ শনাক্ত করুন',

  analyzing:
    'বিশ্লেষণ চলছে...',

  crop:
    'ফসল',

  disease:
    'রোগ',

  prevention:
    'প্রতিরোধ',

  governmentNoticeBoard:
    'সরকারি বিজ্ঞপ্তি বোর্ড',

  nearbyAgricultureExperts:
    'কাছের কৃষি বিশেষজ্ঞ',

  send:
    'পাঠান',
}


// =====================================================
// TAMIL
// =====================================================

const ta = {
  ...en,

  dashboard: 'முகப்புப் பலகை',
  diseaseDetection: 'நோய் கண்டறிதல்',
  cropHistory: 'பயிர் வரலாறு',
  governmentNotices: 'அரசு அறிவிப்புகள்',
  nearbyExperts: 'அருகிலுள்ள நிபுணர்கள்',
  aiChatbot: 'AI உரையாடல்',
  profile: 'சுயவிவரம்',
  logout: 'வெளியேறு',

  cropDiseaseDetection:
    'பயிர் நோய் கண்டறிதல்',

  useCamera:
    'கேமராவைப் பயன்படுத்து',

  closeCamera:
    'கேமராவை மூடு',

  capturePhoto:
    'புகைப்படம் எடு',

  detectDisease:
    'நோயைக் கண்டறி',

  analyzing:
    'பகுப்பாய்வு செய்யப்படுகிறது...',

  crop:
    'பயிர்',

  disease:
    'நோய்',

  prevention:
    'தடுப்பு',

  governmentNoticeBoard:
    'அரசு அறிவிப்பு பலகை',

  nearbyAgricultureExperts:
    'அருகிலுள்ள வேளாண் நிபுணர்கள்',

  send:
    'அனுப்பு',
}


// =====================================================
// TELUGU
// =====================================================

const te = {
  ...en,

  dashboard: 'డ్యాష్‌బోర్డ్',
  diseaseDetection: 'వ్యాధి గుర్తింపు',
  cropHistory: 'పంట చరిత్ర',
  governmentNotices: 'ప్రభుత్వ నోటీసులు',
  nearbyExperts: 'సమీప నిపుణులు',
  aiChatbot: 'ఏఐ చాట్‌బాట్',
  profile: 'ప్రొఫైల్',
  logout: 'లాగ్ అవుట్',

  cropDiseaseDetection:
    'పంట వ్యాధి గుర్తింపు',

  useCamera:
    'కెమెరా ఉపయోగించండి',

  closeCamera:
    'కెమెరా మూసివేయండి',

  capturePhoto:
    'ఫోటో తీయండి',

  detectDisease:
    'వ్యాధిని గుర్తించండి',

  analyzing:
    'విశ్లేషిస్తోంది...',

  crop:
    'పంట',

  disease:
    'వ్యాధి',

  prevention:
    'నివారణ',

  governmentNoticeBoard:
    'ప్రభుత్వ నోటీసు బోర్డు',

  nearbyAgricultureExperts:
    'సమీప వ్యవసాయ నిపుణులు',

  send:
    'పంపండి',
}


// =====================================================
// KANNADA
// =====================================================

const kn = {
  ...en,

  appName: 'ಕ್ರಾಪ್‌ಸೇವರ್',
  dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  diseaseDetection: 'ರೋಗ ಪತ್ತೆ',
  cropHistory: 'ಬೆಳೆ ಇತಿಹಾಸ',
  governmentNotices: 'ಸರ್ಕಾರಿ ಸೂಚನೆಗಳು',
  nearbyExperts: 'ಹತ್ತಿರದ ತಜ್ಞರು',
  aiChatbot: 'ಎಐ ಚಾಟ್‌ಬಾಟ್',
  profile: 'ಪ್ರೊಫೈಲ್',
  logout: 'ಲಾಗ್ ಔಟ್',

  cropDiseaseDetection:
    'ಬೆಳೆ ರೋಗ ಪತ್ತೆ',

  useCamera:
    'ಕ್ಯಾಮೆರಾ ಬಳಸಿ',

  closeCamera:
    'ಕ್ಯಾಮೆರಾ ಮುಚ್ಚಿ',

  capturePhoto:
    'ಫೋಟೋ ತೆಗೆಯಿರಿ',

  detectDisease:
    'ರೋಗ ಪತ್ತೆ ಮಾಡಿ',

  analyzing:
    'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',

  selectImageFirst:
    'ಮೊದಲು ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',

  diagnosisResult:
    'ರೋಗನಿರ್ಣಯ ಫಲಿತಾಂಶ',

  crop:
    'ಬೆಳೆ',

  disease:
    'ರೋಗ',

  confidence:
    'ವಿಶ್ವಾಸ',

  treatmentRecommendation:
    'ಚಿಕಿತ್ಸೆಯ ಶಿಫಾರಸು',

  explanation:
    'ವಿವರಣೆ',

  organicTreatment:
    'ಸಾವಯವ ಚಿಕಿತ್ಸೆ',

  chemicalTreatment:
    'ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ',

  dosage:
    'ಪ್ರಮಾಣ',

  spraySchedule:
    'ಸಿಂಪಡಣೆ ವೇಳಾಪಟ್ಟಿ',

  recoveryTime:
    'ಚೇತರಿಕೆ ಸಮಯ',

  prevention:
    'ತಡೆಗಟ್ಟುವಿಕೆ',

  cropHealthHistory:
    'ಬೆಳೆ ಆರೋಗ್ಯ ಇತಿಹಾಸ',

  governmentNoticeBoard:
    'ಸರ್ಕಾರಿ ಸೂಚನಾ ಫಲಕ',

  loadingNotices:
    'ಸೂಚನೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...',

  nearbyAgricultureExperts:
    'ಹತ್ತಿರದ ಕೃಷಿ ತಜ್ಞರು',

  loadingCenters:
    'ಹತ್ತಿರದ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',

  thinking:
    'ಯೋಚಿಸಲಾಗುತ್ತಿದೆ...',

  chatPlaceholder:
    'ಬೆಳೆ, ಕೀಟ, ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...',

  send:
    'ಕಳುಹಿಸಿ',
}


// =====================================================
// MALAYALAM
// =====================================================

const ml = {
  ...en,

  dashboard: 'ഡാഷ്ബോർഡ്',
  diseaseDetection: 'രോഗ നിർണയം',
  cropHistory: 'വിള ചരിത്രം',
  governmentNotices: 'സർക്കാർ അറിയിപ്പുകൾ',
  nearbyExperts: 'സമീപ വിദഗ്ധർ',
  aiChatbot: 'എഐ ചാറ്റ്ബോട്ട്',
  profile: 'പ്രൊഫൈൽ',
  logout: 'ലോഗ് ഔട്ട്',

  cropDiseaseDetection:
    'വിള രോഗ നിർണയം',

  useCamera:
    'ക്യാമറ ഉപയോഗിക്കുക',

  closeCamera:
    'ക്യാമറ അടയ്ക്കുക',

  capturePhoto:
    'ഫോട്ടോ എടുക്കുക',

  detectDisease:
    'രോഗം കണ്ടെത്തുക',

  analyzing:
    'വിശകലനം ചെയ്യുന്നു...',

  crop:
    'വിള',

  disease:
    'രോഗം',

  prevention:
    'പ്രതിരോധം',

  governmentNoticeBoard:
    'സർക്കാർ അറിയിപ്പ് ബോർഡ്',

  nearbyAgricultureExperts:
    'സമീപ കൃഷി വിദഗ്ധർ',

  send:
    'അയയ്ക്കുക',
}


// =====================================================
// ODIA
// =====================================================

const or = {
  ...en,

  dashboard:
    'ଡ୍ୟାସବୋର୍ଡ',

  diseaseDetection:
    'ରୋଗ ଚିହ୍ନଟ',

  cropHistory:
    'ଫସଲ ଇତିହାସ',

  governmentNotices:
    'ସରକାରୀ ସୂଚନା',

  nearbyExperts:
    'ନିକଟସ୍ଥ ବିଶେଷଜ୍ଞ',

  aiChatbot:
    'ଏଆଇ ଚାଟବଟ୍',

  profile:
    'ପ୍ରୋଫାଇଲ୍',

  logout:
    'ଲଗ୍ ଆଉଟ୍',

  cropDiseaseDetection:
    'ଫସଲ ରୋଗ ଚିହ୍ନଟ',

  crop:
    'ଫସଲ',

  disease:
    'ରୋଗ',

  governmentNoticeBoard:
    'ସରକାରୀ ସୂଚନା ବୋର୍ଡ',

  nearbyAgricultureExperts:
    'ନିକଟସ୍ଥ କୃଷି ବିଶେଷଜ୍ଞ',

  send:
    'ପଠାନ୍ତୁ',
}


// =====================================================
// ASSAMESE
// =====================================================

const as = {
  ...en,

  dashboard:
    'ডেশ্বব’ৰ্ড',

  diseaseDetection:
    'ৰোগ চিনাক্তকৰণ',

  cropHistory:
    'শস্যৰ ইতিহাস',

  governmentNotices:
    'চৰকাৰী জাননী',

  nearbyExperts:
    'ওচৰৰ বিশেষজ্ঞ',

  aiChatbot:
    'এআই চেটবট',

  profile:
    'প্ৰফাইল',

  logout:
    'লগ আউট',

  cropDiseaseDetection:
    'শস্যৰ ৰোগ চিনাক্তকৰণ',

  crop:
    'শস্য',

  disease:
    'ৰোগ',

  governmentNoticeBoard:
    'চৰকাৰী জাননী ফলক',

  nearbyAgricultureExperts:
    'ওচৰৰ কৃষি বিশেষজ্ঞ',

  send:
    'পঠিয়াওক',
}


// =====================================================
// RAJASTHANI / MARWARI
// =====================================================

const raj = {
  ...hi,

  appName:
    'क्रॉपसेवर',

  dashboard:
    'मुख्य पन्नो',

  diseaseDetection:
    'फसल रो रोग पहचान',

  cropHistory:
    'फसल रो इतिहास',

  governmentNotices:
    'सरकारी सूचनावां',

  nearbyExperts:
    'नजीक रा कृषि जाणकार',

  profile:
    'प्रोफाइल',
}


// =====================================================
// BHOJPURI
// =====================================================

const bho = {
  ...hi,

  dashboard:
    'मुख्य पन्ना',

  diseaseDetection:
    'फसल के रोग के पहचान',

  cropHistory:
    'फसल के इतिहास',

  governmentNotices:
    'सरकारी सूचना',

  nearbyExperts:
    'नजदीक के कृषि विशेषज्ञ',
}


// =====================================================
// HARYANVI
// =====================================================

const har = {
  ...hi,

  dashboard:
    'मुख्य पन्ना',

  diseaseDetection:
    'फसल की बीमारी की पहचान',

  cropHistory:
    'फसल का इतिहास',

  governmentNotices:
    'सरकारी सूचना',

  nearbyExperts:
    'नजदीक के खेती विशेषज्ञ',
}


// =====================================================
// FINAL TRANSLATIONS
// Combines existing translations + new dashboard translations
// =====================================================

export const translations = {

  en: {
    ...en,
    ...dashboardTranslations.en,
  },

  hi: {
    ...hi,
    ...dashboardTranslations.hi,
  },

  raj: {
    ...raj,
    ...dashboardTranslations.raj,
  },

  bho: {
    ...bho,
    ...dashboardTranslations.bho,
  },

  har: {
    ...har,
    ...dashboardTranslations.har,
  },

  gu: {
    ...gu,
    ...dashboardTranslations.gu,
  },

  mr: {
    ...mr,
    ...dashboardTranslations.mr,
  },

  pa: {
    ...pa,
    ...dashboardTranslations.pa,
  },

  bn: {
    ...bn,
    ...dashboardTranslations.bn,
  },

  ta: {
    ...ta,
    ...dashboardTranslations.ta,
  },

  te: {
    ...te,
    ...dashboardTranslations.te,
  },

  kn: {
    ...kn,
    ...dashboardTranslations.kn,
  },

  ml: {
    ...ml,
    ...dashboardTranslations.ml,
  },

  or: {
    ...or,
    ...dashboardTranslations.or,
  },

  as: {
    ...as,
    ...dashboardTranslations.as,
  },
}