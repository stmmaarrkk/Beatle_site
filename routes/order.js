var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order/modify_controller');
const OrderGetMethod = require('../controllers/order/get_controller');

orderModifyMethod = new OrderModifyMethod();
orderGetMethod = new OrderGetMethod();

//purchase
router.post('/order', orderModifyMethod.postOrderProduct);

//get whole order list
router.get('/order', orderGetMethod.getAllOrder);

//get a certain member order list
router.get('/order/member', orderGetMethod.getOneOrder);

// update order contents
router.put('/order', orderModifyMethod.putUpdateOrder);

// delete order
router.delete('/order', orderModifyMethod.deleteOrder);

// add an extra quantity on a certain order
router.post('/order/addoncertainorder', orderModifyMethod.postAddOnCertainOrder);

// complete order
router.put('/order/complete', orderModifyMethod.putProductComplete);


module.exports = router;