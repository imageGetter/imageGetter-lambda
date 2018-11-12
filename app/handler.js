'use strict';

const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports.imgs = async (event, context, callback) => {
  const format = /^[(http://) (https://)]/;

  let { encodedURI } = event.pathParameters;

  if (!format.test(encodedURI)) encodedURI = 'http://' + encodedURI;

  return axios.get(decodeURIComponent(encodedURI))
    .then(function (response) {
      const $ = cheerio.load(response.data);
      const { responseUrl } = response.request.res;

      return $('img').map(function () {
        return url.resolve(responseUrl, $(this).attr('src'));
      }).toArray();
    })
    .then(function (imgs) {
      callback(
        null,
        {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(imgs)
        }
      )
    })
    .catch(function (error) {
      callback(error);
    });
};