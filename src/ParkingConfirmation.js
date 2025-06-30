import React from 'react';
import ParkingConfirmationGrid from './ParkingConfirmationGrid';
import './ParkingConfirmation.css'

const ParkingConfirmation = ({selectedSlots,loginName, handleLogout, fetchData}) => {
  return (
    <div className='confirmationLayout'>
        {<ParkingConfirmationGrid 
        selectedSlots = {selectedSlots}
        loginName = {loginName}
        handleLogout = {handleLogout}
        fetchData = {fetchData}/>}
    </div>
  )
}

export default ParkingConfirmation