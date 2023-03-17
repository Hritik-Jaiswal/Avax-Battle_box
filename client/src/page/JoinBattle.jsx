import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../context";
import { PageHOC, CustomButton } from "../components";
import styles from '../styles'


const JoinBattle = () => {
  const { contract, gameData,setShowAllert, setBattleName, walletAddress } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles: </h2>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length 
          ? gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress)) 
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1 }
                </p>
              </div>
            ))
          : <p className={styles.joinLoading}>Reload the page to see new battles</p>};
      </div>
      <p className={styles.infoText} onClick={() => navigate('/create-battle')}>Or create a new battle</p>
    </>
  )
}

export default PageHOC(
  JoinBattle,
  <>Join <br /> A Battle</>,
  <>Join already existing battles</>
)