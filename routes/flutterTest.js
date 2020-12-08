var express = require("express");
var router = express.Router();
const fs = require("fs");

const dir = __dirname + "/../temp";

/* GET home page. */
router.get("/", function (req, res, next) {
  //res.send('helow world');
  //var data = fs.readFileSync(__dirname + '/../temp/qq112.xml','utf8');
  //console.log(data);

  //let data = [];
  let xmlDataArray = new Array();
  let files = fs.readdirSync(dir); // 디렉토리를 읽어온다

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var suffix = file.substr(file.length - 4, file.length); // 확장자 추출
    //console.log(suffix);

    // 확장자가 xml일 경우 읽어 내용 출력
    if (suffix === ".xml") {
      // fs.readFile(dir + "/" + file, function (err, buf) {
      //   //console.log(buf.toString());
      // });
      let xmlData = new Object();
      xmlData.fileName = file;
      xmlData.data = fs.readFileSync(dir + "/" + file, 'utf8');;
      xmlDataArray.unshift(xmlData); // 배열의 앞쪽에 추가
    }
  }
  res.send(JSON.stringify(xmlDataArray));
});

module.exports = router;
