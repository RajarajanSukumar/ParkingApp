import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import ParkingConfirmationCard from './ParkingConfirmationCard';
import parkingApi from './api/parkingSlots';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import './ParkingConfirmation.css'

const ParkingConfirmationGrid = ({selectedSlots, loginName, handleLogout, fetchData}) => {
  const[cardNumber, setCardNumber] = useState(0);
  const[confirmPopup, setConfirmPopup] = useState(false);
  const[totalAmount, setTotalAmount] = useState(0);
  const currentSlot = selectedSlots[cardNumber];

  const disableLeft = selectedSlots.length <= 1 || cardNumber === 0;
  const disableRight = selectedSlots.length <= 1 || cardNumber === selectedSlots.length - 1;
  
  const prev = async() =>{
    setCardNumber(cardNumber - 1);
  };
  const next = async() =>{
    setCardNumber(cardNumber + 1);
  };
 
  let total = 0;
  const handleConfirmBooking = async() => {
    setConfirmPopup(true);
    const toBeBookedSlots = await fetchData();
    toBeBookedSlots.map((slot)=>(
      total = total + (slot.noOfHours * 50)
    ))
    setTotalAmount(total);
    
    await Promise.all(
      selectedSlots.map(async(confirmedSlot)=>{
      const updateZoneBlock = confirmedSlot.id.substring(1,2);
      await parkingApi.patch(`/parkingData${updateZoneBlock}/${confirmedSlot.id}`, {state:'booked', bookedBy:loginName});
    })
  )
  }

  return (
    <div>
      <div className='confirmation-grid'>
          <button
          onClick={prev}
          disabled={disableLeft}
          style={{ border: 'none', background: 'none', cursor: disableLeft ? 'not-allowed' : 'pointer' }}
          >
          <FaAngleLeft style={{ fontSize: "30px", color: disableLeft ? 'gray' : 'white' }} />
          </button>
          <ParkingConfirmationCard 
          setCardNumber={setCardNumber}
          currentSlot={currentSlot}
          />
          <button
          onClick={next}
          disabled={disableRight}
          style={{ border: 'none', background: 'none', cursor: disableRight ? 'not-allowed' : 'pointer' }}
          >
          <FaAngleRight style={{ fontSize: "30px", color: disableRight ? 'gray' : 'white' }} />
          </button>
      </div>
      <div className='confirmBooking'>
        <button className='confirmBookingButton' onClick={handleConfirmBooking}>Confirm Booking</button>
      </div>
      <div>
      {confirmPopup && 
        <div className='confirmOverlay'>
        <div className='confirmBox'>
        <h2>Your slots are booked successfully : </h2>
        <br/>
        <div>
        {selectedSlots.map((slot)=>(
          <p>{slot.id}</p>
        ))}
        </div>
        <p>Total Amount payable : {totalAmount}</p>
        <p>To book more slots, select book parking</p>
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
    </div>
  )
}

export default ParkingConfirmationGrid