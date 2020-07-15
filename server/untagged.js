const fs = require('fs');

export default async function (req, res, next) {
  try {
    const result = JSON.parse(fs.readFileSync('./static/untagged.json'));

    res.json(result);
  } catch (e) {
    res.json({ count: null });
  }
}
