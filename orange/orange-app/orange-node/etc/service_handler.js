const { pool } = require(`${global.__appRoot}db/pg`);

function handle(service) {
  // 일반 함수를 express 핸들러로 변환
  return async (req, res) => {
    // 응답 객체
    let response = {
      state: 0,
    };

    // 파라미터 객체
    const params = {
      ...req.params,
      ...req.query,
      ...req.body,
      ...req.user,
    };

    // 컨텍스트 객체
    const ctx = {
      pool,
      params,
    };

    try {
      response = await service(ctx);
    } catch (e) {
      console.error(e);
      // error 객체에 저잗된 값 사용
      response = e.data || response;

      return res.status(e.status || 500).json(response);
    }

    return res.json(response);
  };
}

function handleWithTx(service) {
  // 일반 함수를 트랜잭션을 사용하는 express 핸들러로 변환
  return async (req, res) => {
    // 응답 객체
    let response = { state: 0 };

    // 파라미터 객체
    const params = {
      ...req.params,
      ...req.query,
      ...req.body,
      ...req.user,
    };

    const client = await pool.connect();

    // 컨텍스트 객체
    const ctx = {
      pool: client,
      params,
    };

    try {
      await client.query('BEGIN');

      response = await service(ctx);

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');

      console.error(e);
      // error 객체에 저잗된 값 사용
      response = e.data || response;

      return res.status(e.status || 500).json(response);
    } finally {
      client.release();
    }

    return res.json(response);
  };
}

module.exports = {
  handle,
  handleWithTx,
};
