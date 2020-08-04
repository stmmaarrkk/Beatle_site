const db = require('../connection_db');

module.exports = function customerEdit(id, memberUpdateData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('UPDATE member SET ? WHERE id = ?', [memberUpdateData, id], function (err, rows) {
            if (err) {
                console.log(err);
                result.status = "Update failed"
                result.err = "Server fail, please try a again later!"
                reject(result);
                return;
            }
            result.status = "Member info update success!"
            result.memberUpdateData = memberUpdateData
            resolve(result)
        })
    })
}