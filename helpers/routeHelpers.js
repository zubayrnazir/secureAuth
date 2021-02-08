const joi = require('@hapi/joi')


module.exports = {

  schemas: {
    authSchema: joi.object({
      username: joi.string()
        .email()
        .required(),

      password: joi.string().min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })

  },

  validateBody: (schema) => {

    return (req, res, next) => {


      const result = schema.validate(req.body);
      console.log(result)
      if (result.error) {
        return res.status(400).json(result.error)
      }

      if (!req.value) { req.value = {} }
      req.value['body'] = result.value
      next()

    }

  },

}