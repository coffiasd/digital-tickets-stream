// import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ContractFactory, utils } from 'ethers';
import ABIJson from "../Ticket.json";
import { ethers } from "ethers";
import axios from 'axios';
import { Polybase } from "@polybase/client";
import { FaPlusSquare } from "react-icons/fa";
import { useState } from "react";
//login user info.
import { useNetwork, useAccount } from 'wagmi';
import { alertService } from '../services';
import { ethPersonalSign } from '@polybase/eth';

export default function Creator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [formcontractAddress, setFormcontractAddress] = useState('');
    const [loading, setLoading] = useState(false);
    //token type
    const [tokenType, setTokenType] = useState('');
    //login user info.
    const { chain } = useNetwork();
    const { address } = useAccount();
    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }
    //checked?
    const [checked, setChecked] = useState(false);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

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


    const collectionReference = db.collection("Room");
    //deploy factory.
    const factory = new ContractFactory(ABIJson.abi, ABIJson.bytecode, signer);

    const deployMyContract = async () => {
        if (!address) {
            alertService.info("please login!", options);
            return
        }
        if (!title || !description) {
            alertService.info("fill the form", options);
            return
        }

        if (checked && !formcontractAddress) {
            alertService.info("fill the form", options);
            return
        }

        if (!checked && (!symbol || !quantity || !price)) {
            alertService.info("fill the form", options);
            return
        }

        setLoading("loading");
        console.log(title, description, symbol, quantity, price);

        if (checked) {
            //skip deploy contract.
            createRoom(formcontractAddress);
        } else {
            const contract = factory.deploy(utils.parseUnits(price), symbol, symbol);
            contract.then(async function (res) {
                // console.log(res);
                const contractAddress = res.address;
                await createRoom(contractAddress);
            }).catch(function (err) {
                console.log(err);
                setLoading(false);
            });
        }
    }

    //create room via api.
    const createRoom = async (contractAddress) => {
        // contractAddress = '0xADC327CC02d3230af723C47eCd91a73F600d7E3A';
        // console.log(address);
        // const s = new Date();
        // let startTime = s.toISOString();
        // const now = new Date();
        // now.setDate(now.getDate() + 1); // Adding 1 day
        // let expiryTime = now.toISOString();
        axios.post('https://api.huddle01.com/api/v1/create-iframe-room', {
            title: title,
            tokenType: 'ERC721',
            contractAddress: [contractAddress],
            chain: "POLYGON",
            description: description,
            hostWallets: [address.toLowerCase()],
            // startTime: startTime,
            // expiryTime: expiryTime

        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'VwTZ4AGTxme9snANex9tep3NwvVMGfYd'
            }
        }).then(async function (response) {
            if (response.status == 200) {
                //kny-giwi-vdg
                console.log(response.data.data.roomId);
                await recordRoomInfo(response.data.data.roomId, contractAddress);
                cleanData();
                setLoading(false);
                alertService.info("success!", options);
                // return response.data.data.roomId;
            }
        }).catch(function (error) {
            console.log(error);
            return;
        });
    }

    //add room info to database.
    const recordRoomInfo = async (roomId, contractAddress) => {
        console.log(roomId, title, address);
        await collectionReference.create([
            roomId,
            title,
            address,
            contractAddress,
            Date.now(),
            description,
            price,
            checked ? 1 : 0
        ]);
        // console.log(recordData);
    }

    const cleanData = async () => {
        setTitle('');
        setDescription('');
        setSymbol('');
        setQuantity('');
        setPrice('');
        setFormcontractAddress('');
    }

    //get specific user room list
    const filterRoom = async () => {
        const records = await collectionReference.where("author", "==", "author").get();
        // Array of records is available under the data property
        const { data, cursor } = records;
        console.log(data, cursor);
    }

    return (
        <div className='flex justify-center flex-col'>

            <div className='flex m-auto mt-20'>
                <div className='mt-1'><FaPlusSquare size="2rem" /></div>
                <div className='mx-2 text-3xl font-bold'>Create a Room</div>
            </div>

            <div className="mx-auto justify-center border border-double rounded-md p-10 mt-20 w-1/3 mb-48  min-w-min">
                <div className='text-left text-lg font-bold mt-5'>Room Information</div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">What is your room title?</span>
                    </label>
                    <input type="text" placeholder="Room title" value={title} className="input input-bordered w-full" onChange={(e) => { if (e.target.value.length < 50) { setTitle(e.target.value) } }} />
                </div>

                <div className="form-control w-full mt-5">
                    <label className="label">
                        <span className="label-text">About your room</span>
                    </label>
                    <textarea onChange={(e) => { if (e.target.value.length < 200) { setDescription(e.target.value) } }} className="textarea textarea-bordered h-24" placeholder="Bio" value={description}></textarea>
                    <label className="label">
                    </label>
                </div>
                {/* <div className="divider"></div> */}

                <div className='text-left text-lg font-bold mt-5'>Contract Information</div>

                <div className="form-control my-5">
                    <label className="label cursor-pointer">
                        <span className="label-text">Already have a ERC721 contract? </span>
                        <input type="checkbox" className="toggle" onClick={() => { setChecked(!checked) }} value={checked} />
                    </label>
                </div>

                {!checked && <>

                    {/* chain */}

                    {/* <div className="form-control my-5">
                        <select className="select select-bordered w-full" onChange={(e) => { setOnChain(e.target.value); console.log(onChain); }}>
                            <option disabled selected>Select Chain</option>
                            <option value='ETHEREUM'>ETHEREUM</option>
                            <option value='COSMOS'>COSMOS</option>
                            <option value='POLYGON'>POLYGON</option>
                            <option value='SOLANA'>SOLANA</option>
                            <option value='TEZOS'>TEZOS</option>
                            <option value='BSC'>BSC</option>
                        </select>
                    </div> */}


                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">What is your tickets symbol?</span>
                        </label>
                        <input type="text" onChange={(e) => { setSymbol(e.target.value) }} placeholder="eg:MATIC" className="input input-bordered w-full" value={symbol} />
                    </div>

                    <div className="form-control w-full mt-5">
                        <label className="label">
                            <span className="label-text">What is tickets quantity?</span>
                        </label>
                        <input type="text" onChange={(e) => { if (!isNaN(+e.target.value)) { setQuantity(e.target.value) } }} placeholder="Total tickets" className="input input-bordered w-full" value={quantity} />
                    </div>

                    <div className="form-control w-full mt-5">
                        <label className="label">
                            <span className="label-text">What is your tickets price?</span>
                        </label>
                        <input type="text" onChange={(e) => { if (!isNaN(+e.target.value)) { setPrice(e.target.value) } }} placeholder="1 == 1 $MATIC" className="input input-bordered w-full" value={price} />
                    </div>
                </>}


                {checked &&
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">What is your contract address?</span>
                        </label>
                        <input type="text" onChange={(e) => { setFormcontractAddress(e.target.value) }} placeholder="address" className="input input-bordered w-full" value={formcontractAddress} />
                    </div>
                }



                <div className="form-control w-full">
                    {/* <button className="loading loading-spinner w-full btn btn-info mt-10" onClick={deployMyContract}>save</button> */}

                    <button className="btn w-full btn-info mt-10" onClick={deployMyContract}>
                        <span className={`loading-spinner ${loading}`}></span>
                        save
                    </button>
                </div>

            </div>
        </div >

    )
}