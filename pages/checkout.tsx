import Head from "next/head";
import Header from "../components/Header";
import { selectBasketItems, selectBasketTotal } from "../redux/basketSlice";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { ChevronDownIcon } from "@heroicons/react/outline";
import Stripe from "stripe";
import { fetchPostJSON } from "./utils/api-helpers";
import getStripe from "./utils/get-stripejs";
import Link from 'next/link'

function checkout() {
    const items = useSelector(selectBasketItems);
    const router = useRouter();
    const [groupedItemsInBasket, setGroupedItemsInBasket] = useState (
        {} as { [key: string]: Product[] }
    );
    const basketTotal = useSelector(selectBasketTotal);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[item._id] = results[item._id] || []).push(item);
            return results
        }, {} as {[key: string]: Product[]});
        
        setGroupedItemsInBasket(groupedItems);
    }, [items]);
    const createCheckoutSession = async () => {
        setLoading(true)

    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON("/api/checkout_sessions", {
        items: items,
    }
    );
    if ((checkoutSession as any).statusCode === 500){
        console.error((checkoutSession as any).message);
        return;
    }
    //Redirect to checkout
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
        sessionId: checkoutSession.id,
    });
    console.warn(error.message);
    setLoading(false);
    };

  return (
    <div className="min-h-screen overflow-hidden bg-[#E7ECEE]">
        <Head>
            <title>Bag - Apple</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
        <main className="mx-auto max-w-5xl pb-24">
            <div className="px-5">
                <h1 className="my-4 text-3xl font-semibold lg:text-4xl">
                    {items.length > 0 ? "Review your bag." : "Your bag is empty."}
                </h1>
                <p className="my-4">Free delivery and free returns</p>
                {items.length === 0 && (
                    <Button title="Continue Shopping" onClick={() => router.push("/")}/>
                )}
            </div>
            {items.length > 0 && (
                <div className="mx-5 md:mx-8">
                    
                    {Object.entries(groupedItemsInBasket).map(([key, items])=> (
                        <CheckoutProduct key={key} items={items} id={key}/>
                    ))}
                <div className="my-12 mt-6 ml-auto max-w-3xl">
                    <div className="divide-y divide-gray-300">
                        <div className="pb-4">
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>
                                    <Currency quantity={basketTotal} currency="EUR"/>
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p>Shipping</p>
                                <p>FREE</p>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-x-1 lg:flex-row">
                                    Estimated tax for:{""}
                                    <p className="flex cursor-not-allowed items-end text-blue-500 hover:underline">
                                        Enter zip code
                                        <ChevronDownIcon className="h-6 w-6 text-blue-500"/>
                                    </p>
                                </div>
                                <p>€ -</p>
                            </div>
                        </div>
                        <div className="flex justify-between pt-4 text-xl font-semibold">
                            <h4>Total</h4>
                            <h4>
                                <Currency quantity={basketTotal} currency="EUR"/>
                            </h4>
                        </div>
                    </div>
                    <div className="my-14 space-y-4">
                        <h4 className="text-xl font-semibold">
                            How would you like to check out?
                        </h4>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="order-2 flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center">
                                <h4 className="mb-4 flex flex-col text-xl font-semibold">
                                    <span>Pay Monthly</span>
                                    <span>with Apple Care</span>
                                    <span>
                                        283,16€/mo at 0% APR<sup className="-top-1">◊</sup>
                                    </span>
                                </h4>
                                <Button title="Check Out with Apple Card Monthly Installments"/>
                                <p className="mt-2 max-w-[240px] text-[13px]">
                                    0,00€ du today, which includes applicable full-price items, down payments, shipping, and taxes.
                                </p>
                            </div>
                            <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2">
                                <h4 className="mb-4 flex flex-col text-xl font-semibold">
                                    Pay in full
                                    <span>
                                        <Currency quantity={basketTotal} currency="EUR"/>
                                    </span>
                                </h4>
                                <Button 
                                noIcon 
                                loading={loading} 
                                title="Check Out" 
                                width="w-full" 
                                onClick={createCheckoutSession}
                                />
                            </div>
                        </div>
                            <div className="text-center justify-center py-12 text-bold text-xl-3 underline decoration-4 text-2xl">
                                <h3>Please do not provide any Personally Identifiable Information.</h3>
                                <p>This website is for educational purposes.</p>
                            </div>
                    </div>
                </div>
                </div>
            )}
        </main>

        <footer aria-label="Site Footer" className="bg-[#35383C]">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div>
                    <Link href="/" className="cursor-pointer">
                        <h3 className='space-y-3 text-5xl font-semibold tracking-wide lg:text-6x xl:text-7xl'>
                        <span className="fontAppleFooter block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Apple</span>
                        </h3>
                    </Link>

                    <p className="mt-4 max-w-xs text-sm text-white">
                    Powered bu Intellect
                    </p>
                    <p className="mt-4 max-w-xs text-sm text-white">
                    Driven by Values
                    </p>

                    <div className="mt-8 flex gap-6 text-white">
                    <a className="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#464646] md:h-[40px] md:w-[40px]" href="https://linkedin.com/in/ benedicte-ntambwe" target="_blank" rel="noopener noreferrer">
                        <span className="sr-only"> LinkedIn </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                    </a>

                    <a className="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#464646] md:h-[40px] md:w-[40px]" href="https://github.com/BenyNtb" target="_blank" rel="noopener noreferrer">
                        <span className="sr-only"> GitHub </span>

                        <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        >
                        <path
                            fill-rule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clip-rule="evenodd"
                        />
                        </svg>
                    </a>
                    </div>
                </div>
                <div
                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4"
                >
                    <div>
                    <p className="font-medium text-white">Product & Service</p>

                    <nav
                        aria-label="Footer Nav"
                        className="mt-4 flex flex-col space-y-2 text-sm text-white"
                    >
                        <a className="hover:opacity-75" href=""> Mac </a>
                        <a className="hover:opacity-75" href=""> iPad</a>
                        <a className="hover:opacity-75" href=""> iPhone </a>
                        <a className="hover:opacity-75" href=""> Watche </a>
                        <a className="hover:opacity-75" href=""> AirPods </a>
                        <a className="hover:opacity-75" href=""> Tv & Home </a>
                        <a className="hover:opacity-75" href=""> AirTag </a>
                        <a className="hover:opacity-75" href=""> Accessories </a>
                        <a className="hover:opacity-75" href=""> Gift Cards </a>
                    </nav>
                    </div>

                    <div>
                    <p className="font-medium text-white">Apple Store</p>

                    <nav className="mt-4 flex flex-col space-y-2 text-sm text-white">
                        <a className="hover:opacity-75" href=""> Find a Store </a>
                        <a className="hover:opacity-75" href=""> Genius Bar </a>
                        <a className="hover:opacity-75" href=""> Today at Apple </a>
                        <a className="hover:opacity-75" href=""> Apple Camp </a>
                        <a className="hover:opacity-75" href=""> Apple Store App </a>
                        <a className="hover:opacity-75" href=""> Financing </a>
                        <a className="hover:opacity-75" href=""> Order Status </a>
                        <a className="hover:opacity-75" href=""> Shopping Helps </a>
                    </nav>
                    </div>

                    <div>
                    <p className="font-medium text-white">About Apple</p>

                    <nav className="mt-4 flex flex-col space-y-2 text-sm text-white">
                        <a className="hover:opacity-75" href=""> Newsroom </a>
                        <a className="hover:opacity-75" href=""> Apple Leadership </a>
                        <a className="hover:opacity-75" href=""> Career Opportunities </a>
                        <a className="hover:opacity-75" href=""> Investors </a>
                        <a className="hover:opacity-75" href=""> Ethics & Compliance </a>
                        <a className="hover:opacity-75" href=""> Events </a>
                        <a className="hover:opacity-75" href=""> Contact Apple </a>
                    </nav>
                    </div>

                    <div>
                    <p className="font-medium text-white">Legal</p>

                    <nav className="mt-4 flex flex-col space-y-2 text-sm text-white">
                        <a className="hover:opacity-75" href=""> Privacy Policy </a>
                        <a className="hover:opacity-75" href=""> Terms & Conditions </a>
                        <a className="hover:opacity-75" href=""> Returns Policy </a>
                        <a className="hover:opacity-75" href=""> Accessibility </a>
                    </nav>
                    </div>
                </div>
                </div>

                <p className="mt-8 text-xs text-white">
                    &copy; 2022  
                    <a href="https://github.com/BenyNtb" target="_blank" rel="noopener noreferrer">
                         <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                            <em>Benedicte Modi</em>
                        </span>
                    </a>
                </p>  
            </div>
        </footer>
    </div>
  )
}

export default checkout