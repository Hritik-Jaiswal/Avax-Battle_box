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
    status: false,
    type: "info",
    message: "",
  });

  
 

  // Set the provider, contract, and wallet address to the state.
useEffect(() => {
  const setSmartContractAndProvider = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newProvider = new ethers.providers.Web3Provider(connection);
    const signer = newProvider.getSigner();
    const newContract = new ethers.Contract(ADDRESS, ABI, signer);

    setProvider(newProvider);
    setContract(newContract);

    // Update the wallet address after connecting to the provider.
    const accounts = await newProvider.listAccounts();
    if (accounts.length) {
      setWalletAddress(accounts[0]);
    }
  };

  setSmartContractAndProvider();
}, []);

// Update the current wallet address in the state and listen for changes.
const updateCurrentWalletAddress = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length) {
      setWalletAddress(accounts[0]);
    }
  }
};

useEffect(() => {
  updateCurrentWalletAddress();

  window.ethereum?.on("accountsChanged", updateCurrentWalletAddress);
}, []);


  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
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
