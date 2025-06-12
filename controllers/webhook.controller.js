import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import Account from "../models/Account.js"
import Destination from "../models/Destination.js";
import axios from "axios";


export const incomingDataHandler = asyncErrorHandler(async (req, res) => {
  // Only accept POST requests with JSON
  if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
    throw new Error("Invalid Data", 400);
  }

  // Get the secret key
  const appSecretToken = req.headers['cl-x-token'];
  console.log(appSecretToken);
  
  if (!appSecretToken) throw new Error("Un Authenticate", 401);

  // Find the account by secret token
  const account = await Account.findOne({ where: { appSecretToken: appSecretToken, status: 0 } });
  if (!account) throw new Error("Un Authenticate", 401);

  const destinations = await Destination.findAll({
    where: { AccountId: account.id, status: 0 }
  });

  // Forward data to each destination
  const sendPromises = destinations.map(destination => {
    const method = destination.httpMethod.toLowerCase();
    const url = destination.url;

    const config = {
      method,
      url,
      headers: destination.headers || {}
    };

    if (method === 'get') {
      config.params = req.body;
    } else {
      config.data = req.body;
    }

    return axios(config).catch(error => {
      console.error(`Error forwarding to ${url}:`, error.message);
    });
  });

  await Promise.all(sendPromises);

  return new Response("Data forwarded successfully", null, 200);
});