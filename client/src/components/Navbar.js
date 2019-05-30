import React, {Component} from 'react';
import LoginMenu from './LoginMenu';
import AppLogo from '../AIFR logo.png';
import './Navbar.scss';
import {Link} from 'react-router-dom';

class Navbar extends Component {
    render() {
      return (
        <div className="Navbar">
          <img className='logo' src={AppLogo} alt='logo'/>
            <ul className='navbar-options'>
                <Link to='/'><li>Dashboard</li></Link>
            </ul>
            <LoginMenu/>
        </div>
      );
    }
  }

export default Navbar;