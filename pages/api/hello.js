// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDB from "../../utils/db";
import db from "../../utils/db";
// import connect from "../../utils/db";

// import { connect } from "mongoose";
// import connect from "../../utils/db";

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

// connectDB();
connectDB();
