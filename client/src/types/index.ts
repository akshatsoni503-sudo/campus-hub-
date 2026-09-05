export enum UserRole { STUDENT = 'STUDENT', EVENT_MANAGER = 'EVENT_MANAGER', ADMIN = 'ADMIN' }
export enum VerificationStatus { PENDING = 'PENDING', VERIFIED = 'VERIFIED', REJECTED = 'REJECTED' }
export enum EventStatus { DRAFT = 'DRAFT', PUBLISHED = 'PUBLISHED', CANCELLED = 'CANCELLED', COMPLETED = 'COMPLETED' }
export type EventCategory = 'HACKATHON' | 'WORKSHOP' | 'COMPETITION' | 'SEMINAR' | 'CULTURAL' | 'SPORTS' | 'TECHNICAL' | 'ENTREPRENEURSHIP' | 'CAREER' | 'OTHER';
export type EventMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';

export interface Skill { id: number; name: string; }
export interface Interest { id: number; name: string; }
export interface UserSkill { id: number; skillId: number; skill: Skill; }
export interface UserInterest { id: number; interestId: number; interest: Interest; }

export interface User {
  id: number; email: string; name: string; role: UserRole;
  verificationStatus: VerificationStatus; profileImage?: string;
  college?: string; branch?: string; year?: string; phone?: string;
  studentId?: string; organizationName?: string; collegeIdDocument?: string;
  emailVerified: boolean; createdAt: string; updatedAt: string;
  skills?: UserSkill[]; interests?: UserInterest[];
}

export interface Event {
  id: number; title: string; description: string; category: EventCategory;
  status: EventStatus; bannerImage?: string; organizer: string;
  organizerClubId?: number; organizerClub?: Club;
  date: string; startTime?: string; endTime?: string;
  registrationStart: string; registrationDeadline: string;
  venue?: string; mode: EventMode; maxParticipants?: number;
  eligibility?: string; branchRestrictions: string[]; yearRestrictions: string[];
  prizePool?: string; rules: string[]; contactEmail?: string; contactPhone?: string;
  registrationLink?: string; faqs: string; createdById: number;
  creator?: { id: number; name: string }; demandLevel: string;
  createdAt: string; updatedAt: string;
  requiredSkills?: { id: number; skill: Skill }[];
  requiredInterests?: { id: number; interest: Interest }[];
  _count?: { registrations: number };
  matchPercentage?: number;
}

export interface EventRegistration { id: number; userId: number; eventId: number; status: string; createdAt: string; event?: Event; }
export interface Club {
  id: number; name: string; category: string; description: string;
  image?: string; coverImage?: string; email?: string; website?: string;
  foundedYear?: number; memberCount: number; createdById: number;
  createdAt: string; updatedAt: string;
  followers?: ClubFollower[]; announcements?: ClubAnnouncement[];
  _count?: { followers: number };
}
export interface ClubFollower { id: number; userId: number; clubId: number; }
export interface ClubAnnouncement { id: number; clubId: number; title: string; content: string; createdAt: string; }

export interface Team {
  id: number; name: string; projectTitle?: string; projectDescription?: string;
  problemStatement?: string; projectCategory?: string;
  maxSize: number; currentSize: number; deadline?: string;
  contactEmail?: string; contactPhone?: string;
  eventId?: number; event?: Event; leaderId: number; leader?: User;
  college?: string; branch?: string; year?: string; isPublic: boolean;
  createdAt: string; updatedAt: string;
  members?: TeamMember[]; joinRequests?: TeamJoinRequest[];
  requiredSkills?: { id: number; skill: Skill }[];
}
export interface TeamMember { id: number; teamId: number; userId: number; role: string; user?: User; joinedAt: string; }
export interface TeamJoinRequest { id: number; teamId: number; userId: number; user?: User; message?: string; status: string; createdAt: string; }
export interface Notification { id: number; userId: number; type: string; title: string; message: string; read: boolean; link?: string; createdAt: string; }
export interface Certificate { id: number; userId: number; title: string; issuer: string; date: string; image?: string; description?: string; }
export interface Project { id: number; userId: number; title: string; description: string; techStack: string[]; link?: string; image?: string; }
export interface HackathonHistory { id: number; userId: number; name: string; date: string; position?: string; teamName?: string; project?: string; }
export interface Chat { id: number; userId: number; title: string; createdAt: string; messages?: ChatMessage[]; }
export interface ChatMessage { id: number; chatId: number; role: string; content: string; createdAt: string; }
export interface Compatibility { overallMatch: number; skillsAlignment: number; interestsAlignment: number; matchingSkills: string[]; missingSkills: string[]; }
export interface AuthResponse { user: User; token: string; }
