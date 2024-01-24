const https = require('https');
const fs = require('fs');

const fileUrl = 'https://drive.usercontent.google.com/download?id=1w1qDCzA1vGkwfEFsv7brThzNhwhWSB7U&export=download&authuser=0&confirm=t&uuid=f0a975e3-98e4-43bb-bb8b-7a22b56b1488&at=APZUnTVnv2Hl_Beol3YXZZ-MqO6-%3A1706000044408';
const destinationPath = 'Palworld/result.zip'; // 設定檔案要保存的路徑

const file = fs.createWriteStream(destinationPath);

https.get(fileUrl, (response) => {
  response.pipe(file);

  file.on('finish', () => {
    file.close(() => {
      console.log('File downloaded successfully.');
    });
  });
}).on('error', (err) => {
  fs.unlink(destinationPath, () => {
    console.error(`Error downloading file: ${err.message}`);
  });
});