import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import parkingApi from './api/parkingSlots';
import './CancelBooking.css'

const CancelBooking = ({loginName, handleLogout}) => {

  const[bookedSlots, setBookedSlots] = useState([]);
  const[checkedSlots, setCheckedSlots] = useState([]);
  const[refundAmount, setRefundAmount] = useState(0);
  const[cancelPopup, setCancelPopup] = useState(false);

  const fetchBookedData = async() =>{
    const zoneKeys =  ['parkingData1', 'parkingData2', 'parkingData3', 'parkingData4'];
    const requests = zoneKeys.map((zoneId) => 
      parkingApi.get(`/${zoneId}`)
    );
    const response = await Promise.all(requests);
    const allSlots = response.flatMap(res => res.data);
    const finalSlots = allSlots.filter(slot => (slot.state === 'booked' && slot.bookedBy === loginName));
    setBookedSlots(finalSlots);
  }
  
  useEffect(()=>{
    fetchBookedData();
  },[loginName]);
  

  const handleCheckBoxChange = (slotId) =>{
    setCheckedSlots((preValues) => (
      preValues.includes(slotId) ? preValues.filter((id) => id !== slotId) : [...preValues, slotId]
    ))
  }

  const handleCancel = async() => {
    setCancelPopup(true);
    let totalRefund = 0;
    await Promise.all(
      checkedSlots.map(async(cancelledSlot)=>{
        const zoneBlock = cancelledSlot.substring(1,2);
        const request = await parkingApi.get(`/parkingData${zoneBlock}/${cancelledSlot}`);
        const currentValue = request.data;
        totalRefund += currentValue.noOfHours * 50;
        await parkingApi.patch(`/parkingData${zoneBlock}/${cancelledSlot}`,{state:'available', bookedBy:'',noOfHours:1});
        setRefundAmount(totalRefund);
        await fetchBookedData();
        setCheckedSlots([]);
      })
    )
  }

  return (
    <div className='cancelLayout'>
      <div className='cancelOutline'>
      {bookedSlots.length === 0 ? (
          <p>No slots booked. Book your slots now!!</p>
        ) : (
          <>
            <h3>Slots you booked:</h3>
            {bookedSlots.map((slot) => (
              <div className='checkBox'>
              <label key={slot.id}>
                <input type="checkbox" id={slot.id}
                checked = {checkedSlots.includes(slot.id)}
                className='slotChecks'
                onChange={()=>handleCheckBoxChange(slot.id)} />
                {slot.id}
              </label>
              </div>
            ))}
            <button className='confirmCancel' onClick={handleCancel}>Confirmation Cancellation</button>
          </>
        )}
      </div>
      {cancelPopup && 
        <div className='cancelOverlay'>
        <div className='cancelPopup'>
        <h2>Slots are cancelled successfully</h2>
        <p>Your total refund amount will be : {refundAmount}</p>
        <div>
          {checkedSlots.map((slot)=>(
            <p>{slot.id}</p>
          ))}
        </div>
        <p>To book slots, select book parking</p>
        <div style={{display:"flex",justifyContent:"center", gap:"12px"}}>
          <Link to='/bookparking'>
            <button>Book Parking</button>
          </Link>
          <Link to='/'>
            <button onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      </div>
      </div>}
    </div>
  )
}

export default CancelBooking