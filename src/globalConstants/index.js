export const moduleName = 'doia';
import {IntlFormatMessage} from "@/utils/util";
//本地存储设置
export const LocalStorageConf = {
    prefix: "do"
};

export const POPUP_EXPIRE = 3; //弹出框过期时间

//是否为开发环境
export const isDev = (process.env.NODE_ENV == 'development') ? true : false;

export const formatArithmeticType = () => {
    let type = {};
    (window.DOIA_CONFIG.dataSceneTypeList || []).map(item => {
        type[item.type] = item.title;
    });
    return type;
};

export const formatType = (type) => {
    switch (type) {
        case 'Anomaly detection of single index time series data':
            return 'task.anomaly.name';
        case 'Single index time series data prediction':
            return 'task.single.name';
        case 'Log Parsing':
            return 'laboratory.anomaly.logPatternRecognition';
        case 'Root cause analysis':
            return 'laboratory.anomaly.rootCauseAnalysis';
        case 'Alert Compress':
            return 'task.create.algorithmsAlert';
        case 'Multi dimensional index analysis':
            return '多指标关联分析';
        case 'anomaly_detection':
            return 'task.anomaly.name';
        case 'anomaly_detections':
            return 'task.anomaly.name';
        case 'forecasting':
            return 'task.single.name';
        case 'log_parsing':
            return 'laboratory.anomaly.logPatternRecognition';
        case 'log_anomaly_detection':
            return 'laboratory.anomaly.logAnomalyDetection';
        case 'root_cause_analysis':
            return 'task.root.name';
        case 'alerting':
            return 'task.create.algorithmsAlert';
        case 'analysis':
            return '多指标关联分析';
        case 'multi_index_analysis':
            return 'task.create.metricAnalysis';
        case 'KAFKA':
            return 'KAFKA';
        case 'outline':
            return 'CH';
        case 'file':
            return 'laboratory.anomaly.relationshipSelect';
        case 'iotdb':
            return 'IOTDB';
        case 'common':
            return 'task.anomaly.name';
        case 'trace':
            return '调用链';
        default:
            return '';
    }
};

//     'laboratory.anomaly.anomalyGenericity': '新建单指标异常检测泛型',
//     'laboratory.anomaly.singleGenericity': '新建单指标预测泛型',
//     'laboratory.anomaly.analysisGenericity': '新建根因分析与推荐泛型',
//     'laboratory.anomaly.patternGenericity': '新建日志模式识别泛型',
//     'laboratory.anomaly.detectionGenericity': '新建日志异常检测泛型',

export const formatTypeCreate = (type) => {
    switch (type) {
        case 'Anomaly detection of single index time series data':
            return 'laboratory.anomaly.anomalyGenericity';
        case 'Single index time series data prediction':
            return 'laboratory.anomaly.singleGenericity';
        case 'Log Parsing':
            return 'laboratory.anomaly.patternGenericity';
        case 'Root cause analysis':
            return 'laboratory.anomaly.analysisGenericity';
        case 'Alert Compress':
            return '告警压缩';
        case 'Multi dimensional index analysis':
            return '多指标关联分析';
        case 'anomaly_detection':
            return 'laboratory.anomaly.anomalyGenericity';
        case 'anomaly_detections':
            return 'laboratory.anomaly.anomalyGenericity';
        case 'forecasting':
            return 'laboratory.anomaly.singleGenericity';
        case 'log_parsing':
            return 'laboratory.anomaly.patternGenericity';
        case 'log_anomaly_detection':
            return 'laboratory.anomaly.detectionGenericity';
        case 'root_cause_analysis':
            return 'laboratory.anomaly.analysisGenericity';
        case 'alerting':
            return '告警压缩';
        case 'analysis':
            return '多指标关联分析';
        case 'KAFKA':
            return 'KAFKA';
        case 'outline':
            return 'CH';
        case 'file':
            return 'laboratory.anomaly.relationshipSelect';
        case 'iotdb':
            return 'IOTDB';
        case 'common':
            return 'laboratory.anomaly.anomalyGenericity';
        case 'trace':
            return '调用链';
        default:
            return '';
    }
};

export const PATH_MAP = (path) => {
    if (path.indexOf('/dashboard') > -1) {
        return '/dashboard';
    } else if (path.indexOf('/datasource') > -1) {
        return '/datasource';
    } else if (path.indexOf('/generics') > -1) {
        return '/generics';
    } else if (path.indexOf('/task/forecasting') > -1) {
        return '/task/forecasting';
    } else if (path.indexOf('/task/anomaly_detection') > -1) {
        return '/task/anomaly_detection';
    } else if (path.indexOf('/task') > -1) {
        return '/task/anomaly_detection';
    } else if (path.indexOf('/monitor') > -1) {
        return '/monitor';
    } else if (path.indexOf('/multitenancy') > -1) {
        return '/multitenancy';
    } else if (path.indexOf('/laboratory') > -1) {
        return '/laboratory';
    } else if (path.indexOf('/setting') > -1) {
        return '/setting';
    }
};

export const OperatorList = {
    E: {
        key: 'E',
        value: 'btn.adaptive.equalTo',
        sign: 'btn.adaptive.equalTo',
    },
    NE: {
        key: 'NE',
        value: 'btn.adaptive.unequalTo',
        sign: 'btn.adaptive.unequalTo',
    },
    LIKE: {
        key: 'LIKE',
        value: 'btn.adaptive.include',
        sign: 'btn.adaptive.include',
    },
    NLIKE: {
        key: 'NLIKE',
        value: 'btn.adaptive.exclude',
        sign: 'btn.adaptive.exclude',
    },
    IN: {
        key: 'IN',
        value: 'btn.adaptive.listedIn',
        sign: 'btn.adaptive.listedIn',
    },
    NIN: {
        key: 'NIN',
        value: 'btn.adaptive.notListedIn',
        sign: 'btn.adaptive.notListedIn',
    },
};

export const polymerizationType = [
    {
        title: '最大值',
        key: 'MAX',
        id: 'common.maximum',
    },
    {
        title: '最小值',
        key: 'MIN',
        id: 'common.minimum',
    },
    {
        title: '平均值',
        key: 'AVG',
        id: 'common.average',
    },
    {
        title: '计数',
        key: 'COUNT',
        id: 'common.count',
    },
    {
        title: '求和',
        key: 'SUM',
        id: 'common.sum',
    },
    {
        title: '百分位',
        key: 'QUANTILE_EXACT',
        id: 'common.quantileExact',
    },
];

export const utilType = [
    {
        title: '秒',
        key: 'SECOND',
        id: 'common.second',
    },
    {
        title: '分钟',
        key: 'MINUTE',
        id: 'common.minutes',
    },
    {
        title: '小时',
        key: 'HOUR',
        id: 'common.hours',
    },
    {
        title: '天',
        key: 'DAY',
        id: 'common.days',
    },
    // {
    //     title: '月',
    //     key: 'MONTH',
    // },
];

export const timeType = (number, unit) => {
    switch (unit) {
        case 'SECOND':
            return number * 1000;
        case 'MINUTE':
            return number * 60 * 1000;
        case 'HOUR':
            return number * 60 * 60 * 1000;
        case 'DAY':
            return number * 24 * 60 * 60 * 1000;
        case 'MONTH':
            return number * 30 * 24 * 60 * 60 * 1000;
    }
};

export const isInPortal = () => {
    return !!document.querySelector('#singlespa-container');
};
export const isInPortalURL = () => {
    return (!isInPortal() ? '' : window.DOIA_CONFIG.basename);
};

//定义数据表的类型
import commonSvg from '@/public/img/datastore/common.svg';
import logSvg from '@/public/img/datastore/log.svg';
import rootCauseAnalysisSvg from '@/public/img/datastore/rootCauseAnalysisSvg.svg';
import logParsingSvg from '@/public/img/datastore/logParsingSvg.svg';
import logAnomalyDetectionSvg from '@/public/img/datastore/logAnomalyDetectionSvg.svg';
import metricSvg from '@/public/img/datastore/metric.svg';
import traceSvg from '@/public/img/datastore/trace.svg';
import kafkaSvg from '@/public/img/datasource/kafka.svg';
import httpSvg from '@/public/img/datasource/http.svg';
import anomaly_detectionSvg from '@/pages/Dashboard/assets/anomaly_detection.svg';
import forecastingSvg from '@/pages/Dashboard/assets/forecasting.svg';
import journalDashbordSvg from '@/pages/Dashboard/assets/journal.svg';
import logAnomalyDetectionDashbordSvg from '@/pages/Dashboard/assets/log_anomaly_detection.svg';
import logAnomalyDetectionDashbordEnSvg from '@/pages/Dashboard/assets/log_anomaly_detectionEn.svg';
import root_cause_analysisnSvg from '@/pages/Dashboard/assets/root_cause_analysis.png';
import root_cause_analysisnEnSvg from '@/pages/Dashboard/assets/root_cause_analysis_en.png';
import alertingSvg from '@/pages/Dashboard/assets/alerting.svg';
import alertingEnSvg from '@/pages/Dashboard/assets/alertingEn.svg';
import analysisSvg from '@/pages/Dashboard/assets/analysis.svg';
import analysisEnSvg from '@/pages/Dashboard/assets/analysis_en.svg';
import dotSvg from '@/pages/Dashboard/assets/dot.svg';
import chsvg from '@/pages/DataSource/assets/ch.svg';
import filesvg from '@/pages/DataSource/assets/file.svg';
import iotdbsvg from '@/pages/DataSource/assets/iotdb.svg';
import waveDetectionDefault from '@/assets/images/waveDetectionDefault.svg';
import waveDetectionDefaultEn from '@/assets/images/waveDetectionDefault_en.svg';
import waveDetectionUnsensitive from '@/assets/images/waveDetectionUnsensitive.svg';
import waveDetectionUnsensitiveEn from '@/assets/images/waveDetectionUnsensitive_en.svg';
import waveDetectionSensitive from '@/assets/images/waveDetectionSensitive.svg';
import waveDetectionSensitiveEn from '@/assets/images/waveDetectionSensitive_en.svg';
import valueSegmentDetectDefault from '@/assets/images/valueSegmentDetectDefault.svg';
import valueSegmentDetectDefaultEn from '@/assets/images/valueSegmentDetectDefault_en.svg';
import valueSegmentDetectNarrowBound from '@/assets/images/valueSegmentDetectNarrowBound.svg';
import valueSegmentDetectNarrowBoundEn from '@/assets/images/valueSegmentDetectNarrowBound_en.svg';
import valueSegmentDetectWideBound from '@/assets/images/valueSegmentDetectWideBound.svg';
import valueSegmentDetectWideBoundEn from '@/assets/images/valueSegmentDetectWideBound_en.svg';
import valueSegmentDetectCloseRealData from '@/assets/images/valueSegmentDetectCloseRealData.svg';
import valueSegmentDetectCloseRealDataEn from '@/assets/images/valueSegmentDetectCloseRealData_en.svg';
import dynamicBaselineForecastingDefault from '@/assets/images/dynamicBaselineForecastingDefault.svg';
import dynamicBaselineForecastingDefaultEn from '@/assets/images/dynamicBaselineForecastingDefault_en.svg';
import arimaForecastingWeeklyPeriodicity from '@/assets/images/arimaForecastingWeeklyPeriodicity.svg';
import arimaForecastingWeeklyPeriodicityEn from '@/assets/images/arimaForecastingWeeklyPeriodicity_en.svg';
import arimaForecastingDailyPeriodicity from '@/assets/images/arimaForecastingDailyPeriodicity.svg';
import arimaForecastingDailyPeriodicityEn from '@/assets/images/arimaForecastingDailyPeriodicity_en.svg';
import arimaForecastingLinearTrend from '@/assets/images/arimaForecastingLinearTrend.svg';
import arimaForecastingLinearTrendEn from '@/assets/images/arimaForecastingLinearTrend_en.svg';
import holtWinterWeeklyPeriordicity from '@/assets/images/holtWinterWeeklyPeriordicity.svg';
import holtWinterWeeklyPeriordicityEn from '@/assets/images/holtWinterWeeklyPeriordicity_en.svg';
import arimaForecastingDefault from '@/assets/images/arimaForecastingDefault.svg';
import arimaForecastingDefaultEn from '@/assets/images/arimaForecastingDefault_en.svg';
import holtWinterForecastingDefault from '@/assets/images/holtWinterForecastingDefault.svg';
import holtWinterForecastingDefaultEn from '@/assets/images/holtWinterForecastingDefault_en.svg';
import holtWinterWeeklyPeriordicityLinearTrend from '@/assets/images/holtWinterWeeklyPeriordicityLinearTrend.svg';
import holtWinterWeeklyPeriordicityLinearTrendEn from '@/assets/images/holtWinterWeeklyPeriordicityLinearTrend_en.svg';

import dynamicBaselineForecastingWeeklyPeriodicity
    from '@/assets/images/dynamicBaselineForecastingWeeklyPeriodicity.svg';
import dynamicBaselineForecastingWeeklyPeriodicityEn
    from '@/assets/images/dynamicBaselineForecastingWeeklyPeriodicity_en.svg';
import dynamicBaselineForecastingTrendDominant from '@/assets/images/dynamicBaselineForecastingTrendDominant.svg';
import dynamicBaselineForecastingTrendDominantEn from '@/assets/images/dynamicBaselineForecastingTrendDominant_en.svg';
import dynamicBaselineDailyPeriodicityFewdata from '@/assets/images/dynamicBaselineDailyPeriodicityFewdata.svg';
import dynamicBaselineDailyPeriodicityFewdataEn from '@/assets/images/dynamicBaselineDailyPeriodicityFewdata_en.svg';
import dynamicBaselineTrendDominant from '@/assets/images/dynamicBaselineTrendDominant.svg';
import dynamicBaselineTrendDominantEn from '@/assets/images/dynamicBaselineTrendDominant_en.svg';
import dynamicBaselineDefault from '@/assets/images/dynamicBaselineDefault.svg';
import dynamicBaselineDefaultEn from '@/assets/images/dynamicBaselineDefault_en.svg';
import dynamicBaselineWideBound from '@/assets/images/dynamicBaselineWideBound.svg';
import dynamicBaselineWideBoundEn from '@/assets/images/dynamicBaselineWideBound_en.svg';
import dynamicBaselineNarrowBound from '@/assets/images/dynamicBaselineNarrowBound.svg';
import dynamicBaselineNarrowBoundEn from '@/assets/images/dynamicBaselineNarrowBound_en.svg';
import dynamicBaselineWeeklyPeriodicity from '@/assets/images/dynamicBaselineWeeklyPeriodicity.svg';
import dynamicBaselineWeeklyPeriodicityEn from '@/assets/images/dynamicBaselineWeeklyPeriodicity_en.svg';
import dw_timaDetectDefault from '@/assets/images/dw_timaDetectDefault.svg';
import dw_timaDetectDefaultEn from '@/assets/images/dw_timaDetectDefault_en.svg';
import dw_timaDetectWide from '@/assets/images/dw_timaDetectWide.svg';
import dw_timaDetectWideEn from '@/assets/images/dw_timaDetectWide_en.svg';
import dw_timaDetectUpperInsensitive from '@/assets/images/dw_timaDetectUpperInsensitive.svg';
import dw_timaDetectUpperInsensitiveEn from '@/assets/images/dw_timaDetectUpperInsensitive_en.svg';
import log_dw_timaDefault from '@/assets/images/log_dw_timaDefault.svg';
import log_dw_timaDefaultEn from '@/assets/images/log_dw_timaDefault_en.svg';
import logDWTimaJumpUnsensitive from '@/assets/images/logDWTimaJumpUnsensitive.svg';
import logDWTimaJumpUnsensitiveEn from '@/assets/images/logDWTimaJumpUnsensitive_en.svg';
import logDWTimaDropUnsensitive from '@/assets/images/logDWTimaDropUnsensitive.svg';
import logDWTimaDropUnsensitiveEn from '@/assets/images/logDWTimaDropUnsensitive_en.svg';
import DWLoADsJumpUnsensitive from '@/assets/images/DWLoADsJumpUnsensitive.svg';
import DWLoADsJumpUnsensitiveEn from '@/assets/images/DWLoADsJumpUnsensitive_en.svg';
import DWLoADsDropUnsensitive from '@/assets/images/DWLoADsDropUnsensitive.svg';
import DWLoADsDropUnsensitiveEn from '@/assets/images/DWLoADsDropUnsensitive_en.svg';
import dw_loadsDefault from '@/assets/images/dw_loadsDefault.svg';
import dw_loadsDefaultEn from '@/assets/images/dw_loadsDefault_en.svg';
import timaDetectDefault from '@/assets/images/timaDetectDefault.svg';
import timaDetectDefaultEn from '@/assets/images/timaDetectDefault_en.svg';
import timaDetectWideRange from '@/assets/images/timaDetectWideRange.svg';
import timaDetectWideRangeEn from '@/assets/images/timaDetectWideRange_en.svg';
import timaDetectUpperInsensitive from '@/assets/images/timaDetectUpperInsensitive.svg';
import timaDetectUpperInsensitiveEn from '@/assets/images/timaDetectUpperInsensitive_en.svg';
import autoValueDefault from '@/assets/images/autoValueDefault.svg';
import autoValueDefaultEn from '@/assets/images/autoValueDefault_en.svg';
import autoValueWideBound from '@/assets/images/autoValueWideBound.svg';
import autoValueWideBoundEn from '@/assets/images/autoValueWideBound_en.svg';
import autoValueNarrowBound from '@/assets/images/autoValueNarrowBound.svg';
import autoValueNarrowBoundEn from '@/assets/images/autoValueNarrowBound_en.svg';
import drainLogParsingDefault from '@/assets/images/drainLogParsingDefault.svg';
import drainLogParsingDefaultTwo from '@/assets/images/drainLogParsingDefaultTwo.svg';
import drainLogParsingDefaultEn from '@/assets/images/drainLogParsingDefault_en.svg';
import drainLogParsingDefaultTrendParseEn from '@/assets/images/arimaForecastingLinearTrendParse_en.svg';
import drainLogParsingSmallTreeDepth from '@/assets/images/drainLogParsingSmallTreeDepth.svg';
import drainLogParsingSmallTreeDepthEn from '@/assets/images/drainLogParsingSmallTreeDepth_en.svg';
import drainLogParsingLargeTreeDepth from '@/assets/images/drainLogParsingLargeTreeDepth.svg';
import drainLogParsingLargeTreeDepthEn from '@/assets/images/drainLogParsingLargeTreeDepth_en.svg';
import drainLogParsingHighThreshold from '@/assets/images/drainLogParsingHighThreshold.svg';
import drainLogParsingHighThresholdEn from '@/assets/images/drainLogParsingHighThreshold_en.svg';
import drainLogParsingLowThreshold from '@/assets/images/drainLogParsingLowThreshold.svg';
import drainLogParsingLowThresholdEn from '@/assets/images/drainLogParsingLowThreshold_en.svg';
import noRanDefaultGenericity from '@/assets/images/noRanDefaultGenericity.svg';
import noRanDefaultGenericityEn from '@/assets/images/noRanDefaultGenericity_en.svg';
import noRanDefaultEn from '@/assets/images/noRanDefault_en.svg';
import noRanDefault from '@/assets/images/noRanDefault.svg';
import noRanGenericityWithoutAdjust from '@/assets/images/noRanGenericityWithoutAdjust.svg';
import noRanGenericityWithoutAdjustEn from '@/assets/images/noRanGenericityWithoutAdjust_en.svg';
import meRExDefault from '@/assets/images/meRExDefault.svg';
import meRExDefaultEn from '@/assets/images/meRExDefault_en.svg';
import meRExGenericityWithoutAdjust from '@/assets/images/meRExGenericityWithoutAdjust.svg';
import meRExGenericityWithoutAdjustEn from '@/assets/images/meRExGenericityWithoutAdjust_en.svg';
import meRExLowValve from '@/assets/images/meRExLowValve.svg';
import meRExLowValveEn from '@/assets/images/meRExLowValve_en.svg';
import meToWGenericityWithoutAdjust from '@/assets/images/meToWGenericityWithoutAdjust.svg';
import meToWGenericityWithoutAdjustEn from '@/assets/images/meToWGenericityWithoutAdjust_en.svg';
import meToWDefault from '@/assets/images/meToWDefault.svg';
import meToWDefaultEn from '@/assets/images/meToWDefault_en.svg';

export const genericsPicList = {
    'Wave detection default': {
        name: {
            en: 'wave detection default',
            zh: '频域分析默认',
        },
        img: {
            zh: waveDetectionDefault,
            en: waveDetectionDefaultEn,
        },
    },
    'Wave Detection': {
        name: {
            en: 'wave detection default',
            zh: '频域分析默认',
        },
        img: {
            zh: waveDetectionDefault,
            en: waveDetectionDefaultEn,
        },
    },
    'Wave detection unsensitive': {
        name: {
            en: 'wave detection unsensitive',
            zh: '频域分析不敏感',
        },
        img: {
            zh: waveDetectionUnsensitive,
            en: waveDetectionUnsensitiveEn,
        },
    },
    'Wave detection sensitive': {
        name: {
            en: 'wave detection unsensitive',
            zh: '频域分析敏感',
        },
        img: {
            zh: waveDetectionSensitive,
            en: waveDetectionSensitiveEn,
        },
    },
    'Value segment detect default': {
        name: {
            en: 'value segment detect default',
            zh: '分段自动阈值默认',
        },
        img: {
            zh: valueSegmentDetectDefault,
            en: valueSegmentDetectDefaultEn,
        },
    },
    'Value Segment Detect': {
        name: {
            en: 'value segment detect default',
            zh: '分段自动阈值默认',
        },
        img: {
            zh: valueSegmentDetectDefault,
            en: valueSegmentDetectDefaultEn,
        },
    },
    'Value segment detect narrow bound': {
        name: {
            en: 'value segment detect narrow bound',
            zh: '分段自动阈值窄边界',
        },
        img: {
            zh: valueSegmentDetectNarrowBound,
            en: valueSegmentDetectNarrowBoundEn,
        },
    },
    'Value segment detect wide bound': {
        name: {
            en: 'value segment detect wide bound',
            zh: '分段自动阈值宽边界',
        },
        img: {
            zh: valueSegmentDetectWideBound,
            en: valueSegmentDetectWideBoundEn,
        },
    },
    'Value segment detect close real data': {
        name: {
            en: 'value segment detect close real data',
            zh: '分段自动阈值历史拟合',
        },
        img: {
            zh: valueSegmentDetectCloseRealData,
            en: valueSegmentDetectCloseRealDataEn,
        },
    },
    'Dynamic baseline forecasting default': {
        name: {
            en: 'dynamic baseline forecasting default',
            zh: '动态基线预测默认',
        },
        img: {
            zh: dynamicBaselineForecastingDefault,
            en: dynamicBaselineForecastingDefaultEn,
        },
    },
    'Dynamic Baseline Forecast': {
        name: {
            en: 'dynamic baseline forecasting default',
            zh: '动态基线预测默认',
        },
        img: {
            zh: dynamicBaselineForecastingDefault,
            en: dynamicBaselineForecastingDefaultEn,
        },
    },
    'Arima forecasting weekly periodicity': {
        name: {
            en: 'Arima Forecasting Weekly Periodicity',
            zh: '自回归滑动平均预测周周期',
        },
        img: {
            zh: arimaForecastingWeeklyPeriodicity,
            en: arimaForecastingWeeklyPeriodicityEn,
        },
    },
    'Arima forecasting daily periodicity': {
        name: {
            en: 'Arima Forecasting Daily Periodicity',
            zh: '自回归滑动平均预测日周期',
        },
        img: {
            zh: arimaForecastingDailyPeriodicity,
            en: arimaForecastingDailyPeriodicityEn,
        },
    },
    'Arima forecasting linear trend': {
        name: {
            en: 'Arima Forecasting Linear Trend',
            zh: '自回归滑动平均预测线性趋势',
        },
        img: {
            zh: arimaForecastingLinearTrend,
            en: arimaForecastingLinearTrendEn,
        },
    },
    'Holtwinter weekly periordicity': {
        name: {
            en: 'HoltWinter Forecasting Weekly Periordicity',
            zh: '指数平均预测周周期',
        },
        img: {
            zh: holtWinterWeeklyPeriordicity,
            en: holtWinterWeeklyPeriordicityEn,
        },
    },
    'Arima forecasting default': {
        name: {
            en: 'Arima Forecasting Default',
            zh: '自回归滑动平均默认',
        },
        img: {
            zh: arimaForecastingDefault,
            en: arimaForecastingDefaultEn,
        },
    },
    'ARIMA Forecast': {
        name: {
            en: 'ARIMA Forecast',
            zh: '自回归滑动平均默认',
        },
        img: {
            zh: arimaForecastingDefault,
            en: arimaForecastingDefaultEn,
        },
    },
    'Arima Forecast': {
        name: {
            en: 'Arima Forecast',
            zh: '自回归滑动平均默认',
        },
        img: {
            zh: arimaForecastingDefault,
            en: arimaForecastingDefaultEn,
        },
    },
    'Holtwinters forecasting default': {
        name: {
            en: 'HoltWinter Forecasting Default',
            zh: '指数平均预测默认',
        },
        img: {
            zh: holtWinterForecastingDefault,
            en: holtWinterForecastingDefaultEn,
        },
    },
    'HoltWinters Forecast': {
        name: {
            en: 'HoltWinter Forecasting',
            zh: '指数平均预测默认',
        },
        img: {
            zh: holtWinterForecastingDefault,
            en: holtWinterForecastingDefaultEn,
        },
    },
    'Holtwinters Forecast': {
        name: {
            en: 'Holtwinter Forecasting',
            zh: '指数平均预测默认',
        },
        img: {
            zh: holtWinterForecastingDefault,
            en: holtWinterForecastingDefaultEn,
        },
    },
    'Holtwinters forecasting weekly periodicity': {
        name: {
            en: 'HoltWinter Forecasting Weekly Periodicity',
            zh: '指数平均预测周周期',
        },
        img: {
            zh: holtWinterWeeklyPeriordicity,
            en: holtWinterWeeklyPeriordicityEn,
        },
    },
    'Holtwinters forecasting weekly periodicity linear trend': {
        name: {
            en: 'HoltWinter Forecasting Weekly Periodicity Linear Trend',
            zh: '指数平均预测周周期线性趋势',
        },
        img: {
            zh: holtWinterWeeklyPeriordicityLinearTrend,
            en: holtWinterWeeklyPeriordicityLinearTrendEn,
        },
    },
    'Dynamic baseline forecasting weekly periodicity': {
        name: {
            en: 'dynamic baseline forecasting weekly periodicity',
            zh: '动态基线预测周周期',
        },
        img: {
            zh: dynamicBaselineForecastingWeeklyPeriodicity,
            en: dynamicBaselineForecastingWeeklyPeriodicityEn,
        },
    },
    'Dynamic baseline forecasting trend dominant': {
        name: {
            en: 'dynamic baseline forecasting trend dominant',
            zh: '动态基线预测趋势拟合',
        },
        img: {
            zh: dynamicBaselineForecastingTrendDominant,
            en: dynamicBaselineForecastingTrendDominantEn,
        },
    },
    'Dynamic baseline daily periodicity fewdata': {
        name: {
            en: 'dynamic baseline daily periodicity fewdata',
            zh: '动态基线少量数据获取天周期',
        },
        img: {
            zh: dynamicBaselineDailyPeriodicityFewdata,
            en: dynamicBaselineDailyPeriodicityFewdataEn,
        },
    },
    'Dynamic baseline trend dominant': {
        name: {
            en: 'dynamic baseline trend dominant',
            zh: '动态基线趋势拟合',
        },
        img: {
            zh: dynamicBaselineTrendDominant,
            en: dynamicBaselineTrendDominantEn,
        },
    },
    'Dynamic baseline default': {
        name: {
            en: 'dynamic baseline default',
            zh: '动态基线默认',
        },
        img: {
            zh: dynamicBaselineDefault,
            en: dynamicBaselineDefaultEn,
        },
    },
    'Dynamic Baseline Detect': {
        name: {
            en: 'dynamic baseline default',
            zh: '动态基线默认',
        },
        img: {
            zh: dynamicBaselineDefault,
            en: dynamicBaselineDefaultEn,
        },
    },
    'Dynamic baseline wide bound': {
        name: {
            en: 'dynamic baseline wide bound',
            zh: '动态基线宽边界',
        },
        img: {
            zh: dynamicBaselineWideBound,
            en: dynamicBaselineWideBoundEn,
        },
    },
    'Dynamic baseline narrow bound': {
        name: {
            en: 'dynamic baseline narrow bound',
            zh: '动态基线窄边界',
        },
        img: {
            zh: dynamicBaselineNarrowBound,
            en: dynamicBaselineNarrowBoundEn,
        },
    },
    'Dynamic baseline weekly periodicity': {
        name: {
            en: 'dynamic baseline weekly periodicity',
            zh: '动态基线周周期',
        },
        img: {
            zh: dynamicBaselineWeeklyPeriodicity,
            en: dynamicBaselineWeeklyPeriodicityEn,
        },
    },
    'DW Tima detect default': {
        name: {
            en: 'dw_tima detect default',
            zh: 'dw_tima默认',
        },
        img: {
            zh: dw_timaDetectDefault,
            en: dw_timaDetectDefaultEn,
        },
    },
    'DW Tima Detect': {
        name: {
            en: 'dw_tima detect default',
            zh: 'dw_tima默认',
        },
        img: {
            zh: dw_timaDetectDefault,
            en: dw_timaDetectDefaultEn,
        },
    },
    'DW Tima wide range': {
        name: {
            en: 'dw_tima detect wide',
            zh: 'dw_tima宽边界',
        },
        img: {
            zh: dw_timaDetectWide,
            en: dw_timaDetectWideEn,
        },
    },
    'DW Tima upper insensitive': {
        name: {
            en: 'dw_tima detect upper insensitive',
            zh: 'dw_tima对上边界不敏感',
        },
        img: {
            zh: dw_timaDetectUpperInsensitive,
            en: dw_timaDetectUpperInsensitiveEn,
        },
    },
    'Log DW Tima Anomaly Detection': {
        name: {
            en: 'Log DW Tima Anomaly Detection',
            zh: 'Log DW Tima默认',
        },
        img: {
            zh: log_dw_timaDefault,
            en: log_dw_timaDefaultEn,
        },
    },
    'Log DW Tima default': {
        name: {
            en: 'log_dw_tima default',
            zh: 'Log DW Tima默认',
        },
        img: {
            zh: log_dw_timaDefault,
            en: log_dw_timaDefaultEn,
        },
    },
    'Log DW Tima jump unsensitive': {
        name: {
            en: 'Log DW Tima jump unsensitive',
            zh: 'Log DW Tima突增不敏感',
        },
        img: {
            zh: logDWTimaJumpUnsensitive,
            en: logDWTimaJumpUnsensitiveEn,
        },
    },
    'Log DW Tima drop unsensitive': {
        name: {
            en: 'Log DW Tima drop unsensitive',
            zh: 'Log DW Tima突降不敏感',
        },
        img: {
            zh: logDWTimaDropUnsensitive,
            en: logDWTimaDropUnsensitiveEn,
        },
    },
    'DW LoADs Anomaly Detection': {
        name: {
            en: 'DW LoADs Anomaly Detection',
            zh: 'DW LoADs默认',
        },
        img: {
            zh: dw_loadsDefault,
            en: dw_loadsDefaultEn,
        },
    },
    'DW LoADs default': {
        name: {
            en: 'dw_loads default',
            zh: 'DW LoADs默认',
        },
        img: {
            zh: dw_loadsDefault,
            en: dw_loadsDefaultEn,
        },
    },
    'DW LoADs jump unsensitive': {
        name: {
            en: 'DW LoADs jump unsensitive',
            zh: 'DW LoADs突增不敏感',
        },
        img: {
            zh: DWLoADsJumpUnsensitive,
            en: DWLoADsJumpUnsensitiveEn,
        },
    },
    'DW LoADs drop unsensitive': {
        name: {
            en: 'DW LoADs drop unsensitive',
            zh: 'DW LoADs突降不敏感',
        },
        img: {
            zh: DWLoADsDropUnsensitive,
            en: DWLoADsDropUnsensitiveEn,
        },
    },
    'Tima detect default': {
        name: {
            en: 'tima detect default',
            zh: 'Tima默认',
        },
        img: {
            zh: timaDetectDefault,
            en: timaDetectDefaultEn,
        },
    },
    'Tima Detect': {
        name: {
            en: 'tima detect default',
            zh: 'Tima默认',
        },
        img: {
            zh: timaDetectDefault,
            en: timaDetectDefaultEn,
        },
    },
    'Tima wide range': {
        name: {
            en: 'tima detect wide range',
            zh: 'Tima宽边界检测',
        },
        img: {
            zh: timaDetectWideRange,
            en: timaDetectWideRangeEn,
        },
    },
    'Tima upper insensitive': {
        name: {
            en: 'tima detect upper insensitive',
            zh: 'Tima对上不敏感检测',
        },
        img: {
            zh: timaDetectUpperInsensitive,
            en: timaDetectUpperInsensitiveEn,
        },
    },
    'Autovalue default': {
        name: {
            en: 'autovalue default',
            zh: '自动阈值默认',
        },
        img: {
            zh: autoValueDefault,
            en: autoValueDefaultEn,
        },
    },
    'Auto Value Detect': {
        name: {
            en: 'autovalue default',
            zh: '自动阈值默认',
        },
        img: {
            zh: autoValueDefault,
            en: autoValueDefaultEn,
        },
    },
    'Autovalue wide bound': {
        name: {
            en: 'autovalue wide bound',
            zh: '自动阈值宽边界',
        },
        img: {
            zh: autoValueWideBound,
            en: autoValueWideBoundEn,
        },
    },
    'Autovalue narrow bound': {
        name: {
            en: 'autovalue wide bound',
            zh: '自动阈值宽边界',
        },
        img: {
            zh: autoValueNarrowBound,
            en: autoValueNarrowBoundEn,
        },
    },
    'Drain Log Parsing': {
        name: {
            en: 'Drain Log Parsing default',
            zh: 'Drain日志解析默认',
        },
        img: {
            zh: drainLogParsingDefault,
            en: drainLogParsingDefaultEn,
        },
    },
    'Drain Log Parsing default': {
        name: {
            en: 'Drain Log Parsing default',
            zh: 'Drain日志解析默认',
        },
        img: {
            zh: drainLogParsingDefault,
            en: drainLogParsingDefaultEn,
        },
    },
    'Drain Log Parsing for already segmented words': {
        name: {
            en: 'Drain Log Parsing default for participle',
            zh: 'Drain日志解析默认已分词',
        },
        img: {
            zh: drainLogParsingDefaultTwo,
            en: drainLogParsingDefaultTrendParseEn,
        },
    },
    'Drain Log Parsing low threshold': {
        name: {
            en: 'Drain Log Parsing low threshold',
            zh: 'Drain日志解析低阈值',
        },
        img: {
            zh: drainLogParsingLowThreshold,
            en: drainLogParsingLowThresholdEn,
        },
    },
    'Drain Log Parsing high threshold': {
        name: {
            en: 'Drain Log Parsing high threshold',
            zh: 'Drain日志解析高阈值',
        },
        img: {
            zh: drainLogParsingHighThreshold,
            en: drainLogParsingHighThresholdEn,
        },
    },
    'Drain Log Parsing large tree depth': {
        name: {
            en: 'Drain Log Parsing large tree depth',
            zh: 'Drain日志解析树深大',
        },
        img: {
            zh: drainLogParsingLargeTreeDepth,
            en: drainLogParsingLargeTreeDepthEn,
        },
    },
    'Drain Log Parsing small tree depth': {
        name: {
            en: 'Drain Log Parsing small tree depth',
            zh: 'Drain日志解析树深小',
        },
        img: {
            zh: drainLogParsingSmallTreeDepth,
            en: drainLogParsingSmallTreeDepthEn,
        },
    },
    'NoRan': {
        name: {
            en: 'NoRan',
            zh: 'NoRan默认泛型',
        },
        img: {
            // zh: noRanDefaultGenericity,
            // en: noRanDefaultGenericityEn,
            zh: noRanDefault,
            en: noRanDefaultEn,
        },
    },
    // 'NoRan default genericity': {
    //     name: {
    //         en: 'NoRan default genericity',
    //         zh: 'NoRan默认泛型',
    //     },
    //     img: {
    //         zh: noRanDefaultGenericity,
    //         en: noRanDefaultGenericityEn,
    //     },
    // },
    'NoRan default': {
        name: {
            en: 'NoRan default',
            zh: 'NoRan默认泛型',
        },
        img: {
            zh: noRanDefault,
            en: noRanDefaultEn,
        },
    },
    'NoRan without adjustment': {
        name: {
            en: 'NoRan genericity without adjust',
            zh: 'NoRan泛型（不使用历史结果修正）',
        },
        img: {
            zh: noRanGenericityWithoutAdjust,
            en: noRanGenericityWithoutAdjustEn,
        },
    },
    'MeREx': {
        name: {
            en: 'MeREx',
            zh: 'MeREx默认泛型',
        },
        img: {
            zh: meRExDefault,
            en: meRExDefaultEn,
        },
    },
    'MeREx default': {
        name: {
            en: 'MeREx default',
            zh: 'MeREx默认泛型',
        },
        img: {
            zh: meRExDefault,
            en: meRExDefaultEn,
        },
    },
    'MeREx without adjustment': {
        name: {
            en: 'MeREx genericity without adjust',
            zh: 'MeREx泛型（不使用历史结果修正）',
        },
        img: {
            zh: meRExGenericityWithoutAdjust,
            en: meRExGenericityWithoutAdjustEn,
        },
    },
    'MeREx low valve': {
        name: {
            en: 'MeREx low valve',
            zh: 'MeREx低阈值泛型',
        },
        img: {
            zh: meRExLowValve,
            en: meRExLowValveEn,
        },
    },
    'MeToW': {
        name: {
            en: 'MeToW',
            zh: 'MeToW默认泛型',
        },
        img: {
            zh: meToWDefault,
            en: meToWDefaultEn,
        },
    },
    'MeToW default': {
        name: {
            en: 'MeToW default',
            zh: 'MeToW默认泛型',
        },
        img: {
            zh: meToWDefault,
            en: meToWDefaultEn,
        },
    },
    'MeToW without adjustment': {
        name: {
            en: 'MeToW genericity without adjust',
            zh: 'MeToW泛型（不使用历史结果修正）',
        },
        img: {
            zh: meToWGenericityWithoutAdjust,
            en: meToWGenericityWithoutAdjustEn,
        },
    },
    // 'Alert Compress based on Similarity': {  //告警暂时没用
    //     name: {
    //         en: 'Alert Compress based on Similarity',
    //         zh: ' ',
    //     },
    //     img: {
    //         zh: ' ',
    //         en: ' ',
    //     },
    // },
    // 'Alert Merger Algorithm Imp': {
    //     name: {
    //         en: 'Alert Merger Algorithm Imp',
    //         zh: ' ',
    //     },
    //     img: {
    //         zh: ' ',
    //         en: ' ',
    //     },
    // },
    // 'Alert Enrichment App Imp': {
    //     name: {
    //         en: 'Alert Enrichment App Imp',
    //         zh: ' ',
    //     },
    //     img: {
    //         zh: ' ',
    //         en: ' ',
    //     },
    // },
    // 'Alert Correlation App': {
    //     name: {
    //         en: 'Alert Correlation App',
    //         zh: '',
    //     },
    //     img: {
    //         zh: ' ',
    //         en: ' ',
    //     },
    // },
};

export const dataSceneTypeObj = {
    'anomaly_detection': {
        title: '单指标时序数据异常检测',
        icon: {
            zh: anomaly_detectionSvg,
            en: anomaly_detectionSvg,
        },
        dot: dotSvg,
    },
    'forecasting': {
        title: '单指标时序数据预测',
        icon: {
            zh: forecastingSvg,
            en: forecastingSvg,
        },
        dot: dotSvg,
    },
    'log_parsing': {
        title: '日志模式解析',
        icon: {
            zh: journalDashbordSvg,
            en: journalDashbordSvg,
        },
        dot: dotSvg,
    },
    'log_anomaly_detection': {
        title: '日志异常检测',
        icon: {
            zh: logAnomalyDetectionDashbordSvg,
            en: logAnomalyDetectionDashbordEnSvg,
        },
        dot: dotSvg,
    },
    'root_cause_analysis': {
        title: '根因分析',
        icon: {
            zh: root_cause_analysisnSvg,
            en: root_cause_analysisnEnSvg,
        },
        dot: dotSvg,
    },
    'alerting': {
        title: '告警降噪',
        icon: {
            zh: alertingSvg,
            en: alertingEnSvg,
        },
        dot: dotSvg,
    },
    'multi_index_analysis': {
        title: '多维度指标分析',
        icon: {
            zh: analysisSvg,
            en: analysisEnSvg,
        },
        dot: dotSvg,
    },
};

export const dataStoreType = [
    {
        name: "选择算法泛型类型",
        children: [
            {
                id: "anomaly_detection",
                name: 'task.anomaly.name',
                icon: commonSvg,
                desc: 'task.anomaly.performanomaly',
                enable: true
            },
            {
                id: "forecasting",
                name: 'task.single.name',
                icon: logSvg,
                desc: 'task.anomaly.orecastingforsinglemetric',
                enable: true
            },
            {
                id: "root_cause_analysis",
                name: 'task.root.name',
                icon: rootCauseAnalysisSvg,
                desc: 'task.anomaly.orecastingforsinglemetric',
                enable: true
            },
            {
                id: "log_parsing",
                name: 'task.log.name',
                icon: logParsingSvg,
                desc: 'task.anomaly.orecastingforsinglemetric',
                enable: true
            },
            {
                id: "log_anomaly_detection",
                name: 'task.log.analyName',
                icon: logAnomalyDetectionSvg,
                desc: 'task.anomaly.orecastingforsinglemetric',
                enable: true
            },
        ]
    }
];

export const relationshipTypeUnit = {
    'TIME_SERIES': 'laboratory.anomaly.timeSeriesData',
    'NODE_RELATION': 'datasource.create.relationaDataSource',
    'HISTORICAL_DATA': '历史数据数据源',
    'KAFKA_SINK': 'KAFKA计算结果输出数据源',
    'KAFKA_SOURCE': 'KAFKA原始数据数输入据源',
    'LOG': 'datasource.create.logDataSource',
};

export const dataLaboratoryType = [
    {
        name: "选择算法泛型类型",
        children: [
            {
                id: "anomaly_detection",
                name: 'task.anomaly.name',
                icon: commonSvg,
                desc: ['task.anomaly.performanomaly'],
                enable: true
            },
            {
                id: "forecasting",
                name: 'task.single.name',
                icon: logSvg,
                desc: 'task.anomaly.orecastingforsinglemetric',
                enable: true
            },
            {
                id: "root_cause_analysis",
                name: 'task.root.name',
                icon: rootCauseAnalysisSvg,
                desc: 'task.anomaly.root_cause_analysis_desc',
                enable: true
            },
            {
                id: "log_parsing",
                name: 'task.log.name',
                icon: logAnomalyDetectionSvg,
                desc: 'task.anomaly.log_parsing_desc',
                enable: true
            },
            {
                id: "log_anomaly_detection",
                name: 'task.log.analyName',
                icon: logParsingSvg,
                desc: 'task.anomaly.log_anomaly_detection_desc',
                enable: true
            },
        ]
    }
];

export const dataSourceType = [
    {
        name: "流式数据源",
        children: [
            // {
            //     id: "KAFKA",
            //     name: "KAFKA",
            //     icon: kafkaSvg,
            //     desc: [
            //         '作为一个Consumer,实时消费指定Kafka topic上的JSON格式的数据，并存储。'
            //     ],
            //     enable: true
            // },
            {
                id: "outline",
                key: 'DODB',
                name: 'laboratory.detail.adddatasource',
                icon: chsvg,
                desc: 'laboratory.detail.accessclickHousedata'
                /* '接口可以在数据源列表中 "拷贝数据源接口" 的按钮中获取，发送示例:',
                'curl \r\n --request POST \r\n --url http://localhost:8098/api/k1/data/bf23d179185043e7b845748c1918d8ec \r\n --header \'content-type: application/json\' \r\n --data \'[{ "id":123,"name":"kevin"}]\'', */
                ,
                enable: true
            },
            {
                id: "file",
                // id: "newfile",
                key: "FILE",
                name: 'laboratory.detail.createofflinedata',
                icon: filesvg,
                desc: 'laboratory.detail.uploadofflinefiles',
                enable: true
            },
            // {
            //     id: "iotdb",
            //     key: "IOTDB",
            //     name: 'laboratory.detail.addIOTDBdatasource',
            //     icon: iotdbsvg,
            //     desc:'laboratory.detail.accessIoTDBdatables',
            //     enable: true
            // },
        ]
    }
];

export const labelLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};

export const paramsModalLabelLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 16},
};