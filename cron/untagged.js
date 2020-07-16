const fs = require('fs');
const cloudinary = require('../server/cloudinary').cloudinary;

const BATCH_SIZE = 500;

async function fetch (nextCursor = '') {
  const result = await cloudinary.search
    .expression('')
    .next_cursor(nextCursor)
    .with_field('tags')
    .max_results(BATCH_SIZE)
    .execute();

  let resources = result.resources.filter(image => !image.tags.length).map(image => image.public_id).length;

  if (result.next_cursor) {
    resources += (await fetch(result.next_cursor));
  }

  return resources;
}

fetch().then(count => fs.writeFileSync('./static/untagged.json', JSON.stringify({ count })));
