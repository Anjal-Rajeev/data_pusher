import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import {
  paginationValues,
} from "../helpers/functions.js";
import models from "../models/index.js";
import { AccountBodyValidation } from "../utils/validationSchema.js";


export const createAccount = asyncErrorHandler(async (req) => {
  const { email, name, website } = req.body;
  const { error } = AccountBodyValidation(req.body);
  if (error) throw new Error(error.details.map(err => err.message.replace(/['"]/g, "")), 400);

  const existingAccount = await models.Account.findOne({
    where: { email, status: 0 },
  });
  if (existingAccount) throw new Error("An account with this email already exists", 409);

  const account = await Account.create({ email, name, website });
  console.log("account", account);
  return new Response("Account created successfully", null, 200);
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


export const listAllAccounts = asyncErrorHandler(async (req) => {
  let { skip, limit } = paginationValues(req.query);

  const data = await Account.findAndCountAll({
    where: { status: 0 },
    offset: skip,
    limit: limit,
    order: [['createdAt', 'DESC']],
  });

  return new Response("Accounts fetched", { count: data.count, data: data.rows, }, 200);
})


export const listOneAccount = asyncErrorHandler(async (req) => {
  let { id } = req.params

  const data = await Account.findOne({
    where: { status: 0, id },
  });

  return new Response("Account fetched", { data }, 200);
})


export const deleteAccount = asyncErrorHandler(async (req) => {
  const { id } = req.params;

  const account = await Account.findOne({ where: { id, status: 0 } });

  if (!account) {
    throw new Error("Account not found or already deleted", 404);
  }

  // Soft deleting account
  await account.update({ status: 1 });

  // Soft deleting all associated destinations
  await Destination.update(
    { status: 1 },
    { where: { AccountId: id, status: 0 } }
  );

  return new Response("Account deleted successfully", null, 200);
});