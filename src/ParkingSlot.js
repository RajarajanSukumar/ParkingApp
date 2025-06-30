import React from 'react'
import './ParkingSlot.css'

const ParkingSlot = ({id, state, onClick}) => {

    let bgSlotColor = '';
    let pointerEvents = 'auto';

    if(state === 'available'){
        bgSlotColor = 'green';
    }

    if(state === 'booked'){
        bgSlotColor = 'red';
        pointerEvents = 'none';
    } 

    if(state === 'selected'){
        bgSlotColor = 'blue';
    }

    const mySlotStyle = {
        backgroundColor: bgSlotColor,
        pointerEvents: pointerEvents
    }


  return (
    <div className="slotSpace" style={mySlotStyle} onClick={onClick}>{id}</div>
  )
}

export default ParkingSlot