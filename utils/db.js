import mongoose from "mongoose";

const connection = {};

async function connectDB() {
  const { connection } = mongoose.connect(process.env.MONGO_URI);
  // const db = mongoose.connect(process.env.MONGO_URI);
  // if (db) {
  //   console.log("connected", db);
  // }
  if (mongoose.connections[0].readyState) {
    console.log("connected db", connection);
  } else {
    console.log("not connected");
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connectDB, convertDocToObj };
export default db;

// async function connectDB() {
//   if (connection.isConnected) {
//     console.log("already connected");
//     return;
//   }
//   if (mongoose.connections.length > 0) {
//     connection.isConnected = mongoose.connections[0].readyState;
//     if (connection.isConnected === 1) {
//       console.log("previous connection");
//       return;
//     }
//     await mongoose.disconnect();
//   }
//   const db = mongoose.connect(process.env.MONGO_URI);
//   connection.isConnected = db.connections[0].readyState;
// }

// async function disconnect() {
//   if (connection.isConnected) {
//     if (process.env.NODE_ENV === "production") {
//       await mongoose.disconnect();
//       connection.isConnect = false;
//     } else {
//       console.log("not disconnected");
//     }
//   }
// }

// const db = { connectDB, disconnect };
// export default db;
