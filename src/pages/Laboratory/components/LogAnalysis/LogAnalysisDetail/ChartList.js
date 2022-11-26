import React, {useEffect, Fragment, useRef} from 'react';
import PieCharts from "@/components/PieCharts";
import styles from './index.less';
import {Spin, Tooltip, Icon, Descriptions, Empty, Badge, Modal, Form, Button} from '@chaoswise/ui';
import {html2canvas} from '@chaoswise/utils';
import {useFetchState} from "@/components/HooksState";
import {success, warning, error} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";
import {useHistory, useLocation, useParams} from "react-router";
import IconTooltip from "@/components/IconTooltip";
import {connect} from "@chaoswise/cw-mobx";
import {isIEFun} from "@/utils/common";
import JSZip from "jszip";
import {saveAs} from "file-saver";


const {confirm} = Modal;
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
    'fail': {
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
    'init': {
        title: IntlFormatMessage('laboratory.anomaly.untrained'),
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
    },
    'calculating': {
        title: IntlFormatMessage('laboratory.detail.training'),
        badge: <div className={styles['k-loader']}/>,
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'
        />,
    },
};
const ChartList = (props) => {
    const {
        getlogPatternCalculateAsync,
        setCurrentGenericList,
        setSaveGeneVisible,
        editCurrentGeneric,
        item = {},
        selectOption = [],
        getOriginData,
        queryLogpatternreFun,
        deleteDenericList,
        logGetProgressAsync,
        taskRecognitionAsync, index, indexKey,
    } = props;
    const history = useHistory();
    const {id} = useParams();
    const {pathname} = useLocation();
    const echartsFlag = `echarts-${index}`;
    const getProcessFlag = `getProcessFlag-${index}`;
    const ref = useRef({
        [echartsFlag]: null,
        [getProcessFlag]: null,
    });

    const {
        info = {}, clusteringIndexConf = {}, tuningBenchGeneric = {}, patternInfoList = [],
        taskStatus, costTime = '', message = '', algorithmStatus = '', patternCount
    } = item;
    const [prosess, setProsess] = useFetchState(0);//进度百分比
    const [prosessResult, setProsessResult] = useFetchState(0);//进度结果
    const [resultTime, setResultTime] = useFetchState(0);//进度结果次数
    const [spinning, setSpinning] = useFetchState(false);
    const [statusInfo, setStatusInfo] = useFetchState({
        status: 'init',
        message: '',
    });
    useEffect(() => {
        return () => {
            !!ref.current[getProcessFlag] && clearInterval(ref.current[getProcessFlag]);
        };
    }, []);

    //监听item里面的status状态
    useEffect(() => {
        if (taskStatus) {
            if (statusObj[taskStatus]) {
                setStatusInfo({
                    status: taskStatus,
                    message: message,
                });
            } else {
                setStatusInfo({
                    status: 'init',
                    message: '',
                });
            }
        }

    }, [item]);
    //calculating异常的情况下
    useEffect(() => {
        if (taskStatus === 'calculating') {
            setSpinning(true);
            if (!ref.current[getProcessFlag]) {
                ref.current[getProcessFlag] = setInterval(() => {
                    progressArear();
                }, 10000);
            }
        }
    }, [taskStatus]);
    useEffect(() => {
        if (tuningBenchGeneric.isPrivate === 1 && taskStatus === 'init') {
            getTriggerresult();
        }
    }, [tuningBenchGeneric, taskStatus]);

    const progressArear = () => {
        logGetProgressAsync({
            taskId: id, tuningBenchGenericId: tuningBenchGeneric.id,
        }, {
            cb: (info) => {
                setProsess(info.toFixed(2));
                if (info == 100) { //只判断数值，不判断类型
                    !!ref.current[getProcessFlag] && clearInterval(ref.current[getProcessFlag]);
                    queryLogpatternreFun();
                    setSpinning(false);
                    setProsess(0);
                    return;
                }
                /**************判断返回的进度值，相同的次数******************/
                if (resultTime < window.DOIA_CONFIG.logAnalysisSameNum) {
                    if (info === prosessResult) {
                        setResultTime(prev => prev + 1);
                    } else {
                        setProsessResult(info);
                        setResultTime(0);
                    }
                } else {
                    setSpinning(false);
                    setProsess(0);
                    !!ref.current[getProcessFlag] && clearInterval(ref.current[getProcessFlag]);
                    queryLogpatternreFun();
                }
                /**************判断返回的进度值，相同的次数******************/
            },
            err: () => {
                setSpinning(false);
                setProsess(0);
                !!ref.current[getProcessFlag] && clearInterval(ref.current[getProcessFlag]);
                queryLogpatternreFun();
            }
        });
    };
    const getTriggerresult = () => {
        setSpinning(true);
        setStatusInfo({
            status: 'starting',
            message: '',
        });
        if (!ref.current[getProcessFlag]) {
            ref.current[getProcessFlag] = setInterval(() => {
                progressArear();
            }, 10000);
        }
        getlogPatternCalculateAsync({
            taskId: id, genericId: tuningBenchGeneric.id,
        }, {
            cb: (info) => {

            },
            err: () => {
                setSpinning(false);
                setProsess(0);
                !!ref.current[getProcessFlag] && clearInterval(ref.current[getProcessFlag]);
                queryLogpatternreFun();
            }
        });
    };
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
                        queryLogpatternreFun();
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
        html2canvas(document.getElementById(`log-analysis-pie-${indexKey}`), {
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
            // alink.href = canvas.toDataURL('image/png');
            // alink.download = '日志模式识别.jpg';
            // document.body.appendChild(alink);
            // alink.click();
            // document.body.removeChild(alink);
        });
    };

    return (
        <div className='chart-wrapper' key={item.id}>
            <Spin spinning={spinning} tip={`${prosess}%`} wrapperClassName='chart-wrapper-spin'>
                <div className="dataView-wrapper-header">
                    <div className="dataView-wrapper-left">
                        {
                            statusInfo && statusInfo.status && statusObj[statusInfo.status] && <Fragment>
                                {statusObj[statusInfo.status].badge}
                                <div>
                                    {IntlFormatMessage('laboratory.detail.status')}: {statusObj[statusInfo.status].title}
                                </div>
                                <span>
                                    {
                                        (!!statusObj[algorithmStatus] && statusObj[algorithmStatus].icon && message) &&
                                        <Tooltip title={message || ''}>
                                            {statusObj[algorithmStatus].icon}
                                        </Tooltip>
                                    }
                                </span>
                            </Fragment>
                        }
                    </div>
                    <div className="dataView-wrapper-right">
                        <Tooltip title={IntlFormatMessage('laboratory.anomaly.calculate')}>
                            <Button icon="calculator" onClick={() => {
                                // 重新计算接口
                                taskStatus === 'success' ?
                                    taskRecognitionAsync({taskId: id, genericId: tuningBenchGeneric.id,}, {
                                        cb: (info) => {
                                            getTriggerresult();
                                        }
                                    })
                                    :
                                    getTriggerresult();
                            }}
                            />
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.detail.view')}>
                            <Button icon="eye" onClick={() => {
                                history.push(`${pathname}/${tuningBenchGeneric.id}`);
                            }}/>
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
                        <Tooltip title={IntlFormatMessage('laboratory.detail.resetBtn')}>
                            <Button icon="sync" onClick={() => {
                                queryLogpatternreFun();
                            }}/>
                        </Tooltip>
                    </div>
                </div>
                <div className="dataView-wrapper-body">
                    <div id={`log-analysis-pie-${indexKey}`}>
                        {
                            (!!patternInfoList && !!Object.keys(patternInfoList).length) ?
                                <PieCharts
                                    style={{height: 250}}
                                    data={patternInfoList.map(pattern => {
                                        return {value: pattern.patternNum, name: pattern.pattern || '-'};
                                    })}
                                    onEchartReady={(echarts) => {
                                        ref.current[echartsFlag] = echarts;
                                    }}
                                />
                                : <div className="flex-box-center" style={{height: 250}}>
                                    <Empty
                                        style={{width: '100%',}}
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            statusInfo.status === 'calculating' ?
                                                <span>{IntlFormatMessage('laboratory.anomaly.training')}</span>
                                                :
                                                <span>
                                            {`${IntlFormatMessage('laboratory.anomaly.dataBtn')}${statusObj[statusInfo.status] && statusObj[statusInfo.status].title}${IntlFormatMessage('laboratory.anomaly.taskBtn')}`}
                                                    <span style={{color: '#008DFF', cursor: 'pointer'}}
                                                          onClick={() => getTriggerresult()}>
                                                {`${(statusInfo && ['fail', 'error'].includes(statusInfo.status)) ? IntlFormatMessage('laboratory.anomaly.dataRetrain') : IntlFormatMessage('laboratory.anomaly.dataTrain')} >`}
                                            </span>
                                        </span>
                                        }/>
                                </div>
                        }
                    </div>
                    <div className='bottom-title'>
                        <div className="flex-box" style={{marginBottom: 8}}>
                            <p className="only-show-one-line" style={{
                                marginRight: 8,
                                maxWidth: 200,
                            }}>
                                <Tooltip
                                    title={`SC: ${clusteringIndexConf.sc ? clusteringIndexConf.sc : ''}`}>
                                    {`SC: ${clusteringIndexConf.sc ? Number(clusteringIndexConf.sc).toFixed(2) : ''}`}
                                </Tooltip>
                                <IconTooltip
                                    title={IntlFormatMessage('laboratory.anomaly.matchedIndicate')}
                                    style={{marginLeft: 4, fontSize: 14}}
                                />
                            </p>
                            <p className="only-show-one-line" style={{
                                marginRight: 8,
                                maxWidth: 200,
                            }}>
                                <Tooltip
                                    title={`DBI: ${clusteringIndexConf.dbi ? clusteringIndexConf.dbi : ''}`}>
                                    {`DBI: ${clusteringIndexConf.dbi ? Number(clusteringIndexConf.dbi).toFixed(2) : ''}`}
                                </Tooltip>
                                <IconTooltip
                                    title={IntlFormatMessage('laboratory.anomaly.clusteringIndicate')}
                                    style={{marginLeft: 4, fontSize: 14}}
                                />
                            </p>
                            <p className="only-show-one-line" style={{
                                maxWidth: 200,
                            }}>
                                <Tooltip
                                    title={`${IntlFormatMessage('laboratory.anomaly.time')}: ${costTime ? costTime : ''}`}>
                                    {`${IntlFormatMessage('laboratory.anomaly.time')}: ${costTime ? costTime : ''}`}
                                </Tooltip>
                            </p>
                            <p className="only-show-one-line" style={{
                                maxWidth: 200,
                                marginLeft: '8px'
                            }}>
                                <Tooltip
                                    title={`${IntlFormatMessage('laboratory.anomaly.totalPatterns')}: ${patternCount ? patternCount : ''}`}>
                                    {`${IntlFormatMessage('laboratory.anomaly.totalPatterns')}: ${patternCount ? patternCount : ''}`}
                                </Tooltip>
                            </p>
                        </div>
                        <div style={{
                            whiteSpace: 'nowrap',
                            marginBottom: 8
                        }}>{IntlFormatMessage('laboratory.create.agorithmgenericity')}：{tuningBenchGeneric.genericName}</div>
                        <div style={{display: selectOption.includes('parameter') ? 'flex' : 'none'}}>
                            <div style={{whiteSpace: 'nowrap'}}>{IntlFormatMessage('laboratory.anomaly.parameter')}：
                            </div>
                            <Descriptions style={{flexGrow: 1, width: '100%'}} column={2}>
                                {
                                    (tuningBenchGeneric.processedParams || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                                        if (item.name === 'training_days' && item.value) {
                                            let value = item.value;
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
                </div>
            </Spin>
        </div>
    );
};
export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        logGetProgressAsync: laboratoryStore.logGetProgressAsync,
        taskRecognitionAsync: laboratoryStore.taskRecognitionAsync,
    };
})(Form.create()(ChartList));