import React, { useState } from 'react';

import { PageHOC, CustomInput, CustomButton } from '../components'
import { useGlobalContext } from '../context';

const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState('')

  const handleClick = async() => {
    try {
      console.log({ contract })
      const playerExists = await contract.isPlayer(walletAddress)

      if(!playerExists) {
        await contract.registerPlayer( playerName, playerName )

        setShowAlert({
          status: true, 
          type: 'info', 
          message: `${playerName} is being summoned`
        })
      }
    } catch (error) {
      const errorMessage = error.message.match(/[^{]*/)[0].trim();
      setShowAlert({
        status: true, 
        type: 'failure', 
        message: errorMessage || "Something went wrong"
      })
      console.log(error, error.message)
    }
  }
  
  return (
    <div className="flex flex-col">
      <CustomInput 
        Label = 'Name' placeholder = 'Enter your name:' value={playerName} handleValueChange={setPlayerName}
      />

      <CustomButton 
        title = 'Register' restStyles='mt-6' 
        handleClick={handleClick}
      />
    </div>
  )
};

export default PageHOC(
  Home,
  <>Welcome to Avax Battle Box <br /> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> The ultimate Web3 Battle Card Game</>
);