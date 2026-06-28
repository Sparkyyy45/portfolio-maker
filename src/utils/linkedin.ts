import JSZip from 'jszip';
import { PortfolioContent, ExperienceData, EducationData, CertificationData, SkillCategory } from '@/types/portfolio';

/**
 * Parse a LinkedIn data export ZIP file (downloaded from LinkedIn Settings → Get a copy of your data).
 * Extracts: Profile, Positions, Education, Skills, Certifications CSVs.
 */
export async function parseLinkedInExport(zipFile: File): Promise<Partial<PortfolioContent>> {
  const zip = await JSZip.loadAsync(zipFile);

  const readCSV = async (filename: string): Promise<Record<string, string>[]> => {
    // LinkedIn export may nest files in subdirectories, search for the filename
    let file: JSZip.JSZipObject | null = null;
    zip.forEach((relativePath, entry) => {
      if (relativePath.toLowerCase().endsWith(filename.toLowerCase()) && !entry.dir) {
        file = entry;
      }
    });
    if (!file) return [];

    const text = await (file as JSZip.JSZipObject).async('text');
    return parseCSVText(text);
  };

  // Parse Profile.csv
  const profiles = await readCSV('Profile.csv');
  const profileRow = profiles[0] || {};

  // Parse Positions.csv
  const positions = await readCSV('Positions.csv');

  // Parse Education.csv
  const educations = await readCSV('Education.csv');

  // Parse Skills.csv
  const skills = await readCSV('Skills.csv');

  // Parse Certifications.csv
  const certifications = await readCSV('Certifications.csv');

  // Map positions to ExperienceData
  const experience: ExperienceData[] = positions.map((pos) => {
    const startDate = [pos['Started On'] || pos['Start Date'] || ''].filter(Boolean).join('');
    const endDate = pos['Finished On'] || pos['End Date'] || 'Present';
    return {
      role: pos['Title'] || pos['Role'] || 'Role',
      company: pos['Company Name'] || pos['Organization Name'] || 'Company',
      period: startDate ? `${startDate} – ${endDate}` : endDate,
      bullets: (pos['Description'] || '').split('\n').map(s => s.trim()).filter(Boolean),
    };
  });

  // Map educations to EducationData
  const education: EducationData[] = educations.map((edu) => {
    const startDate = edu['Start Date'] || '';
    const endDate = edu['End Date'] || '';
    return {
      institution: edu['School Name'] || edu['Institution Name'] || '',
      degree: edu['Degree Name'] || edu['Degree'] || '',
      field: edu['Notes'] || edu['Field of Study'] || '',
      period: startDate && endDate ? `${startDate} – ${endDate}` : startDate || endDate || '',
    };
  }).filter(e => e.institution);

  // Map skills to SkillCategory
  const skillItems = skills.map(s => s['Name'] || s['Skill'] || '').filter(Boolean);
  const mappedSkills: SkillCategory[] = skillItems.length > 0
    ? [{ category: 'Skills', items: skillItems }]
    : [];

  // Map certifications to CertificationData
  const mappedCerts: CertificationData[] = certifications.map((cert) => ({
    name: cert['Name'] || cert['Certification Name'] || '',
    issuer: cert['Authority'] || cert['Issuing Organization'] || '',
    date: cert['Started On'] || cert['License Start Date'] || '',
    url: cert['Url'] || cert['Certification Url'] || undefined,
  })).filter(c => c.name);

  return {
    hero: {
      name: `${profileRow['First Name'] || ''} ${profileRow['Last Name'] || ''}`.trim() || 'Your Name',
      tagline: profileRow['Headline'] || 'Software Engineer',
      bio: profileRow['Summary'] || '',
      socials: {
        github: '',
        linkedin: '',
        twitter: '',
        website: '',
        email: profileRow['Email Address'] || '',
      },
    },
    experience,
    education,
    skills: mappedSkills,
    certifications: mappedCerts,
    projects: [],
  };
}

/**
 * Simple CSV parser that handles quoted fields with commas and newlines.
 */
function parseCSVText(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < lines.length; i++) {
    const char = lines[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < lines.length && lines[i + 1] === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || '';
    });
    return obj;
  });
}
