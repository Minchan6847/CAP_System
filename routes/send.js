var express = require("express");
const db_conn = require("../db/db_conn");

var router = express.Router();

// front-end의 form을 post로 받은 area 정보를 DB에 insert하고 xml 파일로 저장
router.post("/", function (req, res, next) {
  console.log(req.body);
	db_conn.queryExecution(req.body);
	
  res.redirect("/area");
});

module.exports = router;
