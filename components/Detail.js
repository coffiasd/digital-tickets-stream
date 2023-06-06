import ABIJson from "../contract/artifacts/contracts/Ticket.sol/Ticket.json";
import { ethers } from "ethers";
import axios from 'axios';
import { Polybase } from "@polybase/client";
import { useState } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType, SubscribedModal } from '@pushprotocol/uiweb';
import { unsubscribe } from "@pushprotocol/restapi/src/lib/channels";
//FaShoppingCart
import { FaShoppingCart, FaPlayCircle, FaPlay } from "react-icons/fa";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { TiInfo } from "react-icons/ti";
import { IoIosCopy } from "react-icons/io";

export default function Creator() {

    const [shake, setShake] = useState(false);
    const [shake1, setShake1] = useState(false);
    const [shake2, setShake2] = useState(false);

    const animate = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }

    const animate1 = () => {
        setShake1(true);
        setTimeout(() => setShake1(false), 500);
    }

    const animate2 = () => {
        setShake2(true);
        setTimeout(() => setShake2(false), 500);
    }


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //database.
    const db = new Polybase({
        defaultNamespace: "pk/0x5eaba6d080472bc9bf80448f129a370bc893bc13e493007524b70fb0c90790d587f20d37d14370702a0b1971bcd2985b30a4d7a574f54fce44861e07821392e2/digital-tickets-stream",
    });


    const collectionReference = db.collection("Subscribe");

    const [showSubscribe, setShowSubscribe] = useState(true);

    const toggleSubscribedModal = () => {
        setShowSubscribe((lastVal) => !lastVal);
    };

    const receive = async () => {
        // await PushAPI.channels.subscribe({
        //     signer: signer,
        //     channelAddress: 'eip155:5:0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610', // channel address in CAIP
        //     userAddress: 'eip155:5:0x770BE5C2Afb30607A66EBfc98279E6969B353845', // user address in CAIP
        //     onSuccess: () => {
        //         console.log('opt in success');
        //     },
        //     onError: () => {
        //         console.error('opt in error');
        //     },
        //     env: 'staging'
        // })

        //add to database.
        const recordData = await collectionReference.create([
            "uniqueId",
            "roomId",
            "0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2611",
        ]);
        console.log(recordData);
    }

    const unsubscribe = async () => {
        const record = await db.collection("Subscribe").record("roomid").call("del");
        console.log(record);
    }

    const send = async () => {
        // apiResponse?.status === 204, if sent successfully!
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer: signer,
            type: 4, // subset
            identityType: 2, // direct payload
            notification: {
                title: `[SDK-TEST] notification TITLE:`,
                body: `[sdk-test] notification BODY`
            },
            payload: {
                title: `[sdk-test] payload title`,
                body: `sample msg body`,
                cta: '',
                img: ''
            },
            recipients: { 'eip155:5:0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610': null, 'eip155:5:0x770BE5C2Afb30607A66EBfc98279E6969B353845': null }, // recipients addresses
            channel: 'eip155:5:0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610', // your channel address
            env: 'staging'
        });
        console.log(apiResponse);
    }


    return (
        <div className='flex justify-center'>
            <div className="min-h-screen mt-40">

                <div className="card lg:card-side bg-base-400 shadow-xl m-auto">
                    <figure><img src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp" alt="Album" /></figure>
                    <div className="card-body">
                        <h2 className="card-title">New album is released!</h2>
                        <p className='text-gray-500 text-sm mt-5'>Click the button to listen on Spotiwhy app.</p>
                        <>
                            <div className="flex flex-row my-3">
                                <div className="flex w-4 my-auto">
                                    <div className="tooltip tooltip-secondary" data-tip="From">
                                        <TiInfo />
                                    </div>
                                </div>
                                <div className="flex w-40">Author</div>
                                <div className="flex">0x****216F</div>
                                <div className="flex my-auto  ml-2 cursor-pointer">
                                    <div onClick={animate1} className={`tooltip tooltip-secondary ${shake1 ? "shake" : ""}`} data-tip="click to copy">
                                        <CopyToClipboard text="0x****216F">
                                            <IoIosCopy />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row my-3">
                                <div className="flex w-4 my-auto">
                                    <div className="tooltip tooltip-secondary" data-tip="To">
                                        <TiInfo />
                                    </div>
                                </div>
                                <div className="flex w-40">NFTs Address</div>
                                <div className="flex">0x****216F</div>
                                <div className="flex my-auto ml-2 cursor-pointer">
                                    <div onClick={animate2} className={`tooltip tooltip-secondary ${shake2 ? "shake" : ""}`} data-tip="click to copy">
                                        <CopyToClipboard text="0x****216F">
                                            <IoIosCopy />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>
                        </>

                        <div className="card-actions justify-end">
                            <button className="btn w-full">
                                <FaShoppingCart size="1rem" />
                                Buy a ticket
                            </button>
                            <button className="btn w-full">
                                <FaPlay size="1rem" />
                                Entry room
                            </button>
                        </div>
                    </div>
                </div>
                {/* 
<div className="form-control w-full max-w-xs">
    <button className="w-full btn mt-10" onClick={receive}>subscribe</button>
</div>

<div className="form-control w-full max-w-xs">
    <button className="w-full btn mt-10" onClick={unsubscribe}>unsubscribe</button>
</div>

<div className="form-control w-full max-w-xs">
    <button className="w-full btn mt-10" onClick={() => { setShowSubscribe(true) }}>install notification extension</button>
</div>

<div className="form-control w-full max-w-xs">
    <button className="w-full btn mt-10" onClick={send}>send notify</button>
</div> */}


            </div>
        </div>
    )
}