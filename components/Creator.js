// import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ContractFactory, utils } from 'ethers';
import ABIJson from "../contract/artifacts/contracts/Ticket.sol/Ticket.json";
import { ethers } from "ethers";
import axios from 'axios';
import { Polybase } from "@polybase/client";
import { FaPlusSquare } from "react-icons/fa";
import { useState } from "react";
//login user info.
import { useNetwork, useAccount } from 'wagmi';
import { alertService } from '../services';

export default function Creator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    //login user info.
    const { chain } = useNetwork();
    const { address } = useAccount();
    //alert options
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //database.
    const db = new Polybase({
        defaultNamespace: "pk/0x5eaba6d080472bc9bf80448f129a370bc893bc13e493007524b70fb0c90790d587f20d37d14370702a0b1971bcd2985b30a4d7a574f54fce44861e07821392e2/digital-tickets-stream",
    });
    const collectionReference = db.collection("Room");
    //deploy factory.
    const factory = new ContractFactory(ABIJson.abi, ABIJson.bytecode, signer);

    const deployMyContract = async () => {
        if (!address) {
            alertService.info("please login!", options);
            return
        }

        setLoading("loading");
        console.log(title, description, symbol, quantity, price);

        const contract = factory.deploy(utils.parseUnits(price), symbol, symbol);
        // console.log(contract.address);
        // console.log(contract.deployTransaction);
        contract.then(async function (res) {
            // console.log(res);
            const contractAddress = res.address;
            await createRoom(contractAddress);
        }).catch(function (err) {
            console.log(err);
            setLoading(false);
        });

        // setLoading(false);
        // const address = "0xADC327CC02d3230af723C47eCd91a73F600d7E3A";
        // const roomId = await createRoom(contract.address);
        // await recordRoomInfo();
        // await roomList();
        // await filterRoom();
    }

    //create room via api.
    const createRoom = async (contractAddress) => {
        contractAddress = '0xADC327CC02d3230af723C47eCd91a73F600d7E3A';
        // console.log(address);
        axios.post('https://api.huddle01.com/api/v1/create-room', {
            title: title,
            tokenType: 'ERC721',
            contractAddress: [contractAddress],
            chain: "POLYGON",
            description: description
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'VwTZ4AGTxme9snANex9tep3NwvVMGfYd'
            }
        }).then(async function (response) {
            if (response.status == 200) {
                //kny-giwi-vdg
                console.log(response.data.data.roomId);
                await recordRoomInfo(response.data.data.roomId);
                // await cleanData();
                setTitle('');
                setDescription('');
                setSymbol('');
                setQuantity('');
                setPrice('');
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
    const recordRoomInfo = async (roomId) => {
        console.log(roomId, title, address);
        await collectionReference.create([
            roomId,
            title,
            address,
            roomId,
        ]);
        // console.log(recordData);
    }

    const cleanData = async () => {
        // setTitle('');
        // setDescription('');
        // setSymbol('');
        // setQuantity('');
        // setPrice(0);
    }

    // get room list.
    const roomList = async () => {
        const records = await collectionReference.get();
        console.log(records.data[0].data);
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
                <div className='mx-2 text-3xl font-bold'>Create Room</div>
            </div>

            <div className="mx-auto justify-center border border-double rounded-md p-10 mt-20 w-1/3 mb-48">
                <div className='text-left text-lg font-bold mt-5'>Live Room</div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">What is your room title?</span>
                    </label>
                    <input type="text" placeholder="Room title" value={title} className="input input-bordered w-full" onChange={(e) => { setTitle(e.target.value) }} />
                </div>

                <div className="form-control w-full mt-5">
                    <label className="label">
                        <span className="label-text">About your room</span>
                    </label>
                    <textarea onChange={(e) => { setDescription(e.target.value) }} className="textarea textarea-bordered h-24" placeholder="Bio" value={description}></textarea>
                    <label className="label">
                    </label>
                </div>
                {/* <div className="divider"></div> */}

                <div className='text-left text-lg font-bold mt-5'>Ticket Information</div>

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
                    <input type="text" onChange={(e) => { setQuantity(e.target.value) }} placeholder="Total tickets" className="input input-bordered w-full" value={quantity} />
                </div>

                <div className="form-control w-full mt-5">
                    <label className="label">
                        <span className="label-text">What is your tickets price?</span>
                    </label>
                    <input type="text" onChange={(e) => { setPrice(e.target.value) }} placeholder="Amount of $MATIC" className="input input-bordered w-full" value={price} />
                </div>

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