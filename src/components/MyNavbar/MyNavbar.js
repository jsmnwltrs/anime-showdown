import React from 'react';
import './MyNavbar.scss';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

class MyNavbar extends React.Component {
  static propTypes = {
    isAuthed: PropTypes.bool,
    logoutClickEvent: PropTypes.func,
    levelUpToken: PropTypes.number,
    characterToken: PropTypes.number,
  }

  state = {
    isOpen: false,
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const {
      isAuthed,
      logoutClickEvent,
      levelUpToken,
      characterToken,
    } = this.props;
    const buildNavbar = () => {
      if (isAuthed) {
        return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <p title='character tokens' className='userToken m-1 mr-5'><i className="fas fa-user-plus"> : </i> {characterToken}</p>
          </NavItem>
          <NavItem>
            <p title='level up tokens' className='userToken m-1 mr-5'><i className="fas fa-angle-double-up"> : </i> {levelUpToken}</p>
          </NavItem>
          <NavItem>
            <NavLink tag={RRNavLink} to='/characters'>Characters</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRNavLink} to='/locations'>Locations</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={logoutClickEvent}>Logout</NavLink>
          </NavItem>
        </Nav>
        );
      }
      return <Nav className="ml-auto" navbar />;
    };

    return (
      <div className="my-navbar fixed-top align-self-start">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Anime Showdown</NavbarBrand>
          <NavbarToggler onClick={e => this.toggle(e)} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {buildNavbar()}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;
