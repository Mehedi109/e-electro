import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../components/Layout";
import { getError } from "../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "fetch_request":
      return { ...state, loading: true, error: "" };
    case "fetch_success":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "fetch_fail":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderHistory() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "fetch_request" });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: "fetch_success", payload: data });
      } catch (error) {
        dispatch({ type: "fetch_fail", payload: getError(error) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="px-5 text-left">Date</th>
                <th className="px-5 text-left">Total</th>
                <th className="px-5 text-left">Paid</th>
                <th className="px-5 text-left">Delivered</th>
                <th className="px-5 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5">{order._id.substring(20, 24)}</td>
                  <td className="p-5">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-5">{order.totalPrice}</td>
                  <td className="p-5">
                    {order.isPaid
                      ? `{order.paidAt.substring(0,10)}`
                      : "Not Paid"}
                  </td>
                  <td className="p-5">
                    {order.isDelivered
                      ? `{order.deliveredAt.substring(0,10)}`
                      : "Not Delivered"}
                  </td>
                  <td className="p-5">
                    <Link href={`/order/${order._id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
