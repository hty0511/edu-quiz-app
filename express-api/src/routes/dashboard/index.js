const express = require('express');
const auth = require('../../middleware/auth');
const {
  getWeeklyStats,
  getDetailStats,
  getQ3Points,
  getVideo,
  getAccumulatedStats,
  getAccumulatedVideo,
  getAccQ3Points,
} = require('../../controllers/dashboard/dashboard');
const {
  getAllstatus,
  getAll,
  getClassAll,
} = require('../../controllers/dashboard/dashboardall');
// const { getDashboards } = require('../../controllers/dashboard/getDashboard');

const router = express.Router();

// Route to create a user, requires authentication and admin privileges
// router.post('/dashboard', test);
// 測試能不能get到message
// router.get('/dashboard', dashboard);
// 這週答題概況
router.get('/weekstatus', auth, getWeeklyStats);
// 詳細答題概況
router.get('/detailstatus', auth, getDetailStats);
// Q3學習指標
router.get('/Q3points', auth, getQ3Points);
// 答對且有看影片
router.get('/video', auth, getVideo);
// 累積至這周
// Q1Q2Q3Q4
router.get('/accstatus', auth, getAccumulatedStats);
// video
router.get('/accvideo', auth, getAccumulatedVideo);
// Q3學習指標
router.get('/accQ3points', auth, getAccQ3Points);
// 整體狀況
router.get('/allstatus', auth, getAllstatus);
// 整體
router.get('/all', auth, getAll);
router.get('/classall', getClassAll);
module.exports = router;
