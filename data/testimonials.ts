export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarInitials: string;
  avatarColor: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Michael Chen',
    role: 'VP of Engineering',
    company: 'TechVenture Inc.',
    quote:
      'Innoxel Solutions transformed our legacy platform into a modern, cloud-native system. The team\'s expertise and professionalism exceeded every expectation. Delivery was on time, on budget, and flawless.',
    rating: 5,
    avatarInitials: 'MC',
    avatarColor: '#4361ee',
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Head of Product',
    company: 'FinFlow Technologies',
    quote:
      'The mobile app they built for us achieved 4.9 stars on the App Store within the first month. Their attention to UX detail and performance optimization is truly world-class.',
    rating: 5,
    avatarInitials: 'SM',
    avatarColor: '#7209b7',
  },
  {
    id: 3,
    name: 'David Okonkwo',
    role: 'CEO',
    company: 'RetailEdge Solutions',
    quote:
      'We partnered with Innoxel for our AI recommendation engine and the results were staggering — 37% increase in conversion rate within 90 days. They genuinely understand business outcomes.',
    rating: 5,
    avatarInitials: 'DO',
    avatarColor: '#f72585',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'CTO',
    company: 'HealthSync Platform',
    quote:
      'From cloud migration to custom EHR development, Innoxel handled everything end-to-end. HIPAA-compliant, scalable, and beautiful. I couldn\'t ask for a better technology partner.',
    rating: 5,
    avatarInitials: 'PS',
    avatarColor: '#4cc9f0',
  },
  {
    id: 5,
    name: 'James Thornton',
    role: 'Director of Innovation',
    company: 'LogiChain Corp',
    quote:
      'The team at Innoxel built our supply chain management system in record time. Their agile process kept us informed every step of the way. Absolutely outstanding.',
    rating: 5,
    avatarInitials: 'JT',
    avatarColor: '#3a0ca3',
  },
  {
    id: 6,
    name: 'Fatima Al-Hassan',
    role: 'Founder',
    company: 'EduSpark',
    quote:
      'Innoxel designed and built our entire EdTech platform from scratch. The UI/UX is stunning and user engagement metrics doubled in the first quarter post-launch.',
    rating: 5,
    avatarInitials: 'FA',
    avatarColor: '#560bad',
  },
];
