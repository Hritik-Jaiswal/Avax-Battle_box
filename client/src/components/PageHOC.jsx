import React from 'react'
import { useNavigate } from 'react-router-dom'

import { heroImg, logo,  } from '../assets'
import styles from '../styles'

const PageHOC = ( Component, title, description ) => () => {
    const navigate = useNavigate()

  return (
    <div className={styles.hocContainer}>
        <div className={styles.hocContentBox}>
            <img src={logo} alt="logo" className={styles.hocLogo} onCLick={ () => navigate('/')} />

            <div className={styles.hocBodyWrapper}>
                <div className="flex flex-row w-full">
                    <h1 className={` flex ${styles.headText} head-text `}>{title}</h1>
                </div>
                <p className={` ${styles.normalText} my-10 `}>{description}</p>
                <Component />
            </div>

            <p className={styles.footerText}> A Web 3.0 Blockchain Based Game </p>

            <div className="flex flex-1">
                <img src={ heroImg } alt="Hero-Image" className='w-full xl:h-full object-cover' />
            </div>
        </div>
    </div>
  )
}

export default PageHOC;