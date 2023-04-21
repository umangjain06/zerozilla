const express = require('express');
const router = express.Router();
const Agency = require('../models/agency');
const Client = require('../models/client');
const auth = require('../middlewares/auth');

// Create an agency and a client in a single request
router.post('/', auth, async (req, res) => {
  try {
    // Create the agency
    const agency = new Agency({
      name: req.body.name,
      address1: req.body.address1,
      address2: req.body.address2,
      state: req.body.state,
      city: req.body.city,
      phoneNumber: req.body.phoneNumber,
    });
    const savedAgency = await agency.save();

    // Create the client
    const client = new Client({
      name: req.body.clientName,
      agencyId: savedAgency._id,
      email: req.body.email,
      phoneNumber: req.body.clientPhoneNumber,
      totalBill: req.body.totalBill,
    });
    const savedClient = await client.save();

    res.status(201).json({ agency: savedAgency, client: savedClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a client's details
router.put('/clients/:clientId', auth, async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.clientId,
      {
        name: req.body.clientName,
        email: req.body.email,
        phoneNumber: req.body.clientPhoneNumber,
        totalBill: req.body.totalBill,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(updatedClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get the top client(s) for each agency
router.get('/top-clients', auth, async (req, res) => {
  try {
    const topClients = await Client.aggregate([
      {
        $group: {
          _id: '$agencyId',
          maxTotalBill: { $max: '$totalBill' },
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: '_id',
          foreignField: '_id',
          as: 'agency',
        },
      },
      {
        $unwind: '$agency',
      },
      {
        $lookup: {
          from: 'clients',
          let: { agencyId: '$_id', maxTotalBill: '$maxTotalBill' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$agencyId', '$$agencyId'] },
                    { $eq: ['$totalBill', '$$maxTotalBill'] },
                  ],
                },
              },
            },
          ],
          as: 'topClients',
        },
      },
      {
        $project: {
          _id: 0,
          agencyName: '$agency.name',
          topClients: {
            $map: {
              input: '$topClients',
              as: 'client',
              in: {
                clientName: '$$client.name',
                totalBill: '$$client.totalBill',
              },
            },
          },
        },
      },
    ]);
    res.json(topClients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
}
});

module.exports = router;