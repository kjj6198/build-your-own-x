export type Format = 'video' | 'pdf';

export type Tutorial = {
  title: string;
  url: string;
  host: string;
  languages: string[];
  format?: Format;
};

export type Topic = {
  id: string;
  name: string;
  tutorials: Tutorial[];
};

export type LanguageCount = {
  name: string;
  count: number;
};

export type Catalog = {
  topics: Topic[];
  languages: LanguageCount[];
  tutorialCount: number;
};

export type Filter = {
  query: string;
  languages: ReadonlySet<string>;
};

/** A topic as currently shown, with only the tutorials that pass the filter. */
export type Section = {
  topic: Topic;
  number: string;
  tutorials: Tutorial[];
};

export function countGuides(count: number) {
  return `${count} ${count === 1 ? 'guide' : 'guides'}`;
}

export function filterCatalog(catalog: Catalog, filter: Filter): Section[] {
  const words = filter.query.toLowerCase().split(/\s+/).filter(Boolean);
  return catalog.topics.map((topic, index) => ({
    topic,
    number: String(index + 1).padStart(2, '0'),
    tutorials: topic.tutorials.filter((tutorial) =>
      matches(tutorial, topic, words, filter.languages),
    ),
  }));
}

function matches(
  tutorial: Tutorial,
  topic: Topic,
  words: string[],
  languages: ReadonlySet<string>,
) {
  if (
    languages.size > 0 &&
    !tutorial.languages.some((language) => languages.has(language))
  ) {
    return false;
  }

  const haystack = [
    tutorial.title,
    tutorial.host,
    topic.name,
    ...tutorial.languages,
  ]
    .join(' ')
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
}
