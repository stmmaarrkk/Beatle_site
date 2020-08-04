const db = require('../connection_db');

module.exports = class tool {
    getProductPrice(productID) {
        return new Promise((resolve, reject) => {
            db.query('SELECT price FROM product WHERE id = ?', productID, function (err, rows) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(rows[0].price);
            })
        })
    }
}