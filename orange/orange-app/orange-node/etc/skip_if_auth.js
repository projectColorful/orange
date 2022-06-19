// 인증 정보가 있으면 해당 핸들러를 실행하지 않고 다음 라우트로 넘김

/*
ex)
module.exports = (app) => {
  app.get('/', skipIfAuth(handle(require('./select')))); // 인증정보가 있으면 해당 라우트 건너뜀. 인증정보가 없을 때만 해당 라우트 호출 후 종료

  app.group([passport.authenticate('user.jwt', { session: false })], (router) => {
    router.get('/', handle(require('./select'))); // 인증정보와 함께 해당 라우트 호출
  });
};

*/
function skipIfAuth(handle) {
  return (req, res, next) => {
    if(!req.headers.authorization) {
      return handle(req, res, next)
    }
    
    next()
  };
}

module.exports = {
  skipIfAuth
};