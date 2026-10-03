const prisma = require('../config/prisma');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, quota, categoryId } = req.body;

    if (!title || !date || !location || price === undefined || quota === undefined || !categoryId) {
      return errorResponse(res, 'All fields are required to be filled in', 400);
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) }
    });

    if (!categoryExists) {
      return errorResponse(res, 'Category not found', 404);
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

    return createdResponse(res, 'The event was created successfully', event);
  } catch (error) {
    console.error('[Create Event Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true, 
      },
    });
    
    return successResponse(res, 'Successfully retrieved event data', events);
  } catch (error) {
    console.error('[Get All Events Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
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
      return errorResponse(res, 'Event not found', 404);
    }

    return successResponse(res, 'Successfully retrieved event details', event);
  } catch (error) {
    console.error('[Get Event By ID Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, price, quota, categoryId } = req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!existingEvent) {
      return errorResponse(res, 'Event not found', 404);
    }

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        price: price !== undefined ? Number(price) : undefined,
        quota: quota !== undefined ? Number(quota) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    return successResponse(res, 'Event updated successfully', event);
  } catch (error) {
    console.error('[Update Event Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!existingEvent) {
      return errorResponse(res, 'Event not found', 404);
    }

    await prisma.event.delete({
      where: { id: Number(id) },
    });

    return successResponse(res, 'The event was successfully deleted', null);
  } catch (error) {
    console.error('[Delete Event Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};