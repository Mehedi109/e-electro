import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import { ToastContainer } from "react-toastify";
import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce((prev, current) => prev + current.quantity, 0)
    );
  }, [cart.cartItems]);

  const handleLogout = () => {
    Cookies.remove("cart");
    dispatch({ type: "cart_reset" });
    signOut({ callbackUrl: "/login" });
  };
  return (
    <>
      <Head>
        <title>{title ? title + " - Next Ecommerce" : "Next Ecommerce"}</title>
        <meta name="description" content="Next Ecommerce Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />s
      </Head>
      <ToastContainer position="top-center" limit={1} />
      <div className="flex flex-col min-h-screen justify-between">
        <header>
          <nav className="flex h-12 items-center justify-between px-4 shadow-md">
            <Link href="/" className="text-lg font-bold">
              NextCom
            </Link>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cartItemsCount > 0 && (
                  <span className="bg-red-700 text-white text-xs font-bold ml-1 px-2 py-1 rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg py-10 px-2 mt-3 bg-white">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>{" "}
                    <br />
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/orderHistory"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>{" "}
                    <br />
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="#"
                        onClick={handleLogout}
                      >
                        Logout
                      </DropdownLink>
                    </Menu.Item>{" "}
                    <br />
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex justify-center items-center h-10 shadow-inner">
          <p>Copyright © 2022 NextCom</p>
        </footer>
      </div>
    </>
  );
}
