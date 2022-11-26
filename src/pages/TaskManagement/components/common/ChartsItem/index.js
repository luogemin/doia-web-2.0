import React, {Fragment, useEffect, useMemo, useRef,} from "react";
import {Col, Row, Form, Select, Tooltip, Button, Spin, Descriptions, Empty, Dropdown, message} from "@chaoswise/ui";
import {connect} from "@chaoswise/cw-mobx";
import {error, success, warning} from "@/utils/tip";
import Charts from "@/components/Charts";
import {useParams} from "react-router";
import styles from "@/pages/TaskManagement/components/common/ChartsItem/index.less";
import ChartsHeader from "@/pages/TaskManagement/components/common/ChartsItem/ChartsHeader";
import Threshold from '@/components/Threshold';
import {useFetchState} from "@/components/HooksState";
import EchartsSetLine from "@/components/EchartsButton/EchartsSetLine";
import EchartsSaveGenerics from "@/components/EchartsButton/EchartsSaveGenerics";
import {IntlFormatMessage} from "@/utils/util";

const timerObj = {};

const ChartsItem = (props) => {
    const {
        index = undefined, item = {}, searchChartsInfoAsync, searchChartsRawDataInfoAsync,
        param = {}, selectTimeLine = {}, setLoading,
        showParams = false, heartBeating, onSave, onEdit, lowAndUpValue
    } = props;
    const {
        algorithmName = '', algorithmParams = [], algorithmVersion = '', displayAlgorithmNames, algorithmNameZh = '',
        genericName = '', displayGenericName,
    } = item;
    const {taskId = '', taskVersion = '',} = useParams();

    const [chartsData, setChartsData] = useFetchState({});
    const [upValue, setUpValue] = useFetchState(undefined);
    const [lowValue, setLowValue] = useFetchState(undefined);
    const [checked, setChecked] = useFetchState(false);
    const [errorMsg, setErrorMsg] = useFetchState({});
    const [settingLine, setSettingLine] = useFetchState(false);
    const [chartItemLoading, setChartItemLoading] = useFetchState(true);

    const ref = useRef({current: {}});
    const echartsref = useRef(null);


    useEffect(() => {
        setUpValue(lowAndUpValue.uperValue);
        setLowValue(lowAndUpValue.lowerValue);
    }, [lowAndUpValue]);

    useEffect(() => {
        let ifHasStatus = false;
        const {status = '', message = '', data = {}} = item;
        if (status) {
            ifHasStatus = true;
            setErrorMsg({
                status: status,
                messageZH: message,
            });
        }
        if (Object.keys(data).length > 0) {
            setChartsData(data);
            setLoading(false);
            setChartItemLoading(false);
        } else {
            clearTimeout(timerObj[`timer_${index}`]);
            timerObj[`timer_${index}`] = setTimeout(() => {
                const params = Object.assign({}, param, {
                    taskId,
                    taskVersion: selectTimeLine.taskVersion || taskVersion,
                    startTime: selectTimeLine.startTime,
                    endTime: selectTimeLine.endTime,
                });
                searchChartsRawDataInfoAsync(params, res => {
                    const {data} = res;
                    const result = (!!data && data.length) ? {
                        seriesData: data
                    } : {};
                    if (!ifHasStatus) {
                        setErrorMsg({
                            status: (!!data && data.length) ? '' : 'nodata',
                            messageZH: '',
                        });
                    }
                    setChartsData(result);
                    setLoading(false);
                    setChartItemLoading(false);
                });
            }, 500);
        }

        return () => {
            setChartsData({});
            clearTimeout(timerObj[`timer_${index}`]);
        };
    }, [selectTimeLine, index]);

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

    return <div className={styles['charts-box']}>
        <Spin spinning={!Object.keys(chartsData).length && chartItemLoading}>
            {
                (Object.keys(chartsData).length && !chartItemLoading) ?
                    <Fragment>
                        <ChartsHeader
                            item={item}
                            errorMsg={errorMsg}
                        />
                        <div style={{position: 'relative'}}>
                            <Charts
                                ref={echartsref}
                                onChartReady={onChartReady}
                                data={chartsData}
                                upValue={checked ? upValue : ''}
                                lowValue={checked ? lowValue : ''}
                            />
                            <div style={{
                                position: 'absolute',
                                height: 25,
                                zIndex: 999,
                                top: 3,
                                right: 92,
                            }}>
                                <EchartsSetLine
                                    onClick={() => setSettingLine(prev => !prev)}
                                />
                                <EchartsSaveGenerics
                                    onClick={() => {
                                        onSave(Object.assign({}, item, {
                                            parameters: algorithmParams,
                                        }));
                                    }}
                                />
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
                        {
                            (displayAlgorithmNames || algorithmName || displayGenericName || genericName) ?
                                <div className={styles['chart-bottom']}>
                                    <div className='bottom-title'>
                                        <p>{IntlFormatMessage('task.detail.algorithmname')}：
                                            <span>
                                            {displayAlgorithmNames || (algorithmName || '')}&nbsp;
                                                {algorithmVersion}
                                                <span style={{
                                                    marginLeft: 24,
                                                }}>
                                                {IntlFormatMessage('task.detail.name')}：{genericName || ''}
                                            </span>
                                        </span>
                                        </p>
                                        {

                                            showParams ?
                                                <div style={{display: 'flex'}}>
                                                    <div style={{whiteSpace: 'nowrap'}}>{IntlFormatMessage('generics.info.parameter')}:</div>
                                                    <Descriptions style={{flexGrow: 1, width: '100%'}} column={4}>
                                                        {
                                                            algorithmParams.filter(param => param.name !== 'stream_mode').map((item, index) => {
                                                                return <Descriptions.Item key={`${index}-${item.name}`}
                                                                                          label={item.name}>{item.value}</Descriptions.Item>;
                                                            })
                                                        }
                                                    </Descriptions>
                                                </div> : null
                                        }


                                    </div>


                                </div>
                                : null
                        }
                    </Fragment>
                    :
                    <Empty key={item.id} description={IntlFormatMessage('task.detail.nodatafound')}
                           style={{height: 'calc(100% - 100px)'}}/>
            }
        </Spin>
    </div>;
};

export default connect(({taskManagementStore, store}) => {
    return {
        searchChartsInfoAsync: taskManagementStore.searchChartsInfoAsync,
        searchChartsRawDataInfoAsync: taskManagementStore.searchChartsRawDataInfoAsync,
        heartBeating: taskManagementStore.heartBeating,
    };
})(ChartsItem);