const express = require('express');
const router = express.Router();

// POST /api/family/:familyId/book-restaurant  (stub)
router.post('/:familyId/book-restaurant', async (req, res) => {
  const { familyId } = req.params;
  const { date, time, people } = req.body;
  // Here we would call a restaurant booking adapter or service.
  await new Promise((r) => setTimeout(r, 200));
  console.log(`[FamilyTask] Book restaurant for family ${familyId}`);
  res.json({ success: true, familyId, date, time, people });
});

module.exports = router; 