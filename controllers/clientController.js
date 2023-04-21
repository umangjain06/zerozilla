const Client = require('../models/client');

// Create a new client
const createClient = async (req, res) => {
  const { agencyId, name, email, phoneNumber, totalBill } = req.body;

  try {
    const newClient = new Client({ agencyId, name, email, phoneNumber, totalBill });
    const client = await newClient.save();

    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get client by ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404).json({ message: 'Client not found' });
    } else {
      res.status(200).json(client);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update client by ID
const updateClientById = async (req, res) => {
  const { agencyId, name, email, phoneNumber, totalBill } = req.body;

  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { agencyId, name, email, phoneNumber, totalBill }, { new: true });
    if (!client) {
      res.status(404).json({ message: 'Client not found' });
    } else {
      res.status(200).json(client);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get the agency and client with the highest total bill
const getTopClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ totalBill: 'desc' }).limit(1);
    const topClient = clients[0];
    const agency = await Agency.findById(topClient.agencyId);
    const response = {
      agencyName: agency.name,
      clientName: topClient.name,
      totalBill: topClient.totalBill,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClientById,
  getTopClients,
};
