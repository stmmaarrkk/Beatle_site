/* Used to purchase */
const db = require('../connection_db');

module.exports = function orderProductListData(orderList) {
    //訂購整筆商品
    let result = {};

    return new Promise(async (resolve, reject) => {
        // 提取orderID
        let orderID = await getOrderID() + 1;

        const products = orderList.productID; //products here is string type
        const productArray = products.split(',');
        // console.log("productArray: " + productArray);
        const quantitys = orderList.quantity;
        const quantityArray = quantitys.split(',');
        // console.log("quantityArray: " + quantityArray);

        //productID與quantity合併成新object
        //array1 [3, 2, 1]
        //array2 [1, 2, 3]
        //merge為object:{
        //  3: 1,
        //  2: 2,
        //  1, 3
        //}

        let productQuantity = {};
        for (let idx = 0; idx < productArray.length; idx++){
            productQuantity[productArray[idx]] = quantityArray[idx];
        }

        let orderAllData = [];
        for (let key in productQuantity) {
        // console.log(orderID);
        const price = await (getProductPrice(key));
        const orderData = {
            order_id: orderID,
            member_id: orderList.memberID,
            product_id: key,
            order_quantity: parseInt(productQuantity[key]),
            order_price: parseInt(price) * parseInt(productQuantity[key]),
            order_date: orderList.orderDate,
            is_complete: 0
        };

        // insert order data.
        db.query('INSERT INTO order_list SET ?', orderData, function (err, rows) {
            if (err) {
            console.log(err);
            result.err = "伺服器錯誤，請稍後在試！"
            reject(result);
            return;
            }
        })
        orderAllData.push(orderData);
        }

        result.state = "訂單建立成功。";
        result.orderData = orderAllData
        resolve(result);
    })
}


//acquire ID
const getOrderID = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT MAX(order_id) AS id FROM order_list', function (err, rows, fields) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(rows[0].id);
      })
    })
  }
// get the price
const getProductPrice = (productID) => {
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