import { load } from 'js-yaml';

export interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * Parses frontmatter (YAML block delimited by ---) and body content from a raw Markdown string.
 * Uses js-yaml to robustly support nested lists, objects, and types.
 */
export function parseMarkdown(raw: string): ParsedMarkdown {
  const normalized = raw.replace(/\r\n/g, "\n");
  
  // Match frontmatter block
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: normalized };
  }
  
  const yamlBlock = match[1];
  const content = match[2];
  
  try {
    const frontmatter = load(yamlBlock) as Record<string, any>;
    return { frontmatter: frontmatter || {}, content };
  } catch (error) {
    console.error("Failed to parse YAML frontmatter:", error);
    return { frontmatter: {}, content };
  }
}
