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
import { createEventListeners } from './createEventListeners';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  //fetching data from smart contract and pass right here.
  const [walletAddress, setWalletAddress] = useState(""); // Save wallet address of the current player
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [battleName, setBattleName] = useState('')
  const [gameData, setGameData] = useState({
    players: [], pendingBattles: [], activeBattle: null, 
  })

  const navigate = useNavigate();
 

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

  useEffect(() =>{
    if(contract) {
      createEventListeners({
        navigate, contract, provider, walletAddress, setShowAlert,
      })
    }
  }, [contract])

  // Show Allert if something happens...
  useEffect(() => {
      if (showAlert?.status) {
        const timer = setTimeout(() => {
          setShowAlert({ status: false, type: "info", message: "" });
        }, [5000]);

        return () => clearTimeout(timer);
      }
  }, [showAlert]);

  // To check all the current ongoing battles created by the player
  // Set the game gata to state
  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles()
      const pendingBattles = fetchedBattles.filter((battle) => battle.status === 0)
      let activeBattle = null

      fetchedBattles.forEach((battle) => {
        if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())){
          if (battle.winner.startsWith('0x00')) {
            activeBattle = battle
          }
        }
      });
      
      setGameData({ pendingBattles: pendingBattles.slice(1),activeBattle })
      console.log(fetchedBattles)
    }

    if (contract) fetchGameData()
  }, [contract])

  return (
    <GlobalContext.Provider
      value={{
        //passing all the values which we would like to share with all the components in our application.
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
