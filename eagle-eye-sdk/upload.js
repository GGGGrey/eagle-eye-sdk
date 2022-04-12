const fs = require('fs');
const axios = require('axios');
const minimist = require('minimist');
const FormData = require('form-data');

const args = minimist(process.argv);
const { name, path } = args;

// --- 获取需要上传的文件 ---

let file_stream = fs.createReadStream(path)

const body = new FormData();
body.append('file', file_stream);
body.append('path', `file/${name}`,);

axios({
  method: 'post',
  url: `http://172.18.153.86:3003/upload`,
  data: body,
  headers: body.getHeaders(),
}).then((res) => {
  console.log("++++++", res.data);
});

