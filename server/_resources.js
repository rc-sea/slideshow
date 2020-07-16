const fs = require('fs');
const cloudinary = require('../server/cloudinary').cloudinary;

const BATCH_SIZE = 500;

export async function fetchUntaggedCount (nextCursor = '') {
  const result = await cloudinary.search
    .expression('')
    .next_cursor(nextCursor)
    .with_field('tags')
    .max_results(BATCH_SIZE)
    .execute();

  let count = result.resources.filter(image => !image.tags.length).map(image => image.public_id).length;

  if (result.next_cursor) {
    count += (await fetchUntaggedCount(result.next_cursor));
  }

  return count;
}

export async function storeUntaggedCount () {
  return fetchUntaggedCount().then(count => fs.writeFileSync('./static/untagged.json', JSON.stringify({ count })));
}
