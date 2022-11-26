import TooltipDiv from "@/components/TooltipDiv";
import React, {Fragment, useEffect, useMemo,} from "react";
import {BasicLayout, Button, Form, Select, Tooltip, CWTable as Table, Icon, Empty} from "@chaoswise/ui";
import moment from 'moment';
import {omit} from "lodash-es";
import EditGenericsAlert from "@/components/EditGenericsAlert";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams, useHistory} from "react-router";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage, IsInternationalization} from "@/utils/util";

const timeUnit = {
    'MINUTE': 'min',
    'HOUR': 'hour',
    'DAY': 'day',
    'D': 'day',
};

const AlgorithmSelect = (props) => {
    const {
        form, searchAlgorithmAsync, genericIdsList = [], setGenericIdsList, current,
    } = props;
    const {
        scene = 'forecasting', taskAlgorithms = [], bizSceneId = ''
    } = toJS(current);
    const {typeId = '', taskId = ''} = useParams();
    const {push, go, location} = useHistory();
    const {pathname = ""} = location;


    const columns = () => {
        return [
            /*eslint-disable*/
            {
                title: IntlFormatMessage('task.detail.name'),
                dataIndex: 'genericityname',
                key: 'genericityname',
                width: '20%',
                render: (text, record, index) => {
                    const {algorithmNameZh = '', algorithmName = '', algorithmShowAll = false} = record;
                    return <TooltipDiv
                        title={text}
                        onClick={() => {
                            record['algorithmShowAll'] = !algorithmShowAll;
                            const data = [].concat(toJS(genericIdsList));
                            data[index] = record;
                            setGenericIdsList(data);
                        }}
                    >
                        <Icon type={algorithmShowAll ? 'down' : 'right'} className="header-icon-img"/>
                        {text || ''}
                    </TooltipDiv>;
                }
            },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('task.detail.algorithmname'),
                dataIndex: 'algorithmNameZh',
                key: 'algorithmNameZh',
                width: '20%',
                render: (text, record, index) => {
                    const {algorithmNameZh = '', algorithmName = '', algorithmShowAll = false} = record;
                    if (algorithmNameZh || algorithmName) {
                        return <TooltipDiv
                            title={text}
                        >
                            {text ? text : algorithmName}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('task.detail.version'),
                dataIndex: 'algorithmVersion',
                key: 'algorithmVersion',
                width: '10%',
            },
            {
                title: IntlFormatMessage('task.detail.parameter'),
                dataIndex: 'algorithmParams',
                key: 'algorithmParams',
                width: '50%',
                render: (text, record, index) => {
                    if (text) {
                        const {algorithmShowAll = false} = record;
                        return (<div className="algorithm-box">
                            {
                                (algorithmShowAll ? text : text.slice(0, 6)).map((item, index) => {
                                    const {name = '', value = ''} = item;
                                    return <p key={index} className="algorithm-item">
                                        <Tooltip title={`${name}：${value}`} placement={'topLeft'}>
                                            {`${name}：${value}`}
                                        </Tooltip>
                                    </p>;
                                })
                            }
                        </div>);
                    } else {
                        return null;
                    }
                }
            },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('common.operation'),
                dataIndex: 'operation',
                key: 'operation',
                width: IsInternationalization() ? 125 : 115,
                render: (text, record, index) => {
                    return (
                        <div>
                            <span className={'nameStyle'} onClick={() => {
                                setCurrentGenerics(Object.assign({}, {index}, record));
                                setTimeout(() => {
                                    setEditGenericsModal(true)
                                }, 200)
                            }}>
                                {IntlFormatMessage('task.detail.edit')}
                            </span>
                            <span className={"operation_line"}>|</span>
                            <span className={'nameStyle'} onClick={() => {
                                deleteGenerics(Object.assign({}, {index}, record));
                            }}>
                               {IntlFormatMessage('task.detail.delete')}

                            </span>
                        </div>
                    );
                }
            },
            /*eslint-disable*/
        ];
    };

    const [currentGenerics, setCurrentGenerics] = useFetchState({});
    const [editGenericsModal, setEditGenericsModal] = useFetchState(false);

    useEffect(() => {
        const params = {
            pageNum: 1,
            pageSize: 1000,
            query: {
                scene,
                isIncludeAlgorithm: true,
                bizSceneId,
            }
        }
        searchAlgorithmAsync(params)
    }, [])

    useEffect(() => {
        const {timeConfig = {}, extendConfig = {}, aggConfig = {},} = toJS(current);
        const {timeFrameNumber, timeFrameUnit,} = timeConfig;
        const {aggFunc, aggTimeNumber, aggTimeUnit, aggPercentile,} = aggConfig;
        const {forecastTimeNumber, forecastTimeUnit} = extendConfig.dataProcessing || {};
        const training_days = timeFrameNumber + timeUnit[timeFrameUnit];
        const train_grain = aggTimeNumber + timeUnit[aggTimeUnit];
        const forecast_period = forecastTimeNumber + timeUnit[forecastTimeUnit];

        setGenericIdsList(prev => toJS(taskAlgorithms).map(item => {
            const {displayAlgorithmNames, algorithmNameZh, isOverwriteForecastParams, algorithmParams} = item;
            if (!!isOverwriteForecastParams) {
                item.algorithmParams = ([].concat(algorithmParams)).map(param => {
                    if (param.name === 'training_days') {
                        param.value = training_days;
                    }
                    if (param.name === 'train_grain') {
                        param.value = train_grain;
                    }
                    if (param.name === 'forecast_period') {
                        param.value = forecast_period;
                    }
                    return param;
                })
            }
            return Object.assign({}, item, {
                genericityname: item.genericName,
            }, !algorithmNameZh ? {
                algorithmNameZh: displayAlgorithmNames,
            } : {})
        }))
    }, [current])

    //新建泛型
    const onGenericsSave = (generi, checked) => {
        const data = Object.assign({}, generi, {
            isOverwriteForecastParams: checked,
        })
        if (!Object.keys(currentGenerics).length) {
            setGenericIdsList(prev => prev.concat(data))
        } else {
            setGenericIdsList(prev => {
                return prev.map((item, index) => {
                    if (index === data.index) {
                        return Object.assign({}, item, data)
                    }
                    return item
                })
            })
        }
        onCancel()
    }

    const onCancel = () => {
        setEditGenericsModal(false)
        setCurrentGenerics({})
    }

    //删除指标
    const deleteGenerics = (record) => {
        setGenericIdsList(prev => {
            return prev.filter((i, index) => record.index !== index)
        })
    };

    return <div style={{height: pathname.indexOf('modify') > 0 ? '100%' : 'calc(100% - 72px)'}}>
        <Button type="primary" icon='plus' style={{marginBottom: 16}} onClick={() => {
            setEditGenericsModal(true)
        }}>{IntlFormatMessage('laboratory.list.createNew')}
        </Button>
        <div style={{height: 'calc(100% - 40px)'}}>
            <Table
                columns={columns()}
                dataSource={genericIdsList}
                lazyLoading={true}
                rowKey={record => record.rowId}
                locale={{
                    emptyText:
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>{IntlFormatMessage('task.detail.nogenericityfound')}，
                                    <span style={{color: '#008DFF', cursor: 'pointer'}}
                                          onClick={() => {
                                              setEditGenericsModal(true)
                                          }}>{IntlFormatMessage('task.detail.toadd')}{'>'}</span>
                                </span>
                            }/>

                }}
            />
        </div>

        {
            editGenericsModal ?
                <EditGenericsAlert
                    visible={editGenericsModal}
                    onSave={onGenericsSave}
                    onCancel={onCancel}
                    dataSource={currentGenerics}
                    typeId={typeId}
                    comeFrom={'taskManagement'}
                /> : null
        }
    </div>
}

export default connect(({taskManagementStore, genericsStore}) => {
    return {
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        genericsList: genericsStore.list,
        current: taskManagementStore.current,
        ifCanEdit: taskManagementStore.ifCanEdit,

    };
})(AlgorithmSelect);