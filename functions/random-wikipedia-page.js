const axios = require('axios');
const _ = require('underscore');
const sanitizeHtml = require('sanitize-html');
const decodeHtml = require('decode-html');

/**
* Random wikipedia article contents
* @returns {object}
*/
module.exports = async (language = 'en') => {  
  var apiResponse = await axios.get(randomWikipediaArticleApiEndpoint(language));
  var page = _.values(apiResponse.data['query']['pages'])[0];
  var response = {};
  
  response['text'] = decodeHtml(sanitizeHtml(page['extract'], {allowedTags: []}));
  response['title'] = page['title'];
  response['wikipediaId'] = page['pageid'];

  return response;
};

function randomWikipediaArticleApiEndpoint(language) {
  return `https://${language}.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&grnlimit=1`;
}