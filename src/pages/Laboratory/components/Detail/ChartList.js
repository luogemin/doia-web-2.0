import React, {useEffect, Fragment, useRef} from 'react';
import Charts from "@/components/Charts";
import styles from './index.less';
import {Spin, Tooltip, Icon, Descriptions, Empty, Badge, Menu} from '@chaoswise/ui';
import SetSvg from '../../assets/setting.svg';
import Threshold from '@/components/Threshold';
import {useFetchState} from "@/components/HooksState";
import EchartsSetLine from "@/components/EchartsButton/EchartsSetLine";
import EchartsSaveGenerics from "@/components/EchartsButton/EchartsSaveGenerics";
import EchartsEditGenerics from "@/components/EchartsButton/EchartsEditGenerics";
import EchartsTriger from "@/components/EchartsButton/EchartsTriger";
import EchartsDelete from "@/components/EchartsButton/EchartsDelete";
import {success, warning, error} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

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

export default function ChartList(props) {
    const {
        getTrigger,
        setCurrentGenericList,
        setSaveGeneVisible,
        editCurrentGeneric,
        item = {},
        getResult,
        selectOption = [],
        showConfirm,
        lowAndUpValue,
        getOriginData,
        currentGenericId,
    } = props;
    const {seriesId = '', id = '', info = {}} = item;
    const ref = useRef({current: {}});
    const echartsref = useRef(null);

    const [chartData, setChartData] = useFetchState({});
    const [spinning, setSpinning] = useFetchState(false);
    const [statusInfo, setStatusInfo] = useFetchState(null);
    const [upValue, setUpValue] = useFetchState(undefined);
    const [lowValue, setLowValue] = useFetchState(undefined);
    const [checked, setChecked] = useFetchState(false);
    const [settingLine, setSettingLine] = useFetchState(false);

    useEffect(() => {
        setUpValue(lowAndUpValue.uperValue);
        setLowValue(lowAndUpValue.lowerValue);
    }, [lowAndUpValue]);

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
                        tuningBenchSeriesId: currentGenericId
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
            ref.current['chart'] = chart;
        }
    };
    const getTriggerresult = () => {
        setStatusInfo({
            status: 'starting',
            message: '',
        });
        getTrigger({
            tuningBenchGenericId: id,
            seriesId: seriesId
        }, {
            cb: (info) => {

                const {data = {}} = info;

                const {message = '', status = ''} = data;

                setChartData(data.data || {});
                setStatusInfo({
                    status,
                    message,
                });
                if (status === 'success') {
                    success(message || IntlFormatMessage('laboratory.anomaly.calculated'));
                }
                if (status === 'warning') {
                    warning(message || IntlFormatMessage('datasource.create.exceptions'));
                }
                if (status === 'error') {
                    error(message || IntlFormatMessage('datasource.create.errors'));
                }
                setSpinning(false);
            },
            err: () => {
                setSpinning(false);
            }
        });
    };
    const upValueChange = (value) => {
        if (!!lowValue && (!!value || value === 0) && (Number(value) <= Number(lowValue))) {
            error(IntlFormatMessage('laboratory.anomaly.upperBoundary')); //算法版本不能与算法标识符相同
        } else {
            setUpValue(value);
        }
    };
    const lowValueChange = (value) => {
        if (!!upValue && (!!value || value === 0) && (Number(value) >= Number(upValue))) {
            error(IntlFormatMessage('laboratory.anomaly.lowerBoundary')); //算法版本不能与算法标识符相同
        } else {
            setLowValue(value);
        }
    };
    const checkedChange = (check) => {
        setChecked(check);
    };

    return (
        <div className={styles['chart-wrapper']} key={item.id}>
            <Spin spinning={spinning} wrapperClassName={styles['chart-wrapper-spin']}>
                <div className={styles['chart-header']}>
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
                    </div>
                </div>
                {
                    Object.keys(chartData).length === 0 ?
                        <Empty key={item.id} description={IntlFormatMessage('laboratory.detail.nodatafound')}
                               style={{height: 'calc(100% - 100px)'}}/>
                        :
                        <div style={{position: 'relative'}}>
                            <Charts
                                ref={echartsref}
                                onChartReady={onChartReady}
                                data={chartData}
                                id={id}
                                upValue={checked ? upValue : ''}
                                lowValue={checked ? lowValue : ''}
                            />
                            <div style={{
                                position: 'absolute',
                                zIndex: 999,
                                height: 25,
                                top: 4,
                                right: 92
                            }}>
                                <EchartsTriger
                                    onClick={() => {
                                        setSpinning(true);
                                        getTriggerresult();
                                    }}
                                />
                                <EchartsSetLine
                                    onClick={() => setSettingLine(prev => !prev)}
                                />
                                <EchartsSaveGenerics
                                    onClick={() => {
                                        setCurrentGenericList(item);
                                        setSaveGeneVisible(true);
                                    }}
                                />
                                {
                                    item.isPrivate === 1 ?
                                        <EchartsEditGenerics
                                            onClick={() => {
                                                setCurrentGenericList(item);
                                                editCurrentGeneric(item);
                                            }}
                                        />
                                        : null
                                }
                                {
                                    item.isPrivate === 1 ?
                                        <EchartsDelete
                                            onClick={() => {
                                                showConfirm(item);
                                            }}
                                        />
                                        : null
                                }
                            </div>
                            {
                                settingLine ?
                                    <Threshold
                                        upValue={upValue}
                                        lowValue={lowValue}
                                        checked={checked}
                                        upValueChange={upValueChange}
                                        lowValueChange={lowValueChange}
                                        checkedChange={checkedChange}
                                        setSettingLine={setSettingLine}
                                    />
                                    : null
                            }
                        </div>
                }
                <div className={styles['chart-bottom']}>
                    <div className='bottom-title'>
                        <p>{IntlFormatMessage('laboratory.detail.algorithmname')}：
                            <span>
                                {item.displayAlgorithmNames || (item.algorithmName || '')}&nbsp;
                                {item.algorithmVersion || ''}
                                <span style={{
                                    marginLeft: 24,
                                }}>
                                    {IntlFormatMessage('laboratory.detail.name')}：{item.genericName || ''}
                                </span>
                            </span>
                        </p>
                        <div style={{display: !selectOption.includes('parameter') ? 'none' : 'flex'}}>
                            <div style={{whiteSpace: 'nowrap'}}>{IntlFormatMessage('laboratory.detail.parameterBtn')}：</div>
                            <Descriptions style={{flexGrow: 1, width: '100%'}} column={4}>
                                {
                                    (item.processedParams || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
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
