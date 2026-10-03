const prisma = require('../config/prisma');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: { name },
    });

    return createdResponse(res, 'Category created successfully', category);
  } catch (error) {
    if (error.code === 'P2002') {
      return errorResponse(res, 'Category name already exists', 400);
    }
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
    if (error.code === 'P2002') {
      return errorResponse(res, 'Category name already exists', 400);
    }
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
    if (error.code === 'P2003') {
      return errorResponse(res, 'Cannot delete category because it is linked to active events', 400);
    }
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