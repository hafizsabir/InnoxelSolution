export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatarInitials: string;
  avatarColor: string;
  linkedin: string;
  github: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Aryan Shah',
    role: 'CEO & Co-Founder',
    bio: '15+ years of experience in software architecture and business strategy. Former CTO at Fortune 500 tech companies.',
    avatarInitials: 'AS',
    avatarColor: '#4361ee',
    linkedin: '#',
    github: '#',
  },
  {
    id: 2,
    name: 'Zara Khan',
    role: 'CTO & Co-Founder',
    bio: 'AI & cloud infrastructure expert with a passion for scalable systems. PhD in Computer Science from MIT.',
    avatarInitials: 'ZK',
    avatarColor: '#7209b7',
    linkedin: '#',
    github: '#',
  },
  {
    id: 3,
    name: 'Hamza Raza',
    role: 'Lead Full-Stack Developer',
    bio: 'Full-stack wizard specializing in React, Node.js, and cloud-native applications with 10+ years in the field.',
    avatarInitials: 'HR',
    avatarColor: '#f72585',
    linkedin: '#',
    github: '#',
  },
  {
    id: 4,
    name: 'Amna Tariq',
    role: 'Head of UI/UX Design',
    bio: 'Award-winning designer who blends aesthetics with function. Passionate about accessibility and inclusive design.',
    avatarInitials: 'AT',
    avatarColor: '#4cc9f0',
    linkedin: '#',
    github: '#',
  },
  {
    id: 5,
    name: 'Omar Farooq',
    role: 'AI/ML Lead Engineer',
    bio: 'Machine learning researcher turned product engineer. Built AI systems used by millions across 3 continents.',
    avatarInitials: 'OF',
    avatarColor: '#3a0ca3',
    linkedin: '#',
    github: '#',
  },
  {
    id: 6,
    name: 'Sara Malik',
    role: 'Project Manager',
    bio: 'PMP-certified project manager with a track record of delivering complex projects on time and under budget.',
    avatarInitials: 'SM',
    avatarColor: '#560bad',
    linkedin: '#',
    github: '#',
  },
];
