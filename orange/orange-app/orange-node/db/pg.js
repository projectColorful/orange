const db_info = require("../lib/config")//설정관련 데이터
const SQL = require("sql-template-strings");
const { Pool, Q } = require('pg');
const pool = new Pool(db_info.db);
module.exports = {
    getConnection: function () {
        return db_info.db;
    },
    pool, //= pool_set.init(),
    Q(string, ...rest) {
        return SQL(string.slice(0), ...rest.map(((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : x))));
    }///쿼리 만드는 거

}