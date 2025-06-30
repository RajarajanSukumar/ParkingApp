import React from 'react';
import { useState, useEffect } from 'react';
import parkingApi from './api/parkingSlots';
import './ParkingConfirmation.css'

const ParkingConfirmationCard = ({key, setCardNumber, currentSlot}) => {
  const[updatedHours, setUpdatedHours] = useState(1);
  useEffect(() => {
    const fetchHoursData = async() => {
      if (!currentSlot || !currentSlot.id) return;
      const response = await parkingApi.get(`/parkingData${(currentSlot.id).substring(1,2)}/${currentSlot.id}`);
      const hours =  response.data.noOfHours;
      setUpdatedHours(hours);
    };

    fetchHoursData();
  }, [currentSlot]);
  
  if (!currentSlot) {
    return <div className='confirmation-card'>No slot selected</div>;
  }


  const hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleChange = async(e) => {
    e.preventDefault();
    setUpdatedHours(e.target.value);
    await parkingApi.patch(`/parkingData${(currentSlot.id).substring(1,2)}/${currentSlot.id}`,{noOfHours : e.target.value})
  }


  return (
    <div className='confirmation-card'>
      <h1>{currentSlot.id}</h1>
      <p>Please select your No.of hours for the slot {currentSlot.id}</p>
      <p>No. of hours :  
        <select id='hours' value={updatedHours} onChange={(e) => handleChange(e)}>
          {hourOptions.map((hour) => (
            <option key={hour} value={hour}>
                {hour}
            </option>
          ))}
        </select>
      </p>
      <p>Total amount payable : {50*updatedHours}</p>
    </div>
  )
}

export default ParkingConfirmationCard