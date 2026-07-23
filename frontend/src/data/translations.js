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
 appName: 'Krishay',

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

  diseaseCardDesc: 'Upload a crop photo for instant diagnosis',
  historyCardDesc: 'View your saved diagnosis & treatment timeline',
  noticesCardDesc: 'Latest schemes, MSP, subsidies & deadlines',
  expertsCardDesc: 'Find KVKs, soil labs & fertilizer shops nearby',
  chatbotCardDesc: 'Ask anything about crops, pests & irrigation',

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
  noHistory: 'No history yet — try Disease Detection first.',

  governmentNoticeBoard: 'Government Notice Board',
  loadingNotices: 'Loading notices...',
  noNotices: 'No notices available.',
  noticesError: 'Could not load government notices.',
  readMore: 'Read more',

  nearbyAgricultureExperts: 'Nearby Agriculture Experts',
  nearbyDescription:
    'Powered by OpenStreetMap — showing Krishi Vigyan Kendras, agriculture offices, soil labs and fertilizer shops near you.',
  geolocationUnsupported:
    'Geolocation is not supported by your browser.',
  locationError:
    'Could not get your location. Please allow location access.',
  nearbyFetchError: 'Failed to fetch nearby centers.',
  loadingCenters: 'Loading nearby centers...',
  noCenters:
    'No agriculture centers were found near your location in OpenStreetMap data.',

  thinking: 'Thinking...',
  chatPlaceholder: 'Ask about crops, pests, weather...',
  send: 'Send',
  chatError: 'Sorry, something went wrong.',
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
  loginHelp: 'मोबाइल नंबर या ईमेल से लॉग इन करें।',
  emailOrMobile: 'ईमेल या मोबाइल नंबर',
  password: 'पासवर्ड',
  login: 'लॉग इन करें',
  noAccount: 'नया खाता चाहिए?',
  createAccount: 'खाता बनाएं',
  name: 'नाम',
  state: 'राज्य',
  createPassword: 'पासवर्ड बनाएं',
  alreadyAccount: 'पहले से खाता है?',

  changeLanguage: 'वेबसाइट की भाषा',
  saveLanguage: 'भाषा सेव करें',

  account: 'खाता',
  mobile: 'मोबाइल',
  email: 'ईमेल',
  provider: 'लॉगिन का तरीका',
  saved: 'भाषा सेव हो गई।',

  diseaseCardDesc: 'फसल की फोटो अपलोड करके रोग की पहचान करें',
  historyCardDesc: 'पिछली जांच और उपचार देखें',
  noticesCardDesc: 'नई योजनाएं, एमएसपी, सब्सिडी और अंतिम तिथियां',
  expertsCardDesc: 'नजदीकी कृषि विशेषज्ञ और केंद्र खोजें',
  chatbotCardDesc: 'फसल, कीट और सिंचाई के बारे में पूछें',

  cropDiseaseDetection: 'फसल रोग पहचान',
  useCamera: 'कैमरा इस्तेमाल करें',
  closeCamera: 'कैमरा बंद करें',
  capturePhoto: 'फोटो लें',
  detectDisease: 'रोग पहचानें',
  analyzing: 'जांच की जा रही है...',
  selectImageFirst: 'पहले एक फोटो चुनें।',
  backendConnectionError: 'सर्वर से कनेक्ट नहीं हो सका।',

  diagnosisResult: 'जांच का परिणाम',
  crop: 'फसल',
  disease: 'रोग',
  confidence: 'विश्वसनीयता',
  unknownCrop: 'अज्ञात फसल',
  unknown: 'अज्ञात',

  treatmentRecommendation: 'उपचार की सलाह',
  explanation: 'जानकारी',
  organicTreatment: 'जैविक उपचार',
  chemicalTreatment: 'रासायनिक उपचार',
  dosage: 'मात्रा',
  spraySchedule: 'छिड़काव समय',
  recoveryTime: 'ठीक होने का समय',
  prevention: 'बचाव',

  cropHealthHistory: 'फसल स्वास्थ्य इतिहास',
  noHistory: 'अभी कोई इतिहास नहीं है — पहले रोग पहचान का उपयोग करें।',

  governmentNoticeBoard: 'सरकारी सूचना बोर्ड',
  loadingNotices: 'सूचनाएं लोड हो रही हैं...',
  noNotices: 'कोई सूचना उपलब्ध नहीं है।',
  noticesError: 'सरकारी सूचनाएं लोड नहीं हो सकीं।',
  readMore: 'और पढ़ें',

  nearbyAgricultureExperts: 'नज़दीकी कृषि विशेषज्ञ',
  nearbyDescription:
    'OpenStreetMap की मदद से आपके पास के कृषि विज्ञान केंद्र, कृषि कार्यालय, मिट्टी जांच केंद्र और खाद की दुकानें दिखाई जाती हैं।',
  geolocationUnsupported:
    'आपका ब्राउज़र स्थान सुविधा का समर्थन नहीं करता।',
  locationError:
    'आपका स्थान नहीं मिल सका। कृपया लोकेशन की अनुमति दें।',
  nearbyFetchError: 'नज़दीकी केंद्र नहीं मिल सके।',
  loadingCenters: 'नज़दीकी केंद्र खोजे जा रहे हैं...',
  noCenters: 'आपके पास कोई कृषि केंद्र नहीं मिला।',

  thinking: 'सोच रहा हूँ...',
  chatPlaceholder: 'फसल, कीट, मौसम के बारे में पूछें...',
  send: 'भेजें',
  chatError: 'क्षमा करें, कुछ गलत हो गया।',
}

// =====================================================
// REGIONAL LANGUAGES
// =====================================================

const raj = {
  ...hi,
  appName: 'क्रॉपसेवर',
  dashboard: 'मुख्य पन्नो',
  diseaseDetection: 'फसल रो रोग पहचान',
  cropHistory: 'फसल रो इतिहास',
  governmentNotices: 'सरकारी सूचनावां',
  nearbyExperts: 'नजीक रा कृषि जाणकार',
  profile: 'प्रोफाइल',
}

const bho = {
  ...hi,
  dashboard: 'मुख्य पन्ना',
  diseaseDetection: 'फसल के रोग के पहचान',
  cropHistory: 'फसल के इतिहास',
  governmentNotices: 'सरकारी सूचना',
  nearbyExperts: 'नजदीक के कृषि विशेषज्ञ',
}

const har = {
  ...hi,
  dashboard: 'मुख्य पन्ना',
  diseaseDetection: 'फसल की बीमारी की पहचान',
  cropHistory: 'फसल का इतिहास',
  governmentNotices: 'सरकारी सूचना',
  nearbyExperts: 'नजदीक के खेती विशेषज्ञ',
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
  loginHelp: 'તમારા મોબાઇલ નંબર અથવા ઈમેલથી લૉગ ઇન કરો.',
  emailOrMobile: 'ઈમેલ અથવા મોબાઇલ નંબર',
  password: 'પાસવર્ડ',
  login: 'લૉગ ઇન કરો',
  noAccount: 'ખાતું નથી?',
  createAccount: 'ખાતું બનાવો',
  name: 'નામ',
  state: 'રાજ્ય',
  createPassword: 'પાસવર્ડ બનાવો',
  alreadyAccount: 'પહેલેથી ખાતું છે?',

  changeLanguage: 'વેબસાઇટની ભાષા',
  saveLanguage: 'ભાષા સાચવો',

  account: 'ખાતું',
  mobile: 'મોબાઇલ',
  email: 'ઈમેલ',
  provider: 'લૉગિન પદ્ધતિ',
  saved: 'ભાષા સાચવવામાં આવી.',

  cropDiseaseDetection: 'પાક રોગ ઓળખ',
  useCamera: 'કેમેરાનો ઉપયોગ કરો',
  closeCamera: 'કેમેરા બંધ કરો',
  capturePhoto: 'ફોટો લો',
  detectDisease: 'રોગ ઓળખો',
  analyzing: 'વિશ્લેષણ થઈ રહ્યું છે...',
  selectImageFirst: 'પહેલા એક ફોટો પસંદ કરો.',
  backendConnectionError: 'સર્વર સાથે જોડાઈ શકાયું નથી.',

  diagnosisResult: 'નિદાન પરિણામ',
  crop: 'પાક',
  disease: 'રોગ',
  confidence: 'વિશ્વસનીયતા',
  unknownCrop: 'અજ્ઞાત પાક',
  unknown: 'અજ્ઞાત',

  treatmentRecommendation: 'સારવારની ભલામણ',
  explanation: 'સમજૂતી',
  organicTreatment: 'જૈવિક સારવાર',
  chemicalTreatment: 'રાસાયણિક સારવાર',
  dosage: 'માત્રા',
  spraySchedule: 'છંટકાવ સમયપત્રક',
  recoveryTime: 'સાજા થવાનો સમય',
  prevention: 'નિવારણ',

  cropHealthHistory: 'પાક આરોગ્ય ઇતિહાસ',
  governmentNoticeBoard: 'સરકારી સૂચના બોર્ડ',
  nearbyAgricultureExperts: 'નજીકના કૃષિ નિષ્ણાતો',

  thinking: 'વિચારી રહ્યું છે...',
  chatPlaceholder: 'પાક, જીવાત, હવામાન વિશે પૂછો...',
  send: 'મોકલો',
  chatError: 'માફ કરશો, કંઈક ખોટું થયું.',
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
  treatmentRecommendation: 'उपचार शिफारस',
  organicTreatment: 'सेंद्रिय उपचार',
  chemicalTreatment: 'रासायनिक उपचार',
  prevention: 'प्रतिबंध',
  cropHealthHistory: 'पीक आरोग्य इतिहास',
  governmentNoticeBoard: 'सरकारी सूचना फलक',
  nearbyAgricultureExperts: 'जवळचे कृषी तज्ञ',
  thinking: 'विचार करत आहे...',
  send: 'पाठवा',
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

  cropDiseaseDetection: 'ਫਸਲ ਰੋਗ ਪਛਾਣ',
  useCamera: 'ਕੈਮਰਾ ਵਰਤੋ',
  closeCamera: 'ਕੈਮਰਾ ਬੰਦ ਕਰੋ',
  capturePhoto: 'ਫੋਟੋ ਲਓ',
  detectDisease: 'ਰੋਗ ਪਛਾਣੋ',
  analyzing: 'ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
  diagnosisResult: 'ਜਾਂਚ ਨਤੀਜਾ',
  crop: 'ਫਸਲ',
  disease: 'ਰੋਗ',
  treatmentRecommendation: 'ਇਲਾਜ ਦੀ ਸਿਫਾਰਸ਼',
  prevention: 'ਬਚਾਅ',
  cropHealthHistory: 'ਫਸਲ ਸਿਹਤ ਇਤਿਹਾਸ',
  governmentNoticeBoard: 'ਸਰਕਾਰੀ ਸੂਚਨਾ ਬੋਰਡ',
  nearbyAgricultureExperts: 'ਨੇੜਲੇ ਖੇਤੀ ਮਾਹਿਰ',
  thinking: 'ਸੋਚ ਰਿਹਾ ਹੈ...',
  send: 'ਭੇਜੋ',
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

  cropDiseaseDetection: 'ফসলের রোগ শনাক্তকরণ',
  useCamera: 'ক্যামেরা ব্যবহার করুন',
  closeCamera: 'ক্যামেরা বন্ধ করুন',
  capturePhoto: 'ছবি তুলুন',
  detectDisease: 'রোগ শনাক্ত করুন',
  analyzing: 'বিশ্লেষণ চলছে...',
  crop: 'ফসল',
  disease: 'রোগ',
  prevention: 'প্রতিরোধ',
  governmentNoticeBoard: 'সরকারি বিজ্ঞপ্তি বোর্ড',
  nearbyAgricultureExperts: 'কাছের কৃষি বিশেষজ্ঞ',
  send: 'পাঠান',
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

  cropDiseaseDetection: 'பயிர் நோய் கண்டறிதல்',
  useCamera: 'கேமராவைப் பயன்படுத்து',
  closeCamera: 'கேமராவை மூடு',
  capturePhoto: 'புகைப்படம் எடு',
  detectDisease: 'நோயைக் கண்டறி',
  analyzing: 'பகுப்பாய்வு செய்யப்படுகிறது...',
  crop: 'பயிர்',
  disease: 'நோய்',
  prevention: 'தடுப்பு',
  governmentNoticeBoard: 'அரசு அறிவிப்பு பலகை',
  nearbyAgricultureExperts: 'அருகிலுள்ள வேளாண் நிபுணர்கள்',
  send: 'அனுப்பு',
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

  cropDiseaseDetection: 'పంట వ్యాధి గుర్తింపు',
  useCamera: 'కెమెరా ఉపయోగించండి',
  closeCamera: 'కెమెరా మూసివేయండి',
  capturePhoto: 'ఫోటో తీయండి',
  detectDisease: 'వ్యాధిని గుర్తించండి',
  analyzing: 'విశ్లేషిస్తోంది...',
  crop: 'పంట',
  disease: 'వ్యాధి',
  prevention: 'నివారణ',
  governmentNoticeBoard: 'ప్రభుత్వ నోటీసు బోర్డు',
  nearbyAgricultureExperts: 'సమీప వ్యవసాయ నిపుణులు',
  send: 'పంపండి',
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

  cropDiseaseDetection: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ',
  useCamera: 'ಕ್ಯಾಮೆರಾ ಬಳಸಿ',
  closeCamera: 'ಕ್ಯಾಮೆರಾ ಮುಚ್ಚಿ',
  capturePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
  detectDisease: 'ರೋಗ ಪತ್ತೆ ಮಾಡಿ',
  analyzing: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
  selectImageFirst: 'ಮೊದಲು ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  diagnosisResult: 'ರೋಗನಿರ್ಣಯ ಫಲಿತಾಂಶ',
  crop: 'ಬೆಳೆ',
  disease: 'ರೋಗ',
  confidence: 'ವಿಶ್ವಾಸ',
  treatmentRecommendation: 'ಚಿಕಿತ್ಸೆಯ ಶಿಫಾರಸು',
  explanation: 'ವಿವರಣೆ',
  organicTreatment: 'ಸಾವಯವ ಚಿಕಿತ್ಸೆ',
  chemicalTreatment: 'ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ',
  dosage: 'ಪ್ರಮಾಣ',
  spraySchedule: 'ಸಿಂಪಡಣೆ ವೇಳಾಪಟ್ಟಿ',
  recoveryTime: 'ಚೇತರಿಕೆ ಸಮಯ',
  prevention: 'ತಡೆಗಟ್ಟುವಿಕೆ',
  cropHealthHistory: 'ಬೆಳೆ ಆರೋಗ್ಯ ಇತಿಹಾಸ',
  governmentNoticeBoard: 'ಸರ್ಕಾರಿ ಸೂಚನಾ ಫಲಕ',
  loadingNotices: 'ಸೂಚನೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...',
  nearbyAgricultureExperts: 'ಹತ್ತಿರದ ಕೃಷಿ ತಜ್ಞರು',
  loadingCenters: 'ಹತ್ತಿರದ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
  thinking: 'ಯೋಚಿಸಲಾಗುತ್ತಿದೆ...',
  chatPlaceholder: 'ಬೆಳೆ, ಕೀಟ, ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...',
  send: 'ಕಳುಹಿಸಿ',
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

  cropDiseaseDetection: 'വിള രോഗ നിർണയം',
  useCamera: 'ക്യാമറ ഉപയോഗിക്കുക',
  closeCamera: 'ക്യാമറ അടയ്ക്കുക',
  capturePhoto: 'ഫോട്ടോ എടുക്കുക',
  detectDisease: 'രോഗം കണ്ടെത്തുക',
  analyzing: 'വിശകലനം ചെയ്യുന്നു...',
  crop: 'വിള',
  disease: 'രോഗം',
  prevention: 'പ്രതിരോധം',
  governmentNoticeBoard: 'സർക്കാർ അറിയിപ്പ് ബോർഡ്',
  nearbyAgricultureExperts: 'സമീപ കൃഷി വിദഗ്ധർ',
  send: 'അയയ്ക്കുക',
}

// =====================================================
// ODIA
// =====================================================

const or = {
  ...en,

  dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
  diseaseDetection: 'ରୋଗ ଚିହ୍ନଟ',
  cropHistory: 'ଫସଲ ଇତିହାସ',
  governmentNotices: 'ସରକାରୀ ସୂଚନା',
  nearbyExperts: 'ନିକଟସ୍ଥ ବିଶେଷଜ୍ଞ',
  aiChatbot: 'ଏଆଇ ଚାଟବଟ୍',
  profile: 'ପ୍ରୋଫାଇଲ୍',
  logout: 'ଲଗ୍ ଆଉଟ୍',

  cropDiseaseDetection: 'ଫସଲ ରୋଗ ଚିହ୍ନଟ',
  crop: 'ଫସଲ',
  disease: 'ରୋଗ',
  governmentNoticeBoard: 'ସରକାରୀ ସୂଚନା ବୋର୍ଡ',
  nearbyAgricultureExperts: 'ନିକଟସ୍ଥ କୃଷି ବିଶେଷଜ୍ଞ',
  send: 'ପଠାନ୍ତୁ',
}

// =====================================================
// ASSAMESE
// =====================================================

const as = {
  ...en,

  dashboard: 'ডেশ্বব’ৰ্ড',
  diseaseDetection: 'ৰোগ চিনাক্তকৰণ',
  cropHistory: 'শস্যৰ ইতিহাস',
  governmentNotices: 'চৰকাৰী জাননী',
  nearbyExperts: 'ওচৰৰ বিশেষজ্ঞ',
  aiChatbot: 'এআই চেটবট',
  profile: 'প্ৰফাইল',
  logout: 'লগ আউট',

  cropDiseaseDetection: 'শস্যৰ ৰোগ চিনাক্তকৰণ',
  crop: 'শস্য',
  disease: 'ৰোগ',
  governmentNoticeBoard: 'চৰকাৰী জাননী ফলক',
  nearbyAgricultureExperts: 'ওচৰৰ কৃষি বিশেষজ্ঞ',
  send: 'পঠিয়াওক',
}

// =====================================================
// PAGE-SPECIFIC UI TRANSLATIONS
// =====================================================

const pageUiTranslations = {
  en: {
    cropHealthLabel: 'CROP HEALTH',
    historyDescription:
      'Review your previous crop diagnoses and monitor the health of your crops over time.',
    noCropDiagnoses: 'No crop diagnoses yet',
    detectCropDisease: 'Detect a Crop Disease',
    analyzed: 'Analyzed',
    cropDiagnosis: 'CROP DIAGNOSIS',

    farmerUpdates: 'FARMER UPDATES',
    noticesDescription:
      'Stay informed about government schemes, agricultural programs and important updates for farmers.',
    noUpdatesAvailable: 'No updates available',

    farmSupport: 'FARM SUPPORT',
    locationDetected: 'Location detected',
    yourArea: 'YOUR AREA',
    agricultureServicesNearYou: 'Agriculture services near you',
    location: 'location',
    locations: 'locations',
    noCentersNearby: 'No centers found nearby',
    nearbyLocations: 'NEARBY LOCATIONS',
    agricultureSupportCenters: 'Agriculture support centers',
    kmAway: 'km away',

    yourAccount: 'YOUR ACCOUNT',
    profileDescription:
      'View your personal information and manage your CropSaver preferences.',
    farmerProfile: 'FARMER PROFILE',
    personalInformation: 'Personal Information',
    accountDetails: 'Your CropSaver account details',
    preferences: 'PREFERENCES',
    languagePreferenceDescription:
      'Choose the language you want to use across CropSaver.',
    languageLabel: 'Language',
    languageSaveError: 'Could not save language.',

    detectionDescription:
      'Upload a clear photo of your crop and let CropSaver identify possible diseases and recommend treatment.',
    uploadCropImage: 'Upload crop image',
    chooseClearImage:
      'Choose a clear image of the affected leaf or crop',
    chooseImage: 'Choose Image',
    or: 'or',
    imageReady: 'Image ready for analysis',
    imageHint:
      'JPG, PNG or camera photo • Clear images give better results',
    analysisComplete: 'ANALYSIS COMPLETE',
    cropCare: 'CROP CARE',
    treatmentDescription:
      'Recommended steps based on your crop diagnosis',
  },

  hi: {
    cropHealthLabel: 'फसल स्वास्थ्य',
    historyDescription:
      'अपनी पिछली फसल जांच देखें और समय के साथ अपनी फसलों के स्वास्थ्य की निगरानी करें।',
    noCropDiagnoses: 'अभी तक कोई फसल जांच नहीं हुई',
    detectCropDisease: 'फसल रोग की पहचान करें',
    analyzed: 'विश्लेषण पूर्ण',
    cropDiagnosis: 'फसल जांच',

    farmerUpdates: 'किसान अपडेट',
    noticesDescription:
      'किसानों के लिए सरकारी योजनाओं, कृषि कार्यक्रमों और महत्वपूर्ण सूचनाओं की जानकारी प्राप्त करें।',
    noUpdatesAvailable: 'अभी कोई नई सूचना उपलब्ध नहीं है',

    farmSupport: 'कृषि सहायता',
    locationDetected: 'स्थान मिल गया',
    yourArea: 'आपका क्षेत्र',
    agricultureServicesNearYou: 'आपके पास कृषि सेवाएँ',
    location: 'स्थान',
    locations: 'स्थान',
    noCentersNearby: 'आस-पास कोई केंद्र नहीं मिला',
    nearbyLocations: 'नज़दीकी स्थान',
    agricultureSupportCenters: 'कृषि सहायता केंद्र',
    kmAway: 'किमी दूर',

    yourAccount: 'आपका खाता',
    profileDescription:
      'अपनी व्यक्तिगत जानकारी देखें और CropSaver की प्राथमिकताएँ प्रबंधित करें।',
    farmerProfile: 'किसान प्रोफ़ाइल',
    personalInformation: 'व्यक्तिगत जानकारी',
    accountDetails: 'आपके CropSaver खाते की जानकारी',
    preferences: 'प्राथमिकताएँ',
    languagePreferenceDescription:
      'CropSaver में उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें।',
    languageLabel: 'भाषा',
    languageSaveError: 'भाषा सहेजी नहीं जा सकी।',

    detectionDescription:
      'अपनी फसल की साफ़ तस्वीर अपलोड करें और CropSaver को संभावित रोग पहचानने तथा उपचार सुझाने दें।',
    uploadCropImage: 'फसल की तस्वीर अपलोड करें',
    chooseClearImage:
      'प्रभावित पत्ती या फसल की साफ़ तस्वीर चुनें',
    chooseImage: 'तस्वीर चुनें',
    or: 'या',
    imageReady: 'तस्वीर विश्लेषण के लिए तैयार है',
    imageHint:
      'JPG, PNG या कैमरा फोटो • साफ़ तस्वीर से बेहतर परिणाम मिलते हैं',
    analysisComplete: 'विश्लेषण पूर्ण',
    cropCare: 'फसल देखभाल',
    treatmentDescription:
      'आपकी फसल जांच के आधार पर सुझाए गए उपचार के चरण',
  },

  raj: {
    cropHealthLabel: 'फसल री सेहत',
    historyDescription:
      'आपरी पिछली फसल जांच देखो अर समय रै साथ फसलां री सेहत पर नजर राखो।',
    noCropDiagnoses: 'अभी तक कोई फसल जांच कोनी हुई',
    detectCropDisease: 'फसल रो रोग पहचानो',
    analyzed: 'जांच पूरी',
    cropDiagnosis: 'फसल जांच',
    farmerUpdates: 'किसान अपडेट',
    noticesDescription:
      'सरकारी योजनावां, खेती कार्यक्रमां अर किसानां खातर जरूरी सूचनावां री जानकारी राखो।',
    noUpdatesAvailable: 'अभी कोई नई सूचना उपलब्ध कोनी',
    farmSupport: 'खेती सहायता',
    locationDetected: 'जगह मिल गई',
    yourArea: 'आपरो इलाको',
    agricultureServicesNearYou: 'आपरे नजीक खेती री सेवावां',
    location: 'जगह',
    locations: 'जगहां',
    noCentersNearby: 'नजीक कोई केंद्र कोनी मिल्यो',
    nearbyLocations: 'नजीक री जगहां',
    agricultureSupportCenters: 'खेती सहायता केंद्र',
    kmAway: 'किमी दूर',
    yourAccount: 'आपरो खातो',
    profileDescription:
      'आपरी निजी जानकारी देखो अर CropSaver री पसंद संभाळो।',
    farmerProfile: 'किसान प्रोफाइल',
    personalInformation: 'निजी जानकारी',
    accountDetails: 'आपरे CropSaver खाते री जानकारी',
    preferences: 'पसंद',
    languagePreferenceDescription:
      'CropSaver में काम लेण खातर आपरी पसंद री भाषा चुनो।',
    languageLabel: 'भाषा',
    languageSaveError: 'भाषा सेव कोनी हो सकी।',
    detectionDescription:
      'आपरी फसल री साफ फोटो अपलोड करो अर CropSaver नै रोग पहचान अर इलाज री सलाह देण दो।',
    uploadCropImage: 'फसल री फोटो अपलोड करो',
    chooseClearImage: 'खराब पत्ती या फसल री साफ फोटो चुनो',
    chooseImage: 'फोटो चुनो',
    or: 'या',
    imageReady: 'फोटो जांच खातर तैयार है',
    imageHint:
      'JPG, PNG या कैमरा फोटो • साफ फोटो सूं बेहतर नतीजा मिलसी',
    analysisComplete: 'जांच पूरी',
    cropCare: 'फसल देखभाल',
    treatmentDescription:
      'आपरी फसल जांच रै आधार पर सुझाया इलाज',
  },

  bho: {
    cropHealthLabel: 'फसल के सेहत',
    historyDescription:
      'अपना पिछला फसल जांच देखीं आ समय के साथ फसल के सेहत पर नजर रखीं।',
    noCropDiagnoses: 'अभी ले कवनो फसल जांच नइखे भइल',
    detectCropDisease: 'फसल के रोग पहिचानीं',
    analyzed: 'जांच पूरा',
    cropDiagnosis: 'फसल जांच',
    farmerUpdates: 'किसान अपडेट',
    noticesDescription:
      'सरकारी योजना, खेती कार्यक्रम आ किसान खातिर जरूरी सूचना से जुड़ल रहीं।',
    noUpdatesAvailable: 'अभी कवनो नया सूचना नइखे',
    farmSupport: 'खेती सहायता',
    locationDetected: 'जगह मिल गइल',
    yourArea: 'रउआ इलाका',
    agricultureServicesNearYou: 'रउआ नजदीक खेती सेवा',
    location: 'जगह',
    locations: 'जगह',
    noCentersNearby: 'नजदीक कवनो केंद्र ना मिलल',
    nearbyLocations: 'नजदीकी जगह',
    agricultureSupportCenters: 'खेती सहायता केंद्र',
    kmAway: 'किमी दूर',
    yourAccount: 'रउआ खाता',
    profileDescription:
      'अपना निजी जानकारी देखीं आ CropSaver के पसंद संभालीं।',
    farmerProfile: 'किसान प्रोफाइल',
    personalInformation: 'निजी जानकारी',
    accountDetails: 'रउआ CropSaver खाता के जानकारी',
    preferences: 'पसंद',
    languagePreferenceDescription:
      'CropSaver में इस्तेमाल खातिर अपना पसंद के भाषा चुनीं।',
    languageLabel: 'भाषा',
    languageSaveError: 'भाषा सेव ना हो सकल।',
    detectionDescription:
      'अपना फसल के साफ फोटो अपलोड करीं आ CropSaver से रोग पहचान आ इलाज के सलाह लीं।',
    uploadCropImage: 'फसल के फोटो अपलोड करीं',
    chooseClearImage:
      'प्रभावित पत्ता या फसल के साफ फोटो चुनीं',
    chooseImage: 'फोटो चुनीं',
    or: 'या',
    imageReady: 'फोटो जांच खातिर तैयार बा',
    imageHint:
      'JPG, PNG या कैमरा फोटो • साफ फोटो से बेहतर नतीजा मिली',
    analysisComplete: 'जांच पूरा',
    cropCare: 'फसल देखभाल',
    treatmentDescription:
      'रउआ फसल जांच के आधार पर सुझावल इलाज',
  },

  har: {
    cropHealthLabel: 'फसल की सेहत',
    historyDescription:
      'अपणी पिछली फसल जांच देखो अर समय के साथ फसल की सेहत पे नजर राखो।',
    noCropDiagnoses: 'अभी तक कोई फसल जांच ना हुई',
    detectCropDisease: 'फसल की बीमारी पहचानो',
    analyzed: 'जांच पूरी',
    cropDiagnosis: 'फसल जांच',
    farmerUpdates: 'किसान अपडेट',
    noticesDescription:
      'सरकारी योजनाओं, खेती के कार्यक्रमां अर किसानां खातर जरूरी खबरां की जानकारी राखो।',
    noUpdatesAvailable: 'अभी कोई नई सूचना उपलब्ध ना सै',
    farmSupport: 'खेती सहायता',
    locationDetected: 'जगह मिल गई',
    yourArea: 'थारा इलाका',
    agricultureServicesNearYou: 'थारे नजदीक खेती की सेवाएं',
    location: 'जगह',
    locations: 'जगह',
    noCentersNearby: 'नजदीक कोई केंद्र ना मिला',
    nearbyLocations: 'नजदीकी जगह',
    agricultureSupportCenters: 'खेती सहायता केंद्र',
    kmAway: 'किमी दूर',
    yourAccount: 'थारा खाता',
    profileDescription:
      'अपणी निजी जानकारी देखो अर CropSaver की पसंद संभालो।',
    farmerProfile: 'किसान प्रोफाइल',
    personalInformation: 'निजी जानकारी',
    accountDetails: 'थारे CropSaver खाते की जानकारी',
    preferences: 'पसंद',
    languagePreferenceDescription:
      'CropSaver में इस्तेमाल खातर अपणी पसंद की भाषा चुनो।',
    languageLabel: 'भाषा',
    languageSaveError: 'भाषा सेव ना हो सकी।',
    detectionDescription:
      'अपणी फसल की साफ फोटो अपलोड करो अर CropSaver तै बीमारी पहचान अर इलाज की सलाह लो।',
    uploadCropImage: 'फसल की फोटो अपलोड करो',
    chooseClearImage:
      'खराब पत्ते या फसल की साफ फोटो चुनो',
    chooseImage: 'फोटो चुनो',
    or: 'या',
    imageReady: 'फोटो जांच खातर तैयार सै',
    imageHint:
      'JPG, PNG या कैमरा फोटो • साफ फोटो तै बेहतर नतीजा मिलेगा',
    analysisComplete: 'जांच पूरी',
    cropCare: 'फसल देखभाल',
    treatmentDescription:
      'थारी फसल जांच के आधार पे सुझाया इलाज',
  },

  gu: {
    cropHealthLabel: 'પાક આરોગ્ય',
    historyDescription:
      'તમારા અગાઉના પાક નિદાન જુઓ અને સમય સાથે પાકના આરોગ્ય પર નજર રાખો.',
    noCropDiagnoses: 'હજુ સુધી કોઈ પાક નિદાન નથી',
    detectCropDisease: 'પાકનો રોગ ઓળખો',
    analyzed: 'વિશ્લેષણ પૂર્ણ',
    cropDiagnosis: 'પાક નિદાન',
    farmerUpdates: 'ખેડૂત અપડેટ્સ',
    noticesDescription:
      'સરકારી યોજનાઓ, કૃષિ કાર્યક્રમો અને ખેડૂતો માટેના મહત્વપૂર્ણ અપડેટ્સ વિશે માહિતગાર રહો.',
    noUpdatesAvailable: 'હાલ કોઈ નવી માહિતી ઉપલબ્ધ નથી',
    farmSupport: 'કૃષિ સહાય',
    locationDetected: 'સ્થાન મળી ગયું',
    yourArea: 'તમારો વિસ્તાર',
    agricultureServicesNearYou: 'તમારી નજીકની કૃષિ સેવાઓ',
    location: 'સ્થાન',
    locations: 'સ્થાનો',
    noCentersNearby: 'નજીક કોઈ કેન્દ્ર મળ્યું નથી',
    nearbyLocations: 'નજીકના સ્થળો',
    agricultureSupportCenters: 'કૃષિ સહાય કેન્દ્રો',
    kmAway: 'કિમી દૂર',
    yourAccount: 'તમારું ખાતું',
    profileDescription:
      'તમારી વ્યક્તિગત માહિતી જુઓ અને CropSaver પસંદગીઓ સંચાલિત કરો.',
    farmerProfile: 'ખેડૂત પ્રોફાઇલ',
    personalInformation: 'વ્યક્તિગત માહિતી',
    accountDetails: 'તમારા CropSaver ખાતાની વિગતો',
    preferences: 'પસંદગીઓ',
    languagePreferenceDescription:
      'CropSaver માં ઉપયોગ કરવા માટે તમારી પસંદગીની ભાષા પસંદ કરો.',
    languageLabel: 'ભાષા',
    languageSaveError: 'ભાષા સાચવી શકાઈ નથી.',
    detectionDescription:
      'તમારા પાકનો સ્પષ્ટ ફોટો અપલોડ કરો અને CropSaver ને સંભવિત રોગ ઓળખી સારવાર સૂચવવા દો.',
    uploadCropImage: 'પાકનો ફોટો અપલોડ કરો',
    chooseClearImage:
      'અસરગ્રસ્ત પાન અથવા પાકનો સ્પષ્ટ ફોટો પસંદ કરો',
    chooseImage: 'ફોટો પસંદ કરો',
    or: 'અથવા',
    imageReady: 'ફોટો વિશ્લેષણ માટે તૈયાર છે',
    imageHint:
      'JPG, PNG અથવા કેમેરા ફોટો • સ્પષ્ટ ફોટાથી વધુ સારા પરિણામ મળે છે',
    analysisComplete: 'વિશ્લેષણ પૂર્ણ',
    cropCare: 'પાકની સંભાળ',
    treatmentDescription:
      'તમારા પાકના નિદાનના આધારે સૂચવેલા પગલાં',
  },

  mr: {
    cropHealthLabel: 'पीक आरोग्य',
    historyDescription:
      'तुमचे मागील पीक निदान पहा आणि कालांतराने पिकांच्या आरोग्यावर लक्ष ठेवा.',
    noCropDiagnoses: 'अजून कोणतेही पीक निदान नाही',
    detectCropDisease: 'पिकाचा रोग ओळखा',
    analyzed: 'विश्लेषण पूर्ण',
    cropDiagnosis: 'पीक निदान',
    farmerUpdates: 'शेतकरी अपडेट्स',
    noticesDescription:
      'सरकारी योजना, कृषी कार्यक्रम आणि शेतकऱ्यांसाठी महत्त्वाच्या अपडेट्सची माहिती मिळवा.',
    noUpdatesAvailable: 'सध्या कोणतीही नवीन माहिती उपलब्ध नाही',
    farmSupport: 'कृषी सहाय्य',
    locationDetected: 'स्थान सापडले',
    yourArea: 'तुमचा परिसर',
    agricultureServicesNearYou: 'तुमच्या जवळच्या कृषी सेवा',
    location: 'स्थान',
    locations: 'स्थाने',
    noCentersNearby: 'जवळ कोणतेही केंद्र सापडले नाही',
    nearbyLocations: 'जवळची ठिकाणे',
    agricultureSupportCenters: 'कृषी सहाय्य केंद्रे',
    kmAway: 'किमी दूर',
    yourAccount: 'तुमचे खाते',
    profileDescription:
      'तुमची वैयक्तिक माहिती पहा आणि CropSaver प्राधान्ये व्यवस्थापित करा.',
    farmerProfile: 'शेतकरी प्रोफाइल',
    personalInformation: 'वैयक्तिक माहिती',
    accountDetails: 'तुमच्या CropSaver खात्याची माहिती',
    preferences: 'प्राधान्ये',
    languagePreferenceDescription:
      'CropSaver मध्ये वापरण्यासाठी तुमची पसंतीची भाषा निवडा.',
    languageLabel: 'भाषा',
    languageSaveError: 'भाषा जतन करता आली नाही.',
    detectionDescription:
      'तुमच्या पिकाचा स्पष्ट फोटो अपलोड करा आणि CropSaver ला संभाव्य रोग ओळखून उपचार सुचवू द्या.',
    uploadCropImage: 'पिकाचा फोटो अपलोड करा',
    chooseClearImage:
      'प्रभावित पान किंवा पिकाचा स्पष्ट फोटो निवडा',
    chooseImage: 'फोटो निवडा',
    or: 'किंवा',
    imageReady: 'फोटो विश्लेषणासाठी तयार आहे',
    imageHint:
      'JPG, PNG किंवा कॅमेरा फोटो • स्पष्ट फोटोमुळे चांगले परिणाम मिळतात',
    analysisComplete: 'विश्लेषण पूर्ण',
    cropCare: 'पीक काळजी',
    treatmentDescription:
      'तुमच्या पीक निदानावर आधारित सुचवलेली उपचार पावले',
  },

  pa: {
    cropHealthLabel: 'ਫਸਲ ਸਿਹਤ',
    historyDescription:
      'ਆਪਣੀਆਂ ਪਿਛਲੀਆਂ ਫਸਲ ਜਾਂਚਾਂ ਵੇਖੋ ਅਤੇ ਸਮੇਂ ਦੇ ਨਾਲ ਫਸਲਾਂ ਦੀ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।',
    noCropDiagnoses: 'ਹਾਲੇ ਕੋਈ ਫਸਲ ਜਾਂਚ ਨਹੀਂ ਹੋਈ',
    detectCropDisease: 'ਫਸਲ ਦਾ ਰੋਗ ਪਛਾਣੋ',
    analyzed: 'ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ',
    cropDiagnosis: 'ਫਸਲ ਜਾਂਚ',
    farmerUpdates: 'ਕਿਸਾਨ ਅਪਡੇਟ',
    noticesDescription:
      'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਖੇਤੀਬਾੜੀ ਪ੍ਰੋਗਰਾਮਾਂ ਅਤੇ ਕਿਸਾਨਾਂ ਲਈ ਮਹੱਤਵਪੂਰਨ ਜਾਣਕਾਰੀ ਨਾਲ ਅਪਡੇਟ ਰਹੋ।',
    noUpdatesAvailable: 'ਇਸ ਵੇਲੇ ਕੋਈ ਨਵੀਂ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ',
    farmSupport: 'ਖੇਤੀ ਸਹਾਇਤਾ',
    locationDetected: 'ਟਿਕਾਣਾ ਮਿਲ ਗਿਆ',
    yourArea: 'ਤੁਹਾਡਾ ਇਲਾਕਾ',
    agricultureServicesNearYou: 'ਤੁਹਾਡੇ ਨੇੜੇ ਖੇਤੀ ਸੇਵਾਵਾਂ',
    location: 'ਟਿਕਾਣਾ',
    locations: 'ਟਿਕਾਣੇ',
    noCentersNearby: 'ਨੇੜੇ ਕੋਈ ਕੇਂਦਰ ਨਹੀਂ ਮਿਲਿਆ',
    nearbyLocations: 'ਨੇੜਲੇ ਟਿਕਾਣੇ',
    agricultureSupportCenters: 'ਖੇਤੀ ਸਹਾਇਤਾ ਕੇਂਦਰ',
    kmAway: 'ਕਿਮੀ ਦੂਰ',
    yourAccount: 'ਤੁਹਾਡਾ ਖਾਤਾ',
    profileDescription:
      'ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਵੇਖੋ ਅਤੇ CropSaver ਦੀਆਂ ਪਸੰਦਾਂ ਸੰਭਾਲੋ।',
    farmerProfile: 'ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ',
    personalInformation: 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ',
    accountDetails: 'ਤੁਹਾਡੇ CropSaver ਖਾਤੇ ਦੀ ਜਾਣਕਾਰੀ',
    preferences: 'ਪਸੰਦਾਂ',
    languagePreferenceDescription:
      'CropSaver ਵਿੱਚ ਵਰਤਣ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ।',
    languageLabel: 'ਭਾਸ਼ਾ',
    languageSaveError: 'ਭਾਸ਼ਾ ਸੰਭਾਲੀ ਨਹੀਂ ਜਾ ਸਕੀ।',
    detectionDescription:
      'ਆਪਣੀ ਫਸਲ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ ਅਤੇ CropSaver ਨੂੰ ਸੰਭਾਵਿਤ ਰੋਗ ਪਛਾਣ ਕੇ ਇਲਾਜ ਸੁਝਾਉਣ ਦਿਓ।',
    uploadCropImage: 'ਫਸਲ ਦੀ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ',
    chooseClearImage:
      'ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਜਾਂ ਫਸਲ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਚੁਣੋ',
    chooseImage: 'ਤਸਵੀਰ ਚੁਣੋ',
    or: 'ਜਾਂ',
    imageReady: 'ਤਸਵੀਰ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਤਿਆਰ ਹੈ',
    imageHint:
      'JPG, PNG ਜਾਂ ਕੈਮਰਾ ਫੋਟੋ • ਸਾਫ਼ ਤਸਵੀਰ ਨਾਲ ਵਧੀਆ ਨਤੀਜੇ ਮਿਲਦੇ ਹਨ',
    analysisComplete: 'ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ',
    cropCare: 'ਫਸਲ ਦੀ ਦੇਖਭਾਲ',
    treatmentDescription:
      'ਤੁਹਾਡੀ ਫਸਲ ਜਾਂਚ ਦੇ ਆਧਾਰ ਤੇ ਸੁਝਾਏ ਇਲਾਜ ਦੇ ਕਦਮ',
  },

  bn: {
    cropHealthLabel: 'ফসলের স্বাস্থ্য',
    historyDescription:
      'আপনার আগের ফসল নির্ণয় দেখুন এবং সময়ের সাথে ফসলের স্বাস্থ্য পর্যবেক্ষণ করুন।',
    noCropDiagnoses: 'এখনও কোনো ফসল নির্ণয় নেই',
    detectCropDisease: 'ফসলের রোগ শনাক্ত করুন',
    analyzed: 'বিশ্লেষণ সম্পন্ন',
    cropDiagnosis: 'ফসল নির্ণয়',
    farmerUpdates: 'কৃষক আপডেট',
    noticesDescription:
      'সরকারি প্রকল্প, কৃষি কর্মসূচি এবং কৃষকদের গুরুত্বপূর্ণ আপডেট সম্পর্কে জানুন।',
    noUpdatesAvailable: 'এখন কোনো নতুন আপডেট নেই',
    farmSupport: 'কৃষি সহায়তা',
    locationDetected: 'অবস্থান পাওয়া গেছে',
    yourArea: 'আপনার এলাকা',
    agricultureServicesNearYou: 'আপনার কাছের কৃষি পরিষেবা',
    location: 'অবস্থান',
    locations: 'অবস্থানসমূহ',
    noCentersNearby: 'কাছাকাছি কোনো কেন্দ্র পাওয়া যায়নি',
    nearbyLocations: 'কাছের স্থানসমূহ',
    agricultureSupportCenters: 'কৃষি সহায়তা কেন্দ্র',
    kmAway: 'কিমি দূরে',
    yourAccount: 'আপনার অ্যাকাউন্ট',
    profileDescription:
      'আপনার ব্যক্তিগত তথ্য দেখুন এবং CropSaver পছন্দসমূহ পরিচালনা করুন।',
    farmerProfile: 'কৃষক প্রোফাইল',
    personalInformation: 'ব্যক্তিগত তথ্য',
    accountDetails: 'আপনার CropSaver অ্যাকাউন্টের তথ্য',
    preferences: 'পছন্দসমূহ',
    languagePreferenceDescription:
      'CropSaver-এ ব্যবহারের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন।',
    languageLabel: 'ভাষা',
    languageSaveError: 'ভাষা সংরক্ষণ করা যায়নি।',
    detectionDescription:
      'আপনার ফসলের একটি পরিষ্কার ছবি আপলোড করুন এবং CropSaver-কে সম্ভাব্য রোগ শনাক্ত ও চিকিৎসা সুপারিশ করতে দিন।',
    uploadCropImage: 'ফসলের ছবি আপলোড করুন',
    chooseClearImage:
      'আক্রান্ত পাতা বা ফসলের পরিষ্কার ছবি নির্বাচন করুন',
    chooseImage: 'ছবি নির্বাচন করুন',
    or: 'অথবা',
    imageReady: 'ছবি বিশ্লেষণের জন্য প্রস্তুত',
    imageHint:
      'JPG, PNG বা ক্যামেরার ছবি • পরিষ্কার ছবিতে ভালো ফল পাওয়া যায়',
    analysisComplete: 'বিশ্লেষণ সম্পন্ন',
    cropCare: 'ফসলের যত্ন',
    treatmentDescription:
      'আপনার ফসল নির্ণয়ের ভিত্তিতে প্রস্তাবিত চিকিৎসার ধাপ',
  },

  ta: {
    cropHealthLabel: 'பயிர் ஆரோக்கியம்',
    historyDescription:
      'முந்தைய பயிர் நோய் கண்டறிதல்களைப் பார்த்து, காலப்போக்கில் பயிர்களின் ஆரோக்கியத்தை கண்காணிக்கவும்.',
    noCropDiagnoses: 'இன்னும் பயிர் நோய் கண்டறிதல் இல்லை',
    detectCropDisease: 'பயிர் நோயைக் கண்டறியவும்',
    analyzed: 'பகுப்பாய்வு முடிந்தது',
    cropDiagnosis: 'பயிர் நோய் கண்டறிதல்',
    farmerUpdates: 'விவசாயி புதுப்பிப்புகள்',
    noticesDescription:
      'அரசுத் திட்டங்கள், வேளாண் திட்டங்கள் மற்றும் விவசாயிகளுக்கான முக்கிய தகவல்களை அறிந்திருங்கள்.',
    noUpdatesAvailable: 'தற்போது புதிய தகவல்கள் இல்லை',
    farmSupport: 'வேளாண் உதவி',
    locationDetected: 'இடம் கண்டறியப்பட்டது',
    yourArea: 'உங்கள் பகுதி',
    agricultureServicesNearYou:
      'உங்களுக்கு அருகிலுள்ள வேளாண் சேவைகள்',
    location: 'இடம்',
    locations: 'இடங்கள்',
    noCentersNearby: 'அருகில் எந்த மையமும் கிடைக்கவில்லை',
    nearbyLocations: 'அருகிலுள்ள இடங்கள்',
    agricultureSupportCenters: 'வேளாண் உதவி மையங்கள்',
    kmAway: 'கிமீ தொலைவில்',
    yourAccount: 'உங்கள் கணக்கு',
    profileDescription:
      'உங்கள் தனிப்பட்ட தகவல்களைப் பார்த்து CropSaver விருப்பங்களை நிர்வகிக்கவும்.',
    farmerProfile: 'விவசாயி சுயவிவரம்',
    personalInformation: 'தனிப்பட்ட தகவல்',
    accountDetails: 'உங்கள் CropSaver கணக்கு விவரங்கள்',
    preferences: 'விருப்பங்கள்',
    languagePreferenceDescription:
      'CropSaver-ல் பயன்படுத்த விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்.',
    languageLabel: 'மொழி',
    languageSaveError: 'மொழியைச் சேமிக்க முடியவில்லை.',
    detectionDescription:
      'உங்கள் பயிரின் தெளிவான படத்தை பதிவேற்றி, CropSaver மூலம் சாத்தியமான நோய்களை கண்டறிந்து சிகிச்சையைப் பெறுங்கள்.',
    uploadCropImage: 'பயிர் படத்தை பதிவேற்றவும்',
    chooseClearImage:
      'பாதிக்கப்பட்ட இலை அல்லது பயிரின் தெளிவான படத்தைத் தேர்ந்தெடுக்கவும்',
    chooseImage: 'படத்தைத் தேர்ந்தெடுக்கவும்',
    or: 'அல்லது',
    imageReady: 'படம் பகுப்பாய்வுக்கு தயாராக உள்ளது',
    imageHint:
      'JPG, PNG அல்லது கேமரா படம் • தெளிவான படங்கள் சிறந்த முடிவுகளை தரும்',
    analysisComplete: 'பகுப்பாய்வு முடிந்தது',
    cropCare: 'பயிர் பராமரிப்பு',
    treatmentDescription:
      'உங்கள் பயிர் நோய் கண்டறிதலின் அடிப்படையில் பரிந்துரைக்கப்பட்ட சிகிச்சை படிகள்',
  },

  te: {
    cropHealthLabel: 'పంట ఆరోగ్యం',
    historyDescription:
      'మీ గత పంట నిర్ధారణలను చూసి, కాలక్రమంలో పంటల ఆరోగ్యాన్ని పర్యవేక్షించండి.',
    noCropDiagnoses: 'ఇంకా పంట నిర్ధారణలు లేవు',
    detectCropDisease: 'పంట వ్యాధిని గుర్తించండి',
    analyzed: 'విశ్లేషణ పూర్తైంది',
    cropDiagnosis: 'పంట నిర్ధారణ',
    farmerUpdates: 'రైతు నవీకరణలు',
    noticesDescription:
      'ప్రభుత్వ పథకాలు, వ్యవసాయ కార్యక్రమాలు మరియు రైతులకు ముఖ్యమైన సమాచారాన్ని తెలుసుకోండి.',
    noUpdatesAvailable: 'ప్రస్తుతం కొత్త సమాచారం లేదు',
    farmSupport: 'వ్యవసాయ సహాయం',
    locationDetected: 'స్థానం గుర్తించబడింది',
    yourArea: 'మీ ప్రాంతం',
    agricultureServicesNearYou:
      'మీ సమీపంలోని వ్యవసాయ సేవలు',
    location: 'స్థానం',
    locations: 'స్థానాలు',
    noCentersNearby: 'సమీపంలో కేంద్రాలు కనబడలేదు',
    nearbyLocations: 'సమీప స్థానాలు',
    agricultureSupportCenters: 'వ్యవసాయ సహాయ కేంద్రాలు',
    kmAway: 'కిమీ దూరంలో',
    yourAccount: 'మీ ఖాతా',
    profileDescription:
      'మీ వ్యక్తిగత సమాచారాన్ని చూడండి మరియు CropSaver ప్రాధాన్యతలను నిర్వహించండి.',
    farmerProfile: 'రైతు ప్రొఫైల్',
    personalInformation: 'వ్యక్తిగత సమాచారం',
    accountDetails: 'మీ CropSaver ఖాతా వివరాలు',
    preferences: 'ప్రాధాన్యతలు',
    languagePreferenceDescription:
      'CropSaverలో ఉపయోగించాలనుకునే భాషను ఎంచుకోండి.',
    languageLabel: 'భాష',
    languageSaveError: 'భాషను సేవ్ చేయలేకపోయాము.',
    detectionDescription:
      'మీ పంట యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేసి, CropSaver ద్వారా సాధ్యమైన వ్యాధులను గుర్తించి చికిత్స సూచనలు పొందండి.',
    uploadCropImage: 'పంట ఫోటోను అప్‌లోడ్ చేయండి',
    chooseClearImage:
      'ప్రభావిత ఆకు లేదా పంట యొక్క స్పష్టమైన ఫోటోను ఎంచుకోండి',
    chooseImage: 'ఫోటోను ఎంచుకోండి',
    or: 'లేదా',
    imageReady: 'ఫోటో విశ్లేషణకు సిద్ధంగా ఉంది',
    imageHint:
      'JPG, PNG లేదా కెమెరా ఫోటో • స్పష్టమైన ఫోటోలు మెరుగైన ఫలితాలు ఇస్తాయి',
    analysisComplete: 'విశ్లేషణ పూర్తైంది',
    cropCare: 'పంట సంరక్షణ',
    treatmentDescription:
      'మీ పంట నిర్ధారణ ఆధారంగా సూచించిన చికిత్స దశలు',
  },

  kn: {
    cropHealthLabel: 'ಬೆಳೆ ಆರೋಗ್ಯ',
    historyDescription:
      'ನಿಮ್ಮ ಹಿಂದಿನ ಬೆಳೆ ರೋಗನಿರ್ಣಯಗಳನ್ನು ನೋಡಿ ಮತ್ತು ಕಾಲಕ್ರಮೇಣ ಬೆಳೆಗಳ ಆರೋಗ್ಯವನ್ನು ಗಮನಿಸಿ.',
    noCropDiagnoses: 'ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ರೋಗನಿರ್ಣಯ ಇಲ್ಲ',
    detectCropDisease: 'ಬೆಳೆ ರೋಗವನ್ನು ಪತ್ತೆ ಮಾಡಿ',
    analyzed: 'ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
    cropDiagnosis: 'ಬೆಳೆ ರೋಗನಿರ್ಣಯ',
    farmerUpdates: 'ರೈತ ನವೀಕರಣಗಳು',
    noticesDescription:
      'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಕೃಷಿ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ರೈತರಿಗೆ ಮುಖ್ಯವಾದ ಮಾಹಿತಿಯನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ.',
    noUpdatesAvailable: 'ಈಗ ಯಾವುದೇ ಹೊಸ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
    farmSupport: 'ಕೃಷಿ ಸಹಾಯ',
    locationDetected: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ',
    yourArea: 'ನಿಮ್ಮ ಪ್ರದೇಶ',
    agricultureServicesNearYou:
      'ನಿಮ್ಮ ಹತ್ತಿರದ ಕೃಷಿ ಸೇವೆಗಳು',
    location: 'ಸ್ಥಳ',
    locations: 'ಸ್ಥಳಗಳು',
    noCentersNearby: 'ಹತ್ತಿರ ಯಾವುದೇ ಕೇಂದ್ರಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    nearbyLocations: 'ಹತ್ತಿರದ ಸ್ಥಳಗಳು',
    agricultureSupportCenters: 'ಕೃಷಿ ಸಹಾಯ ಕೇಂದ್ರಗಳು',
    kmAway: 'ಕಿಮೀ ದೂರ',
    yourAccount: 'ನಿಮ್ಮ ಖಾತೆ',
    profileDescription:
      'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನೋಡಿ ಮತ್ತು CropSaver ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    farmerProfile: 'ರೈತ ಪ್ರೊಫೈಲ್',
    personalInformation: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
    accountDetails: 'ನಿಮ್ಮ CropSaver ಖಾತೆಯ ವಿವರಗಳು',
    preferences: 'ಆದ್ಯತೆಗಳು',
    languagePreferenceDescription:
      'CropSaverನಲ್ಲಿ ಬಳಸಲು ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    languageLabel: 'ಭಾಷೆ',
    languageSaveError: 'ಭಾಷೆಯನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
    detectionDescription:
      'ನಿಮ್ಮ ಬೆಳೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು CropSaver ಮೂಲಕ ಸಾಧ್ಯವಾದ ರೋಗಗಳನ್ನು ಗುರುತಿಸಿ ಚಿಕಿತ್ಸೆ ಸಲಹೆ ಪಡೆಯಿರಿ.',
    uploadCropImage: 'ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    chooseClearImage:
      'ಬಾಧಿತ ಎಲೆ ಅಥವಾ ಬೆಳೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
    chooseImage: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
    or: 'ಅಥವಾ',
    imageReady: 'ಫೋಟೋ ವಿಶ್ಲೇಷಣೆಗೆ ಸಿದ್ಧವಾಗಿದೆ',
    imageHint:
      'JPG, PNG ಅಥವಾ ಕ್ಯಾಮೆರಾ ಫೋಟೋ • ಸ್ಪಷ್ಟ ಫೋಟೋಗಳು ಉತ್ತಮ ಫಲಿತಾಂಶ ನೀಡುತ್ತವೆ',
    analysisComplete: 'ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
    cropCare: 'ಬೆಳೆ ಆರೈಕೆ',
    treatmentDescription:
      'ನಿಮ್ಮ ಬೆಳೆ ರೋಗನಿರ್ಣಯದ ಆಧಾರದ ಮೇಲೆ ಸೂಚಿಸಿದ ಚಿಕಿತ್ಸಾ ಕ್ರಮಗಳು',
  },

  ml: {
    cropHealthLabel: 'വിള ആരോഗ്യം',
    historyDescription:
      'നിങ്ങളുടെ മുൻകാല വിള രോഗനിർണയങ്ങൾ കാണുകയും കാലക്രമത്തിൽ വിളകളുടെ ആരോഗ്യം നിരീക്ഷിക്കുകയും ചെയ്യുക.',
    noCropDiagnoses: 'ഇതുവരെ വിള രോഗനിർണയം ഒന്നുമില്ല',
    detectCropDisease: 'വിള രോഗം കണ്ടെത്തുക',
    analyzed: 'വിശകലനം പൂർത്തിയായി',
    cropDiagnosis: 'വിള രോഗനിർണയം',
    farmerUpdates: 'കർഷക അപ്ഡേറ്റുകൾ',
    noticesDescription:
      'സർക്കാർ പദ്ധതികൾ, കാർഷിക പരിപാടികൾ, കർഷകർക്ക് പ്രധാനപ്പെട്ട വിവരങ്ങൾ എന്നിവ അറിയുക.',
    noUpdatesAvailable: 'ഇപ്പോൾ പുതിയ വിവരങ്ങളൊന്നുമില്ല',
    farmSupport: 'കാർഷിക സഹായം',
    locationDetected: 'സ്ഥലം കണ്ടെത്തി',
    yourArea: 'നിങ്ങളുടെ പ്രദേശം',
    agricultureServicesNearYou:
      'നിങ്ങളുടെ സമീപത്തെ കാർഷിക സേവനങ്ങൾ',
    location: 'സ്ഥലം',
    locations: 'സ്ഥലങ്ങൾ',
    noCentersNearby:
      'സമീപത്ത് കേന്ദ്രങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
    nearbyLocations: 'സമീപ സ്ഥലങ്ങൾ',
    agricultureSupportCenters: 'കാർഷിക സഹായ കേന്ദ്രങ്ങൾ',
    kmAway: 'കിമീ അകലെ',
    yourAccount: 'നിങ്ങളുടെ അക്കൗണ്ട്',
    profileDescription:
      'നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങൾ കാണുകയും CropSaver മുൻഗണനകൾ നിയന്ത്രിക്കുകയും ചെയ്യുക.',
    farmerProfile: 'കർഷക പ്രൊഫൈൽ',
    personalInformation: 'വ്യക്തിഗത വിവരങ്ങൾ',
    accountDetails: 'നിങ്ങളുടെ CropSaver അക്കൗണ്ട് വിവരങ്ങൾ',
    preferences: 'മുൻഗണനകൾ',
    languagePreferenceDescription:
      'CropSaverൽ ഉപയോഗിക്കാൻ നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക.',
    languageLabel: 'ഭാഷ',
    languageSaveError: 'ഭാഷ സേവ് ചെയ്യാനായില്ല.',
    detectionDescription:
      'നിങ്ങളുടെ വിളയുടെ വ്യക്തമായ ചിത്രം അപ്‌ലോഡ് ചെയ്ത് CropSaver ഉപയോഗിച്ച് സാധ്യതയുള്ള രോഗങ്ങൾ കണ്ടെത്തി ചികിത്സാ നിർദ്ദേശങ്ങൾ നേടുക.',
    uploadCropImage: 'വിളയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    chooseClearImage:
      'ബാധിച്ച ഇലയുടെയോ വിളയുടെയോ വ്യക്തമായ ചിത്രം തിരഞ്ഞെടുക്കുക',
    chooseImage: 'ചിത്രം തിരഞ്ഞെടുക്കുക',
    or: 'അല്ലെങ്കിൽ',
    imageReady: 'ചിത്രം വിശകലനത്തിന് തയ്യാറാണ്',
    imageHint:
      'JPG, PNG അല്ലെങ്കിൽ ക്യാമറ ചിത്രം • വ്യക്തമായ ചിത്രങ്ങൾ മികച്ച ഫലം നൽകും',
    analysisComplete: 'വിശകലനം പൂർത്തിയായി',
    cropCare: 'വിള പരിചരണം',
    treatmentDescription:
      'നിങ്ങളുടെ വിള രോഗനിർണയത്തെ അടിസ്ഥാനമാക്കിയുള്ള നിർദ്ദേശിച്ച ചികിത്സാ നടപടികൾ',
  },

  or: {
    cropHealthLabel: 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ',
    historyDescription:
      'ଆପଣଙ୍କ ପୂର୍ବ ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ ଦେଖନ୍ତୁ ଏବଂ ସମୟ ସହିତ ଫସଲର ସ୍ୱାସ୍ଥ୍ୟ ନିରୀକ୍ଷଣ କରନ୍ତୁ।',
    noCropDiagnoses:
      'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ ନାହିଁ',
    detectCropDisease: 'ଫସଲ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ',
    analyzed: 'ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ',
    cropDiagnosis: 'ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ',
    farmerUpdates: 'କୃଷକ ଅପଡେଟ୍',
    noticesDescription:
      'ସରକାରୀ ଯୋଜନା, କୃଷି କାର୍ଯ୍ୟକ୍ରମ ଏବଂ କୃଷକଙ୍କ ପାଇଁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୂଚନା ବିଷୟରେ ଜାଣନ୍ତୁ।',
    noUpdatesAvailable:
      'ବର୍ତ୍ତମାନ କୌଣସି ନୂଆ ସୂଚନା ନାହିଁ',
    farmSupport: 'କୃଷି ସହାୟତା',
    locationDetected: 'ଅବସ୍ଥାନ ମିଳିଲା',
    yourArea: 'ଆପଣଙ୍କ ଅଞ୍ଚଳ',
    agricultureServicesNearYou:
      'ଆପଣଙ୍କ ନିକଟରେ କୃଷି ସେବା',
    location: 'ଅବସ୍ଥାନ',
    locations: 'ଅବସ୍ଥାନଗୁଡ଼ିକ',
    noCentersNearby:
      'ନିକଟରେ କୌଣସି କେନ୍ଦ୍ର ମିଳିଲା ନାହିଁ',
    nearbyLocations: 'ନିକଟସ୍ଥ ସ୍ଥାନ',
    agricultureSupportCenters: 'କୃଷି ସହାୟତା କେନ୍ଦ୍ର',
    kmAway: 'କିମି ଦୂରେ',
    yourAccount: 'ଆପଣଙ୍କ ଖାତା',
    profileDescription:
      'ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସୂଚନା ଦେଖନ୍ତୁ ଏବଂ CropSaver ପସନ୍ଦଗୁଡ଼ିକ ପରିଚାଳନା କରନ୍ତୁ।',
    farmerProfile: 'କୃଷକ ପ୍ରୋଫାଇଲ୍',
    personalInformation: 'ବ୍ୟକ୍ତିଗତ ସୂଚନା',
    accountDetails: 'ଆପଣଙ୍କ CropSaver ଖାତାର ବିବରଣୀ',
    preferences: 'ପସନ୍ଦ',
    languagePreferenceDescription:
      'CropSaverରେ ବ୍ୟବହାର ପାଇଁ ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ।',
    languageLabel: 'ଭାଷା',
    languageSaveError: 'ଭାଷା ସେଭ୍ କରିହେଲା ନାହିଁ।',
    detectionDescription:
      'ଆପଣଙ୍କ ଫସଲର ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ ଏବଂ CropSaverକୁ ସମ୍ଭାବ୍ୟ ରୋଗ ଚିହ୍ନଟ କରି ଚିକିତ୍ସା ସୁପାରିଶ କରିବାକୁ ଦିଅନ୍ତୁ।',
    uploadCropImage: 'ଫସଲ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    chooseClearImage:
      'ପ୍ରଭାବିତ ପତ୍ର କିମ୍ବା ଫସଲର ସ୍ପଷ୍ଟ ଫଟୋ ବାଛନ୍ତୁ',
    chooseImage: 'ଫଟୋ ବାଛନ୍ତୁ',
    or: 'କିମ୍ବା',
    imageReady: 'ଫଟୋ ବିଶ୍ଳେଷଣ ପାଇଁ ପ୍ରସ୍ତୁତ',
    imageHint:
      'JPG, PNG କିମ୍ବା କ୍ୟାମେରା ଫଟୋ • ସ୍ପଷ୍ଟ ଫଟୋରୁ ଭଲ ଫଳ ମିଳେ',
    analysisComplete: 'ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ',
    cropCare: 'ଫସଲ ଯତ୍ନ',
    treatmentDescription:
      'ଆପଣଙ୍କ ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ ଆଧାରରେ ସୁପାରିଶିତ ଚିକିତ୍ସା ପଦକ୍ଷେପ',
  },

  as: {
    cropHealthLabel: 'শস্যৰ স্বাস্থ্য',
    historyDescription:
      'আপোনাৰ আগৰ শস্য ৰোগ নিৰ্ণয়সমূহ চাওক আৰু সময়ৰ লগে লগে শস্যৰ স্বাস্থ্য নিৰীক্ষণ কৰক।',
    noCropDiagnoses: 'এতিয়ালৈ কোনো শস্য ৰোগ নিৰ্ণয় নাই',
    detectCropDisease: 'শস্যৰ ৰোগ চিনাক্ত কৰক',
    analyzed: 'বিশ্লেষণ সম্পূৰ্ণ',
    cropDiagnosis: 'শস্য ৰোগ নিৰ্ণয়',
    farmerUpdates: 'কৃষক আপডেট',
    noticesDescription:
      'চৰকাৰী আঁচনি, কৃষি কাৰ্যসূচী আৰু কৃষকৰ বাবে গুৰুত্বপূৰ্ণ তথ্যৰ বিষয়ে অৱগত থাকক।',
    noUpdatesAvailable: 'বৰ্তমান কোনো নতুন তথ্য উপলব্ধ নাই',
    farmSupport: 'কৃষি সহায়তা',
    locationDetected: 'অৱস্থান পোৱা গৈছে',
    yourArea: 'আপোনাৰ অঞ্চল',
    agricultureServicesNearYou: 'আপোনাৰ ওচৰৰ কৃষি সেৱা',
    location: 'অৱস্থান',
    locations: 'অৱস্থানসমূহ',
    noCentersNearby: 'ওচৰত কোনো কেন্দ্ৰ পোৱা নগল',
    nearbyLocations: 'ওচৰৰ স্থানসমূহ',
    agricultureSupportCenters: 'কৃষি সহায়তা কেন্দ্ৰ',
    kmAway: 'কিমি দূৰত',
    yourAccount: 'আপোনাৰ একাউণ্ট',
    profileDescription:
      'আপোনাৰ ব্যক্তিগত তথ্য চাওক আৰু CropSaver পছন্দসমূহ পৰিচালনা কৰক।',
    farmerProfile: 'কৃষক প্ৰফাইল',
    personalInformation: 'ব্যক্তিগত তথ্য',
    accountDetails: 'আপোনাৰ CropSaver একাউণ্টৰ তথ্য',
    preferences: 'পছন্দসমূহ',
    languagePreferenceDescription:
      'CropSaverত ব্যৱহাৰ কৰিবলৈ আপোনাৰ পছন্দৰ ভাষা বাছনি কৰক।',
    languageLabel: 'ভাষা',
    languageSaveError: 'ভাষা সংৰক্ষণ কৰিব পৰা নগল।',
    detectionDescription:
      'আপোনাৰ শস্যৰ স্পষ্ট ফটো আপলোড কৰক আৰু CropSaverক সম্ভাব্য ৰোগ চিনাক্ত কৰি চিকিৎসা পৰামৰ্শ দিবলৈ দিয়ক।',
    uploadCropImage: 'শস্যৰ ফটো আপলোড কৰক',
    chooseClearImage:
      'আক্ৰান্ত পাত বা শস্যৰ স্পষ্ট ফটো বাছনি কৰক',
    chooseImage: 'ফটো বাছনি কৰক',
    or: 'বা',
    imageReady: 'ফটো বিশ্লেষণৰ বাবে সাজু',
    imageHint:
      'JPG, PNG বা কেমেৰা ফটো • স্পষ্ট ফটোৱে ভাল ফলাফল দিয়ে',
    analysisComplete: 'বিশ্লেষণ সম্পূৰ্ণ',
    cropCare: 'শস্যৰ যত্ন',
    treatmentDescription:
      'আপোনাৰ শস্য ৰোগ নিৰ্ণয়ৰ ভিত্তিত পৰামৰ্শ দিয়া চিকিৎসাৰ পদক্ষেপ',
  },
}

// =====================================================
// FINAL TRANSLATIONS
// =====================================================

export const translations = {
  en: {
    ...en,
    ...dashboardTranslations.en,
    ...pageUiTranslations.en,
  },

  hi: {
    ...hi,
    ...dashboardTranslations.hi,
    ...pageUiTranslations.hi,
  },

  raj: {
    ...raj,
    ...dashboardTranslations.raj,
    ...pageUiTranslations.raj,
  },

  bho: {
    ...bho,
    ...dashboardTranslations.bho,
    ...pageUiTranslations.bho,
  },

  har: {
    ...har,
    ...dashboardTranslations.har,
    ...pageUiTranslations.har,
  },

  gu: {
    ...gu,
    ...dashboardTranslations.gu,
    ...pageUiTranslations.gu,
  },

  mr: {
    ...mr,
    ...dashboardTranslations.mr,
    ...pageUiTranslations.mr,
  },

  pa: {
    ...pa,
    ...dashboardTranslations.pa,
    ...pageUiTranslations.pa,
  },

  bn: {
    ...bn,
    ...dashboardTranslations.bn,
    ...pageUiTranslations.bn,
  },

  ta: {
    ...ta,
    ...dashboardTranslations.ta,
    ...pageUiTranslations.ta,
  },

  te: {
    ...te,
    ...dashboardTranslations.te,
    ...pageUiTranslations.te,
  },

  kn: {
    ...kn,
    ...dashboardTranslations.kn,
    ...pageUiTranslations.kn,
  },

  ml: {
    ...ml,
    ...dashboardTranslations.ml,
    ...pageUiTranslations.ml,
  },

  or: {
    ...or,
    ...dashboardTranslations.or,
    ...pageUiTranslations.or,
  },

  as: {
    ...as,
    ...dashboardTranslations.as,
    ...pageUiTranslations.as,
  },
}
