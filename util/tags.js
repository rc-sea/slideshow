export const popularTags = Object.freeze({
  Favorites: ['louise', 'bob', 'best'],
  Couples: ['frank_mary', 'eleanor_bill', 'bob_louise'],
  'Other Folk': ['robert_c', 'john', 'brian', 'ellen', 'paul', 'Jane', 'Susan', 'janet'],
});

export function capitalizeTag (tag) {
  return tag.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, key => key.toUpperCase()).replace(/ And /g, ' and ');
}

export function filterTags (tags, filter) {
  const filterLowercased = String(filter || '').trim().toLowerCase();

  if (!filterLowercased) return tags;

  return tags.filter(tag => tag.toLowerCase().includes(filterLowercased));
}
