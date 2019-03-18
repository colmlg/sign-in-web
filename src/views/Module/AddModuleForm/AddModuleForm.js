import React, {Component} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    Row,
} from 'reactstrap';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import moduleService from '../../../services/ModuleService';
import dateFormat from 'dateformat';


class AddModuleForm extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleFade = this.toggleFade.bind(this);
        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit() {
        const newModule = {
            id: this.state.moduleCode,
            students: [ "student" ],
            lecturers: [ "lecturer" ],
            events: [
                {
                    startDate: this.state.startDate.toLocaleDateString("en-US"),
                    endDate: this.state.endDate.toLocaleDateString("en-US"),
                    startTime: dateFormat(this.state.startDate, "HH:MM"),
                    duration: this.state.duration,
                    roomNumber: this.state.roomNumber,
                    moduleId: this.state.moduleCode
                }
            ]
        };

        moduleService.addModule(newModule).then(() => {
            this.props.history.push('/');
        }).catch(error => {
            alert(error);
        });
    }

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }

    toggleFade() {
        this.setState((prevState) => {
            return {fadeIn: !prevState}
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="18" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Add a Module</strong>
                            </CardHeader>
                            <CardBody>
                                <Form className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Module Code</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="module-code" name="moduleCode"
                                                   placeholder="e.g. CS1234" onChange={this.handleChange}/>
                                            <FormText color="muted">Please enter the module code</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="date-input">Lecture Start Date</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <DatePicker
                                                selected={this.state.startDate}
                                                onChange={date => this.setState({startDate: date})}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={60}
                                                dateFormat="Pp"
                                                timeCaption="Time"
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="date-input">Lecture End Date</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <DatePicker
                                                selected={this.state.endDate}
                                                onChange={date => this.setState({endDate: date})}
                                                dateFormat="P"
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="duration-input">Duration</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="duration" id="duration" onChange={this.handleChange}>
                                                <option value="1">1 hour</option>
                                                <option value="2">2 hours</option>
                                                <option value="3">3 hours</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Room Number</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="room-number" name="roomNumber"
                                                   placeholder="e.g. CS4005B" onChange={this.handleChange}/>
                                            <FormText color="muted">Please enter the room number</FormText>
                                        </Col>
                                    </FormGroup>n
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={this.handleSubmit} size="sm" color="primary"><i
                                    className="fa fa-dot-circle-o"></i> Add Module</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default AddModuleForm;
