import ABIJson from "../Ticket.json";
import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';
import { useState, useEffect } from 'react';
import { FaUserAlt, FaBell } from "react-icons/fa";
import { useNetwork, useAccount } from 'wagmi';
import { Polybase } from "@polybase/client";
import { faker } from '@faker-js/faker';
import { ethers } from "ethers";
import { alertService } from '../services';

const Header = dynamic(() => import('../components/Header'), {
    ssr: false,
})

export default function My() {
    const [lists, setLists] = useState([]);
    //login user info.
    const { chain } = useNetwork();
    const { address } = useAccount();
    const [mintLoading, setMintLoading] = useState(false);
    const [notifyLoading, setNotifyLoading] = useState(false);
    //database.
    const db = new Polybase({
        defaultNamespace: process.env.NEXT_PUBLIC_NAME_SPACE,
    });
    const collectionReference = db.collection("Room");
    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }

    //get specific user room list
    const filterRoom = async () => {
        if (!address) {
            return;
        }
        const records = await collectionReference.where("author", "==", address).get();
        // Array of records is available under the data property
        const { data, cursor } = records;
        // console.log(data, cursor);
        let ret = [];
        for (let i = 0; i < data.length; i++) {
            data[i].data.client = faker.number.int({ max: 1000 });
            data[i].data.createAt = formatTimestamp(data[i].data.createAt);
            ret.push(data[i].data);
        }
        setLists(ret);
    }

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();

    const sendNotify = async (item) => {
        setNotifyLoading("loading");
        setTimeout(() => {
            setNotifyLoading(false);
        }, 8000);

        const res = await fetch("/api/notify?id=" + item.id + '&title=' + item.title);
        const data = await res.json();
        console.log("data:", data);
        setNotifyLoading(false);
        alertService.info("notify success", options);
    }

    useEffect(() => {
        filterRoom();
    }, [])

    const formatTimestamp = (timestamp) => {
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        var hours = ('0' + date.getHours()).slice(-2);
        var minutes = ('0' + date.getMinutes()).slice(-2);
        var seconds = ('0' + date.getSeconds()).slice(-2);

        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }

    function getConnectContract(contractAddress) {
        /// interact with blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, ABIJson.abi, signer);
    }

    const withdrawTicketsRevenue = async (contractAddress) => {
        // change loading state
        setMintLoading("loading");
        //set timeout
        setTimeout(() => {
            setMintLoading("");
        }, 8000);

        if (!address) {
            alertService.info("please login", options);
            setMintLoading("");
            return;
        }

        const tx = await getConnectContract(contractAddress).withDraw({
            gasLimit: ethers.utils.hexlify(0x100000), //100000
        });
        await waitForTransactionCompletion(tx.hash);
        setMintLoading("");
    }

    const entryRoom = (id) => {
        let url = "https://iframe.huddle01.com/" + id;
        window.open(url);
    }

    return (
        <div className="min-h-screen bg-white" data-theme="bumblebee">
            <Head>
                <title>Account</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <Alert />

            <div className="flex justify-center min-h-screen mx-auto w-5/6">
                <div className="overflow-x-auto">

                    {/* <h1 className='text-3xl font-bold'>My Rooms</h1> */}
                    <div className='flex m-auto mt-20'>
                        <div className='mt-1'><FaUserAlt size="2rem" /></div>
                        <div className='mx-2 text-3xl font-bold'>My Rooms</div>
                    </div>

                    <div className="divider"></div>

                    {lists && lists.length == 0 && <button className="btn">
                        <span className="loading loading-spinner"></span>
                        loading
                    </button>}

                    {lists &&
                        <table className="table mt-10">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>title</th>
                                    <th>roomId</th>
                                    {/* <th>clients</th> */}
                                    <th>created_at </th>
                                    <th>remind</th>
                                    <th>withdraw</th>
                                    <th>entry</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lists.map((item, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{item.title}</td>
                                        <td>{item.id}</td>
                                        {/* <th>{item.client}</th> */}
                                        <td>{item.createAt}</td>
                                        {notifyLoading && <td><button className="btn btn-info btn-sm normal-case">
                                            <span className="loading loading-spinner"></span>
                                        </button></td>}

                                        {!notifyLoading && <td><button className="btn btn-info btn-sm normal-case" onClick={() => sendNotify(item)}>notify</button></td>}

                                        {mintLoading && <td><button className="btn btn-info btn-sm normal-case">
                                            <span className="loading loading-spinner"></span>
                                        </button></td>}
                                        {!mintLoading && <td><button disabled={item.custom && "disabled"} onClick={() => { withdrawTicketsRevenue(item.url) }} className="btn btn-success btn-sm normal-case">withdraw</button></td>}
                                        <td><button className="btn btn-warning btn-sm normal-case" onClick={() => entryRoom(item.id)}>entry</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                </div>

            </div>

            <Footer />
        </div >
    )
}
