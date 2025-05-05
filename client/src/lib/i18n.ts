import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navbar
      "about": "About",
      "speakers": "Speakers",
      "program": "Program",
      "register": "Register",
      "contact": "Contact",
      "language": "Language",

      // Hero
      "eventDate": "June 16, 2025",
      "eventLocation": "Nakhchivan State University Conservatory",
      "eventSlogan": "Ideas beyond borders, thoughts shaping the future",
      "registerNow": "Register Now",
      "days": "days",
      "hours": "hours",
      "minutes": "min",
      "seconds": "sec",

      // About
      "aboutTitle": "About TEDx",
      "aboutTEDx": "TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TEDTalks video and live speakers combine to spark deep discussion and connection in a small group. These local, self-organized events are branded TEDx, where x = independently organized TED event.",
      "aboutNSU": "About Nakhchivan State University",
      "aboutNSUText": "Nakhchivan State University is one of the leading higher education institutions in Azerbaijan, with a rich history and commitment to academic excellence. Located in the ancient city of Nakhchivan, the university provides quality education across diverse disciplines and fosters innovation through research and international partnerships.",
      "aboutEvent": "About the Event",
      "aboutEventText": "TEDx Nakhchivan State University brings together thinkers, innovators, and creators to spark conversations that matter. Join us for an inspiring day of talks and performances that challenge conventional thinking and inspire new ideas.",

      // Speakers
      "speakersTitle": "Speakers",
      "speakersTitleSub": "Meet our inspiring speakers",
      "speakerBio": "Bio",
      "speakerTopic": "Talk Topic",
      "moreSpeakers": "More speakers to be announced",

      // Program
      "programTitle": "Program",
      "morningSession": "Morning Session",
      "afternoonSession": "Afternoon Session",
      "eveningSession": "Evening Session",

      // Register
      "registerTitle": "Register for the Event",
      "firstName": "First Name",
      "lastName": "Last Name",
      "email": "Email",
      "phone": "Phone",
      "occupation": "Occupation (Optional)",
      "interests": "Which topics interest you?",
      "technology": "Technology",
      "science": "Science",
      "art": "Art",
      "education": "Education",
      "society": "Society",
      "termsAgree": "I agree to the terms and conditions",
      "submitRegistration": "Submit Registration",
      "thanksRegistration": "Thank you for registering!",
      "registrationConfirm": "We've received your registration. We'll be in touch shortly with more details.",

      // Contact
      "contactTitle": "Contact Us",
      "contactName": "Name",
      "contactEmail": "Email",
      "contactSubject": "Subject",
      "contactMessage": "Message",
      "contactSend": "Send Message",
      "contactThank": "Thank you for your message!",
      "contactConfirm": "We'll get back to you as soon as possible.",

      // Sponsors
      "sponsorsTitle": "Sponsors",
      "becomeSponsor": "Become a Sponsor",

      // Footer
      "followUs": "Follow Us",
      "termsOfUse": "Terms of Use",
      "privacyPolicy": "Privacy Policy",
      "copyright": "© 2025 TEDx Nakhchivan State University. All Rights Reserved.",
      "organizedBy": "This TEDx event is independently organized."
    }
  },
  az: {
    translation: {
      // Navbar
      "about": "Haqqında",
      "speakers": "Natiqlər",
      "program": "Proqram",
      "register": "Qeydiyyat",
      "contact": "Əlaqə",
      "language": "Dil",

      // Hero
      "eventDate": "16 İyun 2025",
      "eventLocation": "Naxçıvan Dövlət Universitetinin Konservatoriyası",
      "eventSlogan": "Sərhədləri aşan ideyalar, gələcəyi formalaşdıran fikirlər",
      "registerNow": "Qeydiyyatdan keç",
      "days": "gün",
      "hours": "saat",
      "minutes": "dəq",
      "seconds": "san",

      // About
      "aboutTitle": "TEDx Haqqında",
      "aboutTEDx": "TEDx, insanları TED təcrübəsini bölüşmək üçün bir araya gətirən yerli, öz-özünə təşkil edilmiş tədbirlərin proqramıdır. TEDx tədbiri zamanı TEDTalks videosu və canlı natiqləri kiçik qrupda dərin müzakirə və əlaqə yaratmaq üçün birləşdirir. Bu yerli, özünü təşkil edən tədbirlər TEDx adlandırılır, burada x = müstəqil təşkil edilmiş TED tədbiri deməkdir.",
      "aboutNSU": "Naxçıvan Dövlət Universiteti Haqqında",
      "aboutNSUText": "Naxçıvan Dövlət Universiteti zəngin tarixi və akademik mükəmməlliyə sadiqliyə malik Azərbaycanın aparıcı ali təhsil müəssisələrindən biridir. Qədim Naxçıvan şəhərində yerləşən universitet müxtəlif fənlər üzrə keyfiyyətli təhsil verir və tədqiqat və beynəlxalq tərəfdaşlıq vasitəsilə innovasiyaları təşviq edir.",
      "aboutEvent": "Tədbir Haqqında",
      "aboutEventText": "TEDx Naxçıvan Dövlət Universiteti düşünənləri, yenilikçiləri və yaradıcıları əhəmiyyətli söhbətlərə başlamaq üçün bir araya gətirir. Ənənəvi düşüncəyə meydan oxuyan və yeni ideyalara ilham verən məruzələr və çıxışlarla dolu ilhamverici bir günə qoşulun.",

      // Speakers
      "speakersTitle": "Natiqlərimiz",
      "speakersTitleSub": "İlham verici natiqlərimizlə tanış olun",
      "speakerBio": "Bioqrafiya",
      "speakerTopic": "Mövzu",
      "moreSpeakers": "Daha çox natiq elan ediləcək",

      // Program
      "programTitle": "Proqram",
      "morningSession": "Səhər Sessiyası",
      "afternoonSession": "Günorta Sessiyası",
      "eveningSession": "Axşam Sessiyası",

      // Register
      "registerTitle": "Tədbir üçün qeydiyyat",
      "firstName": "Ad",
      "lastName": "Soyad",
      "email": "E-poçt",
      "phone": "Telefon",
      "occupation": "Peşə (İstəyə bağlı)",
      "interests": "Hansı mövzularla maraqlanırsınız?",
      "technology": "Texnologiya",
      "science": "Elm",
      "art": "İncəsənət",
      "education": "Təhsil",
      "society": "Cəmiyyət",
      "termsAgree": "Şərtlər və qaydalarla razıyam",
      "submitRegistration": "Qeydiyyatı Tamamla",
      "thanksRegistration": "Qeydiyyat üçün təşəkkür edirik!",
      "registrationConfirm": "Qeydiyyatınızı aldıq. Tezliklə sizinlə daha ətraflı məlumat üçün əlaqə saxlayacağıq.",

      // Contact
      "contactTitle": "Bizimlə Əlaqə",
      "contactName": "Ad",
      "contactEmail": "E-poçt",
      "contactSubject": "Mövzu",
      "contactMessage": "Mesaj",
      "contactSend": "Mesaj Göndər",
      "contactThank": "Mesajınız üçün təşəkkür edirik!",
      "contactConfirm": "Sizinlə mümkün qədər tez əlaqə saxlayacağıq.",

      // Sponsors
      "sponsorsTitle": "Sponsorlar",
      "becomeSponsor": "Sponsor Ol",

      // Footer
      "followUs": "Bizi İzləyin",
      "termsOfUse": "İstifadə Şərtləri",
      "privacyPolicy": "Gizlilik Siyasəti",
      "copyright": "© 2025 TEDx Naxçıvan Dövlət Universiteti. Bütün hüquqlar qorunur.",
      "organizedBy": "Bu TEDx tədbiri müstəqil təşkil edilir."
    }
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'az', // default language
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;