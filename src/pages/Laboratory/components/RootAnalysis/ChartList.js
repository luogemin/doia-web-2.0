import React, {Fragment, useEffect, useRef} from 'react';
import Chart from '@/components/Charts/index';
import {Icon, Spin, Empty, Tooltip, Badge, message} from '@chaoswise/ui';
import moment from 'moment';
import styles from './index.less';
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

export default function ChartList(props) {
    const {
        item = [], currentView = 1, currentNum, ifRowDataSampling = false, modalMetric,
    } = props;
    const echartsref = useRef(null);

    const [statusInfo, setStatusInfo] = useFetchState(null);

    useEffect(() => {
        const {data = {}, message = undefined, status} = item;
        setStatusInfo({
            status,
            message,
        });
    }, [item]);

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
                padding: '16px 0',
                marginRight: currentView === 9 && (currentNum % 3 !== 0) && '6px'
            }}
        >
            <div className={styles['root-analysis-chart-header']}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {/*{*/}
                    {/*    statusInfo && statusInfo.status && <Fragment>*/}
                    {/*        <Badge status="warning"/>*/}
                    {/*        <div>*/}
                    {/*            {`${IntlFormatMessage('laboratory.detail.status')}: ${IntlFormatMessage('laboratory.detail.untrainedvalue')}`}*/}
                    {/*        </div>*/}
                    {/*        <span>*/}
                    {/*            {*/}
                    {/*                statusInfo.message &&*/}
                    {/*                <Tooltip title={statusInfo.message || ''}>*/}
                    {/*                    <Icon*/}
                    {/*                        type='exclamation-circle'*/}
                    {/*                        theme="filled"*/}
                    {/*                        className='charts_ctrl_box_items_icon charts_ctrl_box_items_warning'*/}
                    {/*                    />*/}
                    {/*                </Tooltip>*/}
                    {/*            }*/}
                    {/*        </span>*/}
                    {/*    </Fragment>*/}
                    {/*}*/}
                </div>
            </div>
            {
                !!item.data && !!item.data.length ?
                    <Chart
                        ref={echartsref}
                        data={{seriesData: item.data}}
                        seriesDataShow={false}
                        ifRowDataSampling={ifRowDataSampling}
                        style={{height: 'calc(100% - 37px)'}}
                    />
                    : <Empty key={item.id} description={IntlFormatMessage('laboratory.detail.nodatafound')}
                             style={{height: 'calc(100% - 37px)'}}/>
            }

            <div className='bottom-title'>
                    <span className='bottom-target' style={{marginRight: 8}}>
                        <Tooltip title={`${IntlFormatMessage('task.detail.metric')}：${modalMetric.metric}`}>
                        {IntlFormatMessage('laboratory.detail.metric')}：{modalMetric.metric}
                        </Tooltip>
                    </span>
                <span className='bottom-metricTags'>
                        <Tooltip placement='topLeft'
                                 title={`${IntlFormatMessage('laboratory.detail.dimension')}：${modalMetric.tags}`}>
                            {IntlFormatMessage('laboratory.detail.dimension')}：{modalMetric.tags}
                        </Tooltip>
                    </span>
            </div>
        </div>
    );
}
