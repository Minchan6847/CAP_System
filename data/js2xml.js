const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
/*
var data = {
  "firstName": "John",
  "lastName": "Smith",
};
console.log(js2xmlparser.parse("person", data));
*/
exports.js2xml = (tag, data) => {//tag: xml로 저장할 때의 파일명, data: xml로 변환할 js 객체
	//console.log(data);
	//console.log(JSON.parse(data));
	//console.log(typeof js2xmlparser.parse("item", JSON.parse(data)));
	//console.log(js2xmlparser.parse("item", JSON.parse(data)));

	// js 객체를 xml string으로 변환
	let result = js2xmlparser.parse("alert", data);
	// tag 명칭 변경
	/*
	result = result.replace(/NAME/g, 'name');
	result = result.replace(/CONTACT/g, 'phonenumber');
	result = result.replace(/ADDRESS/g, 'address');
	*/
	// 맨앞에서 두번째와 마지막 tag 명칭 변경
	/*
	let temp = result.split('\n');
	temp[1] = '<phonebook>';
	temp[temp.length-1] = '</phonebook>';
	result = temp.join('\n');
	*/

	//console.log(result);
	// 파일로 저장
	//fs.writeFileSync(__dirname + '/../temp/' + "phone_book.xml", '\ufeff' + result, {encoding: 'utf8'});
	fs.writeFileSync(__dirname + '/../temp/' + tag +'.xml', '\ufeff' + result, {encoding: 'utf8'});
	console.log('export to xml - complete!');
}

