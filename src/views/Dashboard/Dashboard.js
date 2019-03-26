import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities'
import AttendanceCalculator from "../../services/AttendanceCalculator";
import ModuleService from "../../services/ModuleService";
import moment from 'moment';

const brandInfo = getStyle('--info');

let data1 = [];


const mainChartOpts = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {}
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                gridLines: {
                    drawOnChartArea: false,
                },
            }],
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: 4,
                    max: 20,
                },
            }],
    },
    elements: {
        point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
        },
    },
};

const mainChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
        {
            label: 'Attendance / Day of Week',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: data1,
        },
    ],
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOpts: mainChartOpts,
            chartData: mainChart,
        }
    }

    componentWillMount() {
        this.getModule();
    }

    getModule() {
        ModuleService.getModule("CS1231").then(response => {
            const today = new Date();
            response.lessons = response.lessons.filter(lesson => new Date(lesson.date) <= today);
            const attendance = AttendanceCalculator.calculateOverallModuleAttendance(response.module.students, response.lessons);
            this.makeChartData(attendance);
        }).catch(error => {
            alert(error);
        });
    }

    makeChartData(attendanceData) {
        const maxY = attendanceData.dayOfWeek.reduce((a, b) => Math.max(a, b)) + 5;
        mainChartOpts.scales.yAxes[0].ticks.max = maxY;
        mainChartOpts.scales.yAxes[0].ticks.stepSize = Math.ceil(maxY / 5);
        const chartData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Attendance / Day of Week',
                    backgroundColor: hexToRgba(brandInfo, 10),
                    borderColor: brandInfo,
                    pointHoverBackgroundColor: '#fff',
                    borderWidth: 2,
                    data: attendanceData.dayOfWeek,
                },
            ],
        };
        this.setState({chartOpts: mainChartOpts, chartData: chartData});
    }

    render() {

        return (
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <CardTitle>Attendance / Day of Week / Module</CardTitle>
                                </Col>
                                <Col>
                                    <Button color="primary" className="float-right"><i className="icon-cloud-download"/></Button>
                                </Col>
                            </Row>
                            <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                                <Line data={this.state.chartData} options={this.state.chartOpts} height={300}/>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Dashboard;
