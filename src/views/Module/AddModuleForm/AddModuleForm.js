import React, {Component} from 'react';
import {
    Badge,
    Button,
    ButtonDropdown,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Fade,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Row,
} from 'reactstrap';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


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

        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    handleStartDateChange(date) {
        this.setState({startDate: date});
    }

    handleEndDateChange(date) {
        this.setState({endDate: date});
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(event) {
        alert('Start Date: ' + this.state.startDate);
        event.preventDefault();
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
                                            <Input type="text" id="module-code" name="module-code"
                                                   placeholder="e.g. CS1234"/>
                                            <FormText color="muted">Please enter the module code</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="date-input">Lecture Start Date</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <DatePicker
                                                name="startDate"
                                                selected={this.state.startDate}
                                                onChange={this.handleStartDateChange}
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
                                                name="endDate"
                                                selected={this.state.endDate}
                                                onChange={this.handleEndDateChange}
                                                dateFormat="P"
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="duration-input">Duration</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="duration" id="duration">
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
                                            <Input type="text" id="room-number" name="room-number"
                                                   placeholder="e.g. CS4005B"/>
                                            <FormText color="muted">Please enter the room number</FormText>
                                        </Col>
                                    </FormGroup>
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
