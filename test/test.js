const assert = require('assert');

describe('http(s) 테스트', function() {
  const format = /^http:\/\/|https:\/\//;

  it('None', function(done) {
    const str = 'google.com';

    assert.ok(!format.test(str));
    done();
  });

  it('http://', function(done) {
    const str = 'http://google.com';

    assert.ok(format.test(str));
    done();
  });

  it('https://', function(done) {
    const str = 'https://google.com';

    assert.ok(format.test(str));
    done();
  });

  it('None to http://', function(done) {
    const str = 'google.com/search';
    let decodedURI = decodeURIComponent(str);
    assert.ok(!format.test(decodedURI));
    if (!format.test(decodedURI)) decodedURI = 'http://' + decodedURI;
    assert.ok(format.test(decodedURI));
    done();
  });
});

describe('axios', function() {
  const axios = require('axios');
  it('GET', function(done) {
    const url = 'http://google.com';
    axios
      .get(url)
      .then(function(response) {
        assert.notEqual(url, response.request.res.responseUrl);
        assert.equal(
          'http://www.google.com/',
          response.request.res.responseUrl
        );
      })
      .catch(function(error) {
        assert.ifError(error);
      });
    done();
  });
});

describe('url', function() {
  const url = require('url');
  it('Relative path to absolute path 01', function(done) {
    const str = 'http://google.com';
    const expect =
      'http://google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png';

    const img01 =
      '/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png';
    const path01 = url.resolve(str, img01);
    assert.equal(path01, expect);

    const img02 =
      './images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png';
    const path02 = url.resolve(str, img02);
    assert.equal(path02, expect);
    done();
  });

  it('Relative path to absolute path 02', function(done) {
    const str = 'http://google.com/search';
    const img =
      '../images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png';
    const expect =
      'http://google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png';

    assert.equal(url.resolve(str, img), expect);
    done();
  });
});

describe('중복 제거', function() {
  it('use filter', function(done) {
    const arr = ['a', 'a', 'a', 'b', 'b', 'a', 'b', 'a', 'c', 'c'];
    const expect = ['a', 'b', 'c'];

    const res = arr.filter(function(el, i, arr) {
      return arr.indexOf(el) === i;
    });

    assert.deepEqual(res, expect);
    done();
  });
});
