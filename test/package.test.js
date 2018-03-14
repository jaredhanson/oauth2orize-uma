/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('oauth2orize-uma', function() {
  
  it('should export exchanges', function() {
    expect(pkg.exchange).to.be.an('object');
    expect(pkg.exchange.ticket).to.be.a('function');
  });
  
});
