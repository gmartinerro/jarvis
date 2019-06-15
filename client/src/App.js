import React, { Component } from 'react';
import './App.scss';
import './components/Navbar.scss';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import {BrowserRouter, Route, withRouter} from 'react-router-dom';


const PageAwareBreadcrumbs = withRouter(props => <Breadcrumbs {...props}/>);


class App extends Component {
  render() {
    return (
      <div className="App fixed-navbar">
        <BrowserRouter>
          <Navbar />
          <PageAwareBreadcrumbs />
          <div className='app-content'>
              <Route path='/' exact component={DashboardPage}></Route>
              <Route path='/customers' component={CustomersPage}></Route>
          </div>
          <Footer/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
