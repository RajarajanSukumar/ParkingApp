import './App.css';
import Header from './Header';
import LoginPage from './LoginPage';
import ParkingLot from './ParkingLot';
import ParkingConfirmation from './ParkingConfirmation';
import CancelBooking from './CancelBooking';
import parkingApi from './api/parkingSlots';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';


function App() {
  const[loginName, setLoginName] = useState('');
  const[loginPassword, setLoginPassword] = useState('');
  const[selectedSlots, setSelectedSlots] = useState([]);
  const[loggedIn, setLoggedIn] = useState(false);
  const[loginPage, setLoginPage] = useState(true);
  const[userName, setUserName] = useState('');
  const[userPassword, setUserPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');
  const[vehicleNumber, setVehicleNumber] = useState('');
  const[message, setMessage] = useState(null);
  const[showProfile, setShowProfile] = useState(false);

  const fetchData = async() => {
        const zoneKeys =  ['parkingData1', 'parkingData2', 'parkingData3', 'parkingData4'];
        const requests = zoneKeys.map((zoneId) => 
          parkingApi.get(`/${zoneId}`)
        );
        const response = await Promise.all(requests);
        const allSlots = response.flatMap(res => res.data);
        const selectedSlots = allSlots.filter(slot => slot.state === 'selected');
        return selectedSlots;
      }

  const handleLogout = () => {
    setLoginName('');
    setLoginPassword('');
    setLoggedIn(false);
    setLoginPage(true);
    setUserName('');
    setUserPassword('');
    setConfirmPassword('');
    setVehicleNumber('');
    setMessage(null);
    setShowProfile(false);
    setSelectedSlots([]);
  }

  return (
    <div className="App">
      <Header 
      loggedIn = {loggedIn}
      loginName={loginName}
      showProfile = {showProfile}
      setShowProfile = {setShowProfile}
      handleLogout = {handleLogout}/>

      <Routes>
        <Route path='/' element={
        <LoginPage 
        loginName = {loginName}
        setLoginName = {setLoginName}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        setLoggedIn = {setLoggedIn}
        loginPage = {loginPage}
        setLoginPage = {setLoginPage}
        userName = {userName}
        setUserName = {setUserName}
        userPassword = {userPassword}
        setUserPassword = {setUserPassword}
        confirmPassword = {confirmPassword}
        setConfirmPassword = {setConfirmPassword}
        vehicleNumber = {vehicleNumber}
        setVehicleNumber = {setVehicleNumber}
        message = {message}
        setMessage = {setMessage}/>
      }/>
        <Route path="/bookparking" element={<ParkingLot setSelectedSlots={setSelectedSlots}
        fetchData = {fetchData}/>}/>
        <Route path="/confirmbooking" element={<ParkingConfirmation selectedSlots={selectedSlots} 
        loginName = {loginName}
        handleLogout = {handleLogout}
        fetchData = {fetchData}/>}/>
        <Route path='/cancelBooking' element={<CancelBooking loginName = {loginName}
        handleLogout = {handleLogout}/>}/>
      </Routes>
    </div>
  );
}

export default App;
