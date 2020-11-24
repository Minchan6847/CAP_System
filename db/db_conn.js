let insert_query =
  "INSERT INTO area VALUES(:f, :a, :p, :c, :gvn, :gv, :al, :ce)";
let select_query = "SELECT file_name FROM area";
const oracledb = require("oracledb");
const dbConfig = require("./dbCofig");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// Oracle Auto Commit 설정
oracledb.autoCommit = true;
//const exportjs = require("../data/export");
const js2xml = require("../data/js2xml");

// area table에 front-end에서 받은 정보(data parameter)를 insert하고,
// 그 정보를 xml 파일로 만들어서 server에 저장
module.exports.queryExecution = function (data) {
  //front-end에서 받은 area 정보
  let sending_data = [
    data.file_name,
    data.areaDesc,
    data.capPolygon,
    data.capCircle,
    data.geocodeValueName,
    data.geocodeValue,
    data.altitude,
    data.ceiling,
  ];

  async function run() {
    let connection;

    try {
      connection = await oracledb.getConnection(dbConfig);

      const result = await connection.execute(insert_query, sending_data);
      console.log(result.rows);
      console.log(result.rowsAffected); // insert query가 잘 수행되었으면 1, 아니면 0

      if (result.rowsAffected == 1) {
				
        let dataForXml = new Object();
				let info = new Object();
				let eventCode = new Object();
        let parameter = new Object();
        let resource = new Object();
        let area = new Object();

        for (let key in data) {
          if (data[key] != "") {
            let strArray = key.split("-");
            if (strArray[0] == "header") {
              dataForXml[strArray[1]] = data[key];
            } else if (strArray[0] == "info") {
              if (strArray[1] == "eventCode") {
                eventCode[strArray[2]] = data[key];
							} else if(strArray[1] == "parameter"){
								parameter[strArray[2]] = data[key];
							} else {
                info[strArray[1]] = data[key];
              }
            } else if (strArray[0] == "resource") {
              resource[strArray[1]] = data[key];
            } else {
              //area
              if (
                key != "file_name" &&
                //data[key] != "" &&
                key != "geocodeValue"
              ) {
                if (key == "geocodeValueName") {
                  area.geocode = {
                    valueName: data[key],
                    value: data.geocodeValue,
                  };
                } else if (key == "capPolygon") {
                  area.polygon = data[key];
                } else if (key == "capCircle") {
                  area.circle = data[key];
                } else {
                  area[key] = data[key];
                }
              }
            }
          }
        }

				info.eventCode = eventCode;
        info.parameter = parameter;
        info.resource = resource;
        info.area = area;
        dataForXml.info = info;

        /*
				const data = {
					areaDesc : data[1],
					polygon : data[2],
					circle : data[3],
					geocode : {
						valueName : data[4],
						value : data[5]
					},
					altitude : data[6],
					ceiling : data[7]
				}
				*/
        // 아래 코드는 위와 같은 객체를 생성
        // data의 한 요소가 빈 값('')이면 그 요소는 pass해서 xml에 반영되지 않도록 함
        // geocode의 valueName과 value는 하나의 객체로 만듦
        // 도형의 key name을 변경
        /*
        let sending_data2 = new Object();
        for (let key in data) {
          console.log(key);
          console.log(typeof key);
          if (key != "file_name" && data[key] != "" && key != "geocodeValue") {
            if (key == "geocodeValueName") {
              sending_data2.geocode = {
                valueName: data[key],
                value: data.geocodeValue,
              };
            } else if (key == "capPolygon") {
              sending_data2.polygon = data[key];
            } else if (key == "capCircle") {
              sending_data2.circle = data[key];
            } else {
              sending_data2[key] = data[key];
            }
          }
				}
				*/

        // 위 과정을 거쳐 만들어진 sending_data2를 xml로 변환해 서버에 xml 파일을 저장
        //js2xml.js2xml(data.file_name, sending_data2);
        js2xml.js2xml(data.file_name, dataForXml);
      }
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
};
// area table의 file_name attribute를 모두 가져옴
/*
module.exports.queryExecutionForSellect = function () {
	let sending_data = [];

	async function run() {

		let connection;
	
		try {
			connection = await oracledb.getConnection(dbConfig);
	
			const result = await connection.execute(select_query, sending_data, );
			console.log(result.rows);
			console.log(result.rowsAffected);

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
};
*/
