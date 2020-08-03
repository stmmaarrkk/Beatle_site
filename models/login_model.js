const db = require('./connection_db');

module.exports = function memberLogin(memberdata){
    let result = {}
    return new Promise((resolve, reject) => {
        //seek in the database
        //db.query('SELECT * FROM member_info WHERE email = ? AND password = ?', [memberData.email, memberData.password], function (err, rows) {
        db.query('SELECT * FROM member_info WHERE email = ? AND password = ?', ['sttttt@ss.cs', '12345'], function (err, rows) {
            if (err) {
                result.status = "登入失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            resolve(rows);
        });
    })
}