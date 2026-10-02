const prisma = require('../config/prisma');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, quota, categoryId } = req.body;

    if (!title || !date || !location || price === undefined || quota === undefined || !categoryId) {
      return res.status(400).json({ message: 'All fields are required to be filled in' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price: Number(price),
        quota: Number(quota),
        categoryId: Number(categoryId),
      },
    });

    res.status(201).json({
      message: 'The event was created successfully',
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true, 
      },
    });
    res.json({
      message: 'Successfully retrieved event data',
      data: events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      message: 'Successfully retrieved event details',
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, price, quota, categoryId } = req.body;

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        price: price ? Number(price) : undefined,
        quota: quota ? Number(quota) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    res.json({
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'The event was successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};