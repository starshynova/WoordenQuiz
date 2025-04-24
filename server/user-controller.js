import User, { validateUser } from "../models/User.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createUser = async (req, res) => {
  try {
    const user = req.body;

    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user,
        )}`,
      });

      return;
    }

    const errorList = validateUser(user);

    if (errorList.length > 0) {
      return res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    }

    const isEmailAvailable = await getUserByEmail(user.email);
    if (isEmailAvailable) {
      res.status(400).send({ error: "E-mail already exist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const newUser = {
      email: user.email,
      password: hashedPassword,
      first_name: user.first_name,
      ...(user.last_name && { last_name: user.last_name }),
      post_code: user.post_code,
      ...(user.address && { address: user.address }),
      ...(user.city && { city: user.city }),
      created_date: new Date(),
    };

    const insertedUser = await User.create(newUser);

    return res.status(201).json({
      success: true,
      user: {
        email: insertedUser.email,
        first_name: insertedUser.first_name,
        last_name: insertedUser.last_name || null,
        post_code: insertedUser.post_code,
        address: insertedUser.address || null,
        city: insertedUser.city || null,
        created_date: insertedUser.created_date,
      },
    });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to create user, try again later" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .send({ error: "Please, provide your e-mail address and password" });
    return;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    res.status(401).send({ error: "Invalid e-mail address of user" });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).send({ error: "Invalid e-mail / password combination" });
    return;
  }

  try {
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).send({ token });
    return;
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
    return;
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  // eslint-disable-next-line no-undef
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(id);
    res.status(200).json({ success: true, result: user });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get user by ID, try again later",
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Please, provide user ID" });
  }

  if (!user || typeof user !== "object") {
    return res.status(400).json({
      success: false,
      msg: "You need to provide a valid 'user' object.",
    });
  }

  try {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    } else {
      return res.status(200).json({ success: true, user: updatedUser });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to update user, try again later",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line no-undef
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid user ID format" });
  }
  if (!id) {
    res.status(400).send({ error: "Please, provide user ID" });
    return;
  }
  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    } else {
      res.status(200).json({ success: true, user: deletedUser });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to delete user, try again later" });
  }
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
