import db from "../../../utils/db";
import User from "../../../models/User";
import bcryptjs from "bcryptjs";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.indexOf("@") ||
    !password ||
    password.trim().length < 3
  ) {
    res.status(422).json({ message: "Validation Error" });
    return;
  }
  await db.connectDB();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "User exists already" });
    return;
  }
  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();

  res.status(201).send({
    message: "Created User",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
