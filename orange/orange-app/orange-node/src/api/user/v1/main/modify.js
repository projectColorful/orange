// const app = express.Router();
const jkh = require('../../../../../lib/jkh_function');
const { Q, pool } = require('../../../../../db/pg');


const modify = async (req, res) => {
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
        if (jkh.isEmpty()) {
            response.state = 2;
            response.msg = 'params is empty !!';
            return res.state(404).json(response);
        }
        const note_data = {
            "note_index": note_count === null ? 1 : note_count,
            "note_text": [{
                "deadline": params.deadline,
                "content": params.content,
                "note_checked":params.nc
            }]
        }
        const sql0 = Q`
        UPDATE
            note
        SET
        note_data = ${note_data}`
        if(params.state !== null){ // 삭제인지 아닌지 확인
         sql0.append(`, state = ${params.state}`);}
        sql0.append(    
        `WHERE
            note_no = ${params.note_no}
        `);//중복조회
        const query0 = await pool.query(sql0);
        if (jkh.isEmpty(query0.rows)) {
            response.state = 0;
            response.msg = 'update fail';
            return res.status(500).json(response);
        }//리턴하면 else가 필용없다.
    }
    catch (err) {
        console.log(err);
        response.state = 0;
        response.msg = err + ' ';
        jkh.webhook('err', 'login sql select err(500)')//log 보내는 역활
        //return res.status(500).json(response); //클라이언트에게 완료 메시지 보내줌
    }
    return res.state(200).join(response);//데이터 전송 !!

}// 회원가입

module.exports = modify;