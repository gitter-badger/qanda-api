const lib = require('lib');
const _ = require('underscore');
const countWord = require('../statistics/count-word.js');

/**
* Qanda question endpoint.
* @returns {object}
*/
module.exports = async (language = "en", context) => {
  console.log('test');
  let response = await randomSentenceErrorProne(language, context);

  let blackedOutDict = await lib[`${context.service.identifier}.black-out-random-word`]({sentence: response.rs.result});
  let randomWordsFromArticle = await lib[`${context.service.identifier}.random-words`]({
    numberOfWords: 3,
    similarTo: blackedOutDict.termNormal
  });

  let choices = [];

  let statisticsPromises = [];
  _.each(randomWordsFromArticle, (randomWord) => {
    choices.push({correctAnswer: false, word: randomWord.word});
    statisticsPromises.push(countWord(randomWord.termNormal));
  });

  choices.push({correctAnswer: true, word: blackedOutDict.blackedOutWord});
  statisticsPromises.push(countWord(blackedOutDict.termNormal));

  await Promise.all(statisticsPromises);

  choices = _.shuffle(choices);

  return {articleTitle: response.p.title, wikipediaId: response.p.wikipediaId, sentence: blackedOutDict, choices: choices};
}

async function randomSentenceErrorProne(language, context) {
  let page = await lib[`${context.service.identifier}.random-wikipedia-page`]({language: language});
  let randomSentence = await lib[`${context.service.identifier}.random-sentence`]({text: page.text});

  if(randomSentence.error === true) {
    return randomSentenceErrorProne(language, context);
  } else {
    return {p: page, rs: randomSentence};
  }
}
