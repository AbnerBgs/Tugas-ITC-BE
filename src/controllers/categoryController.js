const prisma = require('../config/prisma');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return errorResponse(res, 'Category name is required', 400);
        }

        const category = await prisma.category.create({
            data: { name },
        });

        return createdResponse(res, 'Category created successfully', category);
    } catch (error) {
        console.error('[Create Category Error]', error);
        return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        
        return successResponse(res, 'Successfully retrieved category data', categories);
    } catch (error) {
        console.error('[Get All Categories Error]', error);
        return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
    }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return errorResponse(res, 'Category name is required', 400);
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCategory) {
      return errorResponse(res, 'Category not found', 404);
    }

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return successResponse(res, 'Category updated successfully', category);
  } catch (error) {
    console.error('[Update Category Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCategory) {
      return errorResponse(res, 'Category not found', 404);
    }

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return successResponse(res, 'Category successfully deleted', null);
  } catch (error) {
    console.error('[Delete Category Error]', error);
    return errorResponse(res, 'An internal server error occurred. Please try again later.', 500);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};