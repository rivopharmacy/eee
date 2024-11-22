const { Router } = require('express');
const { checkToken } = require('../middlewares/check_token');
const { sendPushNotificationToAll } = require('../controllers/notification');

const router = Router();

router.post('/', checkToken,async (req, res) => {
    try {
      const { title, body, data } = req.body; 
      const result = await sendPushNotificationToAll(title, body, data);
  
      res.status(200).json({
        message: "Notifications sent successfully",
        successCount: result.success,
        failureCount: result.failed,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = { notifyUsersRouter: router };
