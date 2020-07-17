import e from 'express';

const cloudinary = require('./cloudinary').cloudinary;

const LIMIT = 48;

async function fetchPhotos (searchtag, type, next_cursor) {
  let query;

  if (searchtag) {
    const expression = searchtag === '-'
      ? ''
      : searchtag.split('-').map(tag => `tags=${tag}`).join(type === 0 ? ' || ' : ' && ');

    query = cloudinary.search
      .expression(expression)
      .next_cursor(next_cursor)
      .max_results(LIMIT);

    if (searchtag === '-') query = query.with_field('tags');
  } else {
    query = cloudinary.search.next_cursor(next_cursor).max_results(48);
  }

  const result = await query.execute();

  if (searchtag === '-') {
    result.resources = result.resources.filter(image => !image.tags.length);
  }

  return result;
}

export default async function (req, res, next) {
  const searchtag = req.query.searchtag;
  const type = req.query.type | 0;

  let next_cursor = req.query.next_cursor;

  let result = null;

  do {
    const localResult = await fetchPhotos(searchtag, type, next_cursor);

    if (result) {
      localResult.resources = result.resources.concat(localResult.resources);
    }
    result = localResult;
    next_cursor = result.next_cursor;
  } while (searchtag === '-' && next_cursor && result.resources.length <= LIMIT); // eslint-disable-line no-unmodified-loop-condition

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.json(result);
}
