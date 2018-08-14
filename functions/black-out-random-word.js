const _ = require('underscore');
const nlp = require('compromise');

/**
* Black out a random word in a sentence. 
* @returns {object}
*/
module.exports = async (sentence = "") => {
  let sentenceTerms = nlp(sentence).out('terms');

  let sentenceDict = {
    before: "",
    blackedOutWord: undefined,
    after: ""
  };
  
  sentenceTerms = _.filter(sentenceTerms, (term) => {
    return term.normal !== "";
  });
    
  let blackedOutIndex = getRandomInt(0, sentenceTerms.length - 1); 
  _.each(sentenceTerms, (term, index)=> {   
    if(index < blackedOutIndex) {
      sentenceDict.before += term.text;
      
      if(index !== (blackedOutIndex - 1)) {
        sentenceDict.before += " ";
      }
    } else if(index > blackedOutIndex) {
      sentenceDict.after += term.text;
      
      if((sentenceTerms.length - 1) !== index) {
        sentenceDict.after += " ";
      }
    } else if(index === blackedOutIndex) {
      var termText = term.text;
      
      let specialCharsCharacterClass = '[,\\.\\?!()\\-\\–\/"\\s;:*]';
      let nonWordCharsRegex = new RegExp(`^(${specialCharsCharacterClass}*)(.+?)(${specialCharsCharacterClass}*)$`);
      let matchResult = nonWordCharsRegex.exec(termText);
      
      sentenceDict.termNormal = term.normal;
      sentenceDict.tags = term.tags;
      sentenceDict.before += matchResult[1];
      sentenceDict.blackedOutWord = matchResult[2];
      sentenceDict.after += matchResult[3];
    }
  });
  
  return sentenceDict;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}