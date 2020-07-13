const cloudinary = require('./cloudinary').cloudinary;

export default async function (req, res, next) {
  const searchtag = req.query.searchtag;
  const type = req.query.type | 0;
  const next_cursor = req.query.next_cursor;

  let query;

  console.log('SearchTag: ', searchtag);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (searchtag === '-') {
    query = cloudinary.search.expression('').with_field('tags');
  } else if (searchtag) {
    const expression = searchtag.split('-').map(tag => `tags=${tag}`).join(type === 0 ? ' || ' : ' && ');

    query = cloudinary.search
      .expression(expression)
      .next_cursor(next_cursor)
      .max_results(48);
  } else {
    query = cloudinary.search.next_cursor(next_cursor).max_results(48);
  }

  const result = await query.execute();

  if (searchtag === '-') {
    result.resources = result.resources.filter(image => !image.tags.length);
  }

  res.json(result);
}
