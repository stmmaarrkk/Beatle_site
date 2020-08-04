const Check = require('../../service/member_check');

const verify = require('../../models/member/verification');
const orderData = require('../../models/order/all_order_model');
const orderOneData = require('../../models/order/one_order_model');

check = new Check();

module.exports = class GetOrder {
    // 取得全部訂單資料
    getAllOrder(req, res, next) {
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
                    orderData().then(result => {
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
    // 取得單筆產品資料
    getOneOrder(req, res, next) {
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

                    orderOneData(memberID).then(result => {
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