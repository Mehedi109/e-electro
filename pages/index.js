// import { Inter } from "@next/font/google";
import axios from "axios";
import { useContext } from "react";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";

// const inter = Inter({ subsets: ["latin"] });

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const handleAddToCart = async (product) => {
    const existItem = cart.cartItems.find((pd) => pd.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      alert("Sorry Product is out of stock");
      return;
    }
    dispatch({ type: "cart_add", payload: { ...product, quantity } });
  };

  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            handleAddToCart={handleAddToCart}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connectDB();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
