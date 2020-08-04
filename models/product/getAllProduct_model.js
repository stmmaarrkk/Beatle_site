const db = require('../connection_db');

module.exports = function getProductData(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product', function (err, rows) {
            // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                result.status = "Fail to query product list"
                result.err = "Server fail, please try a again later!"
                reject(result);
                return;
            }
            // 若資料庫部分沒問題，則回傳全部產品資料。
            resolve(rows);
        })
    })
}