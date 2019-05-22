# fabric_e2e_app
库版本:

  ```
  npm 6.4.1
  node.js v8.12.0
  fabric 1.0
  ```
<h4>安装及配置</h4>

Step 1:
 ```
  git clone https://github.com/sslinml/fabric_e2e_app.git
 ```
进入nodejdk目录下;
  
Step 2:
在nodejdk目录下找到db.sql,按照里面的sql语句在MySQL中创建`person` DATABASE以及TABLE `people`

```
CREATE DATABASE IF NOT EXISTS person CHARACTER SET utf8;
use person;
CREATE TABLE `people` (
  `name` varchar(32) primary key,
  `password` varchar(32) NOT NULL,
  `department` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
Step 3:
当前目录执行以下命令：
  ```
  npm install
  //安装时速度可能会很慢，静等即可
  ```
  
Step 4:
  ```
  ./startFabric.sh
  若遇到权限问题执行chmod a+x startFabric.sh
  若仍有问题进入basic-network文件夹下执行 chmod a+x start.sh
  ```

Step 5:
   ```
   node registerAdmin.js
   node registerUser.js
   npm start
   ```

访问`http://localhost:3000`
