import React, {Component} from 'react';
import {
    Card, CardBody,
    CardHeader, Table
} from 'reactstrap';
import dateFormat from 'dateformat';
import ModuleService from '../../../services/ModuleService';

class ModuleDetails extends Component {

    constructor(props) {
        super(props);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.createTableRows = this.createTableRows.bind(this);

        this.state = {
            lessons: [],
            module: {
                students: [],
            },
            moduleId: props.match.params.id
        };
    }

    componentWillMount(){
        this.getModules(this.state.moduleId);
    }

    componentWillReceiveProps(nextProps) {
        this.getModules(nextProps.match.params.id);
    }

    getModules(id) {
        ModuleService.getModule(id).then(module => {
            const today = new Date();
            module.lessons = module.lessons.filter(lesson => new Date(lesson.date) <= today);
            this.setState({
                moduleId: id,
                module: module.module,
                lessons: module.lessons,
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
        return this.state.module.students.map(student => {
            return <tr>
                <td>{student}</td>
                {this.calculateAttendance(student)}
                {this.getModuleAttendance(student)}
            </tr>
        })
    }

    getModuleAttendance(student) {
        return this.state.lessons.map(lesson => {
            return <td>{lesson.studentsAttended.indexOf(student) === -1 ? "" : "X"}</td>
        })
    }

    calculateAttendance(student) {
        const totalLessons = this.state.lessons.length;
        const lessonsAttended = this.state.lessons.filter(lesson => lesson.studentsAttended.indexOf(student) !== -1).length;
        const percentage = ((lessonsAttended / totalLessons) * 100.0).toFixed(0);

        let color;
        if(percentage >= 80) {
            color = "table-success";
        } else if(percentage >= 50) {
            color = "table-success";
        } else {
            color = "table-danger";
        }

        return <td class={color}>{percentage + "%"}</td>;
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <strong>{this.state.moduleId}</strong>
                </CardHeader>
                <CardBody>
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
