const express = require('express');
const {
  getResolutions,
  getResolutionById,
  createResolution,
  updateResolution,
  deleteResolution,
  getPendingResolutions,
  createPendingResolution,
  acceptPendingResolution,
  rejectPendingResolution,
  getRecentlyViewed,
  addRecentlyViewed,
  clearRecentlyViewed,
} = require('../controllers/resolutionController');

const router = express.Router();

router.get('/resolutions', getResolutions);
router.get('/resolutions/:id', getResolutionById);
router.post('/resolutions', createResolution);
router.put('/resolutions/:id', updateResolution);
router.delete('/resolutions/:id', deleteResolution);

router.get('/pending-resolutions', getPendingResolutions);
router.post('/pending-resolutions', createPendingResolution);
router.post('/pending-resolutions/:id/accept', acceptPendingResolution);
router.post('/pending-resolutions/:id/reject', rejectPendingResolution);

router.get('/recently-viewed', getRecentlyViewed);
router.post('/recently-viewed', addRecentlyViewed);
router.delete('/recently-viewed', clearRecentlyViewed);

module.exports = router;
