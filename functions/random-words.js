const _ = require('underscore');
const nlp = require('compromise');
const w2v = require("word2vec-pure-js")

w2v.load("./models/test-text8-vector.bin")

/**
* Get random words form the provided text.
* @returns {array}
*/
module.exports = async (text = "", numberOfWords = 1, uniq = true, excludes = [], wordTypes = [], similarTo = "") => {

  let relatedTerms = _.shuffle(w2v.getSimilarWords(similarTo, numberOfWords*8));

  let terms = nlp(relatedTerms.join(" ")).out("terms");

  let randomWordsDirty = terms.slice(0, numberOfWords);

  let randomWords = _.map(randomWordsDirty, (term, index)=> {
    var termText = term.text;

    let specialCharsCharacterClass = '[,\\.\\?!()\\-\\–\/"\\s;:*]';
    let nonWordCharsRegex = new RegExp(`^(${specialCharsCharacterClass}*)(.+?)(${specialCharsCharacterClass}*)$`);
    let matchResult = nonWordCharsRegex.exec(termText);

    return {word: matchResult[2], termNormal: term.normal};
  });

  return randomWords;
};
