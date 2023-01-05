import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import db from "../../utils/db";
import { Store } from "../../utils/Store";

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);

  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  const handleAddToCart = async () => {
    const existItem = state.cart.cartItems.find(
      (pd) => pd.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      alert("Sorry Product is out of stock");
      return;
    }
    dispatch({ type: "cart_add", payload: { ...product, quantity } });
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back To Products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.img}
            alt={product.name}
            width={640}
            height={640}
            // layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>{product.category}</li>
            <li>{product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>{product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>
                {product.countInStock > 0 ? " In Stock" : "Unavailable"}
              </div>
            </div>
            <button className="primary-button w-full" onClick={handleAddToCart}>
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connectDB();

  const product = await Product.findOne({ slug }).lean();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    }, // will be passed to the page component as props
  };
}
