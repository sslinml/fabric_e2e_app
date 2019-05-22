
var db = require('./../db.js');
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var async = require('async');
module.exports = (function () {
    return {
        index: function (req, res) {
            //res.render('index')
            if (req.session.user) {
                res.render('index');
            } else {
                req.session.error = "请先登录"
                res.redirect('logreg');
            }
        },
        query: function (req, res) {
            res.render('query');
        },
        invoke: function (req, res) {
            res.render('invoke');
        },
        logreg: function (req, res) {
            res.render('logreg');
        },
        dologin: function (req, res) {
            var username = req.body.username;
            var password = req.body.password;
            console.log(username);
            console.log(password);
            var mysqlQuery = 'SELECT * FROM person.people;'

            db.DBConnection.query(mysqlQuery, function (err, data, result) {
                var isTrue = false;
                //console.log(data);
                if (data) { //获取用户列表，循环遍历判断当前用户是否存在
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name == username && data[i].password == password) {
                            var user = {
                                username: username,
                                password: password
                            };
                            console.log(user);
                            req.session.user = user;
                            isTrue = true;
                        }
                    }
                }
                if (isTrue) {
                    var success = {
                        message: "登录成功"
                    };
                    //res.send(success);
                    console.log(success);
                    //res.render('index.ejs');
                    res.redirect("/");
                    //res.render('test', { title: success.message})
                    //console.log("111111");
                } else {
                    var fale = {
                        message: "用户名或密码错误"
                    };
                    //res.send(fale);
                    console.log(fale);
                    res.render('logreg');
                    //return res.redirect("/");
                }
            });
        },
        // reg: function (req, res) {
        //     res.render('reg')
        // },
        doreg: function (req, res) {
            var mysqlParams = [
                req.body.name,
                req.body.password,
                req.body.department,
            ];
            console.log(req.body.name);
            console.log(req.body.password);
            console.log(req.body.department);
            var mysqlQuery = 'INSERT people(name,password,department) VALUES(?,?,?)'
            db.DBConnection.query(mysqlQuery, mysqlParams, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                var success = {
                    message: "注册成功"
                };
                console.log(success);
                // res.redirect("/");
                res.send(success);
            });

        },
        block: function (req, res) {
            var fabric_client = new Fabric_Client();
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            var blocknumber = null;
            //req = null;
            channel.addPeer(peer);

            var store_path = path.join(os.homedir(), '.hfc-key-store');
            console.log('Store path:' + store_path);


            // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
            Fabric_Client.newDefaultKeyValueStore({
                path: store_path
            }).then((state_store) => {
                // assign the store to the fabric client
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                // get the enrolled user from persistence, this user will sign all requests
                return fabric_client.getUserContext('user1', true);
            }).then((user_from_store) => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                } else {
                    throw new Error('Failed to get user1.... run registerUser.js');
                }


                return channel.queryInfo();
            }).then((response_info) => {
                var list = [];


                console.log(response_info);

                //前一个区块的哈希
                var buff = response_info.previousBlockHash;
                console.log(buff.toString('hex'));
                //console.log("--------------------");

                //区块高度
                blocknumber = response_info.height.low;
                // console.log(blocknumber);


                //递归,根据区块高度读取出所有的区块信息
                // var i = 0;
                // function recurse() {
                //     console.log(i);
                //     // console.log(blocknumber);

                //     channel.queryBlock(i).then((data) => {
                //         console.log(data.header.data_hash);
                //         list.push(data.header.data_hash);
                //         if (i == blocknumber-1) {
                //             console.log("22222222222222222222")
                //             callback(list)

                //         }
                //     })
                //     i++;
                //     if (i < blocknumber) {
                //         recurse();
                //     }

                // }
                // recurse();

                //只读取创世区块信息
                return channel.queryBlock(0);


                }).then((result) => {
                    //console.log(typeof (result));
                    //console.log(result);
                    //console.log(result.data.data);
                    //var test1 = JSON.stringify(result.data);
                    //console.log(test1);
                    var blockinfos = {
                        "number": blocknumber,
                        "low": result.header.number,
                        "previous_hash":result.header.previous_hash,
                        "data_hash":result.header.data_hash
                    };
                    res.render('block', { message: blockinfos });


            }).catch((err) => {
                console.error("Caught Error", err);
            });


        },

        doblock:function (req, res) {
            var fabric_client = new Fabric_Client();
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            var blocknumber = null;
            //req = null;
            channel.addPeer(peer);

            var store_path = path.join(os.homedir(), '.hfc-key-store');
            console.log('Store path:' + store_path);


            // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
            Fabric_Client.newDefaultKeyValueStore({
                path: store_path
            }).then((state_store) => {
                // assign the store to the fabric client
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                // get the enrolled user from persistence, this user will sign all requests
                return fabric_client.getUserContext('user1', true);
            }).then((user_from_store) => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                } else {
                    throw new Error('Failed to get user1.... run registerUser.js');
                }


                return channel.queryInfo();
            }).then((response_info) => {
                var list = [];


                //console.log(response_info);

                //前一个区块的哈希
                var buff = response_info.previousBlockHash;
                console.log(buff.toString('hex'));
                //console.log("--------------------");

                //区块高度
                blocknumber = response_info.height.low;
                // console.log(blocknumber);

                var numberid = req.body.numberID;
                console.log("------ "+ numberid +" ------")

                //只读取创世区块信息
                return channel.queryBlock(parseInt(numberid)-1);


                }).then((result) => {
                    
                    //console.log(result);
                    
                    var blockinfos = {
                        "number": blocknumber,
                        "low": result.header.number,
                        "previous_hash":result.header.previous_hash,
                        "data_hash":result.header.data_hash
                    };
                    res.render('block', { message: blockinfos });


            }).catch((err) => {
                console.error("Caught Error", err);
            });


        },
        input_fabric: function (req, res, function_name) {
            var fabric_client = new Fabric_Client();

            // setup the fabric network
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            channel.addPeer(peer);
            var order = fabric_client.newOrderer('grpc://localhost:7050')
            channel.addOrderer(order);

            var member_user = null;
            var store_path = path.join(os.homedir(), '.hfc-key-store');
            console.log('Store path:' + store_path);
            var tx_id = null;

            // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
            Fabric_Client.newDefaultKeyValueStore({
                path: store_path
            }).then((state_store) => {
                // assign the store to the fabric client
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                // get the enrolled user from persistence, this user will sign all requests
                return fabric_client.getUserContext('user1', true);
            }).then((user_from_store) => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                } else {
                    throw new Error('Failed to get user1.... run registerUser.js');
                }

                // get a transaction id object based on the current user assigned to fabric client
                tx_id = fabric_client.newTransactionID();
                console.log("Assigning transaction_id: ", tx_id._transaction_id);

                aaa = req.body.zhuanzhang;
                bbb = req.body.shoukuan;
                ccc = req.body.money;
                console.log(aaa + bbb + ccc);
                // recordTuna - requires 5 args, ID, vessel, location, timestamp,holder - ex: args: ['10', 'Hound', '-12.021, 28.012', '1504054225', 'Hansel'],
                // send proposal to endorser
                const request = {
                    //targets : --- letting this default to the peers assigned to the channel
                    chaincodeId: 'mycc',
                    fcn: function_name,
                    args: [aaa, bbb, ccc],
                    chainId: 'mychannel',
                    txId: tx_id
                };

                // send the transaction proposal to the peers
                return channel.sendTransactionProposal(request);
            }).then((results) => {
                var request = {
                    proposalResponses: results[0],
                    proposal: results[1],
                    header: results[2]
                };
                return channel.sendTransaction(request);
            }).then((response) => {
                console.log(response)
                if (response) {
                    var success = {
                        message: "转账成功！"
                    };
                    res.send(success);
                }

            }).catch((err) => {
                console.error("Caught Error", err);
            });
            // req.flash('success', '发布成功!')
            //res.redirect('/invoke');
        },
        get_fabric: function (req, res, function_name) {
            var fabric_client = new Fabric_Client();
            var key = req.params.id

            // setup the fabric network
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            channel.addPeer(peer);



            //
            var member_user = null;
            var store_path = path.join(os.homedir(), '.hfc-key-store');
            console.log('Store path:' + store_path);
            var tx_id = null;

            // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
            Fabric_Client.newDefaultKeyValueStore({
                path: store_path
            }).then((state_store) => {
                // assign the store to the fabric client
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                // get the enrolled user from persistence, this user will sign all requests
                return fabric_client.getUserContext('user1', true);
            }).then((user_from_store) => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                } else {
                    throw new Error('Failed to get user1.... run registerUser.js');
                }

                query_id = (req.body.queryid).toString();
                console.log(query_id);
                // queryTuna - requires 1 argument, ex: args: ['4'],
                const request = {
                    chaincodeId: 'mycc',
                    txId: tx_id,
                    fcn: function_name,
                    args: [query_id]
                };

                // send the query proposal to the peer
                return channel.queryByChaincode(request);
            }).then((query_responses) => {
                console.log("Query has completed, checking results");
                // query_responses could have more than one  results if there multiple peers were used as targets
                if (query_responses && query_responses.length == 1) {
                    if (query_responses[0] instanceof Error) {
                        console.error("error from query = ", query_responses[0]);
                        res.send("Could not locate tuna")

                    } else {
                        console.log("Response is ", query_responses[0].toString());
                        res.send(query_responses[0].toString())
                    }
                } else {
                    console.log("No payloads were returned from query");
                    res.send("Could not locate tuna")
                }
            }).catch((err) => {
                console.error('Failed to query successfully :: ' + err);
                res.send("Could not locate tuna")
            });
        }

    }
})();