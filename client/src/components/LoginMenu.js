import React, {Component} from 'react';
import './LoginMenu.scss';


class LoginMenu extends Component {
    render() {
      return (
        <div className="LoginMenu">
            <div className='login-name'>gmartinerro</div>
            <div className='login-avatar'><img src='https://app.taowifi.io/cms/336' alt='avatar'/></div>
        </div>
      );
    }
  }

export default LoginMenu;