import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';
import { FaPlusSquare, FaBell, FaDollarSign, FaHeadphonesAlt } from "react-icons/fa";
import Link from "next/link"
import Image from 'next/image'

const Header = dynamic(() => import('../components/Header'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="min-h-screen" data-theme="wireframe">
      <Head>
        <title>digital ticket stream startup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Alert />

      <div className="hero min-h-screen">
        <div className="hero-content text-center flex flex-col">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6 text-xl font-normal leading-normal mt-0 mb-2">Digital-ticket-stream is a platform that allows users to create paid live streaming channels. Users can create their own NFTs on the platform or import an existing NFT to charge custom fees to viewers</p>
            {/* <Link href="/lists">
              <button className="btn">
                <FaListUl size="1rem" />
                Explore
              </button>
            </Link>
            <Link href="/create">
              <button className="btn mx-5">
                <FaPlusSquare size="1rem" />
                Create
              </button>
            </Link> */}

          </div>

          <div class="flex flex-col gap-6 mt-20">
            <div class="not-prose grid grid-cols-3 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              <a class="card card-compact hover:bg-base-400 transition-all duration-400 hover:-translate-y-1" href=""><figure class="px-4 pt-4"><FaPlusSquare size="6rem" /></figure> <div class="card-body"><h2 class="text-center text-lg font-bold">Create Room</h2></div></a>

              <a class="card card-compact hover:bg-base-400 transition-all duration-400 hover:-translate-y-1" href=""><figure class="px-4 pt-4"><FaBell size="6rem" /></figure> <div class="card-body"><h2 class="text-center text-lg font-bold">Send Notifications</h2> </div></a>

              <a class="card card-compact hover:bg-base-400 transition-all duration-400 hover:-translate-y-1" href=""><figure class="px-4 pt-4"><FaDollarSign size="6rem" /></figure> <div class="card-body"><h2 class="text-center text-lg font-bold">Withdraw Fees</h2> </div></a>

              <a class="card card-compact hover:bg-base-400 transition-all duration-400 hover:-translate-y-1" href=""><figure class="px-4 pt-4"><FaHeadphonesAlt size="6rem" /></figure> <div class="card-body"><h2 class="text-center text-lg font-bold">Join Lobby</h2> </div></a>


            </div>
          </div>

        </div>


      </div>

      <Footer />
    </div >
  )
}
