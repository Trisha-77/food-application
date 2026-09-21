import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <Link className="footer-brand" to="/home"><span>●</span> Savoury</Link>
                <p>Thoughtful food ordering for the meals you are looking forward to.</p>
            </div>
            <div className="footer-content-center">
                <h2>EXPLORE</h2>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/menu">Menu</Link></li>
                    <li><Link to="/orders">Orders</Link></li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>INFORMATION</h2>
                <ul>
                    <li>About</li><li>Contact</li><li>Privacy</li><li>Terms</li>
                </ul>
            </div>
           
        </div>
        <hr />
        <p className="footer-copyright">
            © {new Date().getFullYear()} Savoury. All rights reserved.
        </p>
    </div>
  )
}

export default Footer
