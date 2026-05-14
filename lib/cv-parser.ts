// lib/cv-parser.ts
// Extracts structured data from raw CV text using regex heuristics

export interface ParsedCVData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  rawText: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function extractEmail(text: string): string {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : '';
}

function extractPhone(text: string): string {
  const m = text.match(/(\+?\d[\d\s\-().]{7,15}\d)/);
  return m ? m[0].trim() : '';
}

function extractLinkedIn(text: string): string {
  // Match optional protocol + www, capture linkedin.com/in/username (with optional trailing slash/path)
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/((?:[\w\-]+\/?))/i);
  if (!m) return '';
  const username = m[1].replace(/\/$/, ''); // strip trailing slash
  return `https://www.linkedin.com/in/${username}`;
}

function extractGitHub(text: string): string {
  // Match optional protocol + www, capture github.com/username (ignore /repo paths)
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/((?:[\w\-]+\/?))/i);
  if (!m) return '';
  const username = m[1].replace(/\/$/, ''); // strip trailing slash
  return `https://github.com/${username}`;
}

function extractName(text: string): string {
  // Usually first non-empty line is the name
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    // Skip lines that look like emails, phones, or URLs
    if (/[@\d\+\/\\:.]/.test(line) && line.length < 30) continue;
    if (line.split(' ').length <= 5 && line.length < 50 && /^[A-Za-z\s]+$/.test(line)) {
      return line;
    }
  }
  return lines[0]?.slice(0, 50) || '';
}

function extractLocation(text: string): string {
  const m = text.match(/\b(Karachi|Lahore|Islamabad|Rawalpindi|Dubai|London|New York|Remote|[A-Z][a-z]+ ?[A-Z][a-z]*,? ?(Pakistan|USA|UK|Canada|UAE|India|Australia))\b/);
  return m ? m[0] : '';
}

function extractSection(text: string, startPattern: RegExp, endPattern: RegExp): string {
  const lower = text;
  const startMatch = lower.search(startPattern);
  if (startMatch === -1) return '';
  const afterStart = lower.slice(startMatch);
  const endMatch = afterStart.slice(30).search(endPattern);
  if (endMatch === -1) return afterStart.slice(0, 2000).trim();
  return afterStart.slice(0, endMatch + 30).trim();
}

function extractSummary(text: string): string {
  const section = extractSection(
    text,
    /\b(summary|objective|profile|about me|professional summary)\b/i,
    /\b(experience|education|skills|work history|employment)\b/i
  );
  if (!section) return '';
  const lines = section.split('\n').slice(1).map((l) => l.trim()).filter((l) => l.length > 20);
  return lines.slice(0, 5).join(' ').slice(0, 600);
}

function extractSkills(text: string): string[] {
  const section = extractSection(
    text,
    /\b(skills|technologies|tech stack|competencies|technical skills)\b/i,
    /\b(experience|education|projects|certifications|work)\b/i
  );
  if (!section) return [];
  const raw = section.replace(/\n/g, ',').replace(/[•·\-]/g, ',');
  return raw.split(/[,|\/]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40 && !/^(skills|technologies|tech stack)/i.test(s))
    .slice(0, 40);
}

function extractExperience(text: string): ExperienceEntry[] {
  const section = extractSection(
    text,
    /\b(experience|work history|employment|career history)\b/i,
    /\b(education|skills|certifications|projects)\b/i
  );
  if (!section) return [];

  const entries: ExperienceEntry[] = [];
  // Split by year patterns to detect job breaks
  const blocks = section.split(/\n{2,}/).filter((b) => b.trim().length > 30).slice(1, 6);

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const dateMatch = block.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20\d{2})\b/i);
    const endDateMatch = block.match(/\b(present|current|now|20\d{2})\b/i);

    entries.push({
      id: uid(),
      title: lines[0]?.slice(0, 80) || 'Role',
      company: lines[1]?.slice(0, 80) || 'Company',
      startDate: dateMatch ? dateMatch[0] : '',
      endDate: endDateMatch ? endDateMatch[0] : 'Present',
      bullets: lines.slice(2)
        .filter((l) => l.length > 10)
        .map((l) => l.replace(/^[•\-*]\s*/, ''))
        .slice(0, 6),
    });
  }

  return entries;
}

function extractEducation(text: string): EducationEntry[] {
  const section = extractSection(
    text,
    /\b(education|academic|qualification)\b/i,
    /\b(skills|experience|projects|certifications|work)\b/i
  );
  if (!section) return [];

  const blocks = section.split(/\n{2,}/).filter((b) => b.trim().length > 20).slice(1, 4);
  const entries: EducationEntry[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const yearMatch = block.match(/\b(19|20)\d{2}\b/);
    const degreeMatch = block.match(/\b(bachelor|master|phd|b\.?sc|m\.?sc|bscs|mscs|b\.?e|m\.?e|associate|diploma)\b/i);
    const fieldMatch = block.match(/\b(computer science|software engineering|information technology|cs|se|it|physics|mathematics|business)\b/i);

    entries.push({
      id: uid(),
      institution: lines[0]?.slice(0, 100) || 'Institution',
      degree: degreeMatch ? degreeMatch[0] : '',
      field: fieldMatch ? fieldMatch[0] : '',
      year: yearMatch ? yearMatch[0] : '',
    });
  }

  return entries;
}

function extractCertifications(text: string): string[] {
  const section = extractSection(
    text,
    /\b(certifications?|certificates?|credentials?)\b/i,
    /\b(projects|interests|references|hobbies)\b/i
  );
  if (!section) return [];
  return section.split('\n')
    .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
    .filter((l) => l.length > 5 && l.length < 120)
    .slice(1, 8);
}

export function parseCV(rawText: string): ParsedCVData {
  return {
    name: extractName(rawText),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    linkedin: extractLinkedIn(rawText),
    github: extractGitHub(rawText),
    location: extractLocation(rawText),
    summary: extractSummary(rawText),
    experience: extractExperience(rawText),
    education: extractEducation(rawText),
    skills: extractSkills(rawText),
    certifications: extractCertifications(rawText),
    rawText,
  };
}
