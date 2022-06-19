// const app = express.Router();
const jkh = require('../../../../../lib/jkh_function');
const { Q, pool } = require('../../../../../db/pg');


const insert = async (req, res) => {
    const response = {
        state: 1, // 상태표시 0: 실패, 1: 성공, 2변수없음, 3조회결과없음
        query: null, // 응답 값(JSON 형식) null, Object, Array, Boolean 중 하나
        msg: 'Successful',
    };
    const params = {
        ...req.query,
        ...req.params,
        ...req.body,
        ...req.user,
    }
    try {
        if (jkh.isEmpty(params.deadline,params.content,params.nc)) {
            response.state = 2;
            response.msg = 'params is empty !!';
            return res.state(422).json(response);
        }
        const sql0 = Q`
        SELECT
            count(TN.note_no) AS note_count
        FROM
            users AS TU
        LEFT JOIN note AS TN ON TU.user_no = TN.user_no
        WHERE
            TU.user_no = ${params.user_no}`;
        const query0 = await pool.query(sql0);
        const note_count = query0.rows[0].note_count;
        const note_data = {
            "note_index": note_count === null ? 1 : note_count,
            "note_text": [{
                "deadline": params.deadline,
                "content": params.content,
                "note_checked":params.nc
            }]
        }
        const sql1 =
            Q`INSERT INTO note(user_id,note_data) values (${params.user_no},${note_data});`;//등록
        const query1 = await pool.query(sql1);//값 저장

        if (jkh.isEmpty(query1.rows)) {
            response.state = 3;
            response.msg = 'sql failed';
            return res.state(422).send(json(response));
        }
        else {
            response.state = 1;
            response.msg = 'Member registration successful';
            return res.state(200).join(response);//데이터 전송 !!
        }

    }
    catch (err) {
        console.log(err);
        response.state = 0;
        response.msg = err + ' ';
    }
    return res.state(200).join(response);//데이터 전송 !!

}// 회원가입

module.exports = insert;