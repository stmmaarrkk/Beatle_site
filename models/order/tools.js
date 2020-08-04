/* function to verify if the order exists or complete */
const db = require('../connection_db');

module.exports = class OrderTools {
    checkOrderData(orderID=0, memberID=0, productID=0) {
        return new Promise((resolve, reject) => {
            db.query(combineSearchCommand(orderID, memberID, productID), function (err, rows) {
                if (rows[0] === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    checkOrderComplete = function (orderID=0, memberID=0, productID=0) {

        return new Promise((resolve, reject) => {
            db.query(combineSearchCommand(orderID, memberID, productID) + ' AND is_complete = 0', function (err, rows) {
                if (rows[0] === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    getOrderData = (orderID, memberID) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID], function (err, rows) {
                resolve(rows);
            })
        })
    }

    checkOrderStock = (orderProductID, orderQuantity) => {
        return new Promise((resolve, rejct) => {
            db.query('SELECT * FROM product WHERE id = ?', orderProductID, function (err, rows) {
                if (rows[0].quantity >= orderQuantity && rows[0].quantity !== 0) {
                    resolve(true)
                } else {
                    resolve(rows[0].name + "庫存不足")
                }
            })
        })
    }
}

function combineSearchCommand(orderID, memberID, productID){
    // combine search string
    var basicString = 'SELECT * FROM order_list WHERE';
    if(orderID > 0){
        basicString += (' order_id = ' + orderID);
    }

    if(memberID > 0){
        if (basicString.substr(basicString.length - 5) !== 'WHERE'){
            basicString += ' AND';
        }
        basicString += (' member_id = ' + memberID);
    }
    
    if(productID > 0){
        if (basicString.substr(basicString.length - 5) !== 'WHERE'){
            basicString += ' AND';
        }
        basicString += (' product_id = ' + productID);
    }
    return basicString
}