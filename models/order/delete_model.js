/* use to delete orders */
const db = require('../connection_db');
const VerifyOrder = require('./verify_order');

verifyOrder = new VerifyOrder();

module.exports = function orderDelete(deleteList) {
    return new Promise(async (resolve, reject) => {
        let result = {};

        // 有幾筆資料就刪除幾次資料
        for (let key in deleteList) {
            let hasData = await verifyOrder.checkOrderData(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
            let hasComplete = await verifyOrder.checkOrderComplete(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
            if (hasData === false) {
                result.status = "Fail to delete order"
                result.err = "找不到該筆資料。"
                reject(result);
            }
            else if (hasComplete === false) {
                result.status = "刪除訂單資料失敗。"
                result.err = "該筆資料已經完成。"
                reject(result);
            } else if (hasData === true && hasComplete === true) {
                db.query('DELETE FROM order_list WHERE order_id = ? and member_id = ? and product_id = ?', [deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID], function (err, rows) {
                    if (err) {
                        console.log(err);
                        result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    result.status = "刪除訂單資料成功。";
                    result.deleteList = deleteList;
                    resolve(result);
                });
            }
        }
    })
}