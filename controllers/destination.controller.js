import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import {
  paginationValues,
} from "../helpers/functions.js";
import Account from "../models/Account.js"
import Destination from "../models/Destination.js";
import { DestinationBodyValidation } from "../utils/validationSchema.js";


export const createDestination = asyncErrorHandler(async (req) => {
  const { accountId, url, httpMethod, headers } = req.body;

  const { error } = DestinationBodyValidation(req.body);
  if (error) throw new Error(error.details.map(err => err.message.replace(/['"]/g, '')).join(', '), 400);

  // Check if account exists
  const account = await Account.findOne({ where: { id: accountId, status: 0 } });
  if (!account) throw new Error('Account not found', 404);

  // Create destination
  const destination = await Destination.create({ AccountId: accountId, url, httpMethod, headers });
  console.log(destination);

  return new Response('Destination created successfully', null, 201);
});


export const updateDestination = asyncErrorHandler(async (req) => {
  const { id, accountId, url, httpMethod, headers } = req.body;

  const { error } = DestinationBodyValidation(req.body);
  if (error) throw new Error(error.details.map(err => err.message.replace(/['"]/g, '')).join(', '), 400);

  // Check if account is valid
  const account = await Account.findOne({ where: { id: accountId, status: 0 } });
  if (!account) throw new Error('Account not found', 404);

  // Find destination
  const destination = await Destination.findOne({ where: { id, AccountId: accountId, status: 0 } });
  if (!destination) throw new Error('Destination not found', 404);

  destination.url = url;
  destination.httpMethod = httpMethod;
  destination.headers = headers;

  await destination.save();

  return new Response('Destination updated successfully', null, 200);
});


export const listDestinations = asyncErrorHandler(async (req) => {
  let { skip, limit } = paginationValues(req.query)

  const data = await Destination.findAndCountAll({
    where: { status: 0 },
    offset: skip,
    limit: limit,
    include: [{
      model: Account,
      attributes: ['name', 'email', 'AccountId', 'id'],
      where: { status: 0 },
      required: true
    }],
    order: [['createdAt', 'DESC']]
  });

  return new Response('Destinations fetched successfully', { count: data.count, data: data.rows, }, 200);
});


export const getDestinationById = asyncErrorHandler(async (req) => {
  const { id } = req.params;

  const data = await Destination.findOne({
    where: { id, status: 0 },
    include: [{
      model: Account,
      attributes: ['name', 'email', 'AccountId', 'id'],
      where: { status: 0 },
      required: true
    }]
  });

  if (!data) throw new Error('Destination not found', 404);

  return new Response('Destination fetched successfully', { data }, 200);
});


export const deleteDestination = asyncErrorHandler(async (req) => {
  const { id } = req.params;

  const destination = await Destination.findOne({ where: { id, status: 0 } });

  if (!destination) {
    throw new Error("Destination not found or already deleted", 404);
  }

  // Soft deleting destination
  await destination.update({ status: 1 });

  return new Response("Destination deleted successfully", null, 200);
});


export const getDesignationsByAccount = asyncErrorHandler(async (req) => {
  let { skip, limit } = paginationValues(req.query)
  let { accountId } = req.query
  if (!accountId) throw new Error("Please select an Account", 400);

  const data = await Destination.findAndCountAll({
    where: { status: 0, AccountId: accountId },
    offset: skip,
    limit: limit,
    order: [['createdAt', 'DESC']]
  });

  return new Response('Destinations fetched successfully', { count: data.count, data: data.rows, }, 200);
})