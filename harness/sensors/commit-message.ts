import { readFileSync } from 'node:fs';

const TYPES = ['feat', 'fix', 'docs', 'test', 'build', 'perf', 'style', 'refactor', 'chore', 'ci', 'raw', 'cleanup', 'remove'];
const EMOJI = /\p{Extended_Pictographic}|:[a-z0-9_+-]+:/u;

export function validate(firstLine: string): string | undefined {
  if (/^(Merge|Revert|fixup!|squash!)/.test(firstLine)) return undefined;
  const template = `Format: <type>: <description, up to 4 words>, no emoji. E.g.: "test: Login scenarios". Types: ${TYPES.join(', ')}`;
  if (EMOJI.test(firstLine)) return `Commits must not have emoji or :code:. ${template}`;
  const m = /^([a-z]+): (.+)$/.exec(firstLine);
  if (!m) return `Message does not match the required format. ${template}`;
  const [, type = '', description = ''] = m;
  if (!TYPES.includes(type)) return `Type "${type}" is invalid. ${template}`;
  const words = description.trim().split(/\s+/).length;
  if (words > 4) return `Description has ${words} words (max 4). Summarize and add detail in the commit body.`;
  return undefined;
}

if (process.argv[1]?.endsWith('commit-message.ts')) {
  const file = process.argv[2];
  if (!file) { console.error('usage: commit-message.ts <file>'); process.exit(2); }
  const line = readFileSync(file, 'utf8').split('\n')[0] ?? '';
  const error = validate(line);
  if (error) { console.error(`[commit-msg] ${error}\n  Received: "${line}"`); process.exit(1); }
}
