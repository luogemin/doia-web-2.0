import React, {useEffect, useRef} from 'react';
import Chart from '@/components/Charts/index';
import {Icon, Spin, Empty, Tooltip, message} from '@chaoswise/ui';
import moment from 'moment';
import styles from './index.less';
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";


export default function ChartList(props) {
    const {
        item = {}, currentView = 1, handleClickStar,
        getSeriesData, currentNum, ifRowDataSampling = false,
    } = props;

    const {id = '', favorites} = item;
    const [data, setData] = useFetchState({});
    const [loading, setLoading] = useFetchState(false);
    const [metricInfo, setMetricInfo] = useFetchState({
        metricTags: '',
        targetName: '',
        asyncErrorMessage: IntlFormatMessage('laboratory.detail.nodatafound')
    });
    const echartsref = useRef(null);

    const onClickStar = (favorites, record) => {
        handleClickStar(favorites, record);
    };

    useEffect(() => {
        if (id) {
            const {endTime = 0, startTime = 0, targetName = '', metricTags = {}, seriesData = [], favorites = 1, asyncErrorMessage = ''} = item;
            setData({seriesData: seriesData});
            setMetricInfo({
                metricTags: JSON.stringify(metricTags),
                targetName,
                asyncErrorMessage,
            });
            // setMetricTags(list);

        }

    }, [id]);

    const onChartReady = (chart) => {
        if (chart) {
            chart.group = 'echartsLink';
        }
    };

    const myToolCollFunc = () => {
        onClickStar(favorites, item);
    };
    const myToolCancFunc = () => {
        onClickStar(favorites, item);
    };
    const ifCollect = favorites ? {
        myToolCancFunc
    } : {
        myToolCollFunc
    };

    return (
        <div
            style={{
                width: currentView === 1 ?
                    '100%' : currentView === 4 ?
                        '49%' : '33%',
                position: "relative",
                border: "1px solid #e9e9e9",
                height: currentView === 1 ? '100%' : '267px',
                overflow: 'auto',
                marginBottom: 16,
                marginRight: currentView === 9 && (currentNum % 3 !== 0) && '6px'
            }}
        >
            <Spin spinning={loading} wrapperClassName={styles['chart-spining']}>
                {
                    (Object.keys(data).length && data.seriesData && data.seriesData.length) ?
                        currentView === 1 ? <Chart
                                data={data}
                                ref={echartsref}
                                onChartReady={onChartReady}
                                // dataZoomTop={'auto'}
                                {...ifCollect}
                                seriesDataShow={false}
                                ifRowDataSampling={ifRowDataSampling}
                                style={{height: 'calc(100% - 37px)'}}
                            /> :
                            <Chart
                                ref={echartsref}
                                data={data}
                                onChartReady={onChartReady}
                                // dataZoomTop={220}
                                {...ifCollect}
                                seriesDataShow={false}
                                ifRowDataSampling={ifRowDataSampling}
                                splitNumber={currentView === 4 ? 2 : 1}
                                style={{height: '228px'}}
                            /> : <Empty style={{height: currentView === 1 ? '100%' : '238px'}}
                                        description={metricInfo.asyncErrorMessage ? metricInfo.asyncErrorMessage : IntlFormatMessage('laboratory.detail.nodatafound')}/>
                }

                <div className='bottom-title'>
                    <span className='bottom-metricTags'>
                        <Tooltip placement='topLeft' title={`${IntlFormatMessage('laboratory.detail.dimension')}：${metricInfo.metricTags}`}>
                            {IntlFormatMessage('laboratory.detail.dimension')}：{metricInfo.metricTags}
                        </Tooltip>
                    </span>
                </div>
                <div style={{
                    position: 'absolute',
                    top: 3,
                    right: 120,
                    zIndex: 999,
                    width: 80,
                    height: 25,
                }}/>
            </Spin>
        </div>
    );
}
