// const app = express.Router();
const jkh = require("../../../../../lib/jkh_function")
const { Q, pool } = require('../../../../../db/pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* 
 * @todo 로그인 유무에따라서 비번 파라메타 수정필요
   @params {string} user_id
*/
async function pwChage(req, res) {
    const response = {
        state: 1,
        query: null,
        msg: 'Successful',
    };
    const params = {
        ...req.query,
        ...req.params,
        ...req.body,
    };
    try {
        if (jkh.isEmpty()) {
            response.state = 2;
            response.msg = 'params is empty !!';
            return res.status(500).json(response);
        }
        console.log(bcrypt.hash(params.user_pw, saltRounds));
        const sql1 = Q`UPDATE users SET user_pw = ${await bcrypt.hash(params.user_pw, saltRounds)} WHERE user_id = ${params.user_id} RETURNING *`; //등록
        const query1 = await pool.query(sql1); //값 저장

        if (jkh.isEmpty(query1.rows)) {
            response.state = 3;
            response.msg = 'login failed';
            return res.status(500).json(response);
        }
        else {
            response.state = 1;
            response.msg = 'Member registration successful';
            return res.status(200).json(response); //데이터 전송 !!
        }

    }
    catch (err) {
        console.log(err);
        response.state = 0;
        response.msg = err + ' ';
        //return res.status(500).json(response); //클라이언트에게 완료 메시지 보내줌
    }
    return res.status(200).json(response); //데이터 전송 !!

}// 회원가입

module.exports = pwChage;