const compressing = require('compressing');

compressing.zip.uncompress('./PalServer_Package/PalServer.zip','./PalServer/').then((e) => {
  console.log(e);
	console.log('解压完成')
}).catch((e) => {
  console.log(e);
	console.log('解压失败')
})
