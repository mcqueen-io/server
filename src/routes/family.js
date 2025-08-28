const express = require('express');
const router = express.Router();
const { makeError } = require('../utils/errors');

// POST /api/family/:familyId/book-restaurant  (stub)
router.post('/:familyId/book-restaurant', async (req, res, next) => {
  const { familyId } = req.params;
  const { date, time, people } = req.body;
  // Here we would call a restaurant booking adapter or service.
  try {
    const { sleep } = require('../utils/sleep');
    await sleep(200);
    console.log(`[FamilyTask] Book restaurant for family ${familyId}`);
    res.json({ success: true, familyId, date, time, people });
  } catch (err) {
    next(makeError('FAMILY_TASK_FAILED', 'Failed to book restaurant', 500));
  }
});

module.exports = router; 