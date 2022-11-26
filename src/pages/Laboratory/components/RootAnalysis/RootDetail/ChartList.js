import React, {useEffect, Fragment, useRef} from 'react';
import Charts from "@/components/Charts";
import styles from './index.less';
import {Spin, Tooltip, Icon, Descriptions, Empty, Badge, Menu} from '@chaoswise/ui';
import Threshold from '@/components/Threshold';
import {useFetchState} from "@/components/HooksState";
import EchartsSetLine from "@/components/EchartsButton/EchartsSetLine";
import EchartsSaveGenerics from "@/components/EchartsButton/EchartsSaveGenerics";
import EchartsEditGenerics from "@/components/EchartsButton/EchartsEditGenerics";
import EchartsTriger from "@/components/EchartsButton/EchartsTriger";
import EchartsDelete from "@/components/EchartsButton/EchartsDelete";
import {success, warning, error, info} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from "react-router";

const statusObj = {
    'error': {
        title: IntlFormatMessage('laboratory.detail.failed'),
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_error'
        />,
        badge: <Badge status="error"/>
    },
    'warning': {
        title: IntlFormatMessage('laboratory.detail.trained'),
        badge: <Badge status="success"/>,
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'
        />,
    },
    'data_repeat': {
        title: `${IntlFormatMessage('laboratory.detail.untrainedvalue')}`,
        badge: <Badge status="warning"/>,
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'
        />,
    },
    'success': {
        title: IntlFormatMessage('laboratory.detail.trained'),
        badge: <Badge status="success"/>,
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_success'
        />,
    },
    'notStart': {
        title: IntlFormatMessage('laboratory.detail.untrainedvalue'),
        badge: <Badge status="default"/>,
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'
        />,
    },
    'starting': {
        title: IntlFormatMessage('laboratory.detail.training'),
        badge: <div className={styles['k-loader']}/>,
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'
        />,
    }
};

function ChartList(props) {
    const {
        setCurrentGenericList,
        editCurrentGeneric,
        item = {},
        index, ifSetAnalysis = false,
        selectOption = [], setSaveGeneVisible,
        getGenericSericeFun, selectedNode,
        runRootCauseAsync, record, taskId, onCancel, rootCauseGenericDataAsync,
        getTriggerresult,
    } = props;
    const ref = useRef({current: {}});
    const echartsref = useRef(null);
    const {id} = useParams();

    const fromModel = JSON.parse(toJS(selectedNode[0]).id).model;
    const fromTarget = JSON.parse(toJS(selectedNode[0]).id).target;
    const fromModelAndTargetJson = toJS(selectedNode[0]).id;

    const [chartData, setChartData] = useFetchState({});
    const [statusInfo, setStatusInfo] = useFetchState(null);
    const [rootLoading, setRootLoading] = useFetchState(false);

    useEffect(() => {
        if (item?.tuningBenchResult?.status) {
            setStatusInfo({
                status: item?.tuningBenchResult?.status,
                message: item?.tuningBenchResult?.message,
            });
        } else {
            setStatusInfo({
                status: 'notStart',
                message: '',
            });
        }
    }, [item?.tuningBenchResult?.status]);

    useEffect(() => {
        const {tuningBenchResult = {}, tuningBenchGeneric = {},} = item;
        setChartData(Object.assign({}, item, tuningBenchResult.data, {...tuningBenchGeneric}));
    }, [item]);

    const lengSelected = (value) => {
        const {selected = {}} = value;
        const fitUp = selected['下界'];
        const fitLow = selected['上界'];
        if (selected['下界'] !== undefined) {
            const option = ref.current['chart'].getOption();
            if (fitUp) {
                option.series[3].areaStyle.opacity = 1;
                option.series[3].lineStyle.opacity = 0;
                if (fitLow) {
                    option.series[2].lineStyle.opacity = 0;
                } else {
                    option.series[2].lineStyle.opacity = 1;
                }
            } else {
                option.series[3].areaStyle.opacity = 0;
                option.series[3].lineStyle.opacity = 1;
            }
            ref.current['chart'].setOption(option);
        }
    };
    const onChartReady = (chart) => {
        if (chart) {
            chart.group = 'echartsLink';
            // chart.on('legendselectchanged', lengSelected);
            if (runRootCauseAsync) {
                chart.getZr().on('dblclick', (e) => {
                    let pointInPixel = [e.offsetX, e.offsetY];
                    let pointInGrid = chart.convertFromPixel({
                        seriesIndex: 0
                    }, pointInPixel);
                    let xIndex = pointInGrid[0]; //索引
                    let handleIndex = Number(xIndex); //对应的x轴的值，也就是时间戳

                    const {
                        genericId, algorithmName, algorithmVersion, algorithmParams,
                        entryNodeJson, entryMetricJson, entryTimestamp,
                    } = record;

                    const params = {
                        taskId: taskId,
                        tuningBenchGenericId: record.id,
                        algorithmName,
                        algorithmVersion,
                        algorithmParams,
                        entryNodeJson: chartData.fromModelAndTargetJson || fromModelAndTargetJson,
                        entryMetricJson: chartData.entryMetricJson,
                        entryTimestamp: handleIndex,
                        isSaveEntry: true,
                    };
                    setRootLoading(true);
                    runRootCauseAsync(params, {
                        cb: () => {
                            setRootLoading(false);
                            onCancel();
                            getGenericSericeFun();
                        },
                        err: () => {
                            setRootLoading(false);
                        }
                    });
                });
            }
            ref.current['chart'] = chart;
        }
    };

    return (
        <div className={'chart-wrapper'} key={chartData.id}>
            <Spin tip={IntlFormatMessage('laboratory.anomaly.triggering')} spinning={rootLoading}>
                <div className={'chart-header'}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {
                            statusInfo && statusInfo.status && <Fragment>
                                {statusObj[statusInfo.status].badge}
                                <div>
                                    {IntlFormatMessage('laboratory.detail.status')}: {statusObj[statusInfo.status].title}
                                </div>
                                <span>
                                    {
                                        (statusObj[statusInfo.status].icon && statusInfo.message) &&
                                        <Tooltip title={statusInfo.message || ''}>
                                            {statusObj[statusInfo.status].icon}
                                        </Tooltip>
                                    }
                                </span>
                            </Fragment>
                        }
                        <div className="only-show-one-line" style={{marginLeft: 16, width: 300}}>
                            <Tooltip
                                title={`${IntlFormatMessage('laboratory.detail.metric')}: ${item.metric || item.rawData.metric || '-'}_${IntlFormatMessage('laboratory.detail.dimension')}: ${item.tags || item.rawData.tags || '-'}`}>
                                {`${IntlFormatMessage('laboratory.detail.metric')}: ${item.metric || item.rawData.metric || '-'}_${IntlFormatMessage('laboratory.detail.dimension')}: ${item.tags || item.rawData.tags || '-'}`}
                            </Tooltip>
                        </div>
                    </div>
                </div>
                {
                    !!chartData.tuningBenchResult && chartData.tuningBenchResult.data ?
                        <div style={{position: 'relative'}}>
                            <Charts
                                ref={echartsref}
                                onChartReady={onChartReady}
                                data={chartData}
                                ifSetAnalysis={ifSetAnalysis}
                                lineFeed={true}
                                // splitNumber={2}
                                // myTool4Func={() => {
                                //     setCurrentGenericList(chartData);
                                //     editCurrentGeneric(chartData, index);
                                // }}
                                // myTool8Func={() => {
                                //     if (!!chartData.tuningBenchGeneric && !!Object.keys(chartData.tuningBenchGeneric).length) {
                                //         getTriggerresult([chartData], '', index);
                                //     } else {
                                //         info(<span>请先<span
                                //             style={{color: '#008DFF', cursor: 'pointer'}}
                                //             onClick={() => {
                                //                 setCurrentGenericList(chartData);
                                //                 editCurrentGeneric(chartData, index);
                                //             }}
                                //         >设置泛型</span></span>, 5);
                                //     }
                                // }}
                            />
                            {
                                setCurrentGenericList && editCurrentGeneric &&
                                <div style={{
                                    position: 'absolute',
                                    zIndex: 999,
                                    height: 25,
                                    width: 200,
                                    textAlign: 'right',
                                    top: 4,
                                    right: 92,
                                }}>
                                    <EchartsTriger
                                        onClick={() => {
                                            if (!!chartData.tuningBenchGeneric && !!Object.keys(chartData.tuningBenchGeneric).length) {
                                                getTriggerresult([chartData], '', index);
                                            } else {
                                                info(<span>{IntlFormatMessage('laboratory.anomaly.firstGenerity')}<span
                                                    style={{color: '#008DFF', cursor: 'pointer'}}
                                                    onClick={() => {
                                                        setCurrentGenericList(chartData);
                                                        editCurrentGeneric(chartData, index);
                                                    }}
                                                >{IntlFormatMessage('laboratory.anomaly.firstGenericitySpecify')}</span></span>, 5);
                                            }
                                        }}
                                    />
                                    <EchartsEditGenerics
                                        onClick={() => {
                                            setCurrentGenericList(chartData);
                                            editCurrentGeneric(chartData, index);
                                        }}
                                    />
                                    <EchartsSaveGenerics
                                        onClick={() => {
                                            if (chartData.displayAlgorithmNames || chartData.algorithmName) {
                                                setCurrentGenericList(chartData);
                                                setSaveGeneVisible(true);
                                            } else {
                                                info(<span>{IntlFormatMessage('laboratory.anomaly.firstGenerity')}<span
                                                    style={{color: '#008DFF', cursor: 'pointer'}}
                                                    onClick={() => {
                                                        setCurrentGenericList(chartData);
                                                        editCurrentGeneric(chartData, index);
                                                    }}
                                                >{IntlFormatMessage('laboratory.anomaly.firstGenericitySpecify')}</span></span>, 5);
                                            }
                                        }}
                                    />
                                </div>
                            }
                        </div>
                        :
                        <Empty key={chartData.id} description={
                            chartData.message ?
                                <span>{chartData.message}</span>
                                :
                                <span>{IntlFormatMessage('task.detail.nogenericityfound')}</span>
                        } style={{height: 'calc(100% - 100px)'}}/>
                }
                <div className={'chart-bottom'}>
                    <div className='bottom-title'>
                        <p>{IntlFormatMessage('laboratory.detail.algorithmname')}：
                            <span>
                                {chartData.displayAlgorithmNames || (chartData.algorithmName || '')}&nbsp;
                                {chartData.algorithmVersion || ''}
                                <span style={{
                                    marginLeft: 24,
                                }}>
                                    {IntlFormatMessage('laboratory.detail.name')}：{chartData.genericName || ''}
                                </span>
                            </span>
                        </p>
                        <div style={{display: !selectOption.includes('parameter') ? 'none' : 'flex'}}>
                            <div style={{whiteSpace: 'nowrap'}}>{IntlFormatMessage('laboratory.detail.parameterBtn')}：
                            </div>
                            <Descriptions style={{flexGrow: 1, width: '100%'}} column={4}>
                                {
                                    (chartData.parameters || chartData.algorithmParams || []).filter(param => param.name !== 'stream_mode').map((param, index) => {
                                        if (param.name === 'training_days' && param.value) {
                                            let value = param.value;
                                            let newValue = Number(value.replace('M', ''));
                                            let renderValue = '';
                                            if (newValue / 60 < 1) {
                                                renderValue = `${newValue}min`;
                                            } else if (newValue / 60 >= 1 && newValue / 60 < 24) {
                                                renderValue = `${Math.ceil(newValue / 60)}h`;
                                            } else if (newValue / 60 >= 24) {
                                                renderValue = `${Math.ceil(newValue / 1440)}d`;
                                            }
                                            return <Descriptions.Item
                                                key={`${index}-${param.name}`}
                                                label={param.name}>
                                                {renderValue || param.value}
                                            </Descriptions.Item>;
                                        }
                                        return <Descriptions.Item
                                            key={`${index}-${param.name}`}
                                            label={param.name}>
                                            {param.value}
                                        </Descriptions.Item>;
                                    })
                                }
                            </Descriptions>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
}

export default connect(({laboratoryStore, genericsStore, TopoStore,}) => {
    return {
        rootCauseGenericDataAsync: laboratoryStore.rootCauseGenericDataAsync,

    };
})(ChartList);