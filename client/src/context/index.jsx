import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers"; // used to sending/receiving ether, interacting with smart contract and retrieving blockchain data. 
import Web3Modal from 'web3modal'; // This will allow to add multiple ethereum wallets to our website.
import { useNavigate } from "react-router-dom";

import { ABI, ADDRESS } from "../contract";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    //fetching data from smart contract and pass right here.
    const [walletAddress, setWalletAddress] = useState('')
    const [provider, setProvider] = useState('')
    const [contract, setContract] = useState('')

    //Setting the wallet address to the state.
    const updateCurrentWalletAddress = async() => {
        const accounts = await window.ethereum.request({ // we have ethereum as window object because of core wallet.
            method: 'eth_requestAccounts'
        })
        
       if(accounts) setWalletAddress(accounts[0])
    }

    useEffect(() => {
        updateCurrentWalletAddress()

        window.ethereum.on('accountsChanged', updateCurrentWalletAddress)
    }, [])
    
    //setting the smart contract and the provider to the state.
    useEffect(() => {
        const setSmartContractAndProvider = async() => {
            const web3modal = new web3modal();
            const connection = await web3modal.connect();
            const newProvider = new ethers.providers.Web3Provider
            (connection);
            const signer = newProvider.signer();
            const newContract = new ethers.Contract( ADDRESS, ABI, signer);

            setProvider(newProvider);
            setContract(newContract);
        }
    },[])
    
    return (
        <GlobalContext.Provider value={{
            //passing all the values which we would like to share with all the components in our application.
           contract, walletAddress
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext
(GlobalContext);