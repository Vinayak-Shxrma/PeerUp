import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET || "secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

export const generateToken = (user) => {
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
