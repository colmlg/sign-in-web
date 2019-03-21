import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import CircularProgressbar from 'react-circular-progressbar';
import dateFormat from 'dateformat';
import ModuleService from '../../../services/ModuleService';
import 'react-circular-progressbar/dist/styles.css';
import './progress.css';

class ModuleDetails extends Component {

    constructor(props) {
        super(props);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.createTableRows = this.createTableRows.bind(this);

        this.state = {
            lessons: [],
            students: [],
            attendance: {
                student: [],
                overall: 0,
            },
            moduleId: props.match.params.id,
        };
    }

    componentWillMount() {
        this.getModules(this.state.moduleId);
    }

    componentWillReceiveProps(nextProps) {
        this.getModules(nextProps.match.params.id);
    }

    getModules(id) {
        ModuleService.getModule(id).then(module => {
            const today = new Date();
            module.lessons = module.lessons.filter(lesson => new Date(lesson.date) <= today);
            const attendance = this.calculateOverallAttendance(module);

            this.setState({
                moduleId: id,
                students: module.module.students,
                lessons: module.lessons,
                attendance: attendance,
            });
        }).catch(error => {
            alert(error);
        });
    }

    createTableHeader() {
        return this.state.lessons.map(lesson => {
            return <th>{lesson.type} {dateFormat(lesson.date, "dd/mm/yyyy")} {lesson.startTime}</th>;
        });
    }

    createTableRows() {
        const rows = this.state.students.map(student => {
            return <tr>
                <td>{student}</td>
                {this.getOverallAttendance(student)}
                {this.getLessonAttendance(student)}
            </tr>
        });

        return rows;
    }

    getLessonAttendance(student) {
        return this.state.lessons.map(lesson => {
            return <td>{lesson.studentsAttended.indexOf(student) === -1 ? "" : "X"}</td>
        })
    }

    getOverallAttendance(student) {

        const percentage = this.state.attendance.student.find(e => e.id === student).attendance.toFixed(0);

        let color;
        if (percentage >= 75) {
            color = "table-success";
        } else if (percentage >= 50) {
            color = "table-warning";
        } else {
            color = "table-danger";
        }


        return <td class={color}>{percentage + "%"}</td>;
    }

    calculateOverallAttendance(module) {
        let attendance = {
            student: [],
            overall: 0,
        };

        const totalLessons = module.lessons.length;

        module.module.students.forEach(s => {
            const lessonsAttended = module.lessons.filter(l => l.studentsAttended.indexOf(s) !== -1).length;
            const percentage = ((lessonsAttended / totalLessons) * 100.0); //.toFixed(0)
            attendance.student.push({id: s, attendance: percentage });
        });

        //Calculate average attendance
        let sum = 0;
        attendance.student.forEach(s => {
            sum += parseInt(s.attendance);
        });

        attendance.overall = sum / attendance.student.length;

        return attendance;
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <strong>{this.state.moduleId}</strong>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <CircularProgressbar className={"module-details"}
                                                 percentage={this.state.attendance.overall}
                                                 text={`${this.state.attendance.overall}%`}/>
                        </Col>
                        <Col>
                            <CircularProgressbar className={"module-details"}
                                                 percentage={78}
                                                 text={`${98}%`}/>
                        </Col>
                        <Col>
                            <CircularProgressbar className={"module-details"}
                                                 percentage={45}
                                                 text={`${45}%`}/>
                        </Col>
                        <Col>
                            <CircularProgressbar className={"module-details"}
                                                 percentage={90}
                                                 text={`${90}%`}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 style={{textAlign: 'center',}}>Overall Attedance</h5>
                        </Col>
                        <Col>
                            <h5 style={{textAlign: 'center',}}>Lectures</h5>
                        </Col>
                        <Col>
                            <h5 style={{textAlign: 'center',}}>Labs</h5>
                        </Col>
                        <Col>
                            <h5 style={{textAlign: 'center',}}>Tutorials</h5>
                        </Col>
                    </Row>
                    <Table responsive striped hover bordered size="sm">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Attendance</th>
                            {this.createTableHeader()}
                        </tr>
                        </thead>
                        <tbody>
                        {this.createTableRows()}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        )
    }
}

export default ModuleDetails;
