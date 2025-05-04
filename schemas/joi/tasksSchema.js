const Joi = require('joi');

// Define the schema for task validation
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  completed: Joi.boolean().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').required()
});

module.exports = { taskSchema };