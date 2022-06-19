// const app = express.Router();
const jkh = require("../../../../../lib/jkh_function")
const { Q, pool } = require('../../../../../db/pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const join = async (req, res) => {
    const response = {
        state: 1, // 상태표시 0: 실패, 1: 성공, 2변수없음, 3조회결과없음
        query: null, // 응답 값(JSON 형식) null, Object, Array, Boolean 중 하나
        msg: 'Successful',
    };
    const params = {
        ...req.query,
        ...req.params,
        ...req.body        
    }
    try {
        let data = {
            id: params.user_id,
            pw: params.user_pw,
            name: params.user_name
        }
        console.log(data.id,data.pw,data.name);
        if (jkh.isEmpty(data.id)) {
            response.state = 2;
            response.msg = 'params is empty !!';
            return res.status(404).json(response);
        }
        const sql0 = Q`
        SELECT user_no FROM users WHERE user_id = ${data.id};`;
        const query0 = await pool.query(sql0);
        console.log(`중복관련 값인지 : ${query0.rows[0]}`)
        if (!jkh.isEmpty(query0.rows)) { //값이 있다는건  거짓을 출력할껀데 값이 있으면 중복이라서 !로 걸러줌
            response.state = 0;
            response.msg = 'Duplicate values';
            return res.status(500).json(response);
        }//리턴하면 else가 필용없다.

        const sql1 =
            Q`INSERT INTO users(user_id,user_pw,user_name) values (${data.id},${await bcrypt.hash(data.pw,saltRounds)},${data.name}) RETURNING *;`;//등록
        const query1 = await pool.query(sql1);//값 저장

        if (jkh.isEmpty(query1.rows)) {
            response.state = 3;
            response.msg = 'join failed';
            return res.status(500).json(response);
        }
        else {
            response.state = 1;
            response.msg = 'Member registration successful';
            return res.status(200).json(response);//데이터 전송 !!
        }

    }
    catch (err) {
        console.log(err);
        response.state = 0;
        response.msg = err + ' ';
        //return res.status(500).json(response); //클라이언트에게 완료 메시지 보내줌
    }
    return res.status(200).json(response);//데이터 전송 !!

}// 회원가입

module.exports = join;
  