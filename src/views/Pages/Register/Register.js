import React, {Component} from 'react';
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from 'reactstrap';

import loginService from '../../../services/LoginService';

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            username: '',
            password: '',
            confirmPassword: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit() {
        if(this.state.username === '') {
            return this.setState({ errorMessage: "Please enter a username."});
        }

        if (this.state.password !== this.state.confirmPassword) {
            return this.setState({ errorMessage: "Passwords must match."});
        }

        if (this.state.password.length < 6) {
            return this.setState({ errorMessage: "Password must be at least 6 characters."});
        }

        this.setState({ errorMessage: ''});

        loginService.register(this.state.username, this.state.password).then(() => {
            this.props.history.push("/");
        }).catch(error => {
            this.setState({ errorMessage: error });
        });
    }


    render() {
        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="6">
                            <Card className="mx-4">
                                <CardBody className="p-4">
                                    <Form>
                                            {this.state.errorMessage === '' ? null :
                                                <Alert className='alert-danger' >
                                                    <p><span className="fa fa-warning fa-lg mt-4" /> {this.state.errorMessage}</p>
                                                </Alert>
                                            }
                                        <h1>Register</h1>
                                        <p className="text-muted">Create your account</p>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Username" autoComplete="username" name="username" onChange={this.handleChange}/>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" placeholder="Password" name="password" autoComplete="new-password" onChange={this.handleChange}/>
                                        </InputGroup>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" placeholder="Repeat password"
                                                   autoComplete="new-password" name="confirmPassword" onChange={this.handleChange}/>
                                        </InputGroup>
                                        <Button onClick={this.handleSubmit} color="success" block>Create Account</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Register;
