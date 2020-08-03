const toRegister = require('../models/register_model');
const Check = require('../service/member_check');
const encryption = require('../models/encryption');
const loginAction = require('../models/login_model');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');

check = new Check();

module.exports = class Member {
    postRegister(req, res, next) {
        // encryption
        const password = encryption(req.body.password);
        // 獲取client端資料
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        const checkEmail = check.checkEmail(memberData.email);
        // 不符合email格式
        if (checkEmail === false) {
            res.json({
                result: {
                    status: "Registration Failed",
                    err: "請輸入正確的Eamil格式。(如1234@email.com)"
                }
            })
            res.send("請輸入正確的Eamil格式。(如1234@email.com)");
        // 若符合email格式
        } else if (checkEmail === true) {
            // 將資料寫入資料庫
            toRegister(memberData).then(result => {
                
                // 若寫入成功則回傳
                res.json({
                    result: result
                })
            }, (err) => {
                // 若寫入失敗則回傳
                res.json({
                    err: err
                })
            })
        }
    }

    postLogin(req, res, next){
        // encryption
        const password = encryption(req.body.password);
        // 獲取client端資料
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }
        
        loginAction(memberData).then(rows => {
            //enter this section, if no server error.
            if (check.checkNull(rows)  === true){ //no match row, so checkNull will be true
                res.json({
                    result:{
                        status: 'Login Failed',
                        err: 'Wrong email or password!'
                    }
                })
            } else{
                // 產生token
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                    data: rows[0].id
                }, config.secret);
                res.setHeader('token', token);
                res.json({
                    result: {
                        status: "Login Success",
                        loginMember: "Welcome back " + rows[0].name + "!",
                    }
                })
            }
            }, (err) => {
                res.json({
                    err: err
                })
            }
        )


    }
}


//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}