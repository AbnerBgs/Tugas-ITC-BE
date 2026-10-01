const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});