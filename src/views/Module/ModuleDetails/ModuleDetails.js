import React, {Component} from 'react';
import {
    Card, CardBody,
    CardHeader, Table
} from 'reactstrap';
import dateFormat from 'dateformat';
import ModuleService from '../../../services/ModuleService';
import AddModuleForm from "../AddModuleForm";

class ModuleDetails extends Component {

    constructor(props) {
        super(props);
        this.createTableHeader = this.createTableHeader.bind(this);
        this.createTableRows = this.createTableRows.bind(this);
        this.getModuleAttendance = this.getModuleAttendance.bind(this);
        this.getModules = this.getModules.bind(this);
        this.state = {
            lessons: [],
            module: {
                students: [],
            },
            moduleId: props.match.params.id
        };
    }

    componentWillMount(){
        this.getModules();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({moduleId: nextProps.match.params.id});
        this.getModules();
    }

    getModules() {
        ModuleService.getModule(this.state.moduleId).then(module => {
            const today = new Date();
            module.lessons = module.lessons.filter(lesson => new Date(lesson.date) <= today);
            this.setState(module);
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
                <td>{this.calculateAttendance(student)}</td>
                {this.getModuleAttendance(student)}
            </tr>
        })
    }

    getModuleAttendance(student) {
        return this.state.lessons.map(lesson => {
            return <td>{lesson.studentsAttended.indexOf(student) === -1 ? "X" : "X"}</td>
        })
    }

    calculateAttendance(student) {
        return "100%";
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <strong>{this.state.moduleId}</strong>
                </CardHeader>
                <CardBody>
                    <Table responsive striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Attendance</th>
                            {this.createTableHeader()}
                        </tr>
                        {this.createTableRows()}
                        </thead>
                        <tbody>

                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        )
    }
}

export default ModuleDetails;
