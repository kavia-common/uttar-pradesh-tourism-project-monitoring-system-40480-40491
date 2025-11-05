const Joi = require('joi');

/**
 * Returns a CRUD controller for a given service with Joi validation.
 */
function crudController(service, schema) {
  return {
    // PUBLIC_INTERFACE
    async list(req, res) {
      /** List with pagination */
      const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
      const offset = parseInt(req.query.offset || '0', 10);
      const rows = await service.findAll(limit, offset);
      return res.json({ items: rows, limit, offset });
    },

    // PUBLIC_INTERFACE
    async get(req, res) {
      /** Get by id */
      const item = await service.findById(req.params.id);
      if (!item) return res.status(404).json({ status: 'error', message: 'Not found' });
      return res.json(item);
    },

    // PUBLIC_INTERFACE
    async create(req, res) {
      /** Create item */
      const { value, error } = schema.validate(req.body);
      if (error) return res.status(400).json({ status: 'error', message: error.message });
      const created = await service.create(value);
      return res.status(201).json(created);
    },

    // PUBLIC_INTERFACE
    async update(req, res) {
      /** Update item */
      const { value, error } = schema.validate(req.body, { allowUnknown: true });
      if (error) return res.status(400).json({ status: 'error', message: error.message });
      const updated = await service.update(req.params.id, value);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Not found' });
      return res.json(updated);
    },

    // PUBLIC_INTERFACE
    async remove(req, res) {
      /** Delete item */
      await service.remove(req.params.id);
      return res.status(204).send();
    },
  };
}

module.exports = crudController;
