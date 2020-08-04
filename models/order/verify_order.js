/* function to verify if the order exists or complete */
const db = require('../connection_db');

module.exports = class VerifyOrder {
    checkOrderData(orderID, memberID, productID) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [orderID, memberID, productID], function (err, rows) {
                if (rows[0] === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    checkOrderComplete = function (orderID, memberID, productID) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ? AND is_complete = 0', [orderID, memberID, productID], function (err, rows) {
                if (rows[0] === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
}