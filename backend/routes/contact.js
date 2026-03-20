const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

router.post('/', async (req, res) => {
  const {
    from_name, from_phone, from_email,
    inquiry_type, coin_type, coin_weight,
    budget, contact_time, message
  } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }

  try {
    await db.execute(
      'CALL SaveInquiry(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        from_name, from_phone, from_email,
        inquiry_type, coin_type, coin_weight,
        budget, contact_time, message
      ]
    );

    res.json({ success: true, message: 'Inquiry saved!' });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('CALL GetAllInquiries()');
    res.json(rows[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/counts', async (req, res) => {
  try {
    const [rows] = await db.execute('CALL GetCounts()');
    res.json(rows[0][0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const [rows] = await db.execute(
      'CALL SearchInquiries(?)',
      [q || '']
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.get('/filter', async (req, res) => {
  const { status, inquiry_type } = req.query;
  try {
    let rows;

    if (status) {
      [rows] = await db.execute(
        'CALL FilterByStatus(?)',
        [status]
      );
    } else if (inquiry_type) {
      [rows] = await db.execute(
        'CALL FilterByInquiryType(?)',
        [inquiry_type]
      );
    } else {
      [rows] = await db.execute('CALL GetAllInquiries()');
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await db.execute(
      'CALL MarkAsDone(?, ?)',
      [req.params.id, status]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await db.execute(
      'CALL DeleteInquiry(?)',
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;