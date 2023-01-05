import Product from "../../models/Product";
import User from "../../models/User";
import data from "../../utils/data";
// import connectDB from "../../utils/db";
import db from "../../utils/db";

const handler = async (req, res) => {
  await db.connectDB();
  // await connectDB();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  // await db.disconnect();
  res.send({ message: "success" });
  // }
};

export default handler;
