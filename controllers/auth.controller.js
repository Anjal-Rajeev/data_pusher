import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import models from "../models/index.js";
import { SignupBodyValidation, LoginBodyValidation } from "../utils/validationSchema.js";


export const signUp = asyncErrorHandler(async (req) => {
  const { email, name, password } = req.body;
  const { error } = SignupBodyValidation(req.body);
  if (error) throw new Error(error.details.map(err => err.message.replace(/['"]/g, "")), 400);

  const existingAccount = await models.Users.findOne({ email, status: 0 });
  if (existingAccount) throw new Error("User with this email already exists", 409);

  await models.Users({ email, name, password }).save();
  return new Response("Signup successful", null, 200);
})


export const updateAccount = asyncErrorHandler(async (req) => {
  const { id, email, name, website } = req.body;
  const { error } = AccountBodyValidation(req.body);
  if (error) throw new Error(error.details.map(err => err.message.replace(/['"]/g, "")), 400);

  // Checking if the account exists or not
  const account = await Account.findOne({
    where: { id, status: 0 },
  });
  if (!account) throw new Error("Account not found", 404);

  // Checking for duplicate accounts
  const existingAccount = await Account.findOne({
    where: { email, status: 0, id: { [Op.ne]: id } },
  });
  if (existingAccount) throw new Error("An account with this email already exists", 409);

  account.email = email;
  account.name = name;
  account.website = website;

  await account.save();

  return new Response("Account updated successfully", null, 200);
})

