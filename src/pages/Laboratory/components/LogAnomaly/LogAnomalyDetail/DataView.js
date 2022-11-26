import React, {Fragment, useEffect, useMemo, useRef} from 'react';
import PieCharts from '../PieCharts';
import {omit} from "lodash-es";
// import LineCharts from '../LineCharts';
import styles from './index.less';
import LineChart from "@/components/LineCharts";
import {connect, toJS} from "@chaoswise/cw-mobx";
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {
    Form, Spin, Button, Row, Col, Descriptions, Icon, Badge, Tooltip, Modal,
    Empty,
} from '@chaoswise/ui';
import {html2canvas, BrowserType,} from '@chaoswise/utils';
import {useFetchState} from "@/components/HooksState";
import {useHistory, useLocation, useParams} from "react-router";
import EchartsTriger from "@/components/EchartsButton/EchartsTriger";
import {IntlFormatMessage} from "@/utils/util";
import {success, info} from "@/utils/tip";
import {isIEFun} from "@/utils/common";

const {confirm} = Modal;
const percentageUtil = {
    'nonAnomalyCount': {
        name: IntlFormatMessage('laboratory.anomaly.normal'),
        color: '#0066FF',
        tootipTexts: ''
    },
    'historyNewAnomaly': {
        name: IntlFormatMessage('laboratory.anomaly.historicalNew'),
        color: '#7262FD',
        tootipTexts: IntlFormatMessage('laboratory.anomaly.historicalNewTootip'),
    },
    'periodNewCount': {
        name: IntlFormatMessage('laboratory.anomaly.periodNew'),
        color: '#F6903D',
        tootipTexts: IntlFormatMessage('laboratory.anomaly.periodNewTooptip'),
    },
    'periodJumpCount': {
        name: IntlFormatMessage('laboratory.anomaly.periodBurst'),
        color: '#FF4D4F',
        tootipTexts: IntlFormatMessage('laboratory.anomaly.periodBurstTooptip'),
    },
    'periodDropCount': {
        name: IntlFormatMessage('laboratory.anomaly.periodDrop'),
        color: '#9661BC',
        tootipTexts: IntlFormatMessage('laboratory.anomaly.periodDropTooptip'),
    },
    'dodWowCount': {
        name: IntlFormatMessage('laboratory.anomaly.periodAnomaly'),
        color: '#6657FF',
        tootipTexts: IntlFormatMessage('laboratory.anomaly.periodAnomalyTootip'),
    },
};
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
const DataView = (props) => {
    const {
        item = {}, selectOption, editCurrentGeneric, setCurrentGenericList,
        setSaveGeneVisible,
        getCalculateAsync, getProcessRatioAsync, deleteDenericList,
        queryOriginLogTrendFun, index, setAllTrendList,
    } = props;
    const {id} = useParams();
    const {pathname} = useLocation();
    const history = useHistory();
    const {
        trendPointList = [], originLogTrendPoint = [], anomalyPercentage = {},
        tuningBenchGeneric = {}, state = 0, successSeries, failedSeries
    } = item;

    const echartsFlag = `echarts-${JSON.stringify(item)}`;
    const getProcessFlag = `getProcessFlag-${JSON.stringify(item)}`;
    const ref = useRef({
        [echartsFlag]: null,
        [getProcessFlag]: null,
    });

    const [prosess, setProsess] = useFetchState(0);//进度
    const [lineList, setLineList] = useFetchState([]);//折线数组
    const [percentage, setPercentage] = useFetchState({});//饼图
    const [spinning, setSpinning] = useFetchState(false);
    const [statusInfo, setStatusInfo] = useFetchState({
        status: 'notStart',
        message: '',
    });

    useEffect(() => {
        return () => {
            processCanceled();
        };
    }, []);

    useEffect(() => {
        setStatusInfo({
            status: state === 0 ? 'notStart' : state === 1 ? 'starting' : state === 2 ? 'success' : state === 3 ? 'error' : 'notStart',
            message: '',
        });
        if (item.needGetCalculate || state === 1) {
            getCalculate();
        }
        //饼图
        if (!!anomalyPercentage && !!Object.keys(anomalyPercentage).length) {
            setPercentage(anomalyPercentage);
        }
        //监听折线的数据变化
        if (!!originLogTrendPoint && !!originLogTrendPoint.length) {
            setLineList(prev => {
                prev[0] = {
                    name: IntlFormatMessage('laboratory.anomaly.logTrend'),
                    symbolSize: 1,
                    data: (originLogTrendPoint || []).map(item => {
                        if (item.log_time) {
                            return [Number(item.log_time), Number(item.log_value)];
                        }
                    }).filter(Boolean),
                };
                if (!!trendPointList && !!trendPointList.length) {
                    prev[1] = {
                        name: IntlFormatMessage('laboratory.anomaly.anomalyTrend'),
                        symbolSize: 1,
                        // lineStyle: {
                        //     color: 'red'
                        // },
                        data: trendPointList.map(item => {
                            return [Number(item.log_time), Number(item.log_value)];
                        })
                    };
                }
                return prev;
            });
        }
    }, [item]);

    const processCanceled = () => {
        setSpinning(false);
        !!ref.current[getProcessFlag] && clearInterval(ref.current[getProcessFlag]);
        ref.current[getProcessFlag] = null;
        setTimeout(() => {
            setProsess(0);
        });
    };

    //获取进度条
    const getProcessFun = () => {
        getProcessRatioAsync({taskId: id, genericId: tuningBenchGeneric.id}, {
            cb: (info) => {
                const numPro = (!!info.ratio && !!info.total) ?
                    ((info.ratio) * 100 / (info.total)).toFixed(2) :
                    '0.00';
                setProsess(numPro);
                if (numPro === '100.00') {
                    setTimeout(() => {
                        processCanceled();
                        queryOriginLogTrendFun();
                    }, 500);
                }
            }
        });
    };

    const getCalculate = () => {
        if (!ref.current[getProcessFlag]) {
            ref.current[getProcessFlag] = setInterval(() => {
                getProcessFun();
            }, 10000);
        }
        setSpinning(true);
        setStatusInfo({
            status: 'starting',
            message: '',
        });
        getCalculateAsync({taskId: id, genericId: tuningBenchGeneric.id}, {
            cb: (data) => {
                setProsess(100.00);
                if (!!data.successSeries || data.successSeries === 0 || !!data.failedSeries || data.failedSeries === 0) {
                    info(`${IntlFormatMessage('laboratory.anomaly.invokeSeries')} ${data.successSeries || 0}${IntlFormatMessage('laboratory.anomaly.noType')}${IntlFormatMessage('laboratory.anomaly.failSeries')} ${data.failedSeries || 0}`);
                }
                processCanceled();
                queryOriginLogTrendFun();
            },
            err: () => {
                processCanceled();
                // setPercentage({});
                // if (!!lineList.length && lineList.length === 2) {
                //     //第二条折线清空
                //     setLineList([lineList[0]]);
                // }
                queryOriginLogTrendFun();
                // setAllTrendList(prev => {
                //     return prev.map(trend => {
                //         if (tuningBenchGeneric.id === trend.tuningBenchGeneric.id) {
                //             return Object.assign({}, trend, {
                //                 state: 3,
                //                 needGetCalculate: false,
                //             });
                //         }
                //         return trend;
                //     });
                // });
                // setSpinning(false);
                // setStatusInfo({
                //     status: 'error',
                //     message: '',
                // });
            }
        });
    };
    const pieChartData = useMemo(() => {
        if (!!percentage && !!Object.keys(percentage).length) {
            return Object.keys(omit(percentage, 'total')).map(item => {
                return {
                    value: percentage[item],
                    name: percentageUtil[item].name,
                    itemStyle: {color: percentageUtil[item].color},
                    tootipTexts: percentageUtil[item].tootipTexts
                };
            });
        } else {
            return [];
        }
    }, [percentage]);

    //删除泛型
    const showConfirm = (item) => {
        const {id = ''} = item;
        confirm({
            title: IntlFormatMessage('laboratory.anomaly.wantResult'),
            okText: IntlFormatMessage('common.explore.setting.modal.determine'),
            okType: 'primary',
            cancelText: IntlFormatMessage('common.explore.setting.modal.cancel'),
            onOk() {
                deleteDenericList(id, {
                    cb: () => {
                        success(IntlFormatMessage('laboratory.anomaly.deleted'));
                        queryOriginLogTrendFun();
                    }
                });
            },
            onCancel() {
                return;
            },
        });
    };

    //下载echarts
    const downPic = () => {
        html2canvas(document.getElementById(`dataView-wrapper-container-${index}`), {
            allowTaint: false,
            useCORS: true,
        }).then((canvas) => {
            if (isIEFun()) {
                const imgUri = canvas.toDataURL().split(';base64,')[1];
                const zip = new JSZip();
                zip.file('echarts.jpg', imgUri, {base64: true});
                zip.generateAsync({type: 'blob'}).then(content => {
                    saveAs(content, 'echarts.zip');
                });
            } else {
                saveAs(canvas.toDataURL('image/jpeg', {quality: 1}), 'echarts.jpg');
            }


            // const alink = document.createElement('a');
            // alink.href = canvas.toDataURL('image/jpeg', {quality: 0.5});
            // alink.download = '日志异常检测.jpg';
            // document.body.appendChild(alink);
            // alink.click();
            // document.body.removeChild(alink);
        });
    };

    return (
        <div className="dataView-wrapper">
            <Spin spinning={spinning} tip={`${prosess}%`}>
                <div className="dataView-wrapper-header">
                    <div className="dataView-wrapper-left">
                        {
                            statusInfo && statusInfo.status &&
                            <Fragment>
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
                    </div>
                    <div className="dataView-wrapper-right">
                        <Tooltip title={IntlFormatMessage('laboratory.anomaly.calculate')}>
                            <Button icon="calculator" onClick={() => {
                                getCalculate();
                            }}
                            />
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.detail.view')}>
                            <Button icon="eye"
                                    disabled={[0].includes(state)}
                                    onClick={() => {
                                        history.push(`${pathname}/${tuningBenchGeneric.id}`);
                                    }}
                            />
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.detail.saveGenericity')}>
                            <Button icon="save" onClick={() => {
                                setCurrentGenericList(tuningBenchGeneric);
                                setSaveGeneVisible(true);
                            }}/>
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.detail.edit')}>
                            <Button icon="form" disabled={tuningBenchGeneric.isPrivate === 0} onClick={() => {
                                setCurrentGenericList(tuningBenchGeneric);
                                editCurrentGeneric(tuningBenchGeneric);
                            }}/>
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.detail.delete')}>
                            <Button icon="delete" disabled={tuningBenchGeneric.isPrivate === 0} onClick={() => {
                                showConfirm(tuningBenchGeneric);
                            }}/>
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.anomaly.saveAsImage')}>
                            <Button icon="download" onClick={() => {
                                downPic();
                            }}/>
                        </Tooltip>
                        {/* <Button icon="refresh"></Button> */}
                    </div>
                </div>
                <div className="dataView-wrapper-container" id={`dataView-wrapper-container-${index}`}>
                    <Row>
                        <Col span={12}>
                            {
                                !!lineList && !!lineList.length ?
                                    <LineChart
                                        title={IntlFormatMessage('laboratory.anomaly.logDistribution')}
                                        data={lineList}
                                    />
                                    :
                                    <div className="flex-box-center" style={{height: 250}}>
                                        <Empty
                                            style={{width: '100%',}}
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={<span>
                                                {IntlFormatMessage('laboratory.detail.nodatafound')}
                                            </span>}
                                        />
                                    </div>
                            }
                        </Col>
                        <Col span={12}>
                            {
                                !!item && !!Object.keys(item).length && !!pieChartData && !!pieChartData.length ?
                                    <PieCharts
                                        style={{height: 250}}
                                        data={pieChartData}
                                        onEchartReady={(echarts) => {
                                            ref.current[echartsFlag] = echarts;
                                        }}
                                    />
                                    :
                                    <div className="flex-box-center" style={{height: 250}}>
                                        <Empty
                                            style={{width: '100%',}}
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={<span>
                                                {`${IntlFormatMessage('laboratory.anomaly.taskTrained')}`}
                                                <span style={{color: '#008DFF', cursor: 'pointer'}}
                                                      onClick={() => getCalculate()}>
                                                    {`${IntlFormatMessage('laboratory.anomaly.dataTrain')} >`}
                                                </span>
                                            </span>}
                                        />
                                    </div>
                            }
                        </Col>
                    </Row>
                    <p className="dataView-wrapper-explain">
                        <span
                            className="dataView-wrapper-label">{IntlFormatMessage('laboratory.create.agorithmgenericity')}：</span>{' '}
                        <span>
                        {tuningBenchGeneric.genericName}
                    </span>
                    </p>
                    <div style={{display: selectOption.includes('parameter') ? 'flex' : 'none'}}>
                        <div style={{whiteSpace: 'nowrap'}}>{IntlFormatMessage('laboratory.anomaly.parameter')}：</div>
                        <Descriptions style={{flexGrow: 1, width: '100%'}} column={4}>
                            {
                                (tuningBenchGeneric.processedParams || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                                    if (item.name === 'training_days' && item.value) {
                                        let value = item.value;
                                        let newValue = Number(value.replace('M', ''));
                                        let renderValue = '';
                                        if (newValue / 60 < 1) {
                                            renderValue = `${newValue}`;
                                        } else if (newValue / 60 >= 1 && newValue / 60 < 24) {
                                            renderValue = `${Math.ceil(newValue / 60)}h`;
                                        } else if (newValue / 60 >= 24) {
                                            renderValue = `${Math.ceil(newValue / 1440)}d`;
                                        }
                                        return <Descriptions.Item
                                            key={`${index}-${item.name}`}
                                            label={item.name}>
                                            {renderValue || item.value}
                                        </Descriptions.Item>;
                                    }
                                    return <Descriptions.Item
                                        key={`${index}-${item.name}`}
                                        label={item.name}>
                                        {item.value}
                                    </Descriptions.Item>;
                                })
                            }
                        </Descriptions>
                    </div>
                </div>
            </Spin>
        </div>
    );
};
export default connect(({laboratoryStore}) => {
    return {
        getCalculateAsync: laboratoryStore.getCalculateAsync,
        getProcessRatioAsync: laboratoryStore.getProcessRatioAsync,
        deleteDenericList: laboratoryStore.deleteDenericList,
    };
})(Form.create()(DataView));