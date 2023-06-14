import { FaUserAlt, FaPlusSquare, FaListUl, FaAffiliatetheme, FaOctopusDeploy } from "react-icons/fa";
import styles from '../styles/Home.module.css';
import Image from 'next/image'
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Header() {
    const router = useRouter()
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { isConnected } = useAccount();
    const { switchNetwork } = useSwitchNetwork()
    const { chain } = useNetwork();
    const { asPath } = useRouter()

    const asPathLists = asPath == "/lists" ? "text-warning" : "";
    const asPathCreate = asPath == "/create" ? "text-warning" : "";
    const asPathAccount = asPath == "/my" ? "text-warning" : "";

    return (
        <div className="navbar text-neutral-content border-solid border-b-2 bg-base-content">
            <div className="flex-1 ml-3">
                <ul className='flex flex-row justify-between gap-6'>
                    <li className="cursor-pointer">
                        <Link className={styles.logo} href="/">
                            <a>
                                <FaOctopusDeploy className='text-success' size="2.2rem" />
                            </a>
                        </Link>
                        {/* <Link className={styles.logo} href="/">
                            <FaAffiliatetheme size="2.2rem" />
                        </Link> */}
                    </li>
                    <li className='mt-1'>
                        <Link href="/lists">
                            <a className={`${styles.leftToRight} ${asPathLists}`}>
                                <FaListUl size="1.2rem" />&nbsp;&nbsp;<div className='font-bold'>explore</div>
                            </a>
                        </Link>
                    </li>
                    <li className='mt-1'>
                        <Link href="/create">
                            <a className={`${styles.leftToRight} ${asPathCreate}`}>
                                <FaPlusSquare size="1.2rem" className='' />&nbsp;&nbsp;<div className='font-bold'>create</div>
                            </a>
                        </Link>
                    </li>

                    <li className='mt-1'>
                        <Link href="/my">
                            <a className={`${styles.leftToRight} ${asPathAccount}`}>
                                <FaUserAlt size="1.2rem" className='' />&nbsp;&nbsp;<div className='font-bold'>account</div>
                            </a>
                        </Link>
                    </li>

                </ul>
            </div>

            <div className="flex-none">
                {/* <>
                    <label className="swap swap-rotate ml-5">
                        <input type="checkbox" />

                        <svg className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

                        <svg className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

                    </label>
                </> */}

            </div>

            <div className="navbar-end">
                {isConnected && chain.id != 137 && <button className="btn btn-sm btn-warning ml-3 normal-case" onClick={() => switchNetwork(137)}>switch net</button>}

                {!isConnected && (<button className="btn btn-sm btn-warning ml-3 normal-case" onClick={openConnectModal}>connect wallet</button>)}

                {isConnected && chain &&
                    (<><button className="btn btn-sm btn-success ml-3 normal-case" onClick={openAccountModal}>Profile</button><button className="btn btn-sm btn-info ml-3 normal-case " onClick={openChainModal}>Chain</button></>)
                }
            </div>


        </div >
    )
}