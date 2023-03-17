import React from 'react'
import { useNavigate } from "react-router-dom";

import { CustomButton } from "../components";
import { useGlobalContext } from "../context";
import { player01, player02 } from "../assets";
import styles from '../styles'

const WaitScreen = () => {
    const { walletAddress } = useGlobalContext()
    const navigate = useNavigate()

  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
        <div className={styles.gameLoadBtnBox}>
            <CustomButton title='Choose Battleground' restStyles='mt-6' handleClick={() => navigate('/battleground')}/>
        </div>
        <div className={`flex-1 ${styles.flexCenter} flex-col`}>
            <h1 className={`${styles.headText} text-center`}>Waiting for a <br /> opponent...</h1>
            <p className={styles.gameLoadText}>While you're waiting choose your preferred battleground.</p>

            <div className={styles.gameLoadPlayersBox}>
                <div className={`${styles.flexCenter} flex-col`}>
                    <img src={player01} alt="player-1" className={styles.gameLoadPlayerImg}/>
                    <p className={styles.gameLoadPlayerText}>
                        {walletAddress}
                    </p>
                </div>{/** for player 1 */}
                
                <h2 className={styles.gameLoadVS}>Vs</h2>

                <div className={`${styles.flexCenter} flex-col`}>
                        <img src={player02} alt="player-1" className={styles.gameLoadPlayerImg}/>
                        <p className={styles.gameLoadPlayerText}>
                            waiting for a player to join...
                        </p>
                </div>{/** for player 2 */}
            </div> 

        </div> 
    </div>
  )
}

export default WaitScreen