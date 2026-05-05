export interface Service {
  id: string;
  icon: string; // MUI icon name
  title: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  gradient: string;
}

export const services: Service[] = [
  {
    id: 'web-development',
    icon: 'WebAsset',
    title: 'Web Application Development',
    shortDesc: 'Scalable, high-performance web applications built with cutting-edge technologies.',
    longDesc:
      'We craft powerful, full-stack web applications tailored to your business needs. From SPAs to complex enterprise platforms, we deliver solutions that are fast, secure, and scalable.',
    features: [
      'React / Next.js front-end development',
      'Node.js / Django / Laravel back-end',
      'RESTful & GraphQL API design',
      'Database architecture & optimization',
      'CI/CD pipeline integration',
      'Performance & security audits',
    ],
    gradient: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
  },
  {
    id: 'mobile-development',
    icon: 'PhoneIphone',
    title: 'Mobile App Development',
    shortDesc: 'Native and cross-platform mobile apps for iOS and Android.',
    longDesc:
      'We build stunning, intuitive mobile applications that engage users and drive business growth. Whether native or cross-platform, our apps deliver exceptional experiences.',
    features: [
      'React Native & Flutter development',
      'iOS & Android native apps',
      'App Store & Play Store deployment',
      'Offline-first architecture',
      'Push notifications & deep linking',
      'App performance optimization',
    ],
    gradient: 'linear-gradient(135deg, #7209b7, #3a0ca3)',
  },
  {
    id: 'ai-ml',
    icon: 'Psychology',
    title: 'AI / Machine Learning Solutions',
    shortDesc: 'Intelligent AI solutions that automate and transform your business processes.',
    longDesc:
      'Harness the power of artificial intelligence and machine learning to gain competitive advantage. We develop custom AI models, NLP systems, computer vision, and predictive analytics platforms.',
    features: [
      'Custom ML model development',
      'Natural Language Processing (NLP)',
      'Computer Vision & image recognition',
      'Predictive analytics & forecasting',
      'LLM integration & fine-tuning',
      'AI-powered automation workflows',
    ],
    gradient: 'linear-gradient(135deg, #f72585, #7209b7)',
  },
  {
    id: 'cloud-solutions',
    icon: 'Cloud',
    title: 'Cloud Solutions',
    shortDesc: 'Robust, secure, and scalable cloud infrastructure for modern businesses.',
    longDesc:
      'We help businesses migrate, build, and optimize cloud infrastructure on AWS, Azure, and GCP. From architecture design to managed services, we ensure reliability at scale.',
    features: [
      'Cloud migration & strategy',
      'AWS / Azure / GCP architecture',
      'Kubernetes & Docker orchestration',
      'Serverless & microservices design',
      'Cost optimization & monitoring',
      'Disaster recovery & backup',
    ],
    gradient: 'linear-gradient(135deg, #4cc9f0, #4361ee)',
  },
  {
    id: 'ui-ux-design',
    icon: 'DesignServices',
    title: 'UI/UX Design',
    shortDesc: 'User-centred designs that delight users and drive conversion.',
    longDesc:
      'Great products start with great design. Our UI/UX team creates beautiful, intuitive interfaces backed by deep user research and industry-leading design principles.',
    features: [
      'User research & persona mapping',
      'Wireframing & prototyping',
      'High-fidelity UI design (Figma)',
      'Design system creation',
      'Usability testing & iteration',
      'Motion design & micro-animations',
    ],
    gradient: 'linear-gradient(135deg, #f72585, #4361ee)',
  },
  {
    id: 'custom-software',
    icon: 'Code',
    title: 'Custom Software Development',
    shortDesc: 'Bespoke software engineered precisely to your unique business requirements.',
    longDesc:
      'Off-the-shelf software rarely fits perfectly. We build custom solutions from the ground up — designed, developed, and tested specifically for your business processes and goals.',
    features: [
      'Requirement analysis & discovery',
      'Agile development methodology',
      'ERP & CRM development',
      'Legacy system modernization',
      'Third-party API integrations',
      'Post-launch support & maintenance',
    ],
    gradient: 'linear-gradient(135deg, #4361ee, #4cc9f0)',
  },
];
