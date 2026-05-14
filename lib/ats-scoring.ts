// lib/ats-scoring.ts
// ATS scoring engine using string-similarity, NLP heuristics and keyword matching

import stringSimilarity from 'string-similarity';

export interface SectionResult {
  name: string;
  score: number;       // 0–100
  maxScore: number;
  status: 'good' | 'warning' | 'bad';
  feedback: string[];
  tips: string[];
}

export interface ATSResult {
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  matchedSkills: string[];
  missingSkills: string[];
  weakAreas: string[];
  suggestions: string[];
  sections: SectionResult[];
  keywordDensity: number;
  jdSimilarity: number;
}

// ─── Keyword Banks ───────────────────────────────────────────────────────────

const HIGH_VALUE_TECH_KEYWORDS = [
  // Frontend
  'react','next.js','vue','angular','typescript','javascript','html','css','tailwind',
  // Backend
  'node.js','express','asp.net','c#','python','java','go','rust','php','laravel',
  // Databases
  'sql server','postgresql','mysql','mongodb','redis','firebase','supabase',
  // Cloud/DevOps
  'aws','azure','gcp','docker','kubernetes','ci/cd','github actions','terraform',
  // AI/ML
  'machine learning','deep learning','tensorflow','pytorch','openai','langchain',
  // Soft
  'agile','scrum','rest api','graphql','microservices','unit testing','git',
];

const ACTION_VERBS = [
  'developed','built','designed','implemented','led','managed','optimized',
  'reduced','increased','improved','delivered','architected','created',
  'launched','scaled','automated','integrated','deployed','collaborated',
];

const REQUIRED_SECTIONS = ['summary','experience','education','skills','contact'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalise(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s.#]/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsAny(text: string, words: string[]): string[] {
  const n = normalise(text);
  return words.filter((w) => n.includes(normalise(w)));
}

function tokenise(text: string): string[] {
  return normalise(text).split(' ').filter((t) => t.length > 2);
}

function cosineSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((t) => setB.has(t));
  if (setA.size === 0 || setB.size === 0) return 0;
  return intersection.length / Math.sqrt(setA.size * setB.size);
}

function hasQuantifiableMetrics(text: string): boolean {
  return /\d+[\s]*(%|percent|x|times|million|k\b|users|clients|hours|days|weeks)/.test(
    text.toLowerCase()
  );
}

// ─── Section Detectors ───────────────────────────────────────────────────────

function detectSections(cv: string): Record<string, boolean> {
  const n = normalise(cv);
  return {
    summary: /\b(summary|objective|profile|about me|overview)\b/.test(n),
    experience: /\b(experience|work history|employment|career)\b/.test(n),
    education: /\b(education|degree|university|college|bachelor|master|phd)\b/.test(n),
    skills: /\b(skills|technologies|tech stack|competencies|expertise)\b/.test(n),
    contact: /\b(email|phone|linkedin|github|@)\b/.test(n),
    projects: /\b(projects|portfolio|side project|open source)\b/.test(n),
    certifications: /\b(certification|certified|certificate|aws|pmp|scrum)\b/.test(n),
  };
}

// ─── Section Scorers ─────────────────────────────────────────────────────────

function scoreContactSection(cv: string): SectionResult {
  // NOTE: Run URL/email regexes against the RAW cv string, NOT normalised.
  // normalise() replaces '/' with spaces, breaking linkedin.com/in/ patterns.
  const n = normalise(cv); // only used for location (word-boundary matching)
  const feedback: string[] = [];
  const tips: string[] = [];
  let score = 0;

  // Email — safe on raw text; @ and . are present in both
  const hasEmail = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(cv);

  // Phone — already tested on raw cv (needs +, digits, spaces)
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(cv);

  // LinkedIn — must test raw cv; normalise() turns '/' into spaces
  const hasLinkedIn = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i.test(cv);

  // GitHub — same reason
  const hasGitHub = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-]+/i.test(cv);

  // Location — word-boundary match is fine on normalised
  const hasLocation = /\b(city|country|remote|karachi|lahore|islamabad|rawalpindi|usa|uk|canada|dubai|pakistan|india|australia)\b/.test(n);

  if (hasEmail) { score += 30; feedback.push('✅ Email address found'); }
  else { tips.push('Add a professional email address (avoid nicknames like "coolguy@")'); }

  if (hasPhone) { score += 25; feedback.push('✅ Phone number present'); }
  else { tips.push('Include your phone number with country code (e.g. +92 300 1234567)'); }

  if (hasLinkedIn) { score += 25; feedback.push('✅ LinkedIn profile linked'); }
  else { tips.push('Add your LinkedIn URL — 87% of recruiters use LinkedIn for screening'); }

  if (hasGitHub) { score += 10; feedback.push('✅ GitHub profile linked'); }
  else { tips.push('Add GitHub link to showcase your code (critical for tech roles)'); }

  if (hasLocation) { score += 10; feedback.push('✅ Location mentioned'); }
  else { tips.push('Mention city/country or state "Remote OK" to pass location filters'); }

  return {
    name: 'Contact Information',
    score,
    maxScore: 100,
    status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'bad',
    feedback,
    tips,
  };
}

function scoreSummarySection(cv: string): SectionResult {
  const n = normalise(cv);
  const feedback: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const hasSummary = /\b(summary|objective|profile|about me)\b/.test(n);
  if (!hasSummary) {
    tips.push('Add a Professional Summary (3–5 lines) — ATS and hiring managers look here first');
    tips.push('Start with: "X+ years of experience in [field] specializing in [skills]..."');
    return { name: 'Professional Summary', score: 0, maxScore: 100, status: 'bad', feedback: ['❌ No summary section detected'], tips };
  }

  score += 40;
  feedback.push('✅ Summary section found');

  const wordCount = n.split(' ').length;
  if (wordCount > 50) { score += 20; feedback.push('✅ Summary has sufficient detail'); }
  else { tips.push('Expand your summary — aim for 80–120 words covering role, years of experience, key skills'); }

  const techKeywordsInSummary = containsAny(cv.substring(0, 600), HIGH_VALUE_TECH_KEYWORDS);
  if (techKeywordsInSummary.length >= 3) { score += 25; feedback.push(`✅ Contains ${techKeywordsInSummary.length} tech keywords`); }
  else { tips.push('Add 3–5 specific technical skills in your summary (e.g. "React, Node.js, PostgreSQL")'); }

  if (hasQuantifiableMetrics(cv.substring(0, 600))) { score += 15; feedback.push('✅ Quantified achievements in summary'); }
  else { tips.push('Add a metric in summary: "delivered 15+ production apps" or "led team of 5 engineers"'); }

  return {
    name: 'Professional Summary',
    score: Math.min(score, 100),
    maxScore: 100,
    status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'bad',
    feedback,
    tips,
  };
}

function scoreExperienceSection(cv: string): SectionResult {
  const feedback: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const hasExp = /\b(experience|work history|employment)\b/i.test(cv);
  if (!hasExp) {
    return { name: 'Work Experience', score: 0, maxScore: 100, status: 'bad', feedback: ['❌ No experience section detected'], tips: ['Add a Work Experience section with company, title, dates, and bullet-point achievements'] };
  }

  score += 25;
  feedback.push('✅ Work experience section present');

  const verbsFound = containsAny(cv, ACTION_VERBS);
  if (verbsFound.length >= 5) { score += 25; feedback.push(`✅ Strong action verbs: ${verbsFound.slice(0, 5).join(', ')}`); }
  else { tips.push(`Use strong action verbs. Found only ${verbsFound.length}. Add: developed, optimized, led, delivered, automated`); }

  if (hasQuantifiableMetrics(cv)) { score += 25; feedback.push('✅ Quantifiable achievements detected'); }
  else { tips.push('Add numbers: "Reduced API response time by 40%" or "Built system serving 10K users"'); }

  const hasDateRange = /\b(20\d{2}|present|current)\b/i.test(cv);
  if (hasDateRange) { score += 15; feedback.push('✅ Date ranges present'); }
  else { tips.push('Add employment dates: "Jan 2022 – Present" for every position'); }

  const roleCount = (cv.match(/\b(developer|engineer|manager|analyst|designer|lead|architect)\b/gi) || []).length;
  if (roleCount >= 2) { score += 10; feedback.push('✅ Multiple roles detected'); }

  return {
    name: 'Work Experience',
    score: Math.min(score, 100),
    maxScore: 100,
    status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'bad',
    feedback,
    tips,
  };
}

function scoreEducationSection(cv: string): SectionResult {
  const feedback: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const hasEdu = /\b(education|degree|university|college|bachelor|master|phd|bs|ms|b\.s|m\.s)\b/i.test(cv);
  if (!hasEdu) {
    return { name: 'Education', score: 0, maxScore: 100, status: 'bad', feedback: ['❌ No education section found'], tips: ['Add Education section with: Degree, Institution, Year graduated'] };
  }

  score += 50;
  feedback.push('✅ Education section present');

  const hasDegree = /\b(bachelor|master|phd|b\.sc|m\.sc|bscs|mscs|b\.e|m\.e)\b/i.test(cv);
  if (hasDegree) { score += 25; feedback.push('✅ Degree level specified'); }
  else { tips.push('Spell out your degree clearly: "Bachelor of Science in Computer Science"'); }

  const hasYear = /\b(19|20)\d{2}\b/.test(cv);
  if (hasYear) { score += 25; feedback.push('✅ Graduation year present'); }
  else { tips.push('Add your graduation year (or expected graduation year)'); }

  return {
    name: 'Education',
    score: Math.min(score, 100),
    maxScore: 100,
    status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'bad',
    feedback,
    tips,
  };
}

function scoreSkillsSection(cv: string, jd: string): SectionResult {
  const feedback: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const hasSkills = /\b(skills|technologies|tech stack|competencies)\b/i.test(cv);
  if (!hasSkills) {
    return { name: 'Skills', score: 0, maxScore: 100, status: 'bad', feedback: ['❌ No dedicated skills section'], tips: ['Add a Skills section listing technical tools, languages, frameworks'] };
  }

  score += 20;
  feedback.push('✅ Skills section present');

  const cvSkills = containsAny(cv, HIGH_VALUE_TECH_KEYWORDS);
  if (cvSkills.length >= 8) { score += 30; feedback.push(`✅ ${cvSkills.length} tech skills listed`); }
  else if (cvSkills.length >= 4) { score += 15; tips.push(`Only ${cvSkills.length} recognized skills found — aim for 10+ relevant skills`); }
  else { tips.push('Add more technical skills. Recruiters filter by keywords like React, SQL, Docker, etc.'); }

  if (jd) {
    const jdSkills = containsAny(jd, HIGH_VALUE_TECH_KEYWORDS);
    const matchedJdSkills = cvSkills.filter((s) => jdSkills.includes(s));
    const matchPct = jdSkills.length > 0 ? (matchedJdSkills.length / jdSkills.length) * 100 : 50;
    score += Math.round(matchPct * 0.5);
    if (matchPct >= 60) { feedback.push(`✅ ${Math.round(matchPct)}% skills match with job description`); }
    else { tips.push(`Only ${Math.round(matchPct)}% skills overlap with JD — add: ${jdSkills.filter(s => !cvSkills.includes(s)).slice(0, 5).join(', ')}`); }
  } else {
    score += 25;
  }

  return {
    name: 'Skills',
    score: Math.min(score, 100),
    maxScore: 100,
    status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'bad',
    feedback,
    tips,
  };
}

function scoreFormattingSection(cv: string, fileType: string): SectionResult {
  const feedback: string[] = [];
  const tips: string[] = [];
  let score = 70; // start high, deduct for issues

  if (fileType === 'docx') { score += 10; feedback.push('✅ .docx format — preferred by most ATS systems'); }
  else if (fileType === 'pdf') { feedback.push('⚠️ PDF format — some ATS struggle with complex PDFs'); tips.push('Consider also saving as .docx — 40% of ATS parse PDFs poorly'); }

  const lines = cv.split('\n').filter((l) => l.trim());
  const avgLineLength = lines.reduce((s, l) => s + l.length, 0) / (lines.length || 1);

  if (avgLineLength < 200) { feedback.push('✅ Good line length — no wall-of-text detected'); }
  else { score -= 15; tips.push('Break long paragraphs into bullet points — ATS prefer scannable bullet lists'); }

  const hasBullets = /[•\-*]\s+\w/.test(cv);
  if (hasBullets) { score += 10; feedback.push('✅ Bullet points used'); }
  else { score -= 10; tips.push('Add bullet points for experience entries — much easier for ATS to parse'); }

  const cvLength = cv.replace(/\s+/g, ' ').length;
  if (cvLength > 2000) { feedback.push('✅ CV has sufficient content length'); }
  else { score -= 10; tips.push('CV seems short. Aim for 500–800 words for 1-page or 800–1200 for 2-page resume'); }

  return {
    name: 'Formatting & Structure',
    score: Math.max(0, Math.min(score, 100)),
    maxScore: 100,
    status: score >= 70 ? 'good' : score >= 50 ? 'warning' : 'bad',
    feedback,
    tips,
  };
}

// ─── Main Scoring Function ────────────────────────────────────────────────────

export function analyseCV(cvText: string, jdText: string = '', fileType: string = 'pdf'): ATSResult {
  const cvTokens = tokenise(cvText);
  const jdTokens = jdText ? tokenise(jdText) : [];

  // Section scores
  const contactResult    = scoreContactSection(cvText);
  const summaryResult    = scoreSummarySection(cvText);
  const experienceResult = scoreExperienceSection(cvText);
  const educationResult  = scoreEducationSection(cvText);
  const skillsResult     = scoreSkillsSection(cvText, jdText);
  const formattingResult = scoreFormattingSection(cvText, fileType);

  const sections = [contactResult, summaryResult, experienceResult, educationResult, skillsResult, formattingResult];

  // Skills matching
  const cvSkills = containsAny(cvText, HIGH_VALUE_TECH_KEYWORDS);
  const jdSkills = jdText ? containsAny(jdText, HIGH_VALUE_TECH_KEYWORDS) : [];
  const matchedSkills = jdSkills.length > 0 ? cvSkills.filter((s) => jdSkills.includes(s)) : cvSkills.slice(0, 10);
  const missingSkills  = jdSkills.filter((s) => !cvSkills.includes(s));

  // JD similarity via cosine
  const jdSimilarity = jdTokens.length > 0
    ? Math.round(cosineSimilarity(cvTokens, jdTokens) * 100)
    : 0;

  // String-similarity for overall text match
  const textSimilarity = jdText
    ? Math.round(stringSimilarity.compareTwoStrings(normalise(cvText.slice(0, 2000)), normalise(jdText.slice(0, 2000))) * 100)
    : 0;

  // Keyword density
  const keywordDensity = Math.round((cvSkills.length / Math.max(cvTokens.length, 1)) * 1000) / 10;

  // ── Weighted score (per spec) ──────────────────────────────────────
  // 40% skills match | 25% experience | 15% keywords | 10% structure | 10% formatting
  const skillsWeight   = jdSkills.length > 0
    ? (matchedSkills.length / jdSkills.length) * 100
    : skillsResult.score;

  const weightedScore = Math.round(
    (skillsWeight            * 0.40) +
    (experienceResult.score  * 0.25) +
    (Math.min(jdSimilarity + textSimilarity, 100) * 0.15 || skillsResult.score * 0.15) +
    (((contactResult.score + summaryResult.score + educationResult.score) / 3) * 0.10) +
    (formattingResult.score  * 0.10)
  );

  const totalScore = Math.max(0, Math.min(weightedScore, 100));

  const grade: ATSResult['grade'] =
    totalScore >= 85 ? 'A' :
    totalScore >= 70 ? 'B' :
    totalScore >= 55 ? 'C' :
    totalScore >= 40 ? 'D' : 'F';

  // Aggregated weak areas
  const weakAreas = sections
    .filter((s) => s.status !== 'good')
    .map((s) => `${s.name} (${s.score}/100)`);

  // Top suggestions from all sections
  const suggestions = sections
    .flatMap((s) => s.tips)
    .filter(Boolean)
    .slice(0, 8);

  return {
    totalScore,
    grade,
    matchedSkills,
    missingSkills: missingSkills.slice(0, 12),
    weakAreas,
    suggestions,
    sections,
    keywordDensity,
    jdSimilarity,
  };
}
