const Category = require('./category.model');
const { MESSAGES } = require('../program/program.constants'); // reuse messages if needed

class CategoryController {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = { ...req.body, createdBy: userId };
      const category = await Category.create(data);
      return res.status(201).json({ message: 'Category created', category });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const categories = await Category.find({ isDeleted: false }).sort({ displayOrder: 1, createdAt: -1 });
      return res.json({ categories });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id, isDeleted: false });
      if (!category) return res.status(404).json({ message: 'Category not found' });
      return res.json({ category });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const category = await Category.findOneAndUpdate({ _id: id, isDeleted: false }, updates, { new: true });
      if (!category) return res.status(404).json({ message: 'Category not found' });
      return res.json({ message: 'Category updated', category });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: new Date() }, { new: true });
      if (!category) return res.status(404).json({ message: 'Category not found' });
      return res.json({ message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
