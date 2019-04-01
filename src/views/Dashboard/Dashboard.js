import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

const brandSuccess = getStyle('--success');
const brandInfo = getStyle('--info');
const brandDanger = getStyle('--danger');

//Random Numbers
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let elements = 27;
let data1 = [];
let data2 = [];
let data3 = [];

for (let i = 0; i <= elements; i++) {
    data1.push(random(50, 200));
    data2.push(random(80, 100));
    data3.push(65);
}

const mainChart = {
    labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: hexToRgba(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: data1,
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'transparent',
            borderColor: brandSuccess,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: data2,
        },
        {
            label: 'My Third dataset',
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5],
            data: data3,
        },
    ],
};

const mainChartOpts = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
        }
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
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
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

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    onRadioBtnClick(radioSelected) {
        this.setState({
            radioSelected: radioSelected,
        });
    }

    render() {

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="5">
                                        <CardTitle className="mb-0">Attendance By day Of Week</CardTitle>
                                        <div className="small text-muted">March 2019</div>
                                    </Col>
                                    <Col sm="7" className="d-none d-sm-inline-block">
                                        <Button color="primary" className="float-right"><i className="icon-cloud-download" /></Button>
                                    </Col>
                                </Row>
                                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                                    <Line data={mainChart} options={mainChartOpts} height={300} />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;
