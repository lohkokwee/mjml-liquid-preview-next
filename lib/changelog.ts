import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const changelogDirectory = path.join(process.cwd(), 'content/changelog');

export type ChangelogEntry = {
  date: string;
  title: string;
  excerpt: string;
  type: string;
  content: string;
};

function checkDirectoryExists() {
  return fs.existsSync(changelogDirectory);
}

function isValidDateFormat(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export function getChangelogDates(): string[] {
  try {
    if (!checkDirectoryExists()) {
      return [];
    }
    
    const fileNames = fs.readdirSync(changelogDirectory);
    
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''))
      .filter(date => isValidDateFormat(date))
      .sort()
      .reverse();
  } catch (error) {
    console.error('Error reading changelog directory:', error);
    return [];
  }
}

export async function getChangelogEntry(date: string): Promise<ChangelogEntry | null> {
  try {
    if (!date || !isValidDateFormat(date)) {
      console.error(`Invalid date format: ${date}`);
      return null;
    }
    
    if (!checkDirectoryExists()) {
      return null;
    }
    
    const fullPath = path.join(changelogDirectory, `${date}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Changelog file not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    const matterResult = matter(fileContents);
    
    return {
      date,
      title: matterResult.data.title || '',
      excerpt: matterResult.data.excerpt || '',
      type: matterResult.data.type || '',
      content: matterResult.content
    };
  } catch (error) {
    console.error(`Error reading changelog entry for ${date}:`, error);
    return null;
  }
}

export async function getAllChangelogEntries(): Promise<ChangelogEntry[]> {
  const dates = getChangelogDates();
  const entries = await Promise.all(
    dates.map(async (date) => {
      const entry = await getChangelogEntry(date);
      return entry;
    })
  );
  
  // Filter out any null entries and sort by date (newest first)
  return entries
    .filter((entry): entry is ChangelogEntry => entry !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getLatestChangelogEntries(count: number = 5): Promise<ChangelogEntry[]> {
  const allEntries = await getAllChangelogEntries();
  return allEntries.slice(0, count);
} 