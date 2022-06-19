const { Q, pool } = require(`../../../../db/pg`);
const config = require(`../../../../lib/config`);

const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ExtractJWT = passportJWT.ExtractJwt;

const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;

// Local Strategy
passport.use('user.local', new LocalStrategy(
  {
    usernameField: 'user_id',
    passwordField: 'user_pw',
    session: false, // 세션 사용안함
  },
  async (user_id, user_pw, done) => {
    try {
      // user_id, user_pw로 사용자 인증 확인. 해당 값이 없으면 400 리턴
      const sql = Q`
      SELECT
        user_no,
        user_pw,
        state
      FROM users
      WHERE
        user_id = ${user_id} 
      `;

      const query = (await pool.query(sql)).rows;
      if (query.length === 0) {
        // 없는 사용자
        return done(null, { error: true, state: -1, msg: 'User not found' }, {});
      }
      const user = query[0];

      const check = await bcrypt.compare(user_pw, user.user_pw);
      if (!check) { 
        // 비밀번호 틀림
        return done(null, { error: true, state: -2, msg: 'Incorrect email or password' }, {});
      }

      if (user.state === 0) {
        // 비활성화된 사용자
        return done(null, { error: true, state: -3, msg: 'Disabled user' }, {});
      }

       // JWT 토큰 생성
      const token = jwt.sign({ user_no: user.user_no }, config.auth.jwtSecretUser, {
        expiresIn: config.auth.jwtExpireUser, // https://github.com/zeit/ms
      });

      // 로그인 체크 성공
      return done(null, { token }, {});
    } catch (e) {
      // 로그인 확인 중 에러 발생 시
      console.error(e);
      return done(null, { error: true, state: 0, msg: 'Internal Error' }, {});
    }
  },
));

// JWT Strategy
passport.use('user.jwt', new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Bearer 인증 방식 사용
    secretOrKey: config.auth.jwtSecretUser,
  },
  async (jwtPayload, done) => {
    try {
      // JWT로 사용자 인증 확인

      // 필요시 유저 정보 조회하는 DB 쿼리 실행

      // 사용자 정보 조회 성공
      return done(null, jwtPayload);
    } catch (e) {
      // 사용자 인증 체크 중 에러 발생 시
      console.error(e);
      return done(null, { error: true, state: 0, msg: 'Internal Error' }, {});
    }
  },
));

module.exports = passport;
