export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  authorGradient: string;
  coverGradient: string;
  tags: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-powered-web-apps-2025',
    title: 'Building AI-Powered Web Apps in 2025: A Complete Developer Guide',
    excerpt:
      'Discover how to seamlessly integrate large language models, vector databases, and real-time inference pipelines into modern Next.js applications — without sacrificing performance or UX.',
    category: 'Artificial Intelligence',
    categoryColor: '#f72585',
    readTime: '8 min read',
    date: 'May 3, 2026',
    author: 'Arslan Mehmood',
    authorRole: 'Lead AI Engineer',
    authorInitials: 'AM',
    authorGradient: 'linear-gradient(135deg, #f72585, #7209b7)',
    coverGradient: 'linear-gradient(135deg, #f72585 0%, #7209b7 50%, #4361ee 100%)',
    tags: ['Next.js', 'OpenAI', 'LangChain', 'Vector DB'],
    featured: true,
  },
  {
    slug: 'microservices-vs-monolith-2025',
    title: 'Microservices vs Monolith: Choosing the Right Architecture for Your SaaS',
    excerpt:
      'A battle-tested framework for deciding when to break a monolith apart — and when to resist the urge. Real-world case studies from 3 production SaaS platforms we rebuilt at Innoxel.',
    category: 'Architecture',
    categoryColor: '#4361ee',
    readTime: '6 min read',
    date: 'Apr 28, 2026',
    author: 'Sara Khalid',
    authorRole: 'Principal Engineer',
    authorInitials: 'SK',
    authorGradient: 'linear-gradient(135deg, #4361ee, #4cc9f0)',
    coverGradient: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
    tags: ['Node.js', 'Docker', 'Kubernetes', 'AWS'],
    featured: true,
  },
  {
    slug: 'react-native-performance-tips',
    title: '10 React Native Performance Tricks That Cut Our App Load Time by 60%',
    excerpt:
      'From hermes engine tuning and lazy bundle loading to Reanimated 3 worklets and FlashList — here are the exact techniques we used to ship a 60 FPS experience on mid-range Android devices.',
    category: 'Mobile Dev',
    categoryColor: '#4cc9f0',
    readTime: '10 min read',
    date: 'Apr 18, 2026',
    author: 'Usman Ali',
    authorRole: 'Senior Mobile Engineer',
    authorInitials: 'UA',
    authorGradient: 'linear-gradient(135deg, #4cc9f0, #4361ee)',
    coverGradient: 'linear-gradient(135deg, #06d6a0 0%, #4cc9f0 100%)',
    tags: ['React Native', 'Hermes', 'Reanimated', 'FlashList'],
    featured: false,
  },
];
