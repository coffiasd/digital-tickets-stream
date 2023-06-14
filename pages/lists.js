import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { FaListUl } from "react-icons/fa";
import { Polybase } from "@polybase/client";
import { faker } from '@faker-js/faker';

const Header = dynamic(() => import('../components/Header'), {
    ssr: false,
})

export default function Lists() {

    //database.
    const db = new Polybase({
        defaultNamespace: process.env.NEXT_PUBLIC_NAME_SPACE,
    });
    const collectionReference = db.collection("Room");

    const [lists, setLists] = useState([]);

    const getRoomList = async () => {
        let ret = [];
        const records = await collectionReference.get();
        // console.log(records.data);
        for (let i = 0; i < records.data.length; i++) {
            records.data[i].data.image = faker.image.url();
            records.data[i].data.avatar = faker.image.avatar();
            records.data[i].data.view = getViews(records.data[i].data.createAt);
            records.data[i].data.diff = getTimeDifference(records.data[i].data.createAt);
            ret.push(records.data[i].data);
        }
        setLists(ret);

    }

    const getViews = (timestamp) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDifference = currentTime - timestamp / 1000;
        let v = parseInt(timeDifference / 1000);
        if (v < 1) {
            return "<1";
        }
        if (v > 100) {
            return ">100";
        }
        return v;
    }

    const getTimeDifference = (timestamp) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDifference = currentTime - timestamp / 1000;
        if (timeDifference < 3600) {
            const min = Math.floor(timeDifference / 60);
            return min + ' mins';
        } else if (timeDifference < 86400) {
            const hours = Math.floor(timeDifference / 3600);
            return hours + ' hours';
        } else if (timeDifference < 2592000) {
            const days = Math.floor(timeDifference / 86400);
            return days + ' days';
        } else {
            // const months = Math.floor(timeDifference / 2592000);
            return ' 1 months';
        }
    }

    useEffect(() => {
        getRoomList();
    }, [])

    return (
        <div className="min-h-screen bg-white" data-theme="bumblebee">
            <Head>
                <title>streams list</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <Alert />

            <div className="min-h-screen">
                <div className="container mx-auto my-10 px-5 py-2 lg:px-32 lg:pt-12 mb-20">
                    <div className='flex flex-row'>
                        <div className='mt-1'><FaListUl size="2rem" /></div>
                        <div className='mx-2 text-3xl font-bold'>Room List</div>
                    </div>
                    <div className="divider"></div>
                    <div className="-m-1 flex flex-wrap md:-m-2">

                        {lists && lists.length == 0 && <button className="btn">
                            <span className="loading loading-spinner"></span>
                            loading
                        </button>}

                        {lists.map((item, index) => (
                            <Link key={index} className='' href={`/info?id=${item.id}`}>
                                <div className="flex w-1/4 flex-wrap cursor-pointer mt-10">
                                    <div className="w-full p-1 md:p-2">
                                        <img
                                            alt="gallery"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src={item.image} />
                                    </div>
                                    <div className='flex'>
                                        <div className='flex-none ml-2'>
                                            <img width="30" className="mask mask-circle" src={item.avatar} />
                                        </div>

                                        <div className='flex-1 mx-2 font-bold'>{item.title}</div>
                                    </div>
                                    <div className="m-auto mt-2 text-sm text-gray-400">
                                        {item.view}k views - {item.diff} ago
                                    </div>
                                </div>
                            </Link>
                        ))}


                    </div>
                </div>
            </div>

            <Footer />
        </div >
    )
}
