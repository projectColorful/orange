async function login(req, res) {
    // 에러처리
    if (req.user.error) {
      delete req.user.error;
      return res.status(422).json(req.user);
    }
  
    // 로그인 성공 시
    const { token } = req.user;
  
    return res.json({ token });
  }
 module.exports = login;