const router = require('express').Router();
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: 'rzp_test_sIORQ7rW8eT9l1',
  key_secret: "w1ctAq7i7wiWLRWNaRV7e2Qo"
});
router.route('/razorpay/:payment_id/:amount').get((req, res) => {
    const {payment_id } = req.params;
    const amount = req.params.amount;
    instance.payments.capture(payment_id, amount).then((data) => {
      res.json(data);
    }).catch((error) => {
      res.json(error);
    });
});



module.exports = router;