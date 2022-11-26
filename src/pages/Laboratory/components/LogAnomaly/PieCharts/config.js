import {IntlFormatMessage} from "@/utils/util";

const ChartOption = () => {
    return {
        // color: ['#5792f9', '#f08cb4', '#60dcaa', '#64799b', '#fb8b16'],
        tooltip: {
            trigger: 'item',
        },
        title: {
            show: true,
            text: IntlFormatMessage('laboratory.anomaly.anomalyPercentage'),
            textAligin: 'left'
        },
        // grid: {
        //     top:'20%',
        //     left: '10%'
        // },
        legend: {
            type: 'scroll',
            top: 'middle',
            orient: 'vertical',
            right: '24px',
            algin: 'left',
            icon: 'react',
            itemGap: 15,
            itemHeight: 10,
            itemWidth: 10,
            textStyle: {
                width: 130,
                overflow: 'truncate',
            },
            tooltip: {
                show: true
            },
            // selected:{
            //     "未见异常数量":false,
            //     'Normal':false,
            // }
        },
        series: [
            {
                name: '',
                type: 'pie',
                center: ['35%', '50%'],
                radius: ['40%', '60%'],
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold',
                    }
                },
                labelLine: {
                    show: true
                },
                data: []
            },
        ],
    };
};

export default ChartOption;