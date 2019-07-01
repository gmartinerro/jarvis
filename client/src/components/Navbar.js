import React, {Component} from 'react';
import LoginMenu from './LoginMenu';
import AppLogo from '../jarvis-white-no-claim.svg';
import './Navbar.scss';
import {Link} from 'react-router-dom';

class Navbar extends Component {
    render() {
      return (
        <div className="Navbar">
          <img className='logo' src={AppLogo} alt='logo'/>
            <ul className='navbar-options'>
                <Link to='/'><li>Dashboard</li></Link>
                <Link to='/customers'><li>Customers</li></Link>
                <Link to='/profile'><li>Profile</li></Link>
            </ul>
            <LoginMenu/>
        </div>
      );
    }
  }

export default Navbar;