import GithubSlugger from 'github-slugger';
import { lexer, type Token, type Tokens } from 'marked';
import type {
  Catalog,
  Format,
  LanguageCount,
  Topic,
  Tutorial,
} from '#lib/catalog.ts';

const ANY_LANGUAGE = 'Any language';
const README_URL = 'https://github.com/kjj6198/build-your-own-x/blob/master/';

export function parseReadme(markdown: string): Catalog {
  // Same slugs GitHub generates, so links to README anchors keep working here.
  const slugger = new GithubSlugger();
  const topics: Topic[] = [];

  for (const token of lexer(markdown)) {
    if (token.type === 'heading') {
      if (token.depth === 4) {
        const heading = plainText([token]);
        topics.push({
          id: slugger.slug(heading),
          name: heading.replace(/^build your own\s+/i, ''),
          tutorials: [],
        });
      } else if (token.depth < 4 && topics.length > 0) {
        break;
      }
    } else if (token.type === 'list' && topics.length > 0) {
      const tutorials = token.items.flatMap(parseTutorial);
      topics[topics.length - 1].tutorials.push(...tutorials);
    }
  }

  const tutorials = topics.flatMap((topic) => topic.tutorials);
  return {
    topics,
    languages: countLanguages(tutorials),
    tutorialCount: tutorials.length,
  };
}

function parseTutorial(item: Tokens.ListItem): Tutorial[] {
  const inline = item.tokens.flatMap((token) =>
    'tokens' in token && token.tokens ? token.tokens : [],
  );
  const linkIndex = inline.findIndex((token) => token.type === 'link');
  if (linkIndex === -1) return [];

  const link = inline[linkIndex] as Tokens.Link;
  const url = new URL(link.href, README_URL);
  const strong = link.tokens.find((token) => token.type === 'strong');
  const languages = strong
    ? plainText([strong])
        .split('/')
        .map((language) => normalizeLanguage(language.trim()))
    : [];
  const title = plainText(link.tokens.filter((token) => token !== strong))
    .replace(/^\s*:/, '')
    .trim();
  const suffix = plainText(inline.slice(linkIndex + 1));
  const format = suffix.match(/\[(video|pdf)\]/)?.[1] as Format | undefined;

  return [
    {
      title,
      url: url.href,
      host: url.hostname.replace(/^www\./, ''),
      languages,
      ...(format && { format }),
    },
  ];
}

function normalizeLanguage(language: string) {
  return /^\(?any\)?$/i.test(language) ? ANY_LANGUAGE : language;
}

function countLanguages(tutorials: Tutorial[]): LanguageCount[] {
  const counts = new Map<string, number>();
  for (const language of tutorials.flatMap((tutorial) => tutorial.languages)) {
    counts.set(language, (counts.get(language) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function plainText(tokens: Token[]): string {
  return tokens
    .map((token) => {
      if ('tokens' in token && token.tokens) return plainText(token.tokens);
      if ('text' in token) return token.text;
      return '';
    })
    .join('');
}
