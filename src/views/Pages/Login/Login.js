import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import loginService from '../../../services/LoginService';

class Login extends Component {

    constructor() {
        super();
        loginService.logout();


        this.state = {
            username: '',
            password: '',
            errorMessage: ''
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        if (username && password) {
            loginService.login(username, password).then(() => {
                this.props.history.push('/');
            }).catch(error => {
                this.setState({errorMessage: error});
            });
        }
    }

  render() {
      return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" onChange={this.handleUsernameChange}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" onChange={this.handlePasswordChange}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <button  color="primary" className="px-4">Login</button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                        <Row>
                            {this.state.errorMessage === '' ? null :
                                <Alert className='alert-danger' style={{width: '100%'}}>
                                    <p><span className="fa fa-warning fa-lg mt-4" /> {this.state.errorMessage}</p>
                                </Alert>
                            }
                        </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Don't have an account? Sign up today!</p>
                      <Button color="primary" className="mt-3" active onClick={() => this.props.history.push('/register')}>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
