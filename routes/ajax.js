let select_query = "SELECT polygon, circle FROM area WHERE file_name = :file_name";
const oracledb = require("oracledb");
const dbConfig = require("../db/dbCofig");

const express = require('express');
let router = express.Router();

/* POST 호출 처리 */
// ajax 과정임
// front-end로부터 file_name 받아서
// DB에서 그 file_name을 가진 sample의 polygon과 circle 정보를 가져와
// 그 정보를 front-end에 전송
router.post('/', function(req, res, next) {
		let data = [req.body.file_name];

    async function run() {
      let connection;
      try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(select_query, data);
        console.log(result.rows);
        console.log(result.rows[0]);
        //// result.rows 값 예시
        // [
        //   {
        //     POLYGON: '37.3789,128.7543 35.9513,128.0292 36.4301,129.4354 37.3789,128.7543',
        //     CIRCLE: null
        //   }
        // ]
        res.send({result: true, info:result.rows[0]});
      } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    run();
});

module.exports = router;