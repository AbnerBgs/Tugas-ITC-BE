const prisma = require('../config/prisma');

const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'eventId dan quantity (minimal 1) wajib diisi' });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    if (event.quota < quantity) {
      return res.status(400).json({ message: `Sisa tiket tidak mencukupi (Tersisa: ${event.quota})` });
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

    res.status(201).json({
      message: 'Pemesanan tiket berhasil',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.json({
      message: 'Berhasil mengambil riwayat pemesanan',
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.json({
      message: 'Berhasil mengambil seluruh transaksi',
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
};