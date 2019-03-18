import React, {Component} from 'react';
import {Button, Nav, NavItem} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo_green_final.png'
import sygnet from '../../assets/img/brand/sygnet.svg'
import LoginService from '../../services/LoginService';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

    render() {
        return (
            <React.Fragment>
                <AppSidebarToggler className="d-lg-none" display="md" mobile/>
                <AppNavbarBrand
                    full={{src: logo, width: 89, height: 25, alt: 'CoreUI Logo'}}
                    minimized={{src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo'}}
                />
                <AppSidebarToggler className="d-md-down-none" display="lg"/>

                <Nav className="d-md-down-none" navbar>

                </Nav>
                <Nav className="ml-auto" navbar>
                    <NavItem className="d-md-down-none">
                        <Button onClick={() => {
                            LoginService.logout();
                            window.location.reload(true);
                        }} size="sm" color="primary">Log Out</Button>
                    </NavItem>
                </Nav>
            </React.Fragment>
        );
    }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
