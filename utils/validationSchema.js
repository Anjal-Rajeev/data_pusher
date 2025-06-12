import Joi from "joi";

export const AccountBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Account Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email")
      .messages({
        "any.required": "{{#label}} is required",
        "string.email": "{{#label}} must be valid",
      }),
  }).unknown(true);
  return schema.validate(body);
};


export const DestinationBodyValidation = (body) => {
  const schema = Joi.object({
    url: Joi.string().uri().required().label("URL"),
    httpMethod: Joi.string().valid('GET', 'POST', 'PUT').required().label("HTTP Method"),
    headers: Joi.object()
      .pattern(Joi.string(), Joi.string())
      .required()
      .label("Headers"),
    accountId: Joi.number().required().label("Account ID")
  }).unknown(true);

  return schema.validate(body);
};

export const SignupBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().label("Password"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email")
      .messages({
        "any.required": "{{#label}} is required",
        "string.email": "{{#label}} must be valid",
      }),
  }).unknown(true);
  return schema.validate(body);
};

export const LoginBodyValidation = (body) => {
  const schema = Joi.object({
    password: Joi.string().required().label("Password"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email")
      .messages({
        "any.required": "{{#label}} is required",
        "string.email": "{{#label}} must be valid",
      }),
  }).unknown(true);
  return schema.validate(body);
};