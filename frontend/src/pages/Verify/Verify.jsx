import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';

const Verify = () => {

    const [searchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const sessionId = searchParams.get("session_id")
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () =>{
        if (!success || !orderId || (success === 'true' && !sessionId)) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.post(url+"/api/order/verify",{success, orderId, sessionId});
            navigate(response.data.success ? '/myorders' : '/');
        } catch {
            navigate('/');
        }
    }

    useEffect(()=>{
        verifyPayment();
    },[success, orderId, sessionId, url, navigate])
   
  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify
