/* Update an order*/
const db = require('../connection_db');
const VerifyOrder = require('./verify_order');
const ProductTools = require('../product/tools');

verifyOrder = new VerifyOrder();
productTools = new ProductTools();

module.exports = function orderEdit(updateList) {
    let result = {};
    return new Promise(async (resolve, reject) => {

        // 判斷有沒有該筆訂單資料
        const hasData = await verifyOrder.checkOrderData(updateList.orderID, updateList.memberID, updateList.productID);

        // 判斷該筆訂單資料是否已完成交易
        const hasComplete = await verifyOrder.checkOrderComplete(updateList.orderID, updateList.memberID, updateList.productID);

        if (hasData === false) {
            result.status = "Fail to update order list"
            result.err = "This order doesn't exist!"
            reject(result);
        } else if (hasComplete === false) {
            result.status = "Fail to update order list"
            result.err = "This order has been complete!"
            reject(result);
        } else if (hasData === true && hasComplete === true) {
            // 取得商品價錢
            const price = await productTools.getProductPrice(updateList.productID);

            // 計算商品總價格
            const orderPrice = updateList.quantity * price;

            // 更新該筆訂單資料（資料庫）
            await db.query('UPDATE order_list SET order_quantity = ?, order_price = ?, update_date = ? WHERE order_id = ? AND member_id = ? AND product_id = ?', [updateList.quantity, orderPrice, updateList.updateDate, updateList.orderID, updateList.memberID, updateList.productID], function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "Fail to update order list"
                    result.err = "Server failed, please update again later."
                    reject(result);
                    return;
                }
                result.status = "Update order successfully"
                result.updateList = updateList
                resolve(result)
            })
        }
    })
}

