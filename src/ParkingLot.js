import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ParkingSlot from './ParkingSlot';
import parkingApi from './api/parkingSlots';
import './ParkingLot.css'

const ParkingLot = ({setSelectedSlots, fetchData}) => {

    const[slots, setSlots] = useState([]);
    const [zoneBlock, setZoneBlock] = useState(1);
    const[confirmButton, setConfirmButton] = useState(false);

    
      useEffect(() => {
        const fetchParkingData = async(zoneBlock) => {
          try{
            const parkingDetails = await parkingApi.get(`/parkingData${zoneBlock}`);
            setSlots(parkingDetails.data)
          }catch(err){
            console.log(err.response)
          }
        };

        const checkSelectedSlots = async () => {
          const selectedSlots = await fetchData();
          setConfirmButton(selectedSlots.length > 0);
        };

        fetchParkingData(zoneBlock);
        checkSelectedSlots();
      },[zoneBlock, fetchData])


      const toggleSelect = async(index,id) => {
        const newSlots = slots.map((currentSlot,i) => i===index ? {...currentSlot, state: currentSlot.state === 'available' ? 'selected' : 'available'} : currentSlot);
        setSlots(newSlots);
        const respone = await parkingApi.get(`/parkingData${zoneBlock}/${id}`);
        const currentState = respone.data.state;
        const newState = currentState === 'available'?'selected':'available'
        await parkingApi.patch(`/parkingData${zoneBlock}/${id}`, {state: newState});

        const checkData = await fetchData();
        setConfirmButton(checkData.length > 0);
      }

      const handleConfirm = async() => {
        const checkData =await fetchData();
        setSelectedSlots(checkData);
      }
  return (
    <div className="parkingLayout">
        <div className='buttonGrid'>
          <div id='zoneSpace' onClick={() => setZoneBlock(1)}>Zone1</div>
          <div id='zoneSpace' onClick={() => setZoneBlock(2)}>Zone2</div>
          <div id='zoneSpace' onClick={() => setZoneBlock(3)}>Zone3</div>
          <div id='zoneSpace' onClick={() => setZoneBlock(4)}>Zone4</div>
        </div>
        <div className="parkingGrid">
        {slots.map((slot, index) => (
          <ParkingSlot
            key={slot.id}
            id={slot.id}
            state={slot.state}
            onClick={() => toggleSelect(index,slot.id)}
          />
        ))}
        </div>
        <Link to='/confirmbooking'>
          <button disabled={!confirmButton} className='confirmSlots' onClick={handleConfirm}>Confirm</button>
        </Link>
    </div>
  )
}

export default ParkingLot