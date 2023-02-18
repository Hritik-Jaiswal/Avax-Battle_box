import React from 'react';
import { PageHOC } from '../components'

const CreateBattle = () => {
  return (
    <div>
      
    </div>
  )
};

export default PageHOC(
  CreateBattle,
  <>Create <br /> A new battle</>,
  <>Create your own battle and wait for another player to join </>
);