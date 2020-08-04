const db = require('../connection_db');
const VerifyOrder = require('./verify_order');
const ProductTools = require('../product/tools');

verifyOrder = new VerifyOrder();
productTools = new ProductTools();

module.exports = function postAddOneCertainOrder(orderOneList) {
    let result = {};
    return new Promise(async (resolve, reject) => {

        const hasData = await verifyOrder.checkOrderData(orderOneList.orderID, orderOneList.memberID, orderOneList.productID);

        const hasComplete = await verifyOrder.checkOrderComplete(orderOneList.orderID);

        if (hasData === true) {
            result.status = "新增單筆訂單資料失敗。"
            result.err = "已有該筆訂單資料！"
            reject(result)
        } else if (hasComplete === true){
            result.status = "新增單筆訂單資料失敗。"
            result.err = "該筆訂單已經完成。"
            reject(result)
        } else if (hasData === false) {

            const price = await productTools.getProductPrice(orderOneList.productID);

            const orderList = {
                order_id: orderOneList.orderID,
                member_id: orderOneList.memberID,
                product_id: orderOneList.productID,
                order_quantity: orderOneList.quantity,
                order_price: orderOneList.quantity * price,
                is_complete: 0,
                order_date: orderOneList.createDate
            }

            db.query('INSERT INTO order_list SET ?', orderList, function (err, rows) {
                // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
                if (err) {
                    console.log(err);
                    result.status = "新增單筆訂單資料失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
                result.status = "新增單筆訂單資料成功。"
                result.orderList = orderList
                resolve(result);
            })
        }
    })
}