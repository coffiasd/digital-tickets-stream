import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';

const Header = dynamic(() => import('../components/Header'), {
    ssr: false,
})

const Creator = dynamic(() => import('../components/Creator'), {
    ssr: false,
})

export default function Create() {

    return (
        <div className="min-h-screen bg-white" data-theme="bumblebee">
            <Head>
                <title>create stream</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Alert />

            <Creator />

            <Footer />
        </div >
    )
}
