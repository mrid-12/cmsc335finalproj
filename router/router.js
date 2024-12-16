// router/router.js
const express = require('express');
const userController = require('../api/links/user.js');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.post('/register', async(req,res) => {
    await userController.saveApplication(req.body);
    res.render('index');
});
router.get('/leaderboard', async (req,res) => {
    const users = await userController.getLeaderboard();
    res.render('leaderboard', { users: users });
});

module.exports = router;
