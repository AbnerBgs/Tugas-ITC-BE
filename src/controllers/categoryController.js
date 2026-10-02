const prisma = require('../config/prisma');

const createCategory = async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({message: ''});
        }

        const category = await prisma.category.create({
            data: {name},
        });

        res.status(201).json({
            message: 'The category name is mandatory',
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
            message : 'Successfully retrieved category data',
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
      message: 'Category updated successfully',
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

    res.json({ message: 'Category successfully deleted' });
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