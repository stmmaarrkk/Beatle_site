/* Used to get order list */
const db = require('../connection_db');

module.exports = function getAllOrderData() {
    let result = {}
    return new Promise((resolve, reject) =>{
        db.query("SELECT * FROM order_list", (err, rows) => {
            if (err){ //server error or mysql sytax error
                result.status = "Getting order list failed";
                result.err = "Server fail, please try again later";
                reject(result);
                return;
            } else{
                resolve(rows);  
            }
        })
    })
}