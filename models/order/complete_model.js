const db = require('../connection_db');
const OrderTools = require('./tools');
const ProductTools = require('../product/tools');

orderTools = new OrderTools();
productTools = new ProductTools();

module.exports = function orderComplete(orderID, memberID) {
    let result = {};
    return new Promise(async (resolve, reject) => {

        const hasData = await orderTools.checkOrderData(orderID, memberID);

        const hasComplete = await orderTools.checkOrderComplete(orderID);

        if (hasData === false) {
            result.status = "訂單完成失敗。"
            result.err = "沒有該訂單資料！"
            reject(result)
        } else if (hasComplete === false) {
            result.status = "訂單完成失敗。"
            result.err = "該訂單已經完成。"
            reject(result)
        } else if (hasData === true && hasComplete === true) {
            // 取得order_list的table資料
            const orderData = await orderTools.getOrderData(orderID, memberID);

            // 提取商品id
            const productID = orderData[0].product_id;

            // 依序確認訂單中的商品是否有庫存
            for (let key in orderData) {
                const hasStock = await orderTools.checkOrderStock(orderData[key].product_id, orderData[key].order_quantity);
                if (hasStock !== true) {
                    result.status = "訂單完成失敗。"
                    result.err = hasStock
                    reject(result);
                    return;
                }
            }

            // 將商品庫存扣除
            await db.query('UPDATE product, order_list SET product.quantity = product.quantity - order_list.order_quantity WHERE order_list.product_id = product.id and order_list.order_id = ?;', orderID, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            // 將is_complete的訂單狀態改為1
            await db.query('UPDATE order_list SET is_complete = 1 WHERE order_id = ?', orderID, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })
            
            /*
            // 寄送Email通知

            const memberData = await getMemberData(memberID);

            const mailOptions = {
                from: `"企鵝購物網" <${config.senderMail.user}>`, // 寄信
                to: memberData.email, // 收信
                subject: memberData.name + '您好，您所購買的訂單已經完成。',  // 主旨
                html: `<p>Hi, ${memberData.name} </p>` + `<br>` + `<br>` + `<span>感謝您訂購<b>企鵝購物網</b>的商品，歡迎下次再來！</span>` // 內文
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return console.log(err);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            })
            
            result.status = "訂單編號：" + orderID + " 付款已完成，謝謝您使用該服務！詳細的訂單資訊已寄送至 " + memberData.email;
            */
            result.status = "訂單編號：" + orderID + " 付款已完成，謝謝您使用該服務！";
            resolve(result);
        }
    })
}