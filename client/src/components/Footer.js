import React, {Component} from 'react';
import './Footer.scss';


class Footer extends Component {
    render() {
      // The last div serves as a spacer to build a larger footer. In final versions, it will be filled up with the web map, contant info, etc.
      return (
        <footer className="Footer">
            A.I. for restaurants
            <div style={{height:20}}></div>
        </footer>
      );
    }
  }

export default Footer;