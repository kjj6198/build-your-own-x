import readme from '../../README.md?raw';
import { parseReadme } from '#lib/server/parse-readme.ts';

export const prerender = true;

export function load() {
  return { catalog: parseReadme(readme) };
}
