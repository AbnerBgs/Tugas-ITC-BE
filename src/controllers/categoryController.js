const prisma = require('../config/prisma');

const createCategory = async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({message: 'Nama kategori wajib di isi'});
        }

        const category = await prisma.category.create({
            data: {name},
        });

        res.status(201).json({
            message: 'Kategori berhasil dibuat',
            data: category,
        });
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json({
            message : 'Berhasil mengambil data kategori',
            data: categories,
        });
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json({
      message: 'Kategori berhasil diperbarui',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};