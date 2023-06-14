import ABIJson from "../contract/artifacts/contracts/Ticket.sol/Ticket.json";
import { ethers } from "ethers";
import axios from 'axios';
import { Polybase } from "@polybase/client";
import { useState } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem, chainNameType, SubscribedModal } from '@pushprotocol/uiweb';
import { unsubscribe } from "@pushprotocol/restapi/src/lib/channels";
//FaShoppingCart
import { FaShoppingCart, FaBell, FaPlay, FaBellSlash } from "react-icons/fa";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { TiInfo } from "react-icons/ti";
import { IoIosCopy } from "react-icons/io";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useNetwork, useAccount } from 'wagmi';
import { alertService } from '../services';
import { faker } from '@faker-js/faker';
import { ethPersonalSign } from '@polybase/eth';
import { TbBellRingingFilled } from "react-icons/tb";

export default function Creator() {
    const router = useRouter();
    const { id } = router.query;
    const [shake1, setShake1] = useState(false);
    const [shake2, setShake2] = useState(false);
    const [item, setItem] = useState({});
    const [sub, setSub] = useState(false);
    const image = faker.image.url();
    //login user info.
    const { chain } = useNetwork();
    const { address } = useAccount();
    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }
    //loading...
    const [mintLoading, setMintLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);


    const animate1 = () => {
        setShake1(true);
        setTimeout(() => setShake1(false), 500);
    }

    const animate2 = () => {
        setShake2(true);
        setTimeout(() => setShake2(false), 500);
    }

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();

    //database.
    const db = new Polybase({
        defaultNamespace: process.env.NEXT_PUBLIC_NAME_SPACE,
    });

    db.signer((data) => {
        return {
            h: 'eth-personal-sign',
            sig: ethPersonalSign(process.env.NEXT_PUBLIC_COMMON_PK, data)
        };
    });


    const collectionReferenceRoom = db.collection("Room");
    const collectionReferenceSub = db.collection("Subscribe");

    // collectionReferenceRoom.record("scy-trsu-jxy").call("del");
    // collectionReferenceRoom.record("fmp-mjow-mjw").call("del");
    // collectionReferenceRoom.record("jyn-fftr-vpv").call("del");
    // collectionReferenceRoom.record("uzc-hdxt-aum").call("del");

    const [showSubscribe, setShowSubscribe] = useState(false);
    const toggleSubscribedModal = () => {
        setShowSubscribe((lastVal) => !lastVal);
    };

    const unsubscribe = async () => {
        if (!address) {
            alertService.info("please login", options);
            return;
        }
        setSubLoading(true);
        setTimeout(() => {
            setSubLoading(false);
        }, 4000);
        const record = await db.collection("Subscribe").record(address + '-' + id,).call("del");
        setSub(false);
        setSubLoading(false);
    }

    const subscribe = async () => {
        if (!address) {
            alertService.info("please login", options);
            return;
        }
        setSubLoading(true);
        setTimeout(() => {
            setSubLoading(false);
        }, 4000);
        const recordData = await collectionReferenceSub.create([
            address + '-' + id,
            address,
            id
        ]);

        setSubLoading(false);
        console.log(recordData);
        setSub(true);
    }

    const getRoomInfo = async () => {
        const record = await collectionReferenceRoom.record(id).get();
        // Get data from the record
        const { data } = record; // or const data = record.data
        setItem(data);
    }

    //entry room.
    const entryRoom = () => {
        let url = "https://iframe.huddle01.com/" + id;
        window.open(url);
    }

    const getSubInfo = async () => {
        if (!address) {
            return;
        }
        let idIndex = address + '-' + id;
        const record = await collectionReferenceSub.where("id", "==", idIndex).get();
        const { data } = record; // or const data = record.data
        if (data.length > 0) {
            console.log('in');
            setSub(true);
        }
    }

    function getConnectContract() {
        let contractAddress = item.url;
        /// interact with blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, ABIJson.abi, signer);
    }

    /// public mint function.
    const publicMint = async () => {
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

        const tx = await getConnectContract().publicMint({
            value: ethers.utils.parseEther(item.price),
            // nonce: window.ethersProvider.getTransactionCount(address, "latest"),
            gasLimit: ethers.utils.hexlify(0x100000), //100000
        });
        await waitForTransactionCompletion(tx.hash);
        setMintLoading("");
        alertService.info("mint success", options);
    }

    async function waitForTransactionCompletion(txHash) {
        let receipt = null;
        while (!receipt) {
            receipt = await new ethers.providers.Web3Provider(window.ethereum).getTransactionReceipt(txHash);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(receipt);
        return receipt;
    }

    const hideAddress = (address) => {
        if (address == null) return;
        return address.substring(0, 4) + "...." + address.slice(-4)
    }

    // function joinLobby() {
    //     console.log('joinLobby');
    // }

    useEffect(() => {
        getRoomInfo();
        getSubInfo();
    }, [])


    return (
        <div className='flex justify-center'>
            <div className="min-h-screen mt-40">

                <div className='flex m-auto mx-10'>
                    <div className='mt-1'><FaShoppingCart size="2rem" /></div>
                    <div className='mx-2 text-3xl font-bold'>Room Information</div>
                </div>
                <div className="divider mx-10"></div>
                <div className="card lg:card-side bg-base-400 shadow-xl m-auto mx-10 mt-10">
                    <figure><img src={image} alt="Album" /></figure>
                    <div className="card-body">
                        <h2 className="card-title">{item != null && item.title}</h2>
                        <p className='text-gray-500 text-sm mt-5'>{item != null && item.description}</p>
                        <>
                            <div className="flex flex-row my-3">
                                <div className="flex w-4 my-auto">
                                    <div className="tooltip tooltip-secondary" data-tip="From">
                                        <TiInfo size=".8rem" />
                                    </div>
                                </div>
                                <div className="flex w-40">Author</div>
                                <div className="flex">{item != null && hideAddress(item.author)}</div>
                                <div className="flex my-auto  ml-2 cursor-pointer">
                                    <div onClick={animate1} className={`tooltip tooltip-secondary ${shake1 ? "shake" : ""}`} data-tip="click to copy">
                                        <CopyToClipboard text={item != null && item.author}>
                                            <IoIosCopy />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row my-3">
                                <div className="flex w-4 my-auto">
                                    <div className="tooltip tooltip-secondary" data-tip="To">
                                        <TiInfo size=".8rem" />
                                    </div>
                                </div>
                                <div className="flex w-40">NFTs Address</div>
                                <div className="flex"><a className='link link-success' target="_blank" rel="noreferrer" href={`https://polygonscan.com/address/${item.url}`}>{item != null && hideAddress(item.url)}</a></div>
                                <div className="flex my-auto ml-2 cursor-pointer">
                                    <div onClick={animate2} className={`tooltip tooltip-secondary ${shake2 ? "shake" : ""}`} data-tip="click to copy">
                                        <CopyToClipboard text={item != null && item.url}>
                                            <IoIosCopy />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>
                        </>

                        <div className="card-actions">
                            {mintLoading && <button className="btn w-full normal-case">
                                <span className="loading loading-spinner"></span>
                            </button>}
                            {!mintLoading && <button className="btn w-full normal-case" disabled={item.custom && "disabled" || address == item.author} onClick={publicMint}>
                                <FaShoppingCart className='flex-none' size="1rem" />
                                <div className='flex-1'>Buy a ticket</div>
                            </button>}
                            <button className="btn w-full normal-case" onClick={entryRoom} >
                                <FaPlay size="0.8rem" />
                                <div className='flex-1'>Entry room</div>
                            </button>


                            <button className="btn normal-case w-full" onClick={subscribe} disabled={sub && "disabled" || (subLoading && "disabled")} >
                                <FaBell size="1rem" />
                                <div className='flex-1'>Subscribe</div>
                            </button>

                            <button className="btn normal-case w-full" onClick={unsubscribe} disabled={!sub && "disabled" || (subLoading && "disabled")} >
                                <FaBellSlash size="1rem" />
                                <div className='flex-1'>UnSubscribe</div>
                            </button>


                            <button className="btn w-full normal-case" onClick={() => { setShowSubscribe(true) }} >
                                <TbBellRingingFilled size="1rem" />
                                <div className='flex-1'>Receive notification</div>
                            </button>

                        </div>
                    </div >

                    {showSubscribe ? <SubscribedModal onClose={toggleSubscribedModal} /> : null
                    }
                </div >
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


            </div >
        </div >
    )
}