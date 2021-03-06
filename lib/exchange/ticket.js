var merge = require('utils-merge');
var TokenError = require('../errors/tokenerror');


module.exports = function(options, issue) {
  if (typeof options == 'function') {
    issue = options;
    options = undefined;
  }
  options = options || {};
  
  if (!issue) { throw new TypeError('oauth2orize.tokenExchange exchange requires an issue callback'); }
  
  var userProperty = options.userProperty || 'user';
  
  
  return function(req, res, next) {
    if (!req.body) { return next(new Error('OAuth2orize requires body parsing. Did you forget to use body-parser middleware?')); }
    
    // The 'user' property of `req` holds the authenticated user.  In the case
    // of the token endpoint, the property will contain the OAuth 2.0 client.
    var client = req[userProperty]
      , ticket = req.body.ticket // required
      , claimToken = req.body.claim_token // optional
      , claimTokenFormat = req.body.claim_token_format // optional
      , pct = req.body.pct // optional (persisted claims token)
      , rpt = req.body.rpt // optional (requesting party token)
      , scope = req.body.scope // optional
    
    if (!ticket) { return next(new TokenError('Missing required parameter: ticket', 'invalid_request')); }
    if (claimToken && !claimTokenFormat) { return next(new TokenError('Missing required parameter: claim_token_format', 'invalid_request')); }
    
    function issued(err, accessToken, refreshToken, params) {
      if (err) { return next(err); }
      if (!accessToken) { return next(new TokenError('Invalid permission ticket', 'invalid_grant')); }
      if (refreshToken && typeof refreshToken == 'object') {
        params = refreshToken;
        refreshToken = null;
      }
      
      var tok = {};
      tok.access_token = accessToken;
      if (refreshToken) { tok.refresh_token = refreshToken; }
      if (params) { merge(tok, params); }
      tok.token_type = tok.token_type || 'Bearer';
      
      var json = JSON.stringify(tok);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.end(json);
    }
    
    try {
      var hints = {
        claimTokenFormat: claimTokenFormat
      }
      
      var arity = issue.length;
      if (arity == 8) {
        issue(client, ticket, scope, issued);
      } else {
        issue(client, ticket, issued);
      }
    } catch (ex) {
      return next(ex);
    }
  };
};
