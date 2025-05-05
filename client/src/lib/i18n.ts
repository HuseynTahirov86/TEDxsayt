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
      'speech_topic': 'Çıxış mövzusu',
      'view_all': 'Hamısına baxın',
      
      // Program
      'program_title': 'Tədbir Proqramı',
      'program_subtitle': 'Gündəliyi kəşf edin və heyəcanverici danışıqlar, seminarlar və şəbəkə imkanları üçün planlaşdırın',
      
      // Register
      'register_title': 'Yerinizi indi təsdiqləyin',
      'register_subtitle': 'TEDx Naxçıvan Dövlət Universiteti tədbirində iştirak etmək üçün aşağıdakı formu doldurun',
      'form_first_name': 'Ad',
      'form_last_name': 'Soyad',
      'form_email': 'E-poçt',
      'form_phone': 'Telefon',
      'form_occupation': 'Peşə/Təhsil',
      'form_topics': 'Sizi ən çox maraqlandıran mövzular',
      'form_terms': 'Məlumatlarımın TEDx Nakhchivan State University tərəfindən işlənməsinə razılıq verirəm.',
      'form_submit': 'Qeydiyyatdan keç',
      'form_first_name_placeholder': 'Adınızı daxil edin',
      'form_last_name_placeholder': 'Soyadınızı daxil edin',
      'form_email_placeholder': 'name@example.com',
      'form_phone_placeholder': '+994 XX XXX XX XX',
      'form_occupation_placeholder': 'Peşənizi və ya təhsil ocağınızı qeyd edin',
      'topic_technology': 'Texnologiya və İnnovasiya',
      'topic_education': 'Təhsil',
      'topic_sustainability': 'Davamlı İnkişaf',
      'topic_culture': 'Mədəni İrs',
      'registration_success': 'Təşəkkür edirik!',
      'registration_success_message': 'Qeydiyyatınız uğurla tamamlandı. Tədbir haqqında ətraflı məlumat tezliklə e-poçt ünvanınıza göndəriləcək.',
      'back': 'Geri qayıt',
      'required_field': 'Bu sahə tələb olunur',
      'invalid_email': 'Düzgün e-poçt ünvanı daxil edin',
      'invalid_phone': 'Düzgün telefon nömrəsi daxil edin',
      'terms_required': 'Qeydiyyatdan keçmək üçün şərtləri qəbul etməlisiniz',
      
      // Contact
      'contact_title': 'Əlaqə saxlayın',
      'contact_subtitle': 'Sualınız var? Bizimlə əlaqə saxlayın və biz sizə köməklik göstərməyə hazırıq.',
      'contact_info': 'Əlaqə Məlumatları',
      'university_address': 'Naxçıvan Dövlət Universitetinin Konservatoriyası, AZ7000\nNaxçıvan, Azərbaycan',
      'email_address': 'info@tedxnakhchivansu.com',
      'phone_number': '+994 50 123 45 67',
      'name': 'Ad',
      'email': 'E-poçt',
      'phone': 'Telefon',
      'subject': 'Mövzu',
      'message': 'Mesaj',
      'send_message': 'Mesaj göndərin',
      'sending': 'Göndərilir...',
      'sent': 'Göndərildi!',
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
      
      // Sponsors information
      'nakhchivan_state_university': 'Naxçıvan Dövlət Universiteti', 
      'nakhchivan_city_executive': 'Naxçıvan Şəhər İcra Hakimiyyəti',
      'tech_azerbaijan': 'TechAzərbaycan',
      'ministry_of_education': 'Təhsil Nazirliyi',
      'innovation_center': 'İnnovasiya Mərkəzi',
      'youth_fund': 'Gənclər Fondu',
      'business_association': 'İş Adamları Assosiasiyası',
      'international_cooperation': 'Beynəlxalq Əməkdaşlıq Mərkəzi',
      
      // Program
      'morning_session': 'Səhər Sessiyası',
      'afternoon_session': 'Günorta Sessiyası',
      'evening_session': 'Axşam Sessiyası',
      'registration_checkin': 'Qeydiyyat və Qarşılama',
      'registration_checkin_desc': 'İştirakçıların qeydiyyatı, qarşılanması və tədbir materiallarının paylanması.',
      'opening_speech': 'Açılış Nitqi',
      'opening_speech_desc': 'Naxçıvan Dövlət Universitetinin rektoru tərəfindən açılış nitqi.',
      'çıxış___ai_və_regional_i̇nnovasiya__naxçıvandan_dünyaya_': 'Çıxış: "Aİ və Regional İnnovasiya: Naxçıvandan Dünyaya"',
      'çıxış___ai_və_regional_i̇nnovasiya__naxçıvandan_dünyaya__desc': 'Süni intellektin regional inkişafa təsiri və Naxçıvanda texnoloji innovasiya imkanları haqqında.',
      
      'çıxış___su_qıtlığı_şəraitində_davamlı_əkinçilik_texnologiyaları_': 'Çıxış: "Su Qıtlığı Şəraitində Davamlı Əkinçilik Texnologiyaları"',
      'çıxış___su_qıtlığı_şəraitində_davamlı_əkinçilik_texnologiyaları__desc': 'Naxçıvanda su qıtlığı problemi və müasir texnologiyaların bu problemin həllində rolu.',
      
      'nahar_fasiləsi': 'Nahar Fasiləsi',
      'nahar_fasiləsi_desc': 'İştirakçılar üçün şəbəkələşmə və müzakirə imkanı.',
      
      'çıxış___ucqar_bölgələrdə_rəqəmsal_təhsil_imkanları_': 'Çıxış: "Ucqar Bölgələrdə Rəqəmsal Təhsil İmkanları"',
      'çıxış___ucqar_bölgələrdə_rəqəmsal_təhsil_imkanları__desc': 'Naxçıvanın ucqar kəndlərində təhsilə çıxış problemləri və texnologiyanın təqdim etdiyi həll yolları.',
      
      'çıxış___rəqəmsal_texnologiyalar_vasitəsilə_naxçıvan_mədəni_i̇rsinin_qorunması_': 'Çıxış: "Rəqəmsal Texnologiyalar vasitəsilə Naxçıvan Mədəni İrsinin Qorunması"',
      'çıxış___rəqəmsal_texnologiyalar_vasitəsilə_naxçıvan_mədəni_i̇rsinin_qorunması__desc': 'Mədəni irsin qorunması və dünyaya tanıdılmasında müasir texnologiyaların rolu.',
      
      'panel_müzakirəsi___regional_i̇nkişafda_gənclərin_rolu_': 'Panel Müzakirəsi: "Regional İnkişafda Gənclərin Rolu"',
      'panel_müzakirəsi___regional_i̇nkişafda_gənclərin_rolu__desc': 'Naxçıvanın inkişafında gənc mütəxəssislərin və sahibkarların rolu haqqında panel müzakirəsi.',
      
      'qəhvə_fasiləsi': 'Qəhvə Fasiləsi',
      'qəhvə_fasiləsi_desc': 'Şəbəkələşmə və interaktiv təqdimatlar.',
      
      'çıxış___i̇qlim_dəyişikliyinə_qarşı_yerli_həll_yolları_': 'Çıxış: "İqlim Dəyişikliyinə Qarşı Yerli Həll Yolları"',
      'çıxış___i̇qlim_dəyişikliyinə_qarşı_yerli_həll_yolları__desc': 'İqlim dəyişikliyinin Naxçıvan bölgəsinə təsirləri və yerli həll yollarının əhəmiyyəti.',
      
      'çıxış___naxçıvanda_günəş_enerjisi__i̇mkanlar_və_perspektivlər_': 'Çıxış: "Naxçıvanda Günəş Enerjisi: İmkanlar və Perspektivlər"', 
      'çıxış___naxçıvanda_günəş_enerjisi__i̇mkanlar_və_perspektivlər__desc': 'Naxçıvanda alternativ enerji mənbələrinin inkişafı və günəş enerjisinin potensialı.',
      
      'bağlanış_nitqi_və_təşəkkürlər': 'Bağlanış Nitqi və Təşəkkürlər',
      'bağlanış_nitqi_və_təşəkkürlər_desc': 'Tədbirin yekunlaşdırılması və təşəkkür nitqi.',
      
      'networking_və_foto_sessiyası': 'Networking və Foto Sessiyası',
      'networking_və_foto_sessiyası_desc': 'İştirakçılar və spikerlərlə birgə şəbəkələşmə imkanı və xatirə fotoları.',
      
      'qeydiyyat_və_qarşılama': 'Qeydiyyat və Qarşılama',
      'qeydiyyat_və_qarşılama_desc': 'İştirakçıların qeydiyyatı, qarşılanması və tədbir materiallarının paylanması.',
      
      'açılış_nitqi': 'Açılış Nitqi',
      'açılış_nitqi_desc': 'Naxçıvan Dövlət Universitetinin rektoru tərəfindən açılış nitqi.',

      // WhyTedx
      'why': 'Nə üçün',
      'idea_exchange': 'Fikir Mübadiləsi',
      'idea_exchange_desc': 'TEDx tədbirlərində müxtəlif sahələrdən olan insanlar öz unikal ideyalarını paylaşır və tamaşaçılara ilham verir.',
      'global_network': 'Qlobal Şəbəkə',
      'global_network_desc': 'TEDx tədbirləri dünyanın 170-dən çox ölkəsində keçirilir, bu da qlobal dialoqun bir hissəsi olmaq imkanı yaradır.',
      'diverse_perspectives': 'Fərqli Perspektivlər',
      'diverse_perspectives_desc': 'TEDx platforması fərqli yaş, təhsil və karyera sahiblərinə öz təcrübələrini bölüşmək imkanı yaradır.',
      
      // Footer
      'footer_about_text': 'TEDx, TED lisenziyası altında yerli icmalar tərəfindən müstəqil şəkildə təşkil edilən tədbirlərdir. Bu tədbir, TED konfrans formatında, yerli toplum üçün TED təcrübəsini yaratmaq məqsədi daşıyır.',
      'navigation': 'Naviqasiya',
      'contacts': 'Əlaqələr',
      'tedx_license': 'TEDx, TED lisenziyası altında müstəqil şəkildə təşkil edilir',
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
      'speech_topic': 'Speech Topic',
      'view_all': 'View All',
      'tech_entrepreneur': 'Tech Entrepreneur & AI Researcher',
      'sustainable_agriculture': 'Sustainable Agriculture Specialist',
      'educational_innovator': 'Educational Innovator',
      'cultural_heritage': 'Cultural Heritage Preservationist',
      'climate_scientist': 'Climate Scientist',
      'renewable_energy': 'Renewable Energy Entrepreneur',
      
      // Program
      'program_title': 'Event Program',
      'program_subtitle': 'Explore the agenda and plan for exciting talks, workshops, and networking opportunities',
      'morning_session': 'Morning Session',
      'afternoon_session': 'Afternoon Session',
      'evening_session': 'Evening Session',
      'registration_checkin': 'Registration & Check-in',
      'registration_checkin_desc': 'Registration, welcome and distribution of event materials.',
      'opening_speech': 'Opening Speech',
      'opening_speech_desc': 'Opening speech by the rector of Nakhchivan State University.',
      'çıxış___ai_və_regional_i̇nnovasiya__naxçıvandan_dünyaya_': 'Talk: "AI and Regional Innovation: From Nakhchivan to the World"',
      'çıxış___ai_və_regional_i̇nnovasiya__naxçıvandan_dünyaya__desc': 'About the impact of artificial intelligence on regional development and technological innovation opportunities in Nakhchivan.',
      
      'çıxış___su_qıtlığı_şəraitində_davamlı_əkinçilik_texnologiyaları_': 'Talk: "Sustainable Agriculture Technologies in Water Scarcity Conditions"',
      'çıxış___su_qıtlığı_şəraitində_davamlı_əkinçilik_texnologiyaları__desc': 'About water scarcity problem in Nakhchivan and the role of modern technologies in solving this problem.',
      
      'nahar_fasiləsi': 'Lunch Break',
      'nahar_fasiləsi_desc': 'Networking and discussion opportunity for participants.',
      
      'çıxış___ucqar_bölgələrdə_rəqəmsal_təhsil_imkanları_': 'Talk: "Digital Education Opportunities in Remote Areas"',
      'çıxış___ucqar_bölgələrdə_rəqəmsal_təhsil_imkanları__desc': 'About education access problems in remote villages of Nakhchivan and the solutions offered by technology.',
      
      'çıxış___rəqəmsal_texnologiyalar_vasitəsilə_naxçıvan_mədəni_i̇rsinin_qorunması_': 'Talk: "Preservation of Nakhchivan Cultural Heritage through Digital Technologies"',
      'çıxış___rəqəmsal_texnologiyalar_vasitəsilə_naxçıvan_mədəni_i̇rsinin_qorunması__desc': 'About the role of modern technologies in preserving and introducing cultural heritage to the world.',
      
      'panel_müzakirəsi___regional_i̇nkişafda_gənclərin_rolu_': 'Panel Discussion: "The Role of Youth in Regional Development"',
      'panel_müzakirəsi___regional_i̇nkişafda_gənclərin_rolu__desc': 'Panel discussion about the role of young specialists and entrepreneurs in the development of Nakhchivan.',
      
      'qəhvə_fasiləsi': 'Coffee Break',
      'qəhvə_fasiləsi_desc': 'Networking and interactive presentations.',
      
      'çıxış___i̇qlim_dəyişikliyinə_qarşı_yerli_həll_yolları_': 'Talk: "Local Solutions to Climate Change"',
      'çıxış___i̇qlim_dəyişikliyinə_qarşı_yerli_həll_yolları__desc': 'About the effects of climate change on the Nakhchivan region and the importance of local solutions.',
      
      'çıxış___naxçıvanda_günəş_enerjisi__i̇mkanlar_və_perspektivlər_': 'Talk: "Solar Energy in Nakhchivan: Opportunities and Perspectives"', 
      'çıxış___naxçıvanda_günəş_enerjisi__i̇mkanlar_və_perspektivlər__desc': 'About the development of alternative energy sources in Nakhchivan and the potential of solar energy.',
      
      'bağlanış_nitqi_və_təşəkkürlər': 'Closing Speech and Acknowledgments',
      'bağlanış_nitqi_və_təşəkkürlər_desc': 'Finalization of the event and thank you speech.',
      
      'networking_və_foto_sessiyası': 'Networking and Photo Session',
      'networking_və_foto_sessiyası_desc': 'Networking opportunity and souvenir photos with participants and speakers.',
      
      'qeydiyyat_və_qarşılama': 'Registration & Welcome',
      'qeydiyyat_və_qarşılama_desc': 'Registration, welcome and distribution of event materials.',
      
      'açılış_nitqi': 'Opening Speech',
      'açılış_nitqi_desc': 'Opening speech by the rector of Nakhchivan State University.',
      
      // Register
      'register_title': 'Secure Your Spot Now',
      'register_subtitle': 'Fill out the form below to participate in the TEDx Nakhchivan State University event',
      'form_first_name': 'First Name',
      'form_last_name': 'Last Name',
      'form_email': 'Email',
      'form_phone': 'Phone',
      'form_occupation': 'Occupation/Education',
      'form_topics': 'Topics that interest you the most',
      'form_terms': 'I consent to the processing of my information by TEDx Nakhchivan State University.',
      'form_submit': 'Register',
      'form_first_name_placeholder': 'Enter your first name',
      'form_last_name_placeholder': 'Enter your last name',
      'form_email_placeholder': 'name@example.com',
      'form_phone_placeholder': '+994 XX XXX XX XX',
      'form_occupation_placeholder': 'Enter your occupation or institution',
      'topic_technology': 'Technology and Innovation',
      'topic_education': 'Education',
      'topic_sustainability': 'Sustainable Development',
      'topic_culture': 'Cultural Heritage',
      'registration_success': 'Thank you!',
      'registration_success_message': 'Your registration has been successfully completed. Detailed information about the event will be sent to your email address soon.',
      'back': 'Go back',
      'required_field': 'This field is required',
      'invalid_email': 'Please enter a valid email address',
      'invalid_phone': 'Please enter a valid phone number',
      'terms_required': 'You must accept the terms to register',
      
      // Contact
      'contact_title': 'Get in Touch',
      'contact_subtitle': 'Have questions? Contact us and we\'re ready to help.',
      'contact_info': 'Contact Information',
      'name': 'Name',
      'email': 'Email',
      'phone': 'Phone',
      'subject': 'Subject',
      'message': 'Message',
      'send_message': 'Send Message',
      'sending': 'Sending...',
      'sent': 'Sent!',
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
      
      // Sponsors information
      'nakhchivan_state_university': 'Nakhchivan State University', 
      'nakhchivan_city_executive': 'Nakhchivan City Executive Authority',
      'tech_azerbaijan': 'TechAzerbaijan',
      'ministry_of_education': 'Ministry of Education',
      'innovation_center': 'Innovation Center',
      'youth_fund': 'Youth Fund',
      'business_association': 'Business Association',
      'international_cooperation': 'International Cooperation Center',
      
      // Footer
      'footer_about_text': 'TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. This event is organized under TED license to create a TED-like experience for the local community.',
      'navigation': 'Navigation',
      'contacts': 'Contacts',
      'tedx_license': 'TEDx is independently organized under TED license',
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