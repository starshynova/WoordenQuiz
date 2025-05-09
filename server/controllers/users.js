import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/connectDB.js';
import { ObjectId } from 'mongodb';

const { users } = db;

export const createUser = async (req, res) => {
  try {
    const user = req.body;

    if (typeof user !== 'object') {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user
        )}`,
      });

      return;
    }

    const isEmailAvailable = await getUserByEmail(user.email);
    if (isEmailAvailable) {
      res.status(400).send({ error: 'E-mail already exist' });
      return;
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const newUser = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      words: [],
      created_date: new Date(),
      lastView_date: new Date(),
    };

    const insertedUser = await users.insertOne(newUser);

    return res.status(201).json({
      success: true,
      user: {
        name: insertedUser.name,
        email: insertedUser.email,
        created_date: insertedUser.created_date,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: 'Unable to create user, try again later' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .send({ error: 'Please, provide your e-mail address and password' });
    return;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    res.status(401).send({ error: 'Invalid e-mail address of user' });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).send({ error: 'Invalid e-mail / password combination' });
    return;
  }

  try {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '5h',
    });
    res.status(201).send({ token });
    return;
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
    return;
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, msg: 'Invalid user ID format' });
  }
  try {
    const user = await users.findOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Unable to get user by ID, try again later',
    });
  }
};

export const checkUserEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ error: 'Please, provide your e-mail address' });
    return;
  }

  try {
    const userEmail = await getUserByEmail(email);
    if (userEmail) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    logError(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const getUserByEmail = async (email) => {
  return await users.findOne({ email });
};
