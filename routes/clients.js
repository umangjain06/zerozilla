const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Client = require('../models/client');

// @route    POST api/clients
// @desc     Create a new client for an agency
// @access   Private
router.post(
  '/',
  [
    auth,
    check('agencyId', 'Agency ID is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phoneNumber', 'Phone number is required').not().isEmpty(),
    check('totalBill', 'Total bill is required').not().isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { agencyId, name, email, phoneNumber, totalBill } = req.body;

      // Check if agency exists
      const agency = await Agency.findById(agencyId);
      if (!agency) {
        return res.status(404).json({ message: 'Agency not found' });
      }

      // Create new client object
      const client = new Client({
        agencyId,
        name,
        email,
        phoneNumber,
        totalBill
      });

      // Save client to database
      await client.save();

      res.json(client);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route    GET api/clients
// @desc     Get all clients for an agency
// @access   Private
router.get('/:agencyId', auth, async (req, res) => {
  try {
    const clients = await Client.find({ agencyId: req.params.agencyId });

    if (!clients) {
      return res.status(404).json({ message: 'Clients not found' });
    }

    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    GET api/clients/:id
// @desc     Get client by ID
// @access   Private
router.get('/:agencyId/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if client belongs to the agency
    if (client.agencyId.toString() !== req.params.agencyId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route    PUT api/clients/:id
// @desc     Update client details by ID
// @access   Private
router.put(
    '/:agencyId/:id',
    [
      auth,
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('phoneNumber', 'Phone number is required').not().isEmpty(),
      check('totalBill', 'Total bill is required').not().isEmpty()
    ],
    async (req, res) => {
      const { agencyId, id } = req.params;
      const { name, email, phoneNumber, totalBill } = req.body;
  
      try {
        const agency = await Agency.findById(agencyId);
        if (!agency) {
          return res.status(404).json({ message: 'Agency not found' });
        }
  
        const client = await Client.findById(id);
        if (!client) {
          return res.status(404).json({ message: 'Client not found' });
        }
  
        if (client.agencyId.toString() !== agencyId) {
          return res.status(400).json({ message: 'Client does not belong to this agency' });
        }
  
        client.name = name;
        client.email = email;
        client.phoneNumber = phoneNumber;
        client.totalBill = totalBill;
  
        await client.save();
  
        res.json(client);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
    }
  );
  