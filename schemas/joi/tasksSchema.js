const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  completed: Joi.boolean().strict().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').required()
});

module.exports = { taskSchema };