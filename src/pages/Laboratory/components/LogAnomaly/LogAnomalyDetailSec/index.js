import React, {Fragment, useEffect, useRef} from 'react';
import {
    Steps, Button, BasicLayout, Form, message, Icon, Spin, Tabs, Tooltip, Table, Progress,
} from '@chaoswise/ui';
import styles from './index.less';
import moment from 'moment';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {useHistory, useLocation, useParams} from "react-router";
import {guid, IntlFormatMessage} from "@/utils/util";
import TooltipDiv from "@/components/TooltipDiv";
import LineChart from "@/components/LineCharts";
import LogAnalysisModel from "@/pages/Laboratory/components/LogAnomaly/LogAnomalyDetailSec/LogAnalysisModel";
import TrendLineCharts from "@/components/TrendLineCharts";
import DetailBody from './DetailBody';
import Charts from "@/components/Charts";

const {TabPane} = Tabs;
const {Footer} = BasicLayout;
const {Step} = Steps;

const LogAnomalyDetailSec = (props) => {
    const {
        form,
        match = {},
        logOriginTren,
        patternResults,
        checkOriginLogs,
        getAnomalyResultAsync,
        getAnomalyResultTrendAsync
    } = props;
    const {params = {}, path = '',} = match;
    const {id = '', genericId = ''} = params;
    const echartsref = useRef(null);

    // const {id, genericId} = useParams();
    const history = useHistory();
    const {pathname} = useLocation();

    const [activeTabs, setActiveTabs] = useFetchState('0');
    const [lineChartLoading, setLineChartLoading] = useFetchState(true);
    const [logModalVisible, setLogModalVisible] = useFetchState(false);
    const [logModalLineData, setLogModalLineData] = useFetchState([]);
    const [orginTrendData, setOrginTrendData] = useFetchState([]);
    const [modelTitle, setModelTitle] = useFetchState('');

    useEffect(() => {
        getAnomalyResultTrendAsync({taskId: id}, {
            cb: (info) => {
                !!info && !!info.data && setOrginTrendData(info.data || []);
                setLineChartLoading(false);
            },
        });
    }, []);

    return (
        <div className={styles["log-anomaly-detail-sec"]}>
            <Spin spinning={lineChartLoading}>
                <div className="top-box">
                    {
                        !!orginTrendData && !!orginTrendData.length ?
                            <Charts
                                ref={echartsref}
                                title={IntlFormatMessage('laboratory.anomaly.logDistribution')}
                                data={{
                                    seriesData: (orginTrendData|| []).map(item => {
                                        if (item.log_time) {
                                            return [Number(item.log_time), Number(item.log_value)];
                                        }
                                    }).filter(Boolean)
                                }}
                                ifShowLegend={false}
                            />
                            : null
                    }
                </div>
            </Spin>
            <div className="log-anomaly-detail-sec-body">
                <DetailBody
                    setLogModalVisible={setLogModalVisible}
                    setLogModalLineData={setLogModalLineData}
                    setModelTitle={setModelTitle}
                />
            </div>
            {
                logModalVisible &&
                <LogAnalysisModel
                    logModalVisible={logModalVisible}
                    setLogModalVisible={setLogModalVisible}
                    logModalLineData={logModalLineData}
                    modelTitle={modelTitle}
                />
            }
        </div>
    );
};

export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        getAnomalyResultAsync: laboratoryStore.getAnomalyResultAsync,
        getAnomalyResultTrendAsync: laboratoryStore.getAnomalyResultTrendAsync,
        checkOriginLogs: laboratoryStore.checkOriginLogs,
        logOriginTren: laboratoryStore.logOriginTren,
        patternResults: laboratoryStore.patternResults,
    };
})(Form.create()(LogAnomalyDetailSec));
