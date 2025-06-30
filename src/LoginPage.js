import React from 'react';
import api from './api/login';
import './LoginPage.css'
import { useNavigate } from 'react-router-dom';

const LoginPage = ({loginName, setLoginName, loginPassword, setLoginPassword, setLoggedIn, loginPage, setLoginPage,userName,setUserName,userPassword,setUserPassword,confirmPassword,setConfirmPassword,vehicleNumber,setVehicleNumber,message,setMessage}) => {
 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;

    if(action === 'login'){
      const fetchLogin = async () => {
        try{
          const response = await api.get('/loginData');
          const checkLogin = await response.data;
          const userDetails =  checkLogin.filter((userDetail) => userDetail.username === loginName);
          if(!(userDetails.length>0)) throw Error('User name does not exist. Please Sign up');
          if(userDetails[0].password !== loginPassword) throw Error('Password is wrong. Please enter the correct password');
          setLoggedIn(true);
          navigate('/bookparking');
        }catch(err){
          if(err.response){
            setMessage(err.message);
          }else{
            setMessage(err.message);
          }
        } 
      }
      fetchLogin();
    }

    if(action === 'confirm'){
      const registerUser = async() => {
        try{
          const response  = await api.get('/loginData');
          const existingUsers = response.data;
          const exist = existingUsers.filter((user) => user.username === userName);
          if(exist.length>0) throw Error('Username already Exist. Please try different name');
          if(userPassword !== confirmPassword) throw Error('Set and Confirm Password does not match');

          const newUser = {username : userName, password : userPassword, vehicleNumber : vehicleNumber}
          await api.post('/loginData', newUser);
          setMessage('User registered successfully');
          setUserName('');
          setUserPassword('');
          setConfirmPassword('');
          setVehicleNumber('');
        }catch(err){
          setMessage(err.message);
        }
        
      }
      registerUser();
    }
  }

  const handleSignup = (e) => {
    e.preventDefault();
    setLoginName('');
    setLoginPassword('');
    setMessage('');
    setLoginPage(false);
  }

  const handleGoToLogin = (e) => {
    e.preventDefault();
    setMessage('');
    setLoginPage(true);
  }

  return (
    <>
    {loginPage && <div className='loginOutlet'>
        <h1>Book Your Parking</h1>
        <form onSubmit={(e) => handleLogin(e)}>
            <div className='input-group'>
                <p style={{paddingBottom:"5px", marginBottom:"0", marginTop:"2px", fontSize:"30px"}}>Username</p>
                <input type="text" 
                placeholder='Username'
                required
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}/>
            </div>
            <div className='input-group'>
                <p style={{paddingBottom:"5px", marginBottom:"0", marginTop:"2px", fontSize:"30px"}}>Password</p>
                <input type="password" 
                placeholder='Password'
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}/>
            </div>
            <button type='submit' value="login">LOGIN</button>
            <button type='button' onClick={(e) => handleSignup(e)}>SIGNUP</button>
        </form>
            {message && <p style={{color:'white'}}>{message}</p>}
    </div>}
    {!loginPage && <div className='loginOutlet'>
        <h1>SIGNUP</h1>
        <form onSubmit={(e) => handleLogin(e)}>
            <div className='input-group'>
                <p style={{paddingBottom:"5px", marginBottom:"0", marginTop:"2px", fontSize:"30px"}}>Username</p>
                <input type="text" 
                placeholder='Username'
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}/>
            </div>
            <div className='input-group'>
                <p style={{paddingBottom:"5px", marginBottom:"0", marginTop:"2px", fontSize:"30px"}}>Vehicle Number</p>
                <input type="text" 
                placeholder='Vehicle Number'
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}/>
            </div>
            <div className='input-group'>
                <p style={{paddingBottom:"5px", marginBottom:"0", marginTop:"2px", fontSize:"30px"}}>Set Password</p>
                <input type="password" 
                placeholder='Password'
                required
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}/>
            </div>
            <div className='input-group'>
                <p style={{paddingBottom:"5px", marginBottom:"0", marginTop:"2px", fontSize:"30px"}}>Confirm Password</p>
                <input type="password" 
                placeholder='Password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
            <button type='submit' value="confirm">Confirm</button>
            <button type='submit' onClick={(e) => handleGoToLogin(e)}>Go To Login</button>
        </form>
        {message && <p style={{color:'white'}}>{message}</p>}
    </div>}
    </>
  )
}

export default LoginPage