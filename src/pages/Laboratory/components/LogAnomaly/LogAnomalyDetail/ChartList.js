import React, {useEffect, Fragment, useRef} from 'react';
import PieCharts from "@/components/PieCharts";
import styles from './index.less';
import {Spin, Tooltip, Icon, Descriptions, Empty, Badge, Modal} from '@chaoswise/ui';
import {useFetchState} from "@/components/HooksState";
import EchartsSetLine from "@/components/EchartsButton/EchartsSetLine";
import EchartsSaveGenerics from "@/components/EchartsButton/EchartsSaveGenerics";
import EchartsEditGenerics from "@/components/EchartsButton/EchartsEditGenerics";
import EchartsTriger from "@/components/EchartsButton/EchartsTriger";
import EchartsDelete from "@/components/EchartsButton/EchartsDelete";
import {success, warning, error} from "@/utils/tip";
import {ClearSomLocalStorage, IntlFormatMessage} from "@/utils/util";
import EchartsSearchValue from "@/components/EchartsButton/EchartsSearchValue";
import {useHistory, useLocation, useParams} from "react-router";
import EchartsReset from "@/components/EchartsButton/EchartsReset";


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
        badge: <Icon type="sync" spin/>,//<div className={styles['k-loader']}/>
        icon: <Icon
            type='exclamation-circle'
            theme="filled"
            className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'
        />,
    }
};

export default function ChartList(props) {
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
    } = props;
    const history = useHistory();
    const {id} = useParams();
    const {pathname} = useLocation();
    const {info = {}, tuningBenchGeneric = {}, patternInfoList = []} = item;

    const [chartData, setChartData] = useFetchState({});
    const [spinning, setSpinning] = useFetchState(false);
    const [statusInfo, setStatusInfo] = useFetchState(null);
    const [emptyFlag, setEmptyFlag] = useFetchState(false);

    useEffect(() => {
        if (id) {
            setSpinning(true);
            const {data = {}, message = undefined, status = 'notStart'} = info;
            setStatusInfo({
                status,
                message,
            });
            setChartData(data);
            const {addBool = false, editBool = false} = item;

            if (status === 'notStart' && (addBool || editBool)) {
                if (addBool && !editBool) {
                    getOriginData({
                        tuningBenchSeriesId: '0'
                    }, {
                        cb: (res) => {
                            const {data = {}} = res;
                            const {seriesData = []} = data;
                            setChartData({
                                seriesData
                            });
                            getTriggerresult();
                        }
                    });
                    return;
                }
                getTriggerresult();
            } else {
                setSpinning(false);
            }
        }
    }, [id, item]);

    const getTriggerresult = () => {
        setSpinning(true);
        setStatusInfo({
            status: 'starting',
            message: '',
        });
        getlogPatternCalculateAsync({
            taskId: id, genericId: tuningBenchGeneric.id,
        }, {
            cb: (info) => {
                queryLogpatternreFun();
                setSpinning(false);
            },
            err: () => {
                setSpinning(false);
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

    return (
        <div className='chart-wrapper' key={item.id}>
            <Spin spinning={spinning} wrapperClassName='chart-wrapper-spin'>
                <div className='chart-header'>
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
                </div>
                {
                    emptyFlag && Object.keys(chartData).length === 1 ?
                        <Empty key={item.id} description={IntlFormatMessage('laboratory.detail.nodatafound')}
                               style={{height: 'calc(100% - 100px)'}}/>
                        :
                        <div style={{position: 'relative'}}>
                            {
                                (!!patternInfoList && !!Object.keys(patternInfoList).length) &&
                                <PieCharts
                                    style={{height: 250}}
                                    data={patternInfoList.map(pattern => {
                                        return {value: pattern.patternNum, name: pattern.pattern};
                                    })}
                                />
                            }
                            <div style={{
                                position: 'absolute',
                                zIndex: 999,
                                height: 25,
                                top: '5px',
                                right: '40px',
                            }}>
                                <EchartsTriger
                                    onClick={() => {
                                        getTriggerresult();
                                    }}
                                />
                                <EchartsSearchValue
                                    onClick={() => {
                                        history.push(`${pathname}/${tuningBenchGeneric.id}`);
                                    }}
                                />
                                <EchartsSaveGenerics
                                    onClick={() => {
                                        setCurrentGenericList(tuningBenchGeneric);
                                        setSaveGeneVisible(true);
                                    }}
                                />
                                {
                                    tuningBenchGeneric.isPrivate === 1 ?
                                        <Fragment>
                                            <EchartsEditGenerics
                                                onClick={() => {
                                                    setCurrentGenericList(tuningBenchGeneric);
                                                    editCurrentGeneric(tuningBenchGeneric);
                                                }}
                                            />
                                            <EchartsDelete
                                                onClick={() => {
                                                    showConfirm(item);
                                                }}
                                            />
                                        </Fragment>
                                        : null
                                }
                                <EchartsReset
                                    onClick={() => {
                                        ClearSomLocalStorage();

                                    }}
                                />
                            </div>
                        </div>
                }
                <div className='chart-bottom'>
                    <div className='bottom-title'>
                        <p style={{whiteSpace: 'nowrap', marginBottom: 8}}>{`处理耗时: 01`}</p>
                        <div style={{
                            whiteSpace: 'nowrap',
                            marginBottom: 8
                        }}>{IntlFormatMessage('task.create.algorithm')}：{tuningBenchGeneric.algorithmName}</div>
                        <div style={{display: selectOption.includes('parameter') ? 'flex' : 'none'}}>
                            <div style={{whiteSpace: 'nowrap'}}>参数：</div>
                            <Descriptions style={{flexGrow: 1, width: '100%'}} column={2}>
                                {
                                    (tuningBenchGeneric.processedParams || []).map((item, index) => {
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
}
