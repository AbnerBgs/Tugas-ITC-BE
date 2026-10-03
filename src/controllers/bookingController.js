const prisma = require('../config/prisma');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');
const { getPagination, formatPaginatedData } = require('../utils/pagination');

const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { eventId, quantity } = req.body;

    const parsedEventId = Number(eventId);
    const parsedQuantity = Number(quantity);

    const event = await prisma.event.findUnique({
      where: { id: parsedEventId },
    });

    if (!event) {
      return errorResponse(res, 'Event tidak ditemukan', 404);
    }

    if (event.quota < parsedQuantity) {
      return errorResponse(res, `Sisa tiket tidak mencukupi (Tersisa: ${event.quota})`, 400);
    }

    const totalPrice = event.price * parsedQuantity;

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId: Number(userId),
          eventId: parsedEventId,
          quantity: parsedQuantity,
          totalPrice: Number(totalPrice),
        },
      }),
      prisma.event.update({
        where: { id: parsedEventId },
        data: {
          quota: {
            decrement: parsedQuantity, 
          },
        },
      }),
    ]);

    return createdResponse(res, 'Pemesanan tiket berhasil', booking);

  } catch (error) {
    console.error('[Create Booking Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId: Number(userId) },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            location: true,
            price: true,
          },
        },
      },
    });

    return successResponse(res, 'Berhasil mengambil riwayat pemesanan', bookings);

  } catch (error) {
    console.error('[Get My Bookings Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { search, eventId, startDate, endDate } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const where = {};

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      };
    }

    if (eventId) {
      where.eventId = Number(eventId);
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [bookings, totalBookings] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          event: {
            select: { id: true, title: true, price: true, date: true },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const result = formatPaginatedData(bookings, totalBookings, page, limit);

    return successResponse(res, 'Successfully retrieved all booking records', result);
  } catch (error) {
    console.error('[Get All Bookings Admin Error]', error);
    return errorResponse(res, 'An internal server error occurred.', 500);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      return errorResponse(res, 'Pemesanan tidak ditemukan', 404);
    }

    const isAdmin = userRole === 'ADMIN';
    const isOwner = booking.userId === Number(userId);

    if (!isAdmin && !isOwner) {
      return errorResponse(res, 'Akses ditolak: Anda tidak berhak membatalkan pemesanan ini', 403);
    }

    await prisma.$transaction([
      prisma.booking.delete({
        where: { id: Number(id) },
      }),
      prisma.event.update({
        where: { id: booking.eventId },
        data: { quota: { increment: booking.quantity } },
      }),
    ]);

    return successResponse(res, 'Pemesanan berhasil dibatalkan', null);
  } catch (error) {
    console.error('[Cancel Booking Error]', error);
    return errorResponse(res, 'An internal server error occurred.', 500);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};