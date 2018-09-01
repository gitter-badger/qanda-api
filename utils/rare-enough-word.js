const lib = require('lib');

module.exports = async function(word) {
  let lessUsedWordCount = await lib[`koma.natural-db[@dev].min`]({
    resource: 'WordFrequency',
    minColumn: 'count',

    token: process.env.NATURAL_DB_TOKEN,
    db: 19
  });

  let wordUsedCount = await lib[`koma.natural-db[@dev].show`]({
    resource: 'WordFrequency',
    filterColumn: 'word_normal',
    filterValue: word
  });

  return (wordUsedCount < lessUsedWordCount + 20);
}