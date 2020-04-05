const router = require('express').Router();
const subscriptionHandler = require('../subscriptionHandler')

router.route('/subscription').post(subscriptionHandler.handlePushNotificationSubscription);

router.route('/subscription/:id').get(subscriptionHandler.sendPushNotification);

module.exports = router;