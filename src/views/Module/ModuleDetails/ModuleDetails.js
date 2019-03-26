import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import CircularProgressbar from 'react-circular-progressbar';
import dateFormat from 'dateformat';
import ModuleService from '../../../services/ModuleService';
import 'react-circular-progressbar/dist/styles.css';
import './progress.css';
import AttendanceCalculator from '../../../services/AttendanceCalculator';

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
        ModuleService.getModule(id).then(response => {
            const today = new Date();
            response.lessons = response.lessons.filter(lesson => new Date(lesson.date) <= today);
            const attendance = AttendanceCalculator.calculateOverallModuleAttendance(response.module.students, response.lessons);

            this.setState({
                moduleId: id,
                students: response.module.students,
                lessons: response.lessons,
                attendance: attendance,
            });
        }).catch(error => {
            alert(error);
        });
    }

    createTableHeader() {
        let header = [];
        if(this.state.attendance.overallLec !== undefined) {
            header.push(<th>{"Lectures"}</th>);
        }

        if(this.state.attendance.overallLab !== undefined) {
            header.push(<th>{"Labs"}</th>);
        }

        if(this.state.attendance.overallTut !== undefined) {
            header.push(<th>{"Tutorials"}</th>);
        }
        header = header.concat(this.state.lessons.map(lesson => {
            return <th>{lesson.type} {dateFormat(lesson.date, "dd/mm/yyyy")} {lesson.startTime}</th>;
        }));

        return header;
    }

    createTableRows() {
        const studentRows = this.state.students.map(student => {
            return <tr>
                <td>{student}</td>
                {this.getOverallAttendance(student)}
                {this.getLessonAttendance(student)}
            </tr>
        });

        const lessonRow = <tr>
            <th scope="row">Total</th>
            {this.getPercentageCell(this.state.attendance.overall)}
            {this.getPercentageCell(this.state.attendance.overallLec)}
            {this.getPercentageCell(this.state.attendance.overallLab)}
            {this.getPercentageCell(this.state.attendance.overallTut)}
            {this.state.lessons.map(l => <td>{l.studentsAttended.length}</td>)}
        </tr>;

        return [lessonRow, studentRows];

    }

    getLessonAttendance(student) {
        return this.state.lessons.map(lesson => {
            return <td className={"check-mark"}>{lesson.studentsAttended.indexOf(student) === -1 ? "" : "✓"}</td>
        })
    }

    getOverallAttendance(student) {
        const cells = [];
        let counter = 0;
        let sum = 0;
        if(this.state.attendance.overallLec !== undefined) {
            const studentLec = this.state.attendance.lecStudent.find(s => s.id === student).attendance;
            cells.push(this.getPercentageCell(studentLec));
            sum += studentLec;
            counter++;
        }

        if(this.state.attendance.overallLab !== undefined) {
            const studentLab = this.state.attendance.labStudent.find(s => s.id === student).attendance;
            cells.push(this.getPercentageCell(studentLab));
            sum += studentLab;
            counter++;
        }

        if(this.state.attendance.overallTut !== undefined) {
            const studentTut = this.state.attendance.tutStudent.find(s => s.id === student).attendance;
            cells.push(this.getPercentageCell(studentTut));
            sum += studentTut;
            counter++;
        }

        const overallAttendance = sum / counter;
        cells.unshift(this.getPercentageCell(overallAttendance));
        return cells;

    }

    getPercentageCell(percentage) {
        if(percentage === undefined) {
            return <td>-</td>;
        }

        return <td className={`table-${this.getColorClassName(percentage)}`}>{percentage.toFixed(0) + "%"}</td>;
    }

    getColorClassName(percentage) {
        if(percentage >= 75) {
            return "success"
        } else if (percentage >= 50) {
            return "warning"
        } else {
            return "danger"
        }
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
                            <CircularProgressbar className={`module-details ${this.getColorClassName(this.state.attendance.overall)}`}
                                                 percentage={this.state.attendance.overall}
                                                 text={`${this.state.attendance.overall.toFixed(0)}%`}/>
                        </Col>
                        {
                            this.state.attendance.overallLec === undefined ? null :
                                <Col>
                            <CircularProgressbar className={`module-details ${this.getColorClassName(this.state.attendance.overallLec)}`}
                                                 percentage={this.state.attendance.overallLec}
                                                 text={`${this.state.attendance.overallLec.toFixed(0)}%`}/>
                        </Col>

                        }
                        {
                            this.state.attendance.overallLab === undefined ? null :
                                <Col>
                                    <CircularProgressbar
                                        className={`module-details ${this.getColorClassName(this.state.attendance.overallLab)}`}
                                        percentage={this.state.attendance.overallLab}
                                        text={`${this.state.attendance.overallLab.toFixed(0)}%`}/>
                                </Col>
                        }
                        {
                            this.state.attendance.overallTut === undefined ? null :
                                <Col>
                                    <CircularProgressbar
                                        className={`module-details ${this.getColorClassName(this.state.attendance.overallTut)}`}
                                        percentage={this.state.attendance.overallTut}
                                        text={`${this.state.attendance.overallTut.toFixed(0)}%`}/>
                                </Col>
                        }
                    </Row>
                    <Row>
                        <Col>
                            <h5>Overall Attendance</h5>
                        </Col>
                        {
                            this.state.attendance.overallLec === undefined ? null :
                                <Col>
                                    <h5>Lectures</h5>
                                </Col>
                        }
                        {
                            this.state.attendance.overallLab === undefined ? null :
                                <Col>
                                    <h5>Labs</h5>
                                </Col>
                        }
                        {
                            this.state.attendance.overallTut === undefined ? null :
                                <Col>
                                    <h5>Tutorials</h5>
                                </Col>
                        }
                    </Row>
                    <Table responsive striped hover bordered size="sm">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Overall</th>
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
