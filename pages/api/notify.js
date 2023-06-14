import * as PushAPI from "@pushprotocol/restapi";
import { Polybase } from "@polybase/client";
import * as ethers from "ethers";

const Pkey = process.env.NEXT_PUBLIC_COMMON_PK;
const _signer = new ethers.Wallet(Pkey);

export default async function handler(req, res) {
    const db = new Polybase({
        defaultNamespace: process.env.NEXT_PUBLIC_NAME_SPACE,
    });
    const collectionReference = db.collection("Subscribe");
    let roomId = req.query.id;
    let title = req.query.title;
    //get subscribe list.
    const records = await collectionReference.where("roomId", "==", roomId).get();
    // Array of records is available under the data property
    const { data, cursor } = records;
    let subs = [];
    for (let i = 0; i < data.length; i++) {
        subs.push("eip155:5:" + data[i].data.address);
    }
    // console.log(subs);
    //send notify.
    const apiResponse = await PushAPI.payloads.sendNotification({
        signer: _signer,
        type: 4, // subset
        identityType: 2, // direct payload
        notification: {
            title: `${title} is kicking off.`,
            body: `click to join.`
        },
        payload: {
            title: "live room is kicking off",
            body: `click to join the meeting`,
            cta: `https://iframe.huddle01.com/${roomId}`,
            img: ''
        },
        recipients: subs, // recipients addresses
        channel: 'eip155:5:0x52bf58425cAd0B50fFcA8Dbe5447dcE9420a2610',
        env: 'staging'
    });

    // console.log(subs, apiResponse);
    res.status(200).json({})
}
