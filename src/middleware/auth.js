const { verify } = require('../utils/jwt');

function jwtAuth(call, callback, next) {
  let token;
  if (call.metadata && call.metadata.get) {
    const authHeader = call.metadata.get('authorization')[0];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    }
  }
  if (!token) {
    const err = { code: 16, message: 'Unauthenticated: JWT required' };
    return (callback ? callback(err) : next(err));
  }
  try {
    const user = verify(token);
    call.request.user = user; // inject user info in request
    return next();
  } catch (e) {
    const err = { code: 16, message: 'Unauthenticated: Invalid JWT' };
    return (callback ? callback(err) : next(err));
  }
}

module.exports = jwtAuth;