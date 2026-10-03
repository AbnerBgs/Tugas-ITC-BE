const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorResponse } = require('./utils/response'); // <-- Import helper response

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    return errorResponse(res, 'Invalid JSON payload', 400);
  }

  console.error('[Unhandled Error]', error);
  return errorResponse(res, 'An internal server error occurred. Please try again later.', error.status || 500);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});