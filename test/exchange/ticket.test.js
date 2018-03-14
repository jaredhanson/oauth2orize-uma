var chai = require('chai')
  , expect = require('chai').expect
  , umaticket = require('../../lib/exchange/ticket');


describe('exchange.ticket', function() {
  
  it('should be unnamed', function() {
    expect(umaticket(function(){}).name).to.equal('');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, ticket, done) {
        if (client.id !== 'some_client_id') { return done(new Error('incorrect client argument')); }
        if (ticket !== '016f84e8-f9b9-11e0-bd6f-0021cc6004de') { return done(new Error('incorrect ticket argument')); }
        
        return done(null, 'sbjsbhs(/SSJHBSUSSJHVhjsgvhsgvshgsv');
      }
      
      chai.connect.use(umaticket(issue))
        .req(function(req) {
          req.user = { id: 'some_client_id' };
          req.body = {
            ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de'
          };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .next(function(err) {
          throw err;
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"sbjsbhs(/SSJHBSUSSJHVhjsgvhsgvshgsv","token_type":"Bearer"}');
    });
  });
  
});
