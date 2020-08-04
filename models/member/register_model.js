const db = require('../connection_db');

module.exports = function register(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT email FROM member WHERE email = ?', memberData.email, function(err, rows){
            if (err) { //if server fail
                result.status = "Registration failed";
                result.err = "Server fail, please try again later";
                reject(result);
                return;
            }
            if (rows.length >= 1){ //duplicated email
                result.status = 'Registration Failed';
                result.err = 'This email already exists, please use another one!';
                reject(result);
                return;
            }else{
                // 將資料寫入資料庫
                db.query('INSERT INTO member SET ?', memberData, function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        result.status = "Registration Failed";
                        result.err = "This email already exists, please use another one!";
                        reject(result);
                        return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    result.status = "註冊成功。"
                    result.registerMember = memberData;
                    resolve(result);
                })
            }
        })
    })
}