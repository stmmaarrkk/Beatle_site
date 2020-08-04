const db = require('../connection_db');

module.exports = function memberLogin(memberdata){
    let result = {}
    return new Promise((resolve, reject) => {
        //seek in the database
        db.query('SELECT * FROM member WHERE email = ? AND password = ?', [memberdata.email, memberdata.password], (err, rows) => {
          
            if (err) {
                result.status = "Login failed"
                result.err = "Server fail, please wait a second!"
                reject(result);
                console.log(result);
                return;
            }
            resolve(rows);
        });
    })
}