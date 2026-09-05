import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Campus Hub database...');

  // Clean existing data (in reverse dependency order)
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.clubAnnouncement.deleteMany();
  await prisma.clubFollower.deleteMany();
  await prisma.teamJoinRequest.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.teamSkill.deleteMany();
  await prisma.team.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.eventInterest.deleteMany();
  await prisma.eventSkill.deleteMany();
  await prisma.event.deleteMany();
  await prisma.club.deleteMany();
  await prisma.hackathonHistory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.skill.deleteMany();

  // Skills
  const skillNames = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AI/ML', 'Data Science', 'Java', 'C++', 'Flutter', 'UI/UX Design', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Blockchain', 'Web Development', 'Mobile Development', 'Database Management'];
  const skills: Record<string, any> = {};
  for (const name of skillNames) {
    skills[name] = await prisma.skill.create({ data: { name } });
  }
  console.log(`✅ Created ${skillNames.length} skills`);

  // Interests
  const interestNames = ['Hackathons', 'Web Development', 'AI/ML', 'Data Science', 'Open Source', 'Competitive Programming', 'App Development', 'Robotics', 'Entrepreneurship', 'Gaming', 'Cybersecurity', 'Cloud Computing'];
  const interests: Record<string, any> = {};
  for (const name of interestNames) {
    interests[name] = await prisma.interest.create({ data: { name } });
  }
  console.log(`✅ Created ${interestNames.length} interests`);

  // Users
  const hash = async (pw: string) => bcrypt.hash(pw, 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@campushub.com',
      password: await hash('Admin@123'),
      name: 'Admin User',
      role: 'ADMIN',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Administration',
      year: 'Staff'
    }
  });

  const rahul = await prisma.user.create({
    data: {
      email: 'rahul@college.edu',
      password: await hash('Student@123'),
      name: 'Rahul Sharma',
      role: 'STUDENT',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '3rd Year',
      studentId: 'CS2024001',
      skills: { create: [{ skillId: skills['JavaScript'].id }, { skillId: skills['React'].id }, { skillId: skills['Python'].id }, { skillId: skills['AI/ML'].id }, { skillId: skills['Node.js'].id }] },
      interests: { create: [{ interestId: interests['Hackathons'].id }, { interestId: interests['Web Development'].id }, { interestId: interests['AI/ML'].id }] }
    }
  });

  const priya = await prisma.user.create({
    data: {
      email: 'priya@college.edu',
      password: await hash('Manager@123'),
      name: 'Priya Patel',
      role: 'EVENT_MANAGER',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '4th Year',
      organizationName: 'Tech Club',
      skills: { create: [{ skillId: skills['JavaScript'].id }, { skillId: skills['TypeScript'].id }, { skillId: skills['React'].id }] },
      interests: { create: [{ interestId: interests['Hackathons'].id }, { interestId: interests['Web Development'].id }] }
    }
  });

  const ananya = await prisma.user.create({
    data: {
      email: 'ananya@college.edu',
      password: await hash('Student@123'),
      name: 'Ananya Gupta',
      role: 'STUDENT',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Electronics',
      year: '2nd Year',
      studentId: 'EC2025002',
      skills: { create: [{ skillId: skills['Python'].id }, { skillId: skills['Data Science'].id }, { skillId: skills['AI/ML'].id }] },
      interests: { create: [{ interestId: interests['AI/ML'].id }, { interestId: interests['Data Science'].id }, { interestId: interests['Robotics'].id }] }
    }
  });

  const vikram = await prisma.user.create({
    data: {
      email: 'vikram@college.edu',
      password: await hash('Student@123'),
      name: 'Vikram Singh',
      role: 'STUDENT',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '4th Year',
      studentId: 'CS2023003',
      skills: { create: [{ skillId: skills['Java'].id }, { skillId: skills['C++'].id }, { skillId: skills['DevOps'].id }, { skillId: skills['Cloud Computing'].id }] },
      interests: { create: [{ interestId: interests['Competitive Programming'].id }, { interestId: interests['Cloud Computing'].id }, { interestId: interests['Open Source'].id }] }
    }
  });

  const neha = await prisma.user.create({
    data: {
      email: 'neha@college.edu',
      password: await hash('Student@123'),
      name: 'Neha Verma',
      role: 'STUDENT',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Design',
      year: '3rd Year',
      studentId: 'DD2024004',
      skills: { create: [{ skillId: skills['UI/UX Design'].id }, { skillId: skills['Flutter'].id }, { skillId: skills['JavaScript'].id }] },
      interests: { create: [{ interestId: interests['App Development'].id }, { interestId: interests['Entrepreneurship'].id }] }
    }
  });

  const arjun = await prisma.user.create({
    data: {
      email: 'arjun@college.edu',
      password: await hash('Student@123'),
      name: 'Arjun Reddy',
      role: 'STUDENT',
      verificationStatus: 'VERIFIED',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '2nd Year',
      studentId: 'CS2025005',
      skills: { create: [{ skillId: skills['Blockchain'].id }, { skillId: skills['JavaScript'].id }, { skillId: skills['Web Development'].id }] },
      interests: { create: [{ interestId: interests['Hackathons'].id }, { interestId: interests['Gaming'].id }, { interestId: interests['Cybersecurity'].id }] }
    }
  });

  const pendingUser = await prisma.user.create({
    data: {
      email: 'pending@college.edu',
      password: await hash('Student@123'),
      name: 'Pending Student',
      role: 'STUDENT',
      verificationStatus: 'PENDING',
      emailVerified: true,
      college: 'IIT Delhi',
      branch: 'Mechanical',
      year: '1st Year'
    }
  });

  console.log('✅ Created 8 users (admin, 5 students, 1 event manager, 1 pending)');

  // Clubs
  const codingClub = await prisma.club.create({
    data: { name: 'Coding Club', category: 'Tech', description: 'The premier coding community on campus. We host weekly coding sessions, competitive programming contests, and development workshops. Join us to level up your programming skills!', createdById: priya.id, memberCount: 450, email: 'coding@iitd.edu', foundedYear: 2018 }
  });
  const aiClub = await prisma.club.create({
    data: { name: 'AI Club', category: 'Tech', description: 'Exploring the frontiers of Artificial Intelligence and Machine Learning. We organize paper reading sessions, model building competitions, and industry talks from leading AI researchers.', createdById: priya.id, memberCount: 320, email: 'ai@iitd.edu', foundedYear: 2020 }
  });
  const eCell = await prisma.club.create({
    data: { name: 'Entrepreneurship Cell', category: 'Entrepreneurship', description: 'Fostering the entrepreneurial spirit on campus. Pitch competitions, startup bootcamps, mentor connect sessions, and the annual E-Summit.', createdById: priya.id, memberCount: 280, foundedYear: 2015 }
  });
  const dramaSociety = await prisma.club.create({
    data: { name: 'Drama Society', category: 'Cultural', description: 'Where stories come alive! Join us for theatre workshops, annual drama festival, street plays, and more. No prior experience needed.', createdById: priya.id, memberCount: 150, foundedYear: 2010 }
  });
  const sportsClub = await prisma.club.create({
    data: { name: 'Sports Club', category: 'Sports', description: 'All things sports! Cricket, football, basketball, athletics, and more. Regular practice sessions and inter-college tournaments.', createdById: priya.id, memberCount: 500, foundedYear: 2008 }
  });
  const photoClub = await prisma.club.create({
    data: { name: 'Photography Club', category: 'Arts', description: 'Capture moments, tell stories. Weekly photo walks, editing workshops, exhibitions, and the annual photography competition.', createdById: priya.id, memberCount: 200, foundedYear: 2016 }
  });
  console.log('✅ Created 6 clubs');

  // Club followers
  await prisma.clubFollower.createMany({
    data: [
      { userId: rahul.id, clubId: codingClub.id },
      { userId: rahul.id, clubId: aiClub.id },
      { userId: ananya.id, clubId: aiClub.id },
      { userId: vikram.id, clubId: codingClub.id },
      { userId: neha.id, clubId: photoClub.id },
      { userId: arjun.id, clubId: codingClub.id },
    ]
  });

  // Club announcements
  await prisma.clubAnnouncement.createMany({
    data: [
      { clubId: codingClub.id, title: 'Weekly Coding Contest #42', content: 'This week\'s contest features dynamic programming problems. Join us this Saturday at 6 PM in Lab 201.' },
      { clubId: codingClub.id, title: 'Hackathon Prep Session', content: 'Preparing for the upcoming AI Innovation Hackathon? Join our prep session on Wednesday.' },
      { clubId: aiClub.id, title: 'Paper Reading: LLM Advances', content: 'We\'ll be discussing the latest advances in Large Language Models this Friday at 5 PM.' },
      { clubId: eCell.id, title: 'Startup Pitch Night', content: 'Got a startup idea? Pitch it to our panel of mentors and investors this Sunday!' },
      { clubId: sportsClub.id, title: 'Cricket Tournament Registration', content: 'Inter-college cricket tournament registrations are now open. Form your teams!' },
      { clubId: photoClub.id, title: 'Campus Photo Walk', content: 'Join us for a sunset photo walk around campus this Saturday at 4:30 PM.' },
    ]
  });
  console.log('✅ Created club followers and announcements');

  // Events
  const events = [];
  const eventsData = [
    { title: 'AI Innovation Hackathon', desc: 'Join the most anticipated technical event of the semester. The AI Innovation Hackathon challenges students to build novel applications leveraging LLMs, computer vision, or predictive analytics to solve campus-related problems. Food, caffeine, and sleeping bags provided. Mentors from top tech companies will be on-site to assist.', cat: 'HACKATHON', date: '2026-10-24', venue: 'Tech Hub, Room 402', prize: '$5,000', demand: 'High', skills: ['AI/ML', 'Python', 'React'], interests: ['AI/ML', 'Hackathons'], mode: 'OFFLINE', max: 200 },
    { title: 'Web3 Development Workshop', desc: 'Learn how to build decentralized applications from scratch. This hands-on workshop covers Solidity, smart contracts, and Web3.js integration. Perfect for developers looking to break into blockchain.', cat: 'WORKSHOP', date: '2026-10-20', venue: 'CS Lab 101', prize: null, demand: 'Medium', skills: ['Blockchain', 'JavaScript', 'Web Development'], interests: ['Web Development'], mode: 'OFFLINE', max: 50 },
    { title: 'Code Sprint 2026', desc: 'A 6-hour competitive programming contest featuring algorithmic challenges across difficulty levels. Top performers win prizes and get noticed by recruiting companies.', cat: 'COMPETITION', date: '2026-11-05', venue: 'Main Auditorium', prize: '$2,000', demand: 'High', skills: ['Java', 'C++', 'Python'], interests: ['Competitive Programming'], mode: 'OFFLINE', max: 300 },
    { title: 'Cloud Computing Seminar', desc: 'Industry experts from AWS and Google Cloud discuss the future of cloud infrastructure, serverless computing, and DevOps practices.', cat: 'SEMINAR', date: '2026-11-12', venue: 'Lecture Hall 3', prize: null, demand: 'Medium', skills: ['Cloud Computing', 'DevOps'], interests: ['Cloud Computing'], mode: 'HYBRID', max: 200 },
    { title: 'Cultural Fest 2026', desc: 'The biggest cultural extravaganza of the year! Music, dance, drama, fashion show, and more. Three days of non-stop entertainment and creativity.', cat: 'CULTURAL', date: '2026-11-20', venue: 'Open Air Theatre', prize: '$3,000', demand: 'High', skills: [], interests: [], mode: 'OFFLINE', max: 1000 },
    { title: 'Inter-College Cricket Tournament', desc: 'Annual inter-college cricket tournament. 16 teams battle it out for the championship trophy. Register your team now!', cat: 'SPORTS', date: '2026-11-25', venue: 'Sports Ground', prize: '$1,500', demand: 'High', skills: [], interests: [], mode: 'OFFLINE', max: 16 },
    { title: 'ML Model Building Challenge', desc: 'Build and deploy a machine learning model that solves a real-world problem. Dataset provided. Best model wins based on accuracy and innovation.', cat: 'TECHNICAL', date: '2026-12-05', venue: 'AI Lab', prize: '$3,000', demand: 'Medium', skills: ['AI/ML', 'Data Science', 'Python'], interests: ['AI/ML', 'Data Science'], mode: 'OFFLINE', max: 100 },
    { title: 'Startup Pitch Competition', desc: 'Pitch your startup idea to a panel of VCs and angel investors. Top 3 ideas receive seed funding and mentorship from industry leaders.', cat: 'ENTREPRENEURSHIP', date: '2026-12-10', venue: 'Business School Auditorium', prize: '$10,000', demand: 'High', skills: [], interests: ['Entrepreneurship'], mode: 'OFFLINE', max: 50 },
    { title: 'Campus Career Fair 2026', desc: 'Connect with 50+ companies including Google, Microsoft, Amazon, and startups. Bring your resume and portfolio. On-the-spot interviews for select roles.', cat: 'CAREER', date: '2026-12-15', venue: 'Convention Center', prize: null, demand: 'High', skills: [], interests: [], mode: 'OFFLINE', max: 2000 },
    { title: 'UI/UX Design Jam', desc: 'A 12-hour design sprint where teams redesign a popular app. Judged by design leads from Figma and Adobe. Learn design thinking, prototyping, and user research.', cat: 'WORKSHOP', date: '2026-10-28', venue: 'Design Studio', prize: '$1,500', demand: 'Medium', skills: ['UI/UX Design', 'JavaScript'], interests: ['App Development'], mode: 'OFFLINE', max: 60 },
    { title: 'Cybersecurity CTF', desc: 'Capture The Flag competition testing your cybersecurity skills. Challenges include web exploitation, cryptography, binary analysis, and forensics.', cat: 'COMPETITION', date: '2026-12-20', venue: 'Security Lab', prize: '$2,500', demand: 'Medium', skills: ['Cybersecurity'], interests: ['Cybersecurity'], mode: 'ONLINE', max: 150 },
    { title: 'Open Source Contribution Day', desc: 'Contribute to popular open source projects with guidance from maintainers. First-time contributors welcome! Learn Git, GitHub workflows, and collaborative development.', cat: 'TECHNICAL', date: '2026-11-15', venue: 'CS Lab 301', prize: null, demand: 'Low', skills: ['JavaScript', 'Python', 'TypeScript'], interests: ['Open Source'], mode: 'HYBRID', max: 80 },
  ];

  for (const e of eventsData) {
    const evDate = new Date(e.date);
    const regStart = new Date(evDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const regDead = new Date(evDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const event = await prisma.event.create({
      data: {
        title: e.title,
        description: e.desc,
        category: e.cat as any,
        status: 'PUBLISHED',
        organizer: 'Campus Tech',
        organizerClubId: e.cat === 'HACKATHON' || e.cat === 'TECHNICAL' ? aiClub.id : e.cat === 'COMPETITION' ? codingClub.id : null,
        date: evDate,
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        registrationStart: regStart,
        registrationDeadline: regDead,
        venue: e.venue,
        mode: (e.mode || 'OFFLINE') as any,
        maxParticipants: e.max,
        prizePool: e.prize,
        demandLevel: e.demand,
        contactEmail: 'events@campushub.com',
        createdById: priya.id,
        rules: ['Open to all verified students', 'Follow the code of conduct'],
        faqs: JSON.stringify([
          { q: 'Who can participate?', a: 'All verified students from any branch.' },
          { q: 'Is there a registration fee?', a: 'No, participation is completely free.' }
        ])
      }
    });

    for (const sName of e.skills) {
      if (skills[sName]) {
        await prisma.eventSkill.create({ data: { eventId: event.id, skillId: skills[sName].id } });
      }
    }
    for (const iName of e.interests) {
      if (interests[iName]) {
        await prisma.eventInterest.create({ data: { eventId: event.id, interestId: interests[iName].id } });
      }
    }
    events.push(event);
  }
  console.log(`✅ Created ${events.length} events`);

  // Event registrations
  await prisma.eventRegistration.createMany({
    data: [
      { userId: rahul.id, eventId: events[0].id },
      { userId: rahul.id, eventId: events[2].id },
      { userId: ananya.id, eventId: events[0].id },
      { userId: ananya.id, eventId: events[6].id },
      { userId: vikram.id, eventId: events[2].id },
      { userId: vikram.id, eventId: events[3].id },
      { userId: arjun.id, eventId: events[10].id },
    ]
  });
  console.log('✅ Created event registrations');

  // Teams
  const team1 = await prisma.team.create({
    data: {
      name: 'Neural Navigators',
      projectTitle: 'AI Campus Navigator',
      projectDescription: 'Building an AI-powered campus navigation system that helps students find classrooms, labs, and facilities using natural language queries.',
      problemStatement: 'Students often struggle to find specific locations on large campuses, especially during first week.',
      projectCategory: 'AI/ML',
      maxSize: 4,
      currentSize: 2,
      leaderId: rahul.id,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '3rd Year',
      isPublic: true,
      eventId: events[0].id,
      contactEmail: 'rahul@college.edu'
    }
  });
  await prisma.teamMember.create({ data: { teamId: team1.id, userId: rahul.id, role: 'LEADER' } });
  await prisma.teamMember.create({ data: { teamId: team1.id, userId: ananya.id, role: 'MEMBER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team1.id, skillId: skills['AI/ML'].id }, { teamId: team1.id, skillId: skills['Python'].id }, { teamId: team1.id, skillId: skills['React'].id }] });

  const team2 = await prisma.team.create({
    data: {
      name: 'Code Crusaders',
      projectTitle: 'Smart Study Planner',
      projectDescription: 'A study planner that uses ML to optimize study schedules based on exam patterns and student performance.',
      problemStatement: 'Students struggle to manage study time efficiently across multiple subjects.',
      projectCategory: 'EdTech',
      maxSize: 3,
      currentSize: 1,
      leaderId: vikram.id,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '4th Year',
      isPublic: true,
      contactEmail: 'vikram@college.edu'
    }
  });
  await prisma.teamMember.create({ data: { teamId: team2.id, userId: vikram.id, role: 'LEADER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team2.id, skillId: skills['Java'].id }, { teamId: team2.id, skillId: skills['Cloud Computing'].id }] });

  const team3 = await prisma.team.create({
    data: {
      name: 'Design Dynamos',
      projectTitle: 'Campus UX Redesign',
      projectDescription: 'Redesigning the campus website and mobile app for better accessibility and user experience.',
      problemStatement: 'Current campus portal has poor UX and is not mobile-friendly.',
      projectCategory: 'Design',
      maxSize: 4,
      currentSize: 1,
      leaderId: neha.id,
      college: 'IIT Delhi',
      branch: 'Design',
      year: '3rd Year',
      isPublic: true,
      eventId: events[9].id,
      contactEmail: 'neha@college.edu'
    }
  });
  await prisma.teamMember.create({ data: { teamId: team3.id, userId: neha.id, role: 'LEADER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team3.id, skillId: skills['UI/UX Design'].id }, { teamId: team3.id, skillId: skills['Flutter'].id }] });

  const team4 = await prisma.team.create({
    data: {
      name: 'Blockchain Builders',
      projectTitle: 'Decentralized Credential System',
      projectDescription: 'A blockchain-based credential verification system for academic certificates.',
      problemStatement: 'Academic credential verification is slow and prone to fraud.',
      projectCategory: 'Blockchain',
      maxSize: 5,
      currentSize: 2,
      leaderId: arjun.id,
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '2nd Year',
      isPublic: true,
      eventId: events[1].id,
      contactEmail: 'arjun@college.edu'
    }
  });
  await prisma.teamMember.create({ data: { teamId: team4.id, userId: arjun.id, role: 'LEADER' } });
  await prisma.teamMember.create({ data: { teamId: team4.id, userId: vikram.id, role: 'MEMBER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team4.id, skillId: skills['Blockchain'].id }, { teamId: team4.id, skillId: skills['JavaScript'].id }, { teamId: team4.id, skillId: skills['Web Development'].id }] });

  const team5 = await prisma.team.create({
    data: {
      name: 'Data Wizards',
      projectTitle: 'Campus Analytics Dashboard',
      projectDescription: 'An analytics dashboard that visualizes campus data trends for administration decision-making.',
      problemStatement: 'Campus administration lacks data-driven insights for resource allocation.',
      projectCategory: 'Data Science',
      maxSize: 4,
      currentSize: 1,
      leaderId: ananya.id,
      college: 'IIT Delhi',
      branch: 'Electronics',
      year: '2nd Year',
      isPublic: true,
      contactEmail: 'ananya@college.edu'
    }
  });
  await prisma.teamMember.create({ data: { teamId: team5.id, userId: ananya.id, role: 'LEADER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team5.id, skillId: skills['Data Science'].id }, { teamId: team5.id, skillId: skills['Python'].id }, { teamId: team5.id, skillId: skills['Database Management'].id }] });

  // More teams
  const team6 = await prisma.team.create({
    data: { name: 'Cloud Pioneers', projectTitle: 'Serverless Campus API', projectDescription: 'Building a serverless API platform for campus services.', projectCategory: 'Cloud', maxSize: 3, currentSize: 1, leaderId: vikram.id, college: 'IIT Delhi', branch: 'Computer Science', year: '4th Year', isPublic: true, contactEmail: 'vikram@college.edu' }
  });
  await prisma.teamMember.create({ data: { teamId: team6.id, userId: vikram.id, role: 'LEADER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team6.id, skillId: skills['Cloud Computing'].id }, { teamId: team6.id, skillId: skills['DevOps'].id }, { teamId: team6.id, skillId: skills['Node.js'].id }] });

  const team7 = await prisma.team.create({
    data: { name: 'Mobile Mavens', projectTitle: 'Campus Social App', projectDescription: 'A social networking app exclusively for campus students.', projectCategory: 'Mobile', maxSize: 4, currentSize: 1, leaderId: neha.id, college: 'IIT Delhi', branch: 'Design', year: '3rd Year', isPublic: true, contactEmail: 'neha@college.edu' }
  });
  await prisma.teamMember.create({ data: { teamId: team7.id, userId: neha.id, role: 'LEADER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team7.id, skillId: skills['Flutter'].id }, { teamId: team7.id, skillId: skills['Mobile Development'].id }, { teamId: team7.id, skillId: skills['UI/UX Design'].id }] });

  const team8 = await prisma.team.create({
    data: { name: 'Security Sentinels', projectTitle: 'Campus Network Monitor', projectDescription: 'A network monitoring tool for detecting security threats on campus Wi-Fi.', projectCategory: 'Security', maxSize: 3, currentSize: 1, leaderId: arjun.id, college: 'IIT Delhi', branch: 'Computer Science', year: '2nd Year', isPublic: true, eventId: events[10].id, contactEmail: 'arjun@college.edu' }
  });
  await prisma.teamMember.create({ data: { teamId: team8.id, userId: arjun.id, role: 'LEADER' } });
  await prisma.teamSkill.createMany({ data: [{ teamId: team8.id, skillId: skills['Cybersecurity'].id }, { teamId: team8.id, skillId: skills['Python'].id }] });

  console.log('✅ Created 8 teams with members');

  // Team join requests
  await prisma.teamJoinRequest.create({ data: { teamId: team1.id, userId: arjun.id, message: 'I have experience with React and would love to contribute to the frontend!', status: 'PENDING' } });
  await prisma.teamJoinRequest.create({ data: { teamId: team2.id, userId: rahul.id, message: 'Interested in the ML optimization aspect of the study planner.', status: 'PENDING' } });
  console.log('✅ Created team join requests');

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: rahul.id, type: 'EVENT_REGISTRATION', title: 'Registration Successful', message: 'You have successfully registered for AI Innovation Hackathon', link: `/events/${events[0].id}` },
      { userId: rahul.id, type: 'EVENT_DEADLINE', title: 'Deadline Approaching', message: 'Registration for Web3 Development Workshop closes in 3 days!', link: `/events/${events[1].id}` },
      { userId: rahul.id, type: 'TEAM_REQUEST', title: 'New Join Request', message: 'Arjun Reddy wants to join Neural Navigators', link: '/teams' },
      { userId: rahul.id, type: 'NEW_EVENT', title: 'New Event Match', message: 'ML Model Building Challenge matches your skills (87% match)', link: `/events/${events[6].id}` },
      { userId: rahul.id, type: 'CLUB_ANNOUNCEMENT', title: 'Coding Club Update', message: 'Weekly Coding Contest #42 announced!', link: '/clubs' },
      { userId: ananya.id, type: 'EVENT_REGISTRATION', title: 'Registration Successful', message: 'You have registered for AI Innovation Hackathon' },
      { userId: vikram.id, type: 'TEAM_ACCEPTED', title: 'Welcome to the Team!', message: 'You are now a member of Blockchain Builders' },
      { userId: arjun.id, type: 'VERIFICATION_UPDATE', title: 'Account Verified', message: 'Your student account has been verified. You now have full access.' },
    ]
  });
  console.log('✅ Created notifications');

  // Certificates & projects for demo student
  await prisma.certificate.create({
    data: { userId: rahul.id, title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: new Date('2026-06-15'), description: 'Foundation-level certification for AWS cloud services' }
  });
  await prisma.certificate.create({
    data: { userId: rahul.id, title: 'React Professional Certificate', issuer: 'Meta', date: new Date('2026-03-20'), description: 'Professional certification in React development' }
  });

  await prisma.project.create({
    data: { userId: rahul.id, title: 'Smart Attendance System', description: 'Face recognition based attendance system using Python and OpenCV', techStack: ['Python', 'OpenCV', 'Flask', 'PostgreSQL'], link: 'https://github.com/rahul/attendance' }
  });
  await prisma.project.create({
    data: { userId: rahul.id, title: 'E-Commerce Dashboard', description: 'Full-stack e-commerce analytics dashboard with real-time data', techStack: ['React', 'Node.js', 'MongoDB', 'D3.js'] }
  });

  await prisma.hackathonHistory.create({
    data: { userId: rahul.id, name: 'HackIITD 2025', date: new Date('2025-11-10'), position: '2nd Place', teamName: 'Code Ninjas', project: 'AI-powered campus chatbot' }
  });
  await prisma.hackathonHistory.create({
    data: { userId: rahul.id, name: 'Smart India Hackathon', date: new Date('2025-08-20'), position: 'Finalist', teamName: 'Tech Titans', project: 'Automated document verification system' }
  });
  console.log('✅ Created certificates, projects, and hackathon history');

  // Demo copilot chat
  const chat = await prisma.chat.create({
    data: {
      userId: rahul.id,
      title: 'Coding Club Events',
      messages: {
        create: [
          { role: 'user', content: 'bhai coding club ka next event kab hai?' },
          { role: 'assistant', content: 'Coding Club ke upcoming events:\n\n1. **Weekly Coding Contest #42** - Is Saturday ko 6 PM, Lab 201 mein. Dynamic programming problems honge.\n\n2. **Hackathon Prep Session** - Wednesday ko. AI Innovation Hackathon ki preparation ke liye.\n\nKisi event ke liye register karna hai toh Explore page pe jao! 🎯' }
        ]
      }
    }
  });
  console.log('✅ Created demo copilot chat');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin:   admin@campushub.com / Admin@123');
  console.log('   Student: rahul@college.edu / Student@123');
  console.log('   Manager: priya@college.edu / Manager@123');
  console.log('   OTP:     123456');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
