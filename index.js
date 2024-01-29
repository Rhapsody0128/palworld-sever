const fs = require('fs');
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');

dotenv.config()

let childProcess = null


const app = express()


// 前端server

const serverPath = path.join(__dirname, './server')

app.use(express.static(serverPath));

app.listen(process.env.SERVER_PORT, () => {
  console.log(new Date().toLocaleTimeString() + `前端伺服器已啟動:\nhttp://${process.env.IP}:${process.env.SERVER_PORT}`);
});

// 後端server

app.use(bodyParser.json())

app.use(cors({
  origin (origin, callback) {
    callback(null, true)
  },
  credentials: true
}))

app.get('/serverStatus', async (req, res) => {
  try {
    if(childProcess){
      res.send({ serverStatus: true })
      console.log(new Date().toLocaleTimeString() + "伺服器狀態確認: 開啟");
      res.status(200)
    }else{
      res.send({ serverStatus: false })
      console.log(new Date().toLocaleTimeString() + "伺服器狀態確認: 關閉");
      res.status(200)
    }
  } catch (error) {
    console.log(error);
    res.status(404)
  }

})

app.post('/startServer', async (req, res) => {
  try {
    if(!childProcess){
      const command = 'PalServer.exe';
      const options = {
        cwd: process.env.PALWORLD_SERVER_DIR, // 設置當前工作目錄
        shell: true, // 啟用 shell，這樣可以使用 "cd" 命令
      };
      childProcess = spawn(command, [], options);
      childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      childProcess.on('close', (code) => {
        childProcess = null;
      });
      res.status(200).send({ serverStatus: true });
      console.log(new Date().toLocaleTimeString() + "伺服器已開啟");
    }else{
      res.status(200).send({ serverStatus: true, message:'已經開啟中' });
    }
  } catch (error) {
    res.status(404).send({ result: "ERROR" })
  }
})

app.post('/closeServer', async (req, res) => {
  try {
    if (childProcess) {
      // 使用 tree-kill 來遞歸終止所有子進程
      treeKill(childProcess.pid, 'SIGTERM', (err) => {
        if (err) {
          console.error(err);
          res.status(404).send({ result: "ERROR" });
          return;
        }

        // 將 childProcess 設置為 null，表示它已經被關閉
        childProcess = null;
        res.status(200).send({ serverStatus: false });
        console.log(new Date().toLocaleTimeString() + "伺服器已關閉");
      });
    } else {
      // 如果 childProcess 為 null，表示已經被關閉
      res.status(200).send({ serverStatus: false, message:'已經關閉中' });
    }
  } catch (error) {
    console.error(error);
    res.status(404).send({ result: "ERROR" });
  }
});



app.listen(process.env.APP_PORT, () => {
  console.log(new Date().toLocaleTimeString() + `後端伺服器已啟動:\nhttp://${process.env.IP}:${process.env.APP_PORT}`)
})

