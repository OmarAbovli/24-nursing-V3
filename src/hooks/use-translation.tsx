import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Extended translation keys
const translations = {
  en: {
    "You are available for duty": "You are available for duty",
    "You are offline": "You are offline",
    "Available": "Available",
    "Offline": "Offline",
    "Active Request": "Active Request",
    "Patient Name": "Patient Name",
    "Age": "Age",
    "years": "years",
    "Service Type": "Service Type",
    "Prescribed treatment": "Prescribed treatment",
    "Request Details": "Request Details",
    "Need assistance with daily insulin injection and blood pressure measurement. Patient has all necessary equipment and medication.": 
      "Need assistance with daily insulin injection and blood pressure measurement. Patient has all necessary equipment and medication.",
    "Address": "Address",
    "Location": "Location",
    "Open in Maps": "Open in Maps",
    "Mark Service as Complete": "Mark Service as Complete",
    "Start Assisting Patient": "Start Assisting Patient",
    "Waiting for requests...": "Waiting for requests...",
    "You'll be notified when a patient requests your service": "You'll be notified when a patient requests your service",
    "You're currently offline": "You're currently offline",
    "Toggle the switch above to make yourself available for service requests": 
      "Toggle the switch above to make yourself available for service requests",
    "All rights reserved.": "All rights reserved.",
    "User Menu": "User Menu",
    "Profile": "Profile",
    "Logout": "Logout",
    "New request received": "New request received",
    "A patient has requested your service.": "A patient has requested your service.",
    "You're now available": "You're now available",
    "You will now receive service requests.": "You will now receive service requests.",
    "You're now offline": "You're now offline",
    "You will no longer receive service requests.": "You will no longer receive service requests.",
    "Cannot go offline": "Cannot go offline",
    "You have an active request in progress.": "You have an active request in progress.",
    "Error": "Error",
    "Could not update your availability status.": "Could not update your availability status.",
    "Service started": "Service started",
    "You have started assisting the patient.": "You have started assisting the patient.",
    "Select Your Role": "Select Your Role",
    "Please select how you want to continue": "Please select how you want to continue",
    "Continue as Patient": "Continue as Patient",
    "Get medical services from qualified nurses": "Get medical services from qualified nurses",
    "Continue as Nurse": "Continue as Nurse",
    "Provide care services to patients in need": "Provide care services to patients in need",
    "Register": "Register",
    "Login": "Login",
    "Good morning": "Good morning",
    "Good afternoon": "Good afternoon",
    "Good evening": "Good evening",
    "How can we assist you today?": "How can we assist you today?",
    "Our Services": "Our Services",
    "Request Nurse": "Request Nurse",
    "Track Request": "Track Request",
    "Online Support": "Online Support",
    "Emergency Call": "Emergency Call",
    "Upcoming Appointments": "Upcoming Appointments",
    "No upcoming appointments": "No upcoming appointments",
    "Request a Service": "Request a Service",
    "Emergency Request": "Emergency Request",
    "Send Emergency Request": "Send Emergency Request",
    "Earnings": "Earnings",
    "Total Earned": "Total Earned",
    "Pending Payments": "Pending Payments",
    "Patient Questions": "Patient Questions",
    "Answer Patient Questions": "Answer Patient Questions",
    "Question Details": "Question Details",
    "Answer": "Answer",
    "Submit Answer": "Submit Answer",
    "Medical Questions": "Medical Questions",
    "Ask a Question": "Ask a Question",
    "My Questions": "My Questions",
    "New Question": "New Question",
    "Question Title": "Question Title",
    "Question Description": "Question Description",
    "Submit Question": "Submit Question"
  },
  ar: {
    "You are available for duty": "أنت متاح للعمل",
    "You are offline": "أنت غير متصل",
    "Available": "متاح",
    "Offline": "غير متصل",
    "Active Request": "طلب نشط",
    "Patient Name": "اسم المريض",
    "Age": "العمر",
    "years": "سنوات",
    "Service Type": "نوع الخدمة",
    "Prescribed treatment": "العلاج الموصوف",
    "Request Details": "تفاصيل الطلب",
    "Need assistance with daily insulin injection and blood pressure measurement. Patient has all necessary equipment and medication.": 
      "بحاجة إلى مساعدة في حقن الأنسولين اليومي وقياس ضغط الدم. المريض لديه جميع المعدات والأدوية اللازمة.",
    "Address": "العنوان",
    "Location": "الموقع",
    "Open in Maps": "فتح في الخرائط",
    "Mark Service as Complete": "وضع علامة اكتمال الخدمة",
    "Start Assisting Patient": "بدء مساعدة المريض",
    "Waiting for requests...": "في انتظار الطلبات...",
    "You'll be notified when a patient requests your service": "سيتم إعلامك عندما يطلب المريض خدمتك",
    "You're currently offline": "أنت حاليًا غير متصل",
    "Toggle the switch above to make yourself available for service requests": 
      "قم بتبديل المفتاح أعلاه لجعل نفسك متاحًا لطلبات الخدمة",
    "All rights reserved.": "جميع الحقوق محفوظة.",
    "User Menu": "قائمة المستخدم",
    "Profile": "الملف الشخصي",
    "Logout": "تسجيل الخروج",
    "New request received": "تم استلام طلب جديد",
    "A patient has requested your service.": "طلب مريض خدمتك.",
    "You're now available": "أنت الآن متاح",
    "You will now receive service requests.": "ستتلقى الآن طلبات الخدمة.",
    "You're now offline": "أنت الآن غير متصل",
    "You will no longer receive service requests.": "لن تتلقى طلبات الخدمة بعد الآن.",
    "Cannot go offline": "لا يمكن الانتقال إلى وضع عدم الاتصال",
    "You have an active request in progress.": "لديك طلب نشط قيد التقدم.",
    "Error": "خطأ",
    "Could not update your availability status.": "تعذر تحديث حالة التوفر الخاصة بك.",
    "Service started": "بدأت الخدمة",
    "You have started assisting the patient.": "لقد بدأت مساعدة المريض.",
    "Select Your Role": "اختر دورك",
    "Please select how you want to continue": "الرجاء تحديد كيف تريد المتابعة",
    "Continue as Patient": "استمر كمريض",
    "Get medical services from qualified nurses": "احصل على خدمات طبية من ممرضات مؤهلات",
    "Continue as Nurse": "استمر كممرض/ة",
    "Provide care services to patients in need": "تقديم خدمات الرعاية للمرضى المحتاجين",
    "Register": "تسجيل",
    "Login": "تسجيل الدخول",
    "Good morning": "صباح الخير",
    "Good afternoon": "مساء الخير",
    "Good evening": "طاب مساؤك",
    "How can we assist you today?": "كيف يمكننا مساعدتك اليوم؟",
    "Our Services": "خدماتنا",
    "Request Nurse": "طلب ممرض",
    "Track Request": "تتبع الطلب",
    "Online Support": "الدعم عبر الإنترنت",
    "Emergency Call": "اتصال طارئ",
    "Upcoming Appointments": "المواعيد القادمة",
    "No upcoming appointments": "لا توجد مواعيد قادمة",
    "Request a Service": "طلب خدمة",
    "Emergency Request": "طلب طوارئ",
    "Send Emergency Request": "إرسال طلب طوارئ",
    "Earnings": "الأرباح",
    "Total Earned": "إجمالي الأرباح",
    "Pending Payments": "المدفوعات المعلقة",
    "Patient Questions": "أسئلة المريض",
    "Answer Patient Questions": "الرد على أسئلة المريض",
    "Question Details": "تفاصيل السؤال",
    "Answer": "إجابة",
    "Submit Answer": "تقديم الإجابة",
    "Medical Questions": "الأسئلة الطبية",
    "Ask a Question": "اطرح سؤالاً",
    "My Questions": "أسئلتي",
    "New Question": "سؤال جديد",
    "Question Title": "عنوان السؤال",
    "Question Description": "وصف السؤال",
    "Submit Question": "تقديم السؤال"
  }
};

type Language = "en" | "ar";

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    return (storedLanguage === "en" || storedLanguage === "ar") ? storedLanguage : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Set direction for RTL/LTR languages
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  
  return context;
};
