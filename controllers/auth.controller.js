import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import models from "../models/index.js";
import { SignupBodyValidation, LoginBodyValidation } from "../utils/validationSchema.js";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "../config.js";


export const signUp = asyncErrorHandler(async (req) => {
  const { email, name, password } = req.body;
  const { error } = SignupBodyValidation(req.body);
  if (error) throw new Error(error.details.map(err => err.message.replace(/['"]/g, "")), 400);

  const existingAccount = await models.Users.findOne({ email, status: 0 });
  if (existingAccount) throw new Error("User with this email already exists", 409);

  await models.Users({ email, name, password }).save();
  return new Response("Signup successful", null, 200);
})


export const login = asyncErrorHandler(async (req) => {
  const { email, password } = req.body;
  const user = await models.Users.findOne({ email, status: 0 });
  if (!user) throw new Error("Account not found", 400);
  if (!(await user.comparePassword(password))) throw new Error("Invalid Credentials", 400);

  const token = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return new Response("Login successful", null, 200);
})


export const logout = asyncErrorHandler(async (req, res) => {
  // Clear the cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return new Response("Logged out successfully", null, 200);
});