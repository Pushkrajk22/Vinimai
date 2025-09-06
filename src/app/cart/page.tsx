'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'
import { countdownTime } from '@/store/countdownTime'
import axios from 'axios'
import ProtectedRoute from '@/components/ProtectedRoutes/ProtectedRoutes'
import PayUFormStatic from '@/components/PayUPaymentGateway/PayUHostedCheckout'

const Cart = () => {
    const router = useRouter()
    const [cartItems, setCartItems] = useState<any[]>([]);

//
const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:8000/api/cart/getCartItems", {
        headers: {
          accept: "application/json",
          Authorization: token,
        },
      });

      setCartItems(res.data.cart_items || []);
      console.log("Cart items:", res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:8000/api/cart/removeFromCart/${itemId}`, {
        headers: {
          accept: "application/json",
          Authorization: token,
        },
      });

      // refresh cart
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

//
    let moneyForFreeship = 150;
    let [totalCart, setTotalCart] = useState<number>(0)
    let [discountCart, setDiscountCart] = useState<number>(0)
    let [shipCart, setShipCart] = useState<number>(30)
    let [applyCode, setApplyCode] = useState<number>(0)

    const handleApplyCode = (minValue: number, discount: number) => {
        if (totalCart > minValue) {
            setApplyCode(minValue)
            setDiscountCart(discount)
        } else {
            alert(`Minimum order must be ${minValue}₹`)
        }
    }

    if (totalCart < applyCode) {
        applyCode = 0
        discountCart = 0
    }

    if (totalCart < moneyForFreeship) {
        shipCart = 30
    }

    const redirectToCheckout = () => {
        router.push(`/checkout?discount=${discountCart}&ship=${shipCart}`)
    }

    //PayU Related
    const [showForm, setShowForm] = useState(false);

    const paymentData = {
        amount: "1000",
        firstname: "Ashish",
        lastname: "Kumar",
        email: "ashish@example.com",
        phone: "9999999999",
        productinfo: "Wireless Earbuds",
    };


    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Shopping cart' subHeading='Shopping cart' />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
                        <div className="xl:w-2/3 xl:pr-3 w-full">
                          {/* <>
                            <div className="list-product w-full sm:mt-7 mt-5">
                                <div className='w-full'>
                                    <div className="list-product-main w-full mt-3">
                                        {cartItems.length < 1 ? (
                                            <p className='text-button pt-3'>No product in cart</p>
                                        ) : (
                                            cartItems.map((item) => (
                                                <div className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full" key={item.id}>
                                                    <div className="w-1/2">
                                                        <div className="flex items-center gap-6">
                                                            <div className="bg-img md:w-[100px] w-20 aspect-[3/4]">
                                                                <Image
                                                                    src={item.image_urls[0]}
                                                                    width={1000}
                                                                    height={1000}
                                                                    alt={item.name}
                                                                    className='w-full h-full object-cover rounded-1g'
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-title">{item.name}</div>
                                                                <div className="list-select mt-3"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/12 price flex items-center justify-center">
                                                        <div className="text-title text-center">₹{item.original_price}</div>
                                                    </div>
                                                    <div className="w-1/12 flex items-center justify-center">
                                                        <div className="text-title text-center"> {item.isVinimaiVerifed ? "Verified" : "Not Verified"}</div>
                                                    </div>
                                                    <div className="w-1/12 flex items-center justify-center">
                                                    <button
                                                        onClick={() => removeFromCart(item.product_id)}
                                                        className="flex items-center gap-1 text-red-500 hover:text-black transition-colors duration-300"
                                                        aria-label="Remove item"
                                                    >
                                                        <Icon.Trash size={20} weight="bold" />
                                                        <span className="hidden md:inline">Remove</span>
                                                    </button>
                                                    </div>

                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                          </> */}
                          <>
                          <div className="list-product w-full sm:mt-7 mt-5">
    <div className='w-full'>
        {/* Enhanced Header */}
        <div className="heading bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Cart Items</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{cartItems.length} items</span>
            </div>
            {/* Column Headers - Hidden on mobile */}
            <div className="hidden lg:flex mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                <div className="w-1/2 pl-4">Product</div>
                <div className="w-1/6 text-center">Price</div>
                <div className="w-1/6 text-center">Status</div>
                <div className="w-1/6 text-center">Action</div>
            </div>
        </div>

        <div className="list-product-main w-full bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg border-x border-b border-gray-200 dark:border-gray-600 overflow-hidden">
            {cartItems.length < 1 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Icon.ShoppingCart size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className='text-lg font-medium text-gray-600 dark:text-gray-400 mb-2'>Your cart is empty</p>
                    <p className='text-sm text-gray-500 dark:text-gray-500'>Add some products to get started</p>
                </div>
            ) : (
                cartItems.map((item, index) => (
                    <div 
                        className={`item group hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 ${
                            index !== cartItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                        }`} 
                        key={item.id}
                    >
                        {/* Desktop Layout */}
                        <div className="hidden lg:flex items-center py-6 px-4">
                            {/* Product Info */}
                            <div className="w-1/2">
                                <div className="flex items-center gap-6">
                                    <div className="relative bg-gray-100 dark:bg-gray-700 md:w-[120px] w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                        <Image
                                            src={item.image_urls[0]}
                                            width={1000}
                                            height={1000}
                                            alt={item.name}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {item.name}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            {item.description && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                    {item.description}
                                                </span>
                                            )}
                                            {/* {item.size && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Size: <span className="font-medium">{item.size}</span>
                                                </span>
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="w-1/6 flex flex-col items-center">
                                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">₹{item.original_price}</div>
                                {/* {item.original_price !== item.discounted_price && (
                                    <div className="text-sm text-gray-500 line-through">₹{item.original_price}</div>
                                )} */}
                            </div>

                            {/* Verification Status */}
                            <div className="w-1/6 flex items-center justify-center">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    item.isVinimaiVerifed 
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-sm' 
                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 shadow-sm'
                                }`}>
                                    {item.isVinimaiVerifed ? (
                                        <>
                                            <Icon.CheckCircle size={16} weight="fill" />
                                            <span>Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon.Clock size={16} weight="fill" />
                                            <span>Awaiting</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Remove Button */}
                            <div className="w-1/6 flex items-center justify-center">
                                <button
                                    onClick={() => removeFromCart(item.product_id)}
                                    className="flex items-center gap-2 px-4 py-2 
                                                text-red dark:text-red 
                                                hover:text-white hover:bg-red 
                                                rounded-lg border border-red 
                                                hover:border-red 
                                                transition-all duration-300 transform hover:scale-105 
                                                focus:outline-none focus:ring-2 focus:ring-red focus:ring-opacity-50"                                    aria-label="Remove item"
                                >
                                    <Icon.Trash size={18} weight="bold" />
                                    <span className="font-medium">Remove</span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="lg:hidden p-4">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="relative bg-gray-100 dark:bg-gray-700 w-24 h-32 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                                    <Image
                                        src={item.image_urls[0]}
                                        width={1000}
                                        height={1000}
                                        alt={item.name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                                        {item.name}
                                    </h4>
                                    
                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">₹{item.discounted_price}</span>
                                        {item.original_price !== item.discounted_price && (
                                            <span className="text-sm text-gray-500 line-through">₹{item.original_price}</span>
                                        )}
                                    </div>

                                    {/* Category and Size */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {item.category && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                {item.category}
                                            </span>
                                        )}
                                        {item.size && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                Size: {item.size}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status and Remove Button */}
                                    <div className="flex items-center justify-between">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                            item.isVinimaiVerifed 
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                        }`}>
                                            {item.isVinimaiVerifed ? (
                                                <>
                                                    <Icon.CheckCircle size={12} weight="fill" />
                                                    <span>Verified</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon.Clock size={12} weight="fill" />
                                                    <span>Pending</span>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-md border border-red-200 dark:border-red-700 hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 text-sm"
                                            aria-label="Remove item"
                                        >
                                            <Icon.Trash size={14} weight="bold" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
                            </div>
                         </>
                            <div className="input-block discount-code w-full h-12 sm:mt-7 mt-5">
                                <form className='w-full h-full relative'>
                                    <input type="text" placeholder='Add voucher discount' className='w-full h-full bg-surface pl-4 pr-14 rounded-lg border border-line' required />
                                    <button className='button-main absolute top-1 bottom-1 right-1 px-5 rounded-lg flex items-center justify-center'>Apply Code
                                    </button>
                                </form>
                            </div>
                            <div className="list-voucher flex items-center gap-5 flex-wrap sm:mt-7 mt-5">
                                <div className={`item ${applyCode === 200 ? 'bg-green' : ''} border border-line rounded-lg py-2`}>
                                    <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                                        <div className="left">
                                            <div className="caption1">Discount</div>
                                            <div className="caption1 font-bold">10% OFF</div>
                                        </div>
                                        <div className="right">
                                            <div className="caption1">For all orders <br />from 200₹</div>
                                        </div>
                                    </div>
                                    <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                                        <div className="text-button-uppercase">Code: AN6810</div>
                                        <div
                                            className="button-main py-1 px-2.5 capitalize text-xs"
                                            onClick={() => handleApplyCode(200, Math.floor((totalCart / 100) * 10))}
                                        >
                                            {applyCode === 200 ? 'Applied' : 'Apply Code'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`item ${applyCode === 300 ? 'bg-green' : ''} border border-line rounded-lg py-2`}>
                                    <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                                        <div className="left">
                                            <div className="caption1">Discount</div>
                                            <div className="caption1 font-bold">15% OFF</div>
                                        </div>
                                        <div className="right">
                                            <div className="caption1">For all orders <br />from 300₹</div>
                                        </div>
                                    </div>
                                    <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                                        <div className="text-button-uppercase">Code: AN6810</div>
                                        <div
                                            className="button-main py-1 px-2.5 capitalize text-xs"
                                            onClick={() => handleApplyCode(300, Math.floor((totalCart / 100) * 15))}
                                        >
                                            {applyCode === 300 ? 'Applied' : 'Apply Code'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`item ${applyCode === 400 ? 'bg-green' : ''} border border-line rounded-lg py-2`}>
                                    <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                                        <div className="left">
                                            <div className="caption1">Discount</div>
                                            <div className="caption1 font-bold">20% OFF</div>
                                        </div>
                                        <div className="right">
                                            <div className="caption1">For all orders <br />from 400₹</div>
                                        </div>
                                    </div>
                                    <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                                        <div className="text-button-uppercase">Code: AN6810</div>
                                        <div
                                            className="button-main py-1 px-2.5 capitalize text-xs"
                                            onClick={() => handleApplyCode(400, Math.floor((totalCart / 100) * 20))}
                                        >
                                            {applyCode === 400 ? 'Applied' : 'Apply Code'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="xl:w-1/3 xl:pl-12 w-full">
                            <div className="checkout-block bg-surface p-6 rounded-2xl">
                                <div className="heading5">Order Summary</div>
                                <div className="total-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Subtotal</div>
                                    <div className="text-title">₹ {cartItems.reduce((sum, item) => sum + item.original_price, 0)}</div>
                                </div>
                                <div className="discount-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Discounts</div>
                                    <div className="text-title"> <span>-₹</span><span className="discount">{discountCart}</span><span>.00</span></div>
                                </div>
                                <div className="ship-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Shipping</div>
                                    <div className="choose-type flex gap-12">
                                        <div className="left">
                                            {/* <div className="type">
                                                {moneyForFreeship - totalCart > 0 ?
                                                    (
                                                        <input
                                                            id="shipping"
                                                            type="radio"
                                                            name="ship"
                                                            disabled
                                                        />
                                                    ) : (
                                                        <input
                                                            id="shipping"
                                                            type="radio"
                                                            name="ship"
                                                            checked={shipCart === 0}
                                                            onChange={() => setShipCart(0)}
                                                        />
                                                    )}
                                                < label className="pl-1" htmlFor="shipping">Free Shipping:</label>
                                            </div> */}
                                            {/* <div className="type mt-1">
                                                <input
                                                    id="local"
                                                    type="radio"
                                                    name="ship"
                                                    value={30}
                                                    checked={shipCart === 30}
                                                    onChange={() => setShipCart(30)}
                                                />
                                                <label className="text-on-surface-variant1 pl-1" htmlFor="local">Local:</label>
                                            </div> */}
                                            {/* <div className="type mt-1">
                                                <input
                                                    id="flat"
                                                    type="radio"
                                                    name="ship"
                                                    value={40}
                                                    checked={shipCart === 60}
                                                    // onChange={() => setShipCart(40)}
                                                />
                                                <label className="text-on-surface-variant1 pl-1" htmlFor="flat">Flat Rate:</label>
                                            </div> */}
                                        </div>
                                        <div className="right">
                                            <div className="ship">₹50.00</div>
                                            {/* <div className="local text-on-surface-variant1 mt-1">₹30.00</div>
                                            <div className="flat text-on-surface-variant1 mt-1">₹40.00</div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                                    <div className="heading5">Total</div>
                                    <div className="heading5">₹
                                        <span className="total-cart heading5">{cartItems.reduce((sum, item) => sum + item.original_price, 0)+50}</span>
                                        <span className='heading5'>.00</span></div>
                                </div>
                                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                                    {/* <div className="checkout-btn button-main text-center w-full" onClick={redirectToCheckout}>Proceed To Checkout</div> */}
                                    <div className="checkout-btn button-main text-center w-full" onClick={() => setShowForm(true)}>
                                        Proceed To Checkout
                                            {showForm && (
                                                <PayUFormStatic paymentData={paymentData} autoSubmit />
                                            )}    
                                    </div>
                                    <Link className="text-button hover-underline" href={"/shop/filter-options"}>Continue shopping</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}

export default Cart


