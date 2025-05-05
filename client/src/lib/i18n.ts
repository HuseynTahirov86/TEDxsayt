import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil resurslarını əlavə edin
const resources = {
  az: {
    translation: {
      // Navigation
      'about': 'Haqqında',
      'speakers': 'Spikerlər',
      'program': 'Proqram',
      'contact': 'Əlaqə',
      'register': 'Qeydiyyat',
      'language': 'Dil',
      
      // Hero
      'hero_title': 'YENİDƏN DÜŞÜNMƏK',
      'hero_subtitle': 'İdeyalar yayılmağa layiqdir',
      'hero_date': '15 Oktyabr, 2025',
      'hero_location': 'Naxçıvan Dövlət Universiteti',
      'hero_register_button': 'İndi qeydiyyatdan keçin',
      'days': 'Gün',
      'hours': 'Saat',
      'minutes': 'Dəqiqə',
      'seconds': 'Saniyə',
      
      // About 
      'about_title': 'TEDx Naxçıvan Dövlət Universiteti Haqqında',
      'about_description': 'TEDx, TED tərəfindən yerli icmalara TED təcrübəsini yaşatmaq üçün yaradılmışdır. Tədbirimizdə TED danışıqlarından videolar və canlı çıxışlar bir araya gətirilir və tədbir boyu təsirli söhbətləri təşviq etmək üçün kiçik qruplarda müzakirələr aparılır.',
      'about_what_is_tedx': 'TEDx nədir?',
      'about_what_is_tedx_desc': 'TED konfranslarının ruhunda, TEDx proqramı yerli, özünü təşkil edən tədbirlərdir ki, insanları TED kimi təcrübəni paylaşmaq üçün bir araya gətirir.',
      'about_theme': 'Tədbirimizin mövzusu: YENİDƏN DÜŞÜNMƏK',
      'about_theme_desc': 'Dünyamızı yenidən düşünmə vaxtı gəldi. Mövcud fərziyyələri sorğulayaraq, yeni perspektivlər axtararaq və ideyalarımızı paylaşaraq, daha yaxşı bir gələcək yaratma potensialına malikik.',
      'about_university': 'Naxçıvan Dövlət Universiteti',
      'about_university_desc': 'Naxçıvan Dövlət Universiteti 1967-ci ildə təsis edilmiş və Azərbaycanın ən nüfuzlu ali təhsil müəssisələrindən biridir. Universitetimiz geniş çeşiddə akademik proqramlar və tədqiqat imkanları təklif edir.',
      'participants': 'iştirakçılar',
      'online_viewers': 'online izləyici',
      'tedx_facts': 'Global TEDx Faktları',
      'fact1': 'Dünyada hər il 3000+ TEDx tədbiri keçirilir',
      'fact2': 'TEDx çıxışları 150+ dildə və 190+ ölkədə izlənir',
      'fact3': 'TEDx video materialları YouTube-da milyardlarla baxış toplayır',
      
      // Speakers
      'speakers_title': 'Spikerlərlə tanış olun',
      'speakers_subtitle': 'İlhamverici danışıqlarla çıxış edəcək mütəxəssislər və liderlərlə tanış olun',
      'speakers_coming_soon': 'Tezliklə...',
      'view_all': 'Hamısına baxın',
      
      // Program
      'program_title': 'Tədbir Proqramı',
      'program_subtitle': 'Gündəliyi kəşf edin və heyəcanverici danışıqlar, seminarlar və şəbəkə imkanları üçün planlaşdırın',
      
      // Register
      'register_title': 'Yerinizi indi təsdiqləyin',
      'register_subtitle': 'TEDx Naxçıvan Dövlət Universiteti tədbirində iştirak etmək üçün aşağıdakı formu doldurun',
      'first_name': 'Ad',
      'last_name': 'Soyad',
      'email': 'E-poçt',
      'phone': 'Telefon',
      'occupation': 'Peşə/İxtisas',
      'topics_interest': 'Maraq dairəsi',
      'terms_conditions': 'Şərtlər və qaydalarla razıyam',
      'submit': 'Təqdim edin',
      'registration_success': 'Uğurla qeydiyyatdan keçdiniz!',
      'required_field': 'Bu sahə tələb olunur',
      'invalid_email': 'Düzgün e-poçt ünvanı daxil edin',
      'invalid_phone': 'Düzgün telefon nömrəsi daxil edin',
      'terms_required': 'Qeydiyyatdan keçmək üçün şərtləri qəbul etməlisiniz',
      
      // Contact
      'contact_title': 'Əlaqə saxlayın',
      'contact_subtitle': 'Sualınız var? Bizimlə əlaqə saxlayın və biz sizə köməklik göstərməyə hazırıq.',
      'name': 'Ad',
      'subject': 'Mövzu',
      'message': 'Mesaj',
      'send_message': 'Mesaj göndərin',
      'address': 'Ünvan',
      'email_us': 'E-poçt göndərin',
      'call_us': 'Bizə zəng edin',
      'follow_us': 'Bizi izləyin',
      
      // Sponsors
      'sponsors_title': 'Sponsorlarımız',
      'sponsors_subtitle': 'Bu tədbirə dəstək olan etibarlı tərəfdaşlarımız',
      'become_sponsor': 'Sponsor olun',
      'sponsor_question': 'Sponsor olmaq istəyirsiniz?',
      'sponsor_description': 'TEDx Naxçıvan Dövlət Universiteti tədbirini dəstəkləyərək innovativ ideyaların və ilham verici mühazirələrin bir parçası olun.',
      'platinum': 'Platin',
      'gold': 'Qızıl',
      'silver': 'Gümüş',
      
      // Footer
      'rights_reserved': 'Bütün hüquqlar qorunur',
      'privacy_policy': 'Gizlilik Siyasəti',
      'terms_of_service': 'Xidmət Şərtləri'
    }
  },
  en: {
    translation: {
      // Navigation
      'about': 'About',
      'speakers': 'Speakers',
      'program': 'Program',
      'contact': 'Contact',
      'register': 'Register',
      'language': 'Language',
      
      // Hero
      'hero_title': 'RETHINK',
      'hero_subtitle': 'Ideas worth spreading',
      'hero_date': 'October 15, 2025',
      'hero_location': 'Nakhchivan State University',
      'hero_register_button': 'Register Now',
      'days': 'Days',
      'hours': 'Hours',
      'minutes': 'Minutes',
      'seconds': 'Seconds',
      
      // About 
      'about_title': 'About TEDx Nakhchivan State University',
      'about_description': 'TEDx was created in the spirit of TED\'s mission, "ideas worth spreading." It supports independent organizers who want to create a TED-like event in their communities.',
      'about_what_is_tedx': 'What is TEDx?',
      'about_what_is_tedx_desc': 'In the spirit of TED conferences, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience.',
      'about_theme': 'Our Theme: RETHINK',
      'about_theme_desc': 'It\'s time to rethink our world. By questioning existing assumptions, seeking new perspectives, and sharing our ideas, we have the potential to create a better future.',
      'about_university': 'Nakhchivan State University',
      'about_university_desc': 'Nakhchivan State University was established in 1967 and is one of the most prestigious higher education institutions in Azerbaijan. Our university offers a wide range of academic programs and research opportunities.',
      'participants': 'participants',
      'online_viewers': 'online viewers',
      'tedx_facts': 'Global TEDx Facts',
      'fact1': 'Over 3000 TEDx events are held worldwide each year',
      'fact2': 'TEDx talks are watched in over 150 languages and 190+ countries',
      'fact3': 'TEDx videos have billions of views on YouTube',
      
      // Speakers
      'speakers_title': 'Meet Our Speakers',
      'speakers_subtitle': 'Get to know the experts and leaders who will deliver inspiring talks',
      'speakers_coming_soon': 'Coming Soon...',
      'view_all': 'View All',
      
      // Program
      'program_title': 'Event Program',
      'program_subtitle': 'Explore the agenda and plan for exciting talks, workshops, and networking opportunities',
      
      // Register
      'register_title': 'Secure Your Spot Now',
      'register_subtitle': 'Fill out the form below to participate in the TEDx Nakhchivan State University event',
      'first_name': 'First Name',
      'last_name': 'Last Name',
      'email': 'Email',
      'phone': 'Phone',
      'occupation': 'Occupation',
      'topics_interest': 'Topics of Interest',
      'terms_conditions': 'I agree to the terms and conditions',
      'submit': 'Submit',
      'registration_success': 'You have registered successfully!',
      'required_field': 'This field is required',
      'invalid_email': 'Please enter a valid email address',
      'invalid_phone': 'Please enter a valid phone number',
      'terms_required': 'You must accept the terms to register',
      
      // Contact
      'contact_title': 'Get in Touch',
      'contact_subtitle': 'Have questions? Contact us and we\'re ready to help.',
      'name': 'Name',
      'subject': 'Subject',
      'message': 'Message',
      'send_message': 'Send Message',
      'address': 'Address',
      'email_us': 'Email Us',
      'call_us': 'Call Us',
      'follow_us': 'Follow Us',
      
      // Sponsors
      'sponsors_title': 'Our Sponsors',
      'sponsors_subtitle': 'Trusted partners supporting this event',
      'become_sponsor': 'Become a Sponsor',
      'sponsor_question': 'Want to become a sponsor?',
      'sponsor_description': 'Support the TEDx Nakhchivan State University event and become part of innovative ideas and inspiring talks.',
      'platinum': 'Platinum',
      'gold': 'Gold',
      'silver': 'Silver',
      
      // Footer
      'rights_reserved': 'All rights reserved',
      'privacy_policy': 'Privacy Policy',
      'terms_of_service': 'Terms of Service'
    }
  }
};

i18n
  // i18next'in PluginModule və DetectorModule istifadə edin
  .use(LanguageDetector)
  .use(initReactI18next)
  // modulu başladın
  .init({
    resources,
    fallbackLng: 'az',
    debug: false,
    interpolation: {
      escapeValue: false, // react daxilən qaçır
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;