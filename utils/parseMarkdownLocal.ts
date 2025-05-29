import { marked } from 'marked'

export async function parseMarkdownLocal(input: string): Promise<string> {
  return await marked.parse(input || '');
}