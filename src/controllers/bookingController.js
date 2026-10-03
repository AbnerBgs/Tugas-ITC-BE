const prisma = require('../config/prisma');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity || quantity <= 0) {
      return errorResponse(res, 'eventId dan quantity (minimal 1) wajib diisi', 400);
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event) {
      return errorResponse(res, 'Event tidak ditemukan', 404);
    }

    if (event.quota < quantity) {
      return errorResponse(res, `Sisa tiket tidak mencukupi (Tersisa: ${event.quota})`, 400);
    }

    const totalPrice = event.price * Number(quantity);

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId: Number(userId),
          eventId: Number(eventId),
          quantity: Number(quantity),
          totalPrice: Number(totalPrice),
        },
      }),
      prisma.event.update({
        where: { id: Number(eventId) },
        data: {
          quota: {
            decrement: Number(quantity), 
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
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        event: {
          select: { id: true, title: true, price: true },
        },
      },
    });

    return successResponse(res, 'Berhasil mengambil seluruh transaksi', bookings);

  } catch (error) {
    console.error('[Get All Bookings Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
};