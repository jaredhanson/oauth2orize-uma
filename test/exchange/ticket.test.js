var chai = require('chai')
  , expect = require('chai').expect
  , umaticket = require('../../lib/exchange/ticket');


describe('exchange.ticket', function() {
  
  it('should be unnamed', function() {
    expect(umaticket(function(){}).name).to.equal('');
  });
  
});
