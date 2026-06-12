import React, { useEffect, useState } from 'react';
import { CentralWarroomTable } from '../Table/WarroomData';
import ReactApexChart from 'react-apexcharts';

export default function Test() {

    const config = {
        series: [16, 16],
        options: {
            labels: ['Male', 'Female'],
            colors: ['rgb(254, 176, 25)', 'rgb(0, 227, 150)'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    }

    const piechart1 = {
        series: [36308,
            16609,
            1062,
            1002,
            217,
            166,
            150,
            143,
            95,
            85,
            61,
            52,
            50,
            38,
            16,
            9,
            1,
            0,
        ],
        options: {
            labels: ['Chongqing Shuangqiao Chia Tai Co., Ltd.',
                'Shijiazhuang Chia Tai Co., Ltd.',
                'Chia Tai Feed(Sui zhou) Co., Ltd.',
                'WUXUAN CHIA TAI ANIMAL HUSBANDRY CO., LTD.',
                'Huai Hua Chia Tai Co., Ltd.',
                'Ganzhou Chia Tai Industrial Co., Ltd.',
                'Weinan Chia Tai Co., Ltd.',
                'Lianyungang Chia Tai Agro - Industry Development Co., Ltd.',
                'Hebei C.P.Livestock Co., Ltd.',
                'Chia Tai Feed(Yushu) Co., Ltd.',
                'Yinchuan Chia Tai Co., Ltd.',
                'Mianyang Chia Tai Co., Ltd',
                'Yichang Chia Tai Animal Husbandry Co., Ltd.（Xiaogan branch）',
                'Chia Tai Feed (Zhanjiang) Co., Ltd.',
                'Guangdong Chia Tai Ecological Agriculture Co., Ltd.',
                'Jiangsu Huai yin Chia Tai Co., Ltd.',
                'Ji Lin De Da Feed Co. Ltd.',
                'Inner Mongolia Chia Tai Co., Ltd.',
            ],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%'
                    },
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        Text: 'Employee China'
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                            return `${w.config.labels[dataPointIndex]}: ${val}`;
                        },
                        style: {
                            fontSize: '14px'
                        }
                    }
                }
            }]
        },
    }



    return (
        <div className="test">
            <div className='pie-chart-container'>
                <div>
                    <ReactApexChart options={config.options} series={config.series} height={302} type="pie" />
                </div>
                <div>
                    <ReactApexChart options={piechart1.options} series={piechart1.series} height={350} type="pie" />
                </div>
            </div>
            <CentralWarroomTable />
        </div >
    );
}