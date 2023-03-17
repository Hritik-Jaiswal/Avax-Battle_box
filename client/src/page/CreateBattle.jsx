import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { CustomButton, CustomInput, PageHOC, WaitScreen } from '../components'
import styles from '../styles'
import { useGlobalContext } from "../context";

const CreateBattle = () => {
  const { contract, battleName, setBattleName, gameData} = useGlobalContext()
  const navigate = useNavigate()

  const [waitBattle, setWaitBattle] = useState(false)

  // Current open battles
  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true)
    }
    console.log(gameData)
  }, [gameData]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null

    try {
      await contract.createBattle(battleName)

      setWaitBattle(true)
    } catch(error) {
        console.log(error)
    }
  }
  
  return (
    <>
      { waitBattle && <WaitScreen />}
      <div className="flex flex-col mb-5">
        <CustomInput Label="Battle" placeholder="Enter battle name" value={battleName} handleValueChange={setBattleName}/>
        <CustomButton title="Create Battle" handleClick={handleClick} restStyles="mt-6" />
      </div> 

      <p className={styles.infoText} onClick={() => navigate('/join-battle')}>Or join an existing battle</p>
    </>
  )
};

export default PageHOC(
  CreateBattle,
  <>Create <br /> A new battle</>,
  <>Create your own battle and wait for another player to join </>
);