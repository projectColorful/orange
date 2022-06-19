const passport = require(`../passport`);
const express = require('express');
var app = express.Router()
/**
 * @description /list -> 목록 출력
 * @description /modify ->  수정 출력 @parma state  - 0 삭제시 업데이트시 첨부 x
 * @description /insert ->  메모추가
 * @description /detail ->  세부정보 출력
 */
module.exports = (app) => {
	app.group('/',[passport.authenticate('user.jwt', { session: false })], (router) => {
		router.get('/modify', require('./modify'));
		router.put('/insert', require('./insert'));
		router.get('/list', require('./list'));
		router.get('/detail', require('./deteil'));
	});
};
