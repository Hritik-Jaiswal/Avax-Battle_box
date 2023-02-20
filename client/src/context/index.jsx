import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import { ethers } from "ethers"; // used to sending/receiving ether, interacting with smart contract and retrieving blockchain data.
import Web3Modal from "web3modal"; // This will allow to add multiple ethereum wallets to our website.
import { useNavigate } from "react-router-dom";

import { ABI, ADDRESS } from "../contract";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  //fetching data from smart contract and pass right here.
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const [showAlert, setShowAlert] = useState({
    status: "false",
    type: "info",
    message: "",
  });

  
  // const updateCurrentWalletAddress = async() => {
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

  //    if(accounts) setWalletAddress(accounts[0])
  // }

  // useEffect(() => {
  //     updateCurrentWalletAddress()

  //     window.ethereum.on('accountsChanged', updateCurrentWalletAddress)
  // }, [])

  //Setting the wallet address to the state.
  const updateCurrentWalletAddress = useCallback(async () => {
    // we have ethereum as window object because of core wallet.
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts) setWalletAddress(accounts[0]);
  }, [setWalletAddress]);

  useEffect(() => {
    updateCurrentWalletAddress();

    window.ethereum.on("accountsChanged", updateCurrentWalletAddress);

    // Clean up the subscription to avoid memory leaks
    return () => {
      window.ethereum.off("accountsChanged", updateCurrentWalletAddress);
    };
  }, [updateCurrentWalletAddress]);

  //setting the smart contract and the provider to the state.
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      try {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const newProvider = new ethers.providers.Web3Provider(connection);
        const signer = newProvider.getSigner();
        const newContract = new ethers.Contract(ADDRESS, ABI, signer);

        setProvider(newProvider);
        setContract(newContract);
      } catch (error) {
        console.error(error);
        // handle the error here, e.g. show an error message
      }
    };

    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: "false", type: "info", message: "" });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <GlobalContext.Provider
      value={{
        //passing all the values which we would like to share with all the components in our application.
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
