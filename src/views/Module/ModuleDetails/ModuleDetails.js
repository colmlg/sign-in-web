import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import CircularProgressbar from 'react-circular-progressbar';
import dateFormat from 'dateformat';
import ModuleService from '../../../services/ModuleService';
import 'react-circular-progressbar/dist/styles.css';
import './progress.css';
import moment from 'moment';

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
            const attendance = this.calculateOverallModuleAttendance(response.module.students, response.lessons);

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
        if(this.state.attendance.overallLec) {
            header.push(<th>{"Lectures"}</th>);
        }

        if(this.state.attendance.overallLab) {
            header.push(<th>{"Labs"}</th>);
        }

        if(this.state.attendance.overallTut) {
            header.push(<th>{"Tutorials"}</th>);
        }
        header = header.concat(this.state.lessons.map(lesson => {
            return <th>{lesson.type} {dateFormat(lesson.date, "dd/mm/yyyy")} {lesson.startTime}</th>;
        }));

        return header;
    }

    createTableRows() {
        return this.state.students.map(student => {
            return <tr>
                <td>{student}</td>
                {this.getOverallAttendance(student)}
                {this.getLessonAttendance(student)}
            </tr>
        });
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
        if(this.state.attendance.overallLec) {
            const studentLec = this.state.attendance.lecStudent.find(s => s.id === student).attendance;
            cells.push(this.getPercentageCell(studentLec));
            sum += studentLec;
            counter++;
        }

        if(this.state.attendance.overallLab) {
            const studentLab = this.state.attendance.labStudent.find(s => s.id === student).attendance;
            cells.push(this.getPercentageCell(studentLab));
            sum += studentLab;
            counter++;
        }

        if(this.state.attendance.overallTut) {
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
        return <td className={`table-${this.getColorClassName(percentage)}`}>{percentage.toFixed(0) + "%"}</td>;
    }

    calculateOverallModuleAttendance(students, lessons) {
        let attendance = {};

        const lectures = lessons.filter(l => l.type === 'LEC');
        if(lectures.length > 0) {
            const lectureAttendance = this.calculateLectureAttendance(students, lectures);
            attendance.overallLec = lectureAttendance.overall;
            attendance.lecStudent = lectureAttendance.perStudent;
        }


        const labs = lessons.filter(l => l.type === 'LAB');
        if(labs.length > 0) {
            const labAttendance = this.calculateLabAndTutAttendance(students, labs);
            attendance.overallLab = labAttendance.overall;
            attendance.labStudent = labAttendance.perStudent;
        }


        const tuts = lessons.filter(l => l.type === 'TUT');
        if(tuts.length > 0) {
            const tutAttendance = this.calculateLabAndTutAttendance(students, tuts);
            attendance.overallTut = tutAttendance.overall;
            attendance.tutStudent = tutAttendance.perStudent;
        }

        this.calculateOverall(attendance);


        return attendance;
    }

    calculateOverall(attendance) {
        let counter = 0;
        let sum = 0;
        if(attendance.overallLec) {
            sum += attendance.overallLec;
            counter++;
        }

        if(attendance.overallLab) {
            sum += attendance.overallLab;
            counter++;
        }

        if(attendance.overallTut) {
            sum += attendance.overallTut;
            counter++;
        }

        attendance.overall = sum / counter;
    }

    calculateLectureAttendance(students, lessons) {
        const attendance = {
            overall: 0,
            perStudent: [],
        };
        const totalLessons = lessons.length;
        students.forEach(s => {
            const lessonsAttended = lessons.filter(l => l.studentsAttended.indexOf(s) !== -1).length;
            const percentage = ((lessonsAttended / totalLessons) * 100.0);
            attendance.perStudent.push({id: s, attendance: percentage});
        });

        attendance.overall = this.getAverage(attendance.perStudent);
        return attendance;
    }

    calculateLabAndTutAttendance(students, lessons) {
        const attendance = {
            overall: 0,
            perStudent: [],
        };

        let lessonsCopy = [...lessons];
        for(let i = 0; i < lessonsCopy.length; i++) {
            let lesson = lessonsCopy.shift();
            lessonsCopy = lessonsCopy.filter(l => !moment(lesson.date).isSame(moment(l.date), 'week'));
            lessonsCopy.push(lesson)
        }
        const goalNumber = lessonsCopy.length; //You must have attended this many labs to get 100%, i.e. 1 a week.

        //Attending two labs in one weeks will falsely push this number up...
        students.forEach(s => {
            const lessonsAttended = lessons.filter(l => l.studentsAttended.indexOf(s) !== -1).length;
            let percentage = ((lessonsAttended / goalNumber) * 100.0);
            if (percentage > 100) {
                percentage = 100;
            }
            attendance.perStudent.push({id: s, attendance: percentage});
        });

        attendance.overall = this.getAverage(attendance.perStudent);
        return attendance;
    }

    getAverage(perStudent) {
        let sum = 0;
        perStudent.forEach(s => {
            sum += parseInt(s.attendance);
        });
        let average = sum / perStudent.length;
        if(isNaN(average)) {
            average = 100;
        }
        return average;
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
