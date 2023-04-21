const Agency = require('../models/agency');
const Client = require('../models/client');

// Create a new agency and client in a single request
const createAgencyAndClient = async (req, res) => {
  const { name, address1, address2, state, city, phoneNumber, clientName, email, clientPhoneNumber, totalBill } = req.body;

  try {
    // Create new agency
    const newAgency = new Agency({ name, address1, address2, state, city, phoneNumber });
    const agency = await newAgency.save();

    // Create new client associated with the agency
    const newClient = new Client({ agencyId: agency._id, name: clientName, email, phoneNumber: clientPhoneNumber, totalBill });
    const client = await newClient.save();

    res.status(201).json({ agency, client });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all agencies
const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get agency by ID
const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) {
      res.status(404).json({ message: 'Agency not found' });
    } else {
      res.status(200).json(agency);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update agency by ID
const updateAgencyById = async (req, res) => {
  const { name, address1, address2, state, city, phoneNumber } = req.body;

  try {
    const agency = await Agency.findByIdAndUpdate(req.params.id, { name, address1, address2, state, city, phoneNumber }, { new: true });
    if (!agency) {
      res.status(404).json({ message: 'Agency not found' });
    } else {
      res.status(200).json(agency);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createAgencyAndClient,
  getAllAgencies,
  getAgencyById,
  updateAgencyById,
};
