import Product from "../../../models/Product";
import db from "../../../utils/db";

const handler = async (req, res) => {
  await db.connectDB();
  const product = await Product.findById(req.query.id);
  res.send(product);
};

export default handler;
