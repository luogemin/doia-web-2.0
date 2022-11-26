import React, {Fragment, useEffect, useMemo, useRef} from "react";
import {Col, Row, message, Select, Tooltip, Empty, Spin, Descriptions, Menu, Dropdown} from "@chaoswise/ui";
import Charts from "@/components/Charts";
import {useParams} from "react-router";
import styles from "@/pages/TaskManagement/components/common/ChartsItem/index.less";
import TooltipDiv from "@/components/TooltipDiv";
import {guid, IntlFormatMessage} from "@/utils/util";
import ChartsHeader from "@/pages/TaskManagement/components/common/ChartsItem/ChartsHeader";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";
import Threshold from '@/components/Threshold';
import SetSvg from '@/pages/Laboratory/assets/setting.svg';
import {useFetchState} from "@/components/HooksState";
import EchartsSetLine from "@/components/EchartsButton/EchartsSetLine";
import EchartsSaveGenerics from "@/components/EchartsButton/EchartsSaveGenerics";
import EchartsEditGenerics from "@/components/EchartsButton/EchartsEditGenerics";
import {success, warning, error} from "@/utils/tip";

let timer = null;

const ChartsItemComparison = (props) => {
    const {
        item = {}, id = '', index, onSave, onEdit, showParams = false, lowAndUpValue, addAlgorithmLoading,
    } = props;
    const {
        algorithm = {}, algorithmParams = [], algorithmName = '', genericId, algorithmVersion = '', chartsData, errorMsg = {},
        genericName,
    } = item;
    const {name = '', displayNames} = algorithm;

    const ref = useRef({current: {}});
    const echartsref = useRef(null);
    const [upValue, setUpValue] = useFetchState(undefined);
    const [lowValue, setLowValue] = useFetchState(undefined);
    const [checked, setChecked] = useFetchState(false);
    const [settingLine, setSettingLine] = useFetchState(false);


    useEffect(() => {
        setUpValue(lowAndUpValue.uperValue);
        setLowValue(lowAndUpValue.lowerValue);
    }, [lowAndUpValue]);
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

    return <div key={id} className={styles['charts-box']}>
        <Spin spinning={!Object.keys(chartsData).length && addAlgorithmLoading}>
            {
                Object.keys(chartsData).length ?
                    <Fragment>
                        <ChartsHeader
                            item={item}
                            errorMsg={errorMsg}
                        />
                        <div style={{position: 'relative'}}>
                            <Charts
                                id={id}
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
                                right: 90,
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
                                <EchartsEditGenerics
                                    onClick={() => {
                                        onEdit(Object.assign({}, item, {
                                            index: index,
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
                            (!!displayNames || algorithmName) ?
                                <div className={styles['chart-bottom']}>
                                    <div className='bottom-title'>
                                        <p>{`${IntlFormatMessage('task.detail.algorithmname')}：`}
                                            <span>
                                                {displayNames || (algorithmName || '')} {algorithmVersion}
                                                <span style={{
                                                    marginLeft: 24,
                                                }}>
                                                    {`${IntlFormatMessage('task.detail.name')}：`}{genericName}
                                                </span>
                                            </span>
                                        </p>
                                        {
                                            showParams ? <div style={{display: 'flex', width: '100%'}}>
                                                <div style={{whiteSpace: 'nowrap'}}>{IntlFormatMessage('generics.info.parameter')}:</div>
                                                <Descriptions style={{flexGrow: 1}} column={4}>
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
                    <Empty key={item.id} description={IntlFormatMessage('task.detail.nodatafound')
                    }
                           style={{height: 'calc(100% - 100px)'}}/>
            }
        </Spin>
    </div>;
};

export default ChartsItemComparison;