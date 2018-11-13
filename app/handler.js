'use strict';

const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports.imgs = async (event, context, callback) => {
  const format = /^http:\/\/|https:\/\//;

  const { encodedURI } = event.pathParameters;
  let decodedURI = decodeURIComponent(encodedURI);

  if (!format.test(decodedURI)) decodedURI = 'http://' + decodedURI;

  return axios.get(decodedURI)
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
      const { response } = error;
      const body = 
        response ? {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        } : null;

      callback(
        null,
        {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(body)
        }
      );
    });
};