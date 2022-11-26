let ChartOption = () => {
    return {
        color: ['#5792f9', '#f08cb4', '#60dcaa', '#64799b', '#fb8b16'],
        tooltip: {
            trigger: 'item',
        },
        grid: {
            top: '5%',
            bottom: '20',
        },
        title: {
            show: false,
            text: '',
            textStyle: {
                fontWeight: 400,
                fontsize: 16,
            },
            textAligin: 'left',
        },
        legend: {
            top: 500,
            orient: 'vertical',
            right: '70',
            bottom: 10,
            algin: 'left',
            icon: 'react',
            itemGap: 15,
            itemHeight: 10,
            itemWidth: 10,
        },
        xAxis: {
            type: 'category',
            axisLine: {
                show: false,
                color: '#AEB0B8',
            },
            splitLine: {
                show: false,
                lineStyle: {
                    // color: 'rgba(174,176,184,0.20)'
                },
            },
            scale: false,
            axisTick: {
                show: false,
                color: 'rgba(0,0,0,0.45)',
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0, //不再间隔显示
                formatter: function (value, index) {
                    let v = value.substring(0, 4) + '...';
                    return value.length > 5 ? v : value;
                }
            },
            data: [],
        },
        yAxis: {
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(174,176,184,0.20)',
                },
            },
            scale: false,
            splitNumber: 5,
            axisTick: {
                show: false,
                color: 'rgba(0,0,0,0.45)',
            },
            type: 'value',
        },
        series: [
            {
                name: '',
                type: 'bar',
                showBackground: true,
                data: [],
                barWidth: 50,
            },
        ],
    };
};

export default ChartOption;
