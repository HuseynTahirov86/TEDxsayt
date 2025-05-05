import mysql from 'mysql2/promise';

async function seed() {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
    throw new Error(
      "MySQL environment variables must be set (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)",
    );
  }

  // Create a MySQL connection pool
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  });

  try {
    console.log("Starting to seed database...");

    // Check if program sessions already exist
    console.log("Seeding program sessions...");
    const [sessions] = await pool.query("SELECT * FROM program_sessions");
    
    if (Array.isArray(sessions) && sessions.length === 0) {
      await pool.query(`
        INSERT INTO program_sessions (id, name, \`order\`) VALUES 
        ('morning', 'Səhər Sessiyası', 1),
        ('afternoon', 'Günorta Sessiyası', 2),
        ('evening', 'Axşam Sessiyası', 3)
      `);
      console.log("Program sessions seeded successfully");
    } else {
      console.log("Program sessions already exist, skipping...");
    }

    // Check if speakers already exist
    console.log("Seeding speakers...");
    const [speakers] = await pool.query("SELECT * FROM speakers");
    
    if (Array.isArray(speakers) && speakers.length === 0) {
      await pool.query(`
        INSERT INTO speakers (name, title, bio, topic, image) VALUES 
        ('Leyla Əliyeva', 'Tech Entrepreneur & AI Researcher', 'Süni intellekt sahəsində 10+ illik təcrübəyə malik olan Leyla, hazırda Azərbaycanda texnologiya startaplarını dəstəkləyən və mentor kimi çalışan bir sahibkardır.', 'AI və Regional İnnovasiya: Naxçıvandan Dünyaya', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'),
        ('Orxan Məmmədov', 'Sustainable Agriculture Specialist', 'Orxan, davamlı kənd təsərrüfatı sahəsində çalışan və Naxçıvan bölgəsində innovativ əkinçilik metodlarının tətbiqi ilə məşğul olan bir mütəxəssisdir.', 'Su Qıtlığı Şəraitində Davamlı Əkinçilik Texnologiyaları', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'),
        ('Aynur Həsənli', 'Educational Innovator', 'Aynur, təhsil sahəsində yeni metodların tətbiqi ilə tanınan və ucqar kənd məktəblərində distant təhsil layihələri həyata keçirən təhsil innovatorudur.', 'Ucqar Bölgələrdə Rəqəmsal Təhsil İmkanları', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1161&q=80'),
        ('Tural Əliyev', 'Cultural Heritage Preservationist', 'Tural Naxçıvanın zəngin mədəni irsinin qorunması üçün çalışan və müasir texnologiyalardan istifadə edərək tarixi abidələrin virtual turlarını yaradan bir mütəxəssisdir.', 'Rəqəmsal Texnologiyalar vasitəsilə Naxçıvan Mədəni İrsinin Qorunması', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'),
        ('Gülnar Məmmədova', 'Climate Scientist', 'Gülnar iqlim dəyişikliyi sahəsində tədqiqatlar aparan və Naxçıvan bölgəsində su qıtlığı problemlərinin həlli yollarını araşdıran bir alimədir.', 'İqlim Dəyişikliyinə Qarşı Yerli Həll Yolları', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'),
        ('Elşən Quliyev', 'Renewable Energy Entrepreneur', 'Elşən bərpa olunan enerji sahəsində çalışan və Naxçıvanda günəş enerjisi layihələri həyata keçirən bir sahibkardır.', 'Naxçıvanda Günəş Enerjisi: İmkanlar və Perspektivlər', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')
      `);
      console.log("Speakers seeded successfully");
    } else {
      console.log("Speakers already exist, skipping...");
    }

    // Get speakers for references
    const [allSpeakers] = await pool.query("SELECT id, name FROM speakers");
    const speakerMap = new Map();
    
    if (Array.isArray(allSpeakers)) {
      allSpeakers.forEach((speaker: any) => {
        speakerMap.set(speaker.name, speaker.id);
      });
    }

    // Check if program items already exist
    console.log("Seeding program items...");
    const [items] = await pool.query("SELECT * FROM program_items");
    
    if (Array.isArray(items) && items.length === 0) {
      // Morning session
      await pool.query(`
        INSERT INTO program_items (time, title, description, session, \`order\`) VALUES 
        ('09:00', 'Qeydiyyat və Qarşılama', 'İştirakçıların qeydiyyatı, qarşılanması və tədbir materiallarının paylanması.', 'morning', 1)
      `);
      
      await pool.query(`
        INSERT INTO program_items (time, title, description, session, \`order\`) VALUES 
        ('10:00', 'Açılış Nitqi', 'Naxçıvan Dövlət Universitetinin rektoru tərəfindən açılış nitqi.', 'morning', 2)
      `);
      
      // Add speaker presentations
      for (const [name, id] of speakerMap.entries()) {
        if (name === 'Leyla Əliyeva') {
          await pool.query(`
            INSERT INTO program_items (time, title, description, session, speaker_id, \`order\`) VALUES 
            ('10:30', 'Çıxış: "AI və Regional İnnovasiya: Naxçıvandan Dünyaya"', 'Süni intellektin regional inkişafa təsiri və Naxçıvanda texnoloji innovasiya imkanları haqqında.', 'morning', ?, 3)
          `, [id]);
        } else if (name === 'Orxan Məmmədov') {
          await pool.query(`
            INSERT INTO program_items (time, title, description, session, speaker_id, \`order\`) VALUES 
            ('11:15', 'Çıxış: "Su Qıtlığı Şəraitində Davamlı Əkinçilik Texnologiyaları"', 'Naxçıvanda su qıtlığı problemi və müasir texnologiyaların bu problemin həllində rolu.', 'morning', ?, 4)
          `, [id]);
        } else if (name === 'Aynur Həsənli') {
          await pool.query(`
            INSERT INTO program_items (time, title, description, session, speaker_id, \`order\`) VALUES 
            ('13:30', 'Çıxış: "Ucqar Bölgələrdə Rəqəmsal Təhsil İmkanları"', 'Naxçıvanın ucqar kəndlərində təhsilə çıxış problemləri və texnologiyanın təqdim etdiyi həll yolları.', 'afternoon', ?, 1)
          `, [id]);
        } else if (name === 'Tural Əliyev') {
          await pool.query(`
            INSERT INTO program_items (time, title, description, session, speaker_id, \`order\`) VALUES 
            ('14:15', 'Çıxış: "Rəqəmsal Texnologiyalar vasitəsilə Naxçıvan Mədəni İrsinin Qorunması"', 'Mədəni irsin qorunması və dünyaya tanıdılmasında müasir texnologiyaların rolu.', 'afternoon', ?, 2)
          `, [id]);
        } else if (name === 'Gülnar Məmmədova') {
          await pool.query(`
            INSERT INTO program_items (time, title, description, session, speaker_id, \`order\`) VALUES 
            ('16:30', 'Çıxış: "İqlim Dəyişikliyinə Qarşı Yerli Həll Yolları"', 'İqlim dəyişikliyinin Naxçıvan bölgəsinə təsirləri və yerli həll yollarının əhəmiyyəti.', 'evening', ?, 1)
          `, [id]);
        } else if (name === 'Elşən Quliyev') {
          await pool.query(`
            INSERT INTO program_items (time, title, description, session, speaker_id, \`order\`) VALUES 
            ('17:15', 'Çıxış: "Naxçıvanda Günəş Enerjisi: İmkanlar və Perspektivlər"', 'Naxçıvanda alternativ enerji mənbələrinin inkişafı və günəş enerjisinin potensialı.', 'evening', ?, 2)
          `, [id]);
        }
      }
      
      // Add remaining program items
      await pool.query(`
        INSERT INTO program_items (time, title, description, session, \`order\`) VALUES 
        ('12:00', 'Nahar Fasiləsi', 'İştirakçılar üçün şəbəkələşmə və müzakirə imkanı.', 'morning', 5),
        ('15:00', 'Panel Müzakirəsi: "Regional İnkişafda Gənclərin Rolu"', 'Naxçıvanın inkişafında gənc mütəxəssislərin və sahibkarların rolu haqqında panel müzakirəsi.', 'afternoon', 3),
        ('16:00', 'Qəhvə Fasiləsi', 'Şəbəkələşmə və interaktiv təqdimatlar.', 'afternoon', 4),
        ('18:00', 'Bağlanış Nitqi və Təşəkkürlər', 'Tədbirin yekunlaşdırılması və təşəkkür nitqi.', 'evening', 3),
        ('18:30', 'Networking və Foto Sessiyası', 'İştirakçılar və spikerlərlə birgə şəbəkələşmə imkanı və xatirə fotoları.', 'evening', 4)
      `);
      
      console.log("Program items seeded successfully");
    } else {
      console.log("Program items already exist, skipping...");
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seed();