console.log('확장기능(V2)을 제작할때 사용할듯..');
const test = (req, res) => {
    var ress = [];
    for (let i = 0; i < 100; i++) {
        ress.push({
            context_id: i + 1,
            data: "데이터값" + (i + 1) + "번",
            title: "제목" + (i + 1) + "번째",
            user: "사용자명",
            count: 30,
            date: jkh.date_ymd(),
            date2: jkh.date_time(),
        });
    }
    return res.status(200).json(ress);
}/// 테스트 함수
module.exports = (app) => {
  app.get('/',test);
};
