import React from 'react'
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import './App.css';

const Header = ({loggedIn, loginName, showProfile, setShowProfile, handleLogout}) => {
  console.log(loginName);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    console.log(loginName);
  }


  return (
    <div className='mainHeader' style={{display:"flex"}}> 
        <h1 style={{textAlign:"center"}}>Parking</h1>
        {loggedIn && <CgProfile style={{fontSize:"30px",position:"absolute",top:"45px",right:"30px", cursor:"pointer"}} onClick={toggleProfile}/>}
        {showProfile && 
          <div className='myProfile'>
            <h4>Hi {loginName},</h4>
            <div>
            <Link to='/cancelbooking'>
              <button className="myProfile-btn" onClick={()=>setShowProfile(!showProfile)}>Cancel Booking</button>
            </Link>
            </div>
            <div>
            <Link to='/'>
              <button className="myProfile-btn" onClick={handleLogout}>Logout</button>
            </Link>
            </div>
          </div>}
    </div>
  )
}

export default Header