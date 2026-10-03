const prisma = require('../config/prisma');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');
const { getPagination, formatPaginatedData } = require('../utils/pagination');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, quota, categoryId } = req.body;

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
    const { search, categoryId, minPrice, maxPrice } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const [events, totalEvents] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    const result = formatPaginatedData(events, totalEvents, page, limit);

    return successResponse(res, 'Successfully retrieved event data', result);
  } catch (error) {
    console.error('[Get All Events Error]', error);
    return errorResponse(res, 'An internal server error occurred.', 500);
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

    if (categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: Number(categoryId) }
      });
      if (!categoryExists) {
        return errorResponse(res, 'Category not found', 404);
      }
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
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
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
    if (error.code === 'P2003') {
      return errorResponse(res, 'Cannot delete event because it has existing bookings', 400);
    }
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