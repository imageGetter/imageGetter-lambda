'use strict';

const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');

const { WebClient } = require('@slack/client');
const { SLACK_TOKEN, SLACK_CHANNEL } = process.env;
const web = new WebClient(SLACK_TOKEN);

module.exports.imgs = async (event, context, callback) => {
  const format = /^http:\/\/|https:\/\//;

  const { encodedURI } = event.pathParameters;
  let decodedURI = decodeURIComponent(encodedURI);

  if (!format.test(decodedURI)) decodedURI = 'http://' + decodedURI;

  return axios
    .get(decodedURI)
    .then(function(response) {
      const $ = cheerio.load(response.data);
      const { responseUrl } = response.request.res;

      return $('img')
        .map(function() {
          return url.resolve(responseUrl, $(this).attr('src'));
        })
        .toArray();
    })
    .then(function(imgs) {
      return imgs.filter(function(el, i, arr) {
        return arr.indexOf(el) === i;
      });
    })
    .then(function(imgs) {
      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(imgs)
      });
    })
    .catch(function(error) {
      const { response } = error;
      const body = response
        ? {
            status: response.status,
            statusText: response.statusText,
            data: response.data
          }
        : null;

      web.chat
        .postMessage({
          channel: SLACK_CHANNEL,
          text: `${decodedURI}\r\n${encodedURI}\r\n${body.status} - ${
            body.statusText
          }`
        })
        .then(() => {
          return body;
        })
        .catch(error => {
          return {
            ...body,
            slack: error
          };
        });
    })
    .then(body => {
      callback(null, {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)
      });
    });
};
