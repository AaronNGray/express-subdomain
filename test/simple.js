var colors = require('colors');
var request = require('request');
var expect = require('chai').expect;

var express = require('express');
var subdomain = require('../');
var config = require('./config.json');

console.log("config = ", config);

//////////////////////////////
//    expected responses    //
//////////////////////////////
var responses = {
  main: {
    '/': 'Simple example homepage!'
  },
  api: {
    '/': 'Welcome to our simple API!',
    '/users': [{ name: "Brian" }]
  }
};

//////////////////////////////
//         routes           //
//////////////////////////////
var router = express.Router();

//api specific routes
router.get('/', function(req, res) {
    res.send(responses.api['/']);
});

router.get('/users', function(req, res) {
    res.json(responses.api['/users']);
});

//////////////////////////////
//       express app        //
//////////////////////////////
var app = express();

app.use(subdomain('api', router));

app.get('/', function (req, res) {
  res.send(responses.main['/']);
});

describe('Simple tests', function () {

  //to be assigned in the 'before' hook (below)
  var server;

  before(function (done) {
    server = app.listen(config.PORT, config.HOSTNAME, done);
  });

  ///////////////////////////////
  //        example.com        //
  ///////////////////////////////

  console.log("config.urls.com.BASE_URL = ", config.urls.BASE_URL);

  it('GET ' + config.urls.com.BASE_URL, function (done) {
    request('http://'+ config.urls.com.BASE_URL, function (error, res, body) {
      expect(body).to.equal(responses.main['/']);
      done();
    });
  });

  ///////////////////////////////
  //      api.example.com      //
  ///////////////////////////////

  it('GET ' + config.urls.com.API_URL, function (done) {
    request('http://' + config.urls.com.API_URL, function (error, res, body) {
      expect(body).to.equal(responses.api['/']);
      done();
    });
  });

  it('GET ' + config.urls.com.API_URL + '/users', function (done) {
    request('http://' + config.urls.com.API_URL + '/users', function (error, res, body) {
      expect(body).to.equal( JSON.stringify(responses.api['/users']) );
      done();
    });
  });

  ///////////////////////////////
  //        example.org.uk     //
  ///////////////////////////////

  it('GET ' + config.urls.org_uk.BASE_URL, function (done) {
    request('http://'+ config.urls.org_uk.API_URL, function (error, res, body) {
      expect(body).to.equal(responses.main['/']);
      done();
    });
  });

  ///////////////////////////////
  //      api.example.org.uk   //
  ///////////////////////////////

  it('GET ' + config.urls.org_uk.API_URL, function (done) {
    request('http://' + config.urls.org_uk.API_URL, function (error, res, body) {
      expect(body).to.equal(responses.api['/']);
      done();
    });
  });

  it('GET ' + config.urls.org_uk.API_URL + '/users', function (done) {
    request('http://' + config.urls.org_uk.API_URL + '/users', function (error, res, body) {
      expect(body).to.equal( JSON.stringify(responses.api['/users']) );
      done();
    });
  });


  ///////////////////////////////
  //        localhost          //
  ///////////////////////////////

  it('GET ' + config.urls.localhost.BASE_URL, function (done) {
    request('http://'+ config.urls.localhost.BASE_URL, function (error, res, body) {
      expect(body).to.equal(responses.main['/']);
      done();
    });
  });

  ///////////////////////////////
  //      api.localhost        //
  ///////////////////////////////

  it('GET ' + config.urls.localhost.API_URL, function (done) {
    request('http://' + config.urls.localhost.API_URL, function (error, res, body) {
      expect(body).to.equal(responses.api['/']);
      done();
    });
  });

  it('GET ' + config.urls.localhost.API_URL + '/users', function (done) {
    request('http://' + config.urls.localhost.API_URL + '/users', function (error, res, body) {
      expect(body).to.equal( JSON.stringify(responses.api['/users']) );
      done();
    });
  });



  after(function(done) {
    server.close(function() {
      console.log('    ♻ server recycled'.cyan);
      done();
    });
  });

});
