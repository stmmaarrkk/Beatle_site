const Check = require('../../service/member_check');
const verify = require('../../models/member/verification');
const orderProduct = require('../../models/order/order_product_model');
const updateOrder = require('../../models/order/update_model');
const deleteSeveralOrder = require('../../models/order/delete_model');
const addOnCertainOrder = require('../../models/order/add_on_certain_order_model')


check = new Check();

module.exports = class ModifyOrder {
    // 訂整筆訂單
    postOrderProduct(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "Please input token！"
            })
        } else {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "Wrong token",
                            err: "Please login again"
                        }
                    })
                } else {
                    const memberID = tokenResult;
                    const orderList = {
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderDate: onTime(),
                    }
                    orderProduct(orderList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }

    putUpdateOrder(req, res, next){
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "Please input token！"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "Wrong token",
                            err: "Please login again"
                        }
                    })
                } else {
                    const memberID = tokenResult;
                    const updateList = {
                        memberID: memberID,
                        orderID: req.body.orderID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderDate: onTime(),
                    }
                    updateOrder(updateList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }

    deleteOrder(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "Please input token！"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "Wrong token",
                            err: "Please login again"
                        }
                    })
                } else {
                    // 取得欲刪除的資料
                    const orderID = req.body.orderID;
                    const memberID = tokenResult;
                    
                    // 防呆處理，去處空白
                    const productID = req.body.productID.replace(" ", "");
                    const splitProductID = productID.split(",");
    
                    let deleteList = [];
    
                    // 重整成資料庫可辨識的順序
                    for (let i = 0; i < splitProductID.length; i += 1) {
                        deleteList.push({orderID: orderID, memberID: memberID, productID: splitProductID[i]});
                    }
                    deleteSeveralOrder(deleteList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }

    postAddOnCertainOrder(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    // 提取要新增的單筆資料
                    const memberID = tokenResult;
                    const orderOneList = {
                        orderID: req.body.orderID,
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        createDate: onTime()
                    }
                    addOnCertainOrder(orderOneList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
}

//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}