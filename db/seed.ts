import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Starting to seed database...");

    // Seed program sessions
    console.log("Seeding program sessions...");
    const existingSessions = await db.query.programSessions.findMany();
    
    if (existingSessions.length === 0) {
      await db.insert(schema.programSessions).values([
        { id: "morning", name: "Səhər Sessiyası", order: 1 },
        { id: "afternoon", name: "Günorta Sessiyası", order: 2 },
        { id: "evening", name: "Axşam Sessiyası", order: 3 },
      ]);
      console.log("Program sessions seeded successfully");
    } else {
      console.log("Program sessions already exist, skipping...");
    }

    // Seed speakers
    console.log("Seeding speakers...");
    const existingSpeakers = await db.query.speakers.findMany();
    
    if (existingSpeakers.length === 0) {
      await db.insert(schema.speakers).values([
        {
          name: "Leyla Əliyeva",
          title: "Tech Entrepreneur & AI Researcher",
          bio: "Süni intellekt sahəsində 10+ illik təcrübəyə malik olan Leyla, hazırda Azərbaycanda texnologiya startaplarını dəstəkləyən və mentor kimi çalışan bir sahibkardır.",
          topic: "AI və Regional İnnovasiya: Naxçıvandan Dünyaya",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
        },
        {
          name: "Orxan Məmmədov",
          title: "Sustainable Agriculture Specialist",
          bio: "Orxan, davamlı kənd təsərrüfatı sahəsində çalışan və Naxçıvan bölgəsində innovativ əkinçilik metodlarının tətbiqi ilə məşğul olan bir mütəxəssisdir.",
          topic: "Su Qıtlığı Şəraitində Davamlı Əkinçilik Texnologiyaları",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
          name: "Aynur Həsənli",
          title: "Educational Innovator",
          bio: "Aynur, təhsil sahəsində yeni metodların tətbiqi ilə tanınan və ucqar kənd məktəblərində distant təhsil layihələri həyata keçirən təhsil innovatorudur.",
          topic: "Ucqar Bölgələrdə Rəqəmsal Təhsil İmkanları",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80",
        },
        {
          name: "Tural Əliyev",
          title: "Cultural Heritage Preservationist",
          bio: "Tural Naxçıvanın zəngin mədəni irsinin qorunması üçün çalışan və müasir texnologiyalardan istifadə edərək tarixi abidələrin virtual turlarını yaradan bir mütəxəssisdir.",
          topic: "Rəqəmsal Texnologiyalar vasitəsilə Naxçıvan Mədəni İrsinin Qorunması",
          image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        },
        {
          name: "Gülnar Məmmədova",
          title: "Climate Scientist",
          bio: "Gülnar iqlim dəyişikliyi sahəsində tədqiqatlar aparan və Naxçıvan bölgəsində su qıtlığı problemlərinin həlli yollarını araşdıran bir alimədir.",
          topic: "İqlim Dəyişikliyinə Qarşı Yerli Həll Yolları",
          image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
          name: "Elşən Quliyev",
          title: "Renewable Energy Entrepreneur",
          bio: "Elşən bərpa olunan enerji sahəsində çalışan və Naxçıvanda günəş enerjisi layihələri həyata keçirən bir sahibkardır.",
          topic: "Naxçıvanda Günəş Enerjisi: İmkanlar və Perspektivlər",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        },
      ]);
      console.log("Speakers seeded successfully");
    } else {
      console.log("Speakers already exist, skipping...");
    }

    // Get speakers for references
    const allSpeakers = await db.query.speakers.findMany();
    const speakerMap = new Map(allSpeakers.map(s => [s.name, s.id]));

    // Seed program items
    console.log("Seeding program items...");
    const existingItems = await db.query.programItems.findMany();
    
    if (existingItems.length === 0) {
      await db.insert(schema.programItems).values([
        // Morning session
        {
          time: "09:00",
          title: "Qeydiyyat və Qarşılama",
          description: "İştirakçıların qeydiyyatı, qarşılanması və tədbir materiallarının paylanması.",
          session: "morning",
          order: 1,
        },
        {
          time: "10:00",
          title: "Açılış Nitqi",
          description: "Naxçıvan Dövlət Universitetinin rektoru tərəfindən açılış nitqi.",
          session: "morning",
          order: 2,
        },
        {
          time: "10:30",
          title: "Çıxış: \"AI və Regional İnnovasiya: Naxçıvandan Dünyaya\"",
          description: "Süni intellektin regional inkişafa təsiri və Naxçıvanda texnoloji innovasiya imkanları haqqında.",
          session: "morning",
          speakerId: speakerMap.get("Leyla Əliyeva"),
          order: 3,
        },
        {
          time: "11:15",
          title: "Çıxış: \"Su Qıtlığı Şəraitində Davamlı Əkinçilik Texnologiyaları\"",
          description: "Naxçıvanda su qıtlığı problemi və müasir texnologiyaların bu problemin həllində rolu.",
          session: "morning",
          speakerId: speakerMap.get("Orxan Məmmədov"),
          order: 4,
        },
        {
          time: "12:00",
          title: "Nahar Fasiləsi",
          description: "İştirakçılar üçün şəbəkələşmə və müzakirə imkanı.",
          session: "morning",
          order: 5,
        },
        // Afternoon session
        {
          time: "13:30",
          title: "Çıxış: \"Ucqar Bölgələrdə Rəqəmsal Təhsil İmkanları\"",
          description: "Naxçıvanın ucqar kəndlərində təhsilə çıxış problemləri və texnologiyanın təqdim etdiyi həll yolları.",
          session: "afternoon",
          speakerId: speakerMap.get("Aynur Həsənli"),
          order: 1,
        },
        {
          time: "14:15",
          title: "Çıxış: \"Rəqəmsal Texnologiyalar vasitəsilə Naxçıvan Mədəni İrsinin Qorunması\"",
          description: "Mədəni irsin qorunması və dünyaya tanıdılmasında müasir texnologiyaların rolu.",
          session: "afternoon",
          speakerId: speakerMap.get("Tural Əliyev"),
          order: 2,
        },
        {
          time: "15:00",
          title: "Panel Müzakirəsi: \"Regional İnkişafda Gənclərin Rolu\"",
          description: "Naxçıvanın inkişafında gənc mütəxəssislərin və sahibkarların rolu haqqında panel müzakirəsi.",
          session: "afternoon",
          order: 3,
        },
        {
          time: "16:00",
          title: "Qəhvə Fasiləsi",
          description: "Şəbəkələşmə və interaktiv təqdimatlar.",
          session: "afternoon",
          order: 4,
        },
        // Evening session
        {
          time: "16:30",
          title: "Çıxış: \"İqlim Dəyişikliyinə Qarşı Yerli Həll Yolları\"",
          description: "İqlim dəyişikliyinin Naxçıvan bölgəsinə təsirləri və yerli həll yollarının əhəmiyyəti.",
          session: "evening",
          speakerId: speakerMap.get("Gülnar Məmmədova"),
          order: 1,
        },
        {
          time: "17:15",
          title: "Çıxış: \"Naxçıvanda Günəş Enerjisi: İmkanlar və Perspektivlər\"",
          description: "Naxçıvanda alternativ enerji mənbələrinin inkişafı və günəş enerjisinin potensialı.",
          session: "evening",
          speakerId: speakerMap.get("Elşən Quliyev"),
          order: 2,
        },
        {
          time: "18:00",
          title: "Bağlanış Nitqi və Təşəkkürlər",
          description: "Tədbirin yekunlaşdırılması və təşəkkür nitqi.",
          session: "evening",
          order: 3,
        },
        {
          time: "18:30",
          title: "Networking və Foto Sessiyası",
          description: "İştirakçılar və spikerlərlə birgə şəbəkələşmə imkanı və xatirə fotoları.",
          session: "evening",
          order: 4,
        },
      ]);
      console.log("Program items seeded successfully");
    } else {
      console.log("Program items already exist, skipping...");
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
