import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "Sign In Required" });
  }
  const { user } = session;
  await db.connectDB();
  const orders = await Order.find({ user: user._id });
  res.send(orders);
};

export default handler;
