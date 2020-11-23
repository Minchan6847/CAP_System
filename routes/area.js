const select_query = "SELECT file_name FROM area";
var express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../db/dbCofig");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// Oracle Auto Commit 설정
oracledb.autoCommit = true;

var router = express.Router();

// 파일 리스트를 DB에서 받아서 area.ejs에 보내주며 렌더링
router.get("/", function (req, res, next) {
  async function run() {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);

      const result = await connection.execute(select_query, []);
      console.log(result.rows);
      console.log(result.rowsAffected);
      //// result.rows 예시
      // [
      //   { FILE_NAME: 'dd' },
      //   { FILE_NAME: 'test 2 fn' },
      //   { FILE_NAME: 'test1 fn' },
      //   { FILE_NAME: 'test10 fn ' },
      //   { FILE_NAME: 'test3 fn' },
      //   { FILE_NAME: 'test4 fn' },
      //   { FILE_NAME: 'test5 fn' },
      //   { FILE_NAME: 'test6 fn' },
      //   { FILE_NAME: 'test8 fn' },
      //   { FILE_NAME: 'test9 fn' }
      // ]
      res.render("area", {
        title: "Area",
        file_list: result.rows
      });
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
