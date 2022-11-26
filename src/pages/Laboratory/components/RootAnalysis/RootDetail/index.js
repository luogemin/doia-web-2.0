import React, {Fragment, useCallback, useEffect, useMemo, useRef} from "react";
import {
    Form, Button, Table, Input, Select, DatePicker, Tooltip, Modal, Icon, Dropdown, Menu,
} from "@chaoswise/ui";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import moment from 'moment';
import styles from './index.less';
import EditGenericsAlert from "@/components/EditGenericsAlert";
import DataSetModal from "@/pages/Laboratory/components/SingleCheck/DataSetModal";
import {useParams} from "react-router";
import {IntlFormatMessage, IsInternationalization} from "@/utils/util";
import Topo from '@/pages/Laboratory/components/RootAnalysis/Topo';
import {labelLayout, polymerizationType} from "@/globalConstants";
import CreateTypeModal from "@/components/CreateTypeModal";
import elementResizeEvent from 'element-resize-event';
import TooltipDiv from "@/components/TooltipDiv";
import SideBar from "@/pages/Laboratory/components/RootAnalysis/Topo/SideBar";
import {error, success, warning, info} from "@/utils/tip";
import ChartList from "@/pages/Laboratory/components/Detail/ChartList";
import RootTaskModel from "@/pages/Laboratory/components/RootAnalysis/RootDetail/RootTaskModel";
import TopoWilr from "@/pages/Laboratory/components/RootAnalysis/RootDetail/TopoWilr";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";
import IconTooltip from "@/components/IconTooltip";
import RootTaskModelForClick from "@/pages/Laboratory/components/RootAnalysis/RootDetail/RootTaskModelForClick";
import PluginWrapper from "@/components/BasicFlow/components/flow/components/PluginWrapper";
import lineBrowkenOne from '@/pages/Laboratory/assets/lineBrokenOne.svg';
import lineBrowkenTwo from '@/pages/Laboratory/assets/lineBrokenTwo.svg';
import lineStraightOne from '@/pages/Laboratory/assets/lineStraightOne.svg';
import lineStraightTwo from '@/pages/Laboratory/assets/lineStraightTwo.svg';

const {Option} = Select;
const {Item} = Form;
const greyColorStyle = {
    color: '#c4c4c4',
    cursor: 'not-allowed',
};
let timer = {rootAnalysisListInterVal: null};

function RootDetail(props) {
    const {
        form,
        getGroupNodelistAsync,
        groupNodelist,
        getGroupMetriclistAsync,
        groupMetriclist,
        getRootAlgorithmDetailAsync,
        getGenericSericeList,
        rootAnalysisList, //根因入口列表
        modifyGenericList,
        deleteDenericList,
        addGenericList,
        runRootCauseAsync,
        updateRootAnalysisList,
        getNodeRelationsAsync,
        groupTopoData, //拓扑数据
        clearGroupTopoData, getRootCauseAnalysisResultAsync, rootCauseFeedBackAddAsync,
        handUpdate, selectedNode, setSelectedNode, laboratoryRecord, lineType, setLineTypeReducer,
    } = props;
    const localLaboratoryRecord = localStorage.getItem('laboratoryRecord') ? JSON.parse(localStorage.getItem('laboratoryRecord')) : toJS(laboratoryRecord);
    const {startTime, endTime} = localLaboratoryRecord;
    const {getFieldDecorator, validateFields, getFieldValue, setFieldsValue} = form;
    const {id} = useParams();
    const ref = useRef({
        graph: null,
        graphBox: null,
        graphHighLight: null,
        rootModal: null,
    });
    const typeId = 'root_cause_analysis';
    const [editGenericsModal, setEditGenericsModal] = useFetchState(false);
    const [currentGenerics, setCurrentGenerics] = useFetchState({});
    const [rootModalVisible, setRootModalVisible] = useFetchState(false);
    const [selectNodeToCheck, setSelectNodeToCheck] = useFetchState(false);
    const [changeCanvasSize, setChangeCanvasSize] = useFetchState(false);
    const [handelSelectModalVisible, setHandelSelectModalVisible] = useFetchState(false);
    const [showSideBar, setShowSideBar] = useFetchState(false);
    const [sideBarList, setSideBarList] = useFetchState([]);
    const [sideBarTraceList, setSideBarTraceList] = useFetchState([]);
    const [selfSideBarList, setSelfSideBarList] = useFetchState([]);
    const [sideBarSelected, setSideBarSelected] = useFetchState('');
    const [saveGeneVisible, setSaveGeneVisible] = useFetchState(false);
    const [recordRow, setRecordRow] = useFetchState({record: {}, index: 0});
    const {record, index} = recordRow;

    //获取已添加的私有泛型列表
    const getGenericSericeFun = (type, modifyId) => {
        getGenericSericeList({
            scene: typeId,
            taskId: id,
        }, {
            cb: (list) => {
                if (type === 'modify') {
                    let modifyIndex = 0;
                    const modifyRecord = list.filter((i, index) => {
                        modifyIndex = index;
                        return i.id === modifyId;
                    })[0];
                    runRootCauseFun(modifyRecord, modifyIndex);
                    onCancel();
                }
            }
        });
    };
    //获取拓扑数据
    const getNodeRelationsFun = () => {
        getNodeRelationsAsync(id);
    };

    /*eslint-disable*/
    //组层级
    const topoData = useMemo(() => {
        const topoList = [].concat(toJS(groupTopoData));
        if (topoList.length) {
            const nodesFrom = [].concat(toJS(groupTopoData)).map(node => {
                return node.fromModelAndTargetJson
            })
            const nodesTar = [].concat(toJS(groupTopoData)).map(node => {
                return node.toModelAndTargetJson
            })
            const nodeSet = Array.from(new Set(nodesFrom.concat(nodesTar)));
            const data = {
                nodes: nodeSet.map(node => {
                    if (!!node && node !== "{}") {
                        const label = JSON.parse(node);
                        return {
                            label: `${label.model || '-'}_${label.target || '-'}`,
                            id: node,
                            anchorPoints: [
                                [1, 0.5],
                                [0, 0.5],
                            ],
                        }
                    }
                }).filter(i => !!i),
                edges: topoList.map(node => {
                    const {fromModelAndTargetJson, toModelAndTargetJson} = node;
                    if (
                        !!fromModelAndTargetJson && fromModelAndTargetJson !== "{}" &&
                        !!toModelAndTargetJson && toModelAndTargetJson !== "{}" &&
                        fromModelAndTargetJson !== toModelAndTargetJson
                    ) {
                        return {
                            source: fromModelAndTargetJson,
                            target: toModelAndTargetJson,
                            id: `${fromModelAndTargetJson}&&${toModelAndTargetJson}`,
                            // 该边连入 source 点的第 0 个 anchorPoint，
                            sourceAnchor: 0,
                            // 该边连入 target 点的第 0 个 anchorPoint，
                            targetAnchor: 1,
                            type: lineType,
                        }
                    }
                }).filter(i => !!i)
            };

            return data;
        } else {
            return {
                nodes: [],
                edges: [],
            }
        }
    }, [groupTopoData, lineType]);
    /*eslint-disable*/

    useEffect(() => {
        getGenericSericeFun();
        getNodeRelationsFun();
        //获取添加泛型下拉框内容
        getGroupNodelistAsync(id);

        //泛型选择接口algorithmGeneric
        getRootAlgorithmDetailAsync({
            pageNum: 1,
            pageSize: 500,
            query: {
                taskId: id,
                scene: typeId,
                isIncludeAlgorithm: true,
            }
        });

        return () => {
            clearGroupTopoData();
            setLineTypeReducer()
            // localStorage.removeItem('laboratoryRecord');
        }
    }, []);

    useEffect(() => {
        if (!selectNodeToCheck && !changeCanvasSize) {
            getGenericSericeFun();
        }
    }, [selectNodeToCheck, changeCanvasSize])

    //onOK的添加泛型
    const onGenericsSave = (params, checked) => {
        const {algorithmId = '', algorithmName = '', algorithmVersion = '', algorithmGenericId = ''} = currentGenerics;
        const {algorithm = {}} = params;
        const result = {
            scene: typeId,
            algorithmId: params.algorithmId || algorithmId,
            algorithmName: params.algorithmName || algorithmName,
            algorithmGenericId: params.genericId || algorithmGenericId,
            algorithmVersion: params.algorithmVersion || algorithmVersion,
            taskId: id,
            algorithmParams: (params.parameters || params.algorithmParams).map(item => {
                if (item.value || item.value === 0) {
                    return item;
                }
                return {
                    name: item.name,
                    value: null
                };
            }),
            id: currentGenerics.id,
            algorithmNameZh: params.algorithmNameZh,
            genericName: params.genericityname,
            isOverwriteForecastParams: !!checked
        };
        if (Object.keys(currentGenerics).length > 0) {
            modifyGenericList(result, {
                cb: (info) => {
                    getGenericSericeFun('modify', currentGenerics.id);
                }
            });
        } else {
            addGenericList(result, {
                cb: (info) => {
                    closeSelectNodeToCheck()
                    getGenericSericeFun();
                    onCancel();
                }
            });
        }
    };
    const onCancel = () => {
        setEditGenericsModal(false);
        setCurrentGenerics({});
        ref.current['graphHighLight']()
        // setRecordRow({record: {}, index: 0,}) //这块不能加，会导致手动选择失效
    };

    const runRootCauseFun = (record, index) => {
        record.state = 1;
        updateRootAnalysisList(record, record.id);
        const {
            genericId, algorithmName, algorithmVersion, algorithmParams,
            entryNodeJson, entryMetricJson, entryTimestamp,
        } = record;
        const params = {
            taskId: id,
            tuningBenchGenericId: record.id,
            algorithmName,
            algorithmVersion,
            algorithmParams,
            entryNodeJson,
            entryMetricJson,
            entryTimestamp,
        }
        runRootCauseAsync(params, {
            cb: (res) => {
                if (res.status === 'success') {
                    success(IntlFormatMessage('laboratory.detail.trained'));
                } else if (res.status === 'warning') {
                    warning(res.message);
                } else {
                    error(res.message);
                }
                getGenericSericeFun();
            },
            err: () => {
                getGenericSericeFun();
            },
        })
    }
    const closeSelectNodeToCheck = () => {
        setRecordRow({
            record: {}, index: 0,
        })
        setSelectNodeToCheck(false)
        setShowSideBar(false)
    }

    /*eslint-disable*/
    const columns = [
        {
            title: IntlFormatMessage('laboratory.detail.name'),
            dataIndex: 'genericName',
            key: 'genericName',
            width: 132,
            render: (text, record, index) => {
                const {algorithmNameZh = '', algorithmName = '', algorithmShowAll = false} = record;
                return <TooltipDiv
                    title={text}
                    onClick={() => {
                        record['algorithmShowAll'] = !algorithmShowAll;
                        updateRootAnalysisList(record, record.id);
                    }}
                    style={{width: 100}}
                >
                    <Icon type={algorithmShowAll ? 'down' : 'right'} style={{
                        marginRight: 8,
                        fontSize: 12,
                    }}/>
                    {text || ''}
                </TooltipDiv>;
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.trainingStatus'),
            dataIndex: 'state',
            key: 'state',
            width: 130,
            render: (text, record) => {
                const {stateMessage} = record;
                let stateText = '';
                if (text === 1) {
                    stateText = IntlFormatMessage('laboratory.detail.training');
                } else if (text === 2 || text === 4) {
                    stateText = IntlFormatMessage('laboratory.detail.trained');
                } else if (text === 3) {
                    stateText = IntlFormatMessage('laboratory.detail.failed');
                } else {
                    stateText = IntlFormatMessage('laboratory.anomaly.untrained');
                }
                return <div className="flex-box">
                    {stateText}
                    {
                        (!!stateMessage && record.state !== 1) ?
                            <IconTooltip
                                type={text === 2 ? 'exclamation-circle' : (text === 4 ? 'exclamation-circle' : 'question-circle')}
                                style={{
                                    marginLeft: '8px',
                                    fontSize: 14,
                                    color: text === 2 ? '#72c140' : (text === 4 ? '#efaf41' : '#ec5b56')
                                }}
                                title={stateMessage}
                            />
                            : null
                    }
                </div>
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.algorithmname'),
            dataIndex: 'algorithmName',
            key: 'algorithmName',
            width: 138,
            render: (text, record) => {
                return <TooltipDiv
                    title={text}
                    style={{width: 100}}
                >
                    {text}
                </TooltipDiv>
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.parameter'),
            dataIndex: 'algorithmParams',
            key: 'algorithmParams',
            // width: '50%',
            render: (text, record) => {
                if (text) {
                    const box = document.getElementsByClassName('ant-table-tbody')[0];
                    if (box) {
                        const widthBox = ((box.clientWidth - 394 - (IsInternationalization() ? 250 : 230)) * 0.5 - 32);
                        const {algorithmShowAll = false} = record;
                        return (<div style={{maxWidth: widthBox}}
                                     className={algorithmShowAll ? 'algorithm-box-showAll' : `algorithm-box`}>
                            {
                                (algorithmShowAll ? text : text.slice(0, 4)).map((item, index) => {
                                    const {name = '', value = ''} = item;
                                    return <p key={index}
                                              className={"algorithm-item"}
                                              style={(!algorithmShowAll && index > 1) ? {marginBottom: 0} : {}}
                                    >
                                        <Tooltip title={`${name}：${value}`} placement={'topLeft'}>
                                            {`${name}：${value}`}
                                        </Tooltip>
                                    </p>;
                                })
                            }
                        </div>);
                    }
                } else {
                    return null;
                }
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.entryRCA'),
            dataIndex: 'entryNodeJson',
            key: 'entryNodeJson',
            // width: '50%',
            render: (text, record, index) => {
                if (text) {
                    const box = document.getElementsByClassName('ant-table-tbody')[0];
                    if (box) {
                        const widthBox = ((box.clientWidth - 394 - (IsInternationalization() ? 250 : 230)) * 0.5 - 32);
                        const {entryNodeJson, entryMetricJson, entryTimestamp, algorithmShowAll} = record;
                        let entryMetricJsonParse = {};
                        try {
                            entryMetricJsonParse = Object.entries(JSON.parse(JSON.parse(entryMetricJson).tags)).map(res => {
                                return `${res[0]}=${res[1]}`
                            }).join(', ')
                        } catch (err) {
                            entryMetricJsonParse = !!entryMetricJson ? `tags=${JSON.parse(entryMetricJson).tags}` : {}
                            console.log('入口指标entryMetricJson字段错误', err)
                        }
                        return <div className="flex-box" style={{maxWidth: widthBox}}>
                            <div className={algorithmShowAll ? '' : "only-show-two-line"}>
                                {`${IntlFormatMessage('laboratory.detail.entryNode')}: ${JSON.parse(entryNodeJson).model}, ${JSON.parse(entryNodeJson).target}`}<br/>
                                {`${IntlFormatMessage('laboratory.detail.entryMetric')}: ${JSON.parse(entryMetricJson).metric}, {${entryMetricJsonParse}`}}<br/>
                                {`${IntlFormatMessage('laboratory.detail.timePoint')}: ${moment(entryTimestamp).format('YYYY-MM-DD HH:mm:ss')}`}
                            </div>
                            <div style={{minWidth: 45, textAlign: 'right'}} className="nameStyle">
                                <Dropdown overlay={<Menu>
                                    <Menu.Item onClick={() => {
                                        setRecordRow({
                                            record, index,
                                        })
                                        setRootModalVisible(true)
                                    }}>
                                        {IntlFormatMessage('laboratory.detail.manualSelectionBtn')}
                                    </Menu.Item>
                                    <Menu.Item onClick={() => {
                                        setSelectedNode([]);
                                        if (selectNodeToCheck) {
                                            closeSelectNodeToCheck()
                                        } else {
                                            setRecordRow({
                                                record, index,
                                            })
                                            setSelectNodeToCheck(true)
                                            info(IntlFormatMessage('datasource.create.doubleClick'), 3)
                                        }
                                    }}>
                                        {selectNodeToCheck ? IntlFormatMessage('common.explore.setting.modal.cancel') : IntlFormatMessage('laboratory.detail.nodeSelection')}
                                    </Menu.Item>
                                </Menu>} trigger={['hover']}>
                                    <span>
                                        {
                                            IntlFormatMessage('laboratory.detail.modify')
                                        }
                                    </span>
                                </Dropdown>
                            </div>
                        </div>
                    }
                } else {
                    return <div style={{display: 'flex', alignItems: 'center'}}>
                        <TooltipDiv onClick={() => {
                            setRecordRow({
                                record, index,
                            })
                            setRootModalVisible(true)
                        }}>
                            {IntlFormatMessage('laboratory.detail.manualSelectionBtn')}
                        </TooltipDiv>
                        <span className={"operation_line"}>|</span>
                        <TooltipDiv onClick={() => {
                            setSelectedNode([]);
                            if (selectNodeToCheck) {
                                closeSelectNodeToCheck()
                            } else {
                                setRecordRow({
                                    record, index,
                                })
                                setSelectNodeToCheck(true)
                                info(IntlFormatMessage('datasource.create.doubleClick'), 3)
                            }
                        }}>
                            {selectNodeToCheck ? IntlFormatMessage('common.explore.setting.modal.cancel') : IntlFormatMessage('laboratory.detail.nodeSelection')
                            }
                        </TooltipDiv>
                    </div>
                }
            }
        },
        {
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: IsInternationalization() ? 280 : 230,
            render: (text, record, index) => {
                const {state,} = record;
                return (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: (IsInternationalization() ? 280 : 230) - 32,
                    }}>
                        <span className={'nameStyle'} style={(record.state === 1) ? greyColorStyle : {}}
                              onClick={() => {
                                  closeSelectNodeToCheck()
                                  if (record.state === 1) {
                                      return
                                  }
                                  if (!!record.entryNodeJson) {
                                      runRootCauseFun(record, index);
                                  } else {
                                      warning(IntlFormatMessage('datasource.create.configureNode'))
                                  }
                              }}>{(record.state === 1) ? IntlFormatMessage('laboratory.detail.training')
                            : IntlFormatMessage('laboratory.detail.train')}</span>
                        {
                            record.isPrivate === 1 ?
                                <Fragment>
                                    <span className={"operation_line"}>|</span>
                                    <span className={'nameStyle'} onClick={() => {
                                        closeSelectNodeToCheck()
                                        setRecordRow({
                                            record, index,
                                        })
                                        setCurrentGenerics(record)
                                        setEditGenericsModal(true)
                                    }}>{IntlFormatMessage('laboratory.detail.edit')}</span>
                                </Fragment>
                                :
                                null
                        }
                        <span className={"operation_line"}>|</span>
                        <span className={'nameStyle'} style={
                            [2, 4].includes(state) ? {} : greyColorStyle
                        } onClick={() => {
                            closeSelectNodeToCheck()
                            if ([2, 4].includes(state)) {
                                setRecordRow({
                                    record, index,
                                })
                                getRootCauseAnalysisResultAsync({
                                    tuningBenchGenericId: record.id,
                                    id: record.seriesResultId,
                                    analysisTriggerTime: record.analysisTriggerTime,
                                }, {
                                    cb: (info) => {
                                        setShowSideBar(true)
                                        setSideBarList(!!info.score && !!info.score.length ? info.score : []);
                                        setSideBarTraceList(!!info.trace && !!info.trace.length ? info.trace : []);
                                        setSelfSideBarList((!!info.feedback && !!Object.keys(info.feedback).length) ?
                                            [info.feedback] : [])
                                    }
                                })
                            }
                        }}>
                            {
                                IntlFormatMessage('laboratory.detail.trainingResult')
                            }
                        </span>
                        <span className={"operation_line"}>|</span>
                        <Dropdown overlay={<Menu>
                            {
                                record.isPrivate === 1 ?
                                    <Menu.Item onClick={() => {
                                        closeSelectNodeToCheck()
                                        setShowSideBar(false)
                                        deleteDenericList(record.id, {
                                            cb: () => {
                                                getGenericSericeFun();
                                            }
                                        })
                                    }}>
                                        {IntlFormatMessage('laboratory.detail.delete')}
                                    </Menu.Item>
                                    : null
                            }
                            <Menu.Item onClick={() => {
                                setRecordRow({
                                    record, index,
                                })
                                setSaveGeneVisible(true)
                            }}>
                                {
                                    IntlFormatMessage('laboratory.detail.saveGenericity')

                                }
                            </Menu.Item>
                        </Menu>} trigger={['hover']}>
                            <span className={'nameStyle'}>{IntlFormatMessage('laboratory.detail.more')}</span>
                        </Dropdown>
                    </div>
                );
            }
        }
    ];
    /*eslint-disable*/

    // 手动选择
    const handUpdatecall = (record) => {
        handUpdate({
            tuningBenchGenericId: record.id,//泛型标识
            taskId: id,
            entryNodeJson: record.entryNodeJson,//入口节点
            entryMetricJson: record.entryMetricJson,
            entryTimestamp: record.entryTimestamp //入口时间
        }, {
            cb: (info) => {
                getGenericSericeFun();
            }
        })
    }
    const graphHighLight = (graph) => {
        ref.current['graphHighLight'] = graph;
    }
    useEffect(() => {
        if (!!ref.current['graph']) {
            elementResizeEvent(ref.current['graphBox'], () => {
                const {clientWidth = 0, clientHeight = 0} = ref.current['graphBox'];
                setTimeout(() => {
                    ref.current['graph'].changeSize(clientWidth, clientHeight)
                }, 200)
            })
        }
    }, [selectNodeToCheck, changeCanvasSize, showSideBar, ref.current['graph']])
    return (
        <div className={styles['root-anamaly']}>
            <div>
                <div className='flex-box root-title-box'>
                    {IntlFormatMessage('laboratory.detail.topology')}
                    <div className='topo-tool-box'>
                        <Tooltip title={IntlFormatMessage('laboratory.anomaly.lineStraight')}>
                            <img src={lineType === 'line' ? lineStraightTwo : lineStraightOne} onClick={() => {
                                setLineTypeReducer('line')
                            }}/>
                        </Tooltip>
                        <Tooltip title={IntlFormatMessage('laboratory.anomaly.lineBroken')}>
                            <img src={lineType === 'polyline' ? lineBrowkenTwo : lineBrowkenOne} onClick={() => {
                                setLineTypeReducer('polyline')
                            }}/>
                        </Tooltip>
                    </div>
                </div>
                <div className="topo-box" style={{
                    height: (selectNodeToCheck || changeCanvasSize) ?
                        (
                            document.getElementsByClassName('cw-content-show-area-hasnav')[0].clientHeight - 88 > 400 ?
                                document.getElementsByClassName('cw-content-show-area-hasnav')[0].clientHeight - 88 : 400
                        )
                        : 400,
                }}>
                    <div style={{
                        height: '100%',
                        width: showSideBar ? `calc(100% - 400px)` : '100%',
                        position: 'relative'
                    }}>
                        <TopoWilr
                            data={topoData}
                            lineType={lineType}
                            setLineTypeReducer={setLineTypeReducer}
                            setSelectedNode={setSelectedNode}
                            getGraph={graphHighLight}
                            onReady={({graph, graphBox}) => {
                                ref.current['graph'] = graph;
                                ref.current['graphBox'] = graphBox;
                            }}
                            selectNodeToCheck={selectNodeToCheck}
                            setSelectNodeToCheck={setSelectNodeToCheck}
                            changeCanvasSize={changeCanvasSize}
                            setChangeCanvasSize={setChangeCanvasSize}
                            showSideBar={showSideBar}

                        />
                    </div>
                    {
                        showSideBar &&
                        <SideBar
                            showSideBar={showSideBar}
                            setShowSideBar={setShowSideBar} //关闭的属性和值
                            sideBarSelected={sideBarSelected}//底色改变的属性和值
                            setSideBarSelected={setSideBarSelected}
                            //手动选择出现弹框的方法
                            setHandelSelectModalVisible={setHandelSelectModalVisible}
                            sideBarList={sideBarList}
                            sideBarTraceList={sideBarTraceList}
                            setSideBarList={setSideBarList}
                            selfSideBarList={selfSideBarList}
                            setSelfSideBarList={setSelfSideBarList}
                            record={record}
                            graph={ref.current['graphHighLight']}
                        />
                    }
                </div>
            </div>
            {
                (!selectNodeToCheck && !changeCanvasSize) ?
                    <Fragment>
                        <div className='flex-box root-title-box'>
                            {
                                IntlFormatMessage('laboratory.detail.settingsRCA')
                            }
                            <Button type='primary' onClick={() => {
                                setEditGenericsModal(true);
                            }}>
                                {IntlFormatMessage('laboratory.detail.createAdd')}
                            </Button>
                        </div>
                        <div>
                            <Table
                                columns={columns}
                                dataSource={toJS(rootAnalysisList)}
                                lazyLoading={true}
                                rowKey={record => record.id}
                            >
                            </Table>
                        </div>
                    </Fragment>
                    : null
            }
            {
                editGenericsModal ?
                    <EditGenericsAlert
                        visible={editGenericsModal}
                        onSave={onGenericsSave}
                        onCancel={onCancel}
                        dataSource={currentGenerics}
                        typeId={typeId}
                    /> : null
            }
            {/*修改手动配置*/}
            {
                rootModalVisible ?
                    <Modal
                        title={IntlFormatMessage('laboratory.detail.modifyManualSelection')
                        }
                        visible={rootModalVisible}
                        destroyOnClose={true}
                        centered={true}
                        onCancel={() => {
                            setRootModalVisible(false)
                            setRecordRow({record: {}, index: 0,})
                        }}
                        onOk={() => {
                            validateFields((err, values) => {
                                const {entryNodeJson, entryMetricJson, entryTimestamp,} = values;
                                if (!!entryNodeJson && !!entryMetricJson && !!entryTimestamp) {
                                    let entryMetricJsonResult = {};
                                    try {
                                        if (typeof JSON.parse(entryMetricJson).tags === 'object') {
                                            entryMetricJsonResult = JSON.stringify(Object.assign({}, JSON.parse(entryMetricJson), {
                                                tags: JSON.stringify(JSON.parse(entryMetricJson).tags)
                                            }))
                                        } else {
                                            entryMetricJsonResult = entryMetricJson
                                        }
                                    } catch (err) {

                                    }
                                    record['entryNodeJson'] = entryNodeJson;
                                    record['entryMetricJson'] = entryMetricJsonResult;
                                    record['entryTimestamp'] = new Date(entryTimestamp).getTime();
                                    updateRootAnalysisList(record, index);
                                    setRootModalVisible(false)
                                    setRecordRow({record: {}, index: 0,})
                                    handUpdatecall(record)
                                } else {
                                    error(IntlFormatMessage('laboratory.anomaly.informationComplete'))
                                }
                            })
                        }}
                    >
                        <Form>
                            <Item label={<span className="requird-before">
                                {
                                    IntlFormatMessage('laboratory.detail.entryNode')
                                }
                            </span>}
                                  {...labelLayout}>
                                {
                                    getFieldDecorator('entryNodeJson', {
                                        initialValue: record.entryNodeJson || undefined,
                                        rules: [
                                            {required: false, message: '请选择入口节点'},
                                        ],
                                    })(
                                        <Select
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={IntlFormatMessage('laboratory.detail.selectEntryNode')}
                                            onChange={(value) => {
                                                setFieldsValue({
                                                    entryMetricJson: undefined,
                                                    // entryTimestamp: undefined,
                                                })
                                                const params = {
                                                    pageNum: 1,
                                                    pageSize: 500,
                                                    query: {
                                                        taskId: id,
                                                        entryNodeJson: value,
                                                    }
                                                }
                                                getGroupMetriclistAsync(params)
                                            }}
                                            style={{width: '100%'}}
                                        >
                                            {
                                                (toJS(groupNodelist) || []).map(item => {
                                                    return <Option
                                                        value={item.entryNodeJson}
                                                        key={item.entryNodeJson}>
                                                        <Tooltip title={item.entryNodeJson} placement="topLeft">
                                                            {item.entryNodeJson}
                                                        </Tooltip>
                                                    </Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                            <Item label={<span className="requird-before">
                                {
                                    IntlFormatMessage('laboratory.detail.entryMetric')
                                }
                            </span>}
                                  {...labelLayout}>
                                {
                                    getFieldDecorator('entryMetricJson', {
                                        initialValue: JSON.stringify(!!record.entryMetricJson ? Object.assign({}, JSON.parse(record.entryMetricJson),
                                            !!JSON.parse(record.entryMetricJson).tags ? {
                                                tags: JSON.parse(JSON.parse(record.entryMetricJson).tags)
                                            } : {}) : undefined),
                                        rules: [
                                            {
                                                required: false,
                                                message: IntlFormatMessage('laboratory.detail.selectEntryMetric')
                                            },
                                        ],
                                    })(
                                        <Select
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={IntlFormatMessage('laboratory.detail.selectEntryMetric')}
                                            onChange={(value) => {
                                                // setFieldsValue({
                                                //     entryTimestamp: undeined,
                                                // })
                                            }}
                                            style={{width: '100%'}}
                                        >
                                            {
                                                (toJS(groupMetriclist) || []).map(item => {
                                                    const itemEntryMetricJson = JSON.parse(JSON.stringify(item.entryMetricJson))
                                                    let entryMetricJson = {};
                                                    try {
                                                        entryMetricJson = !!itemEntryMetricJson ? Object.assign({}, JSON.parse(itemEntryMetricJson), {
                                                            tags: JSON.parse(JSON.parse(itemEntryMetricJson).tags)
                                                        }) : {}
                                                    } catch (err) {
                                                        entryMetricJson = !!itemEntryMetricJson ? Object.assign({}, JSON.parse(itemEntryMetricJson)) : {}
                                                        console.log('入口指标entryMetricJson字段错误', err)
                                                    }
                                                    return <Option
                                                        value={item.entryMetricJson}
                                                        key={item.entryMetricJson}>
                                                        <Tooltip title={JSON.stringify(entryMetricJson)}
                                                                 placement="topLeft">
                                                            {JSON.stringify(entryMetricJson)}
                                                        </Tooltip>
                                                    </Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                            <Item label={<span className="requird-before">
                                {
                                    IntlFormatMessage('laboratory.detail.timePoint')
                                }</span>}
                                  {...labelLayout}>
                                {
                                    getFieldDecorator('entryTimestamp', {
                                        initialValue: !!record.entryTimestamp ? moment(record.entryTimestamp) : moment(startTime),
                                        rules: [
                                            {
                                                required: false,
                                                message: IntlFormatMessage('laboratory.anomaly.selectTime')
                                            },
                                        ],
                                    })(
                                        <DatePicker
                                            showTime
                                            style={{width: '100%'}}
                                            disabledDate={(current) => {
                                                const currentTime = new Date(current).getTime();
                                                return moment(currentTime).endOf('day') < moment(startTime).endOf('day')
                                                    ||
                                                    moment(currentTime).endOf('day') > moment(endTime).endOf('day');
                                            }}
                                        />
                                    )
                                }
                            </Item>
                        </Form>
                    </Modal>
                    : null
            }
            {/*手动选择*/}
            {
                handelSelectModalVisible ?
                    <Modal
                        title={IntlFormatMessage('laboratory.detail.manualSelection')
                        }
                        visible={handelSelectModalVisible}
                        destroyOnClose={true}
                        centered={true}
                        onCancel={() => {
                            setHandelSelectModalVisible(false)
                        }}
                        onOk={() => {
                            form.validateFields((err, values) => {
                                const {entryNode, entryMetric} = values;
                                if (!!entryNode && !!entryMetric) {
                                    rootCauseFeedBackAddAsync({
                                        // taskId: id,
                                        // feedbackTime: new Date().getTime(),
                                        feedback: {
                                            approved: 1,
                                            positive: 1,
                                            userTag: {
                                                ...JSON.parse(entryNode),
                                                ...JSON.parse(entryMetric)
                                            }
                                        },
                                        isManualSel: true,
                                        tuningBenchGenericId: record.id,
                                        entryNodeJson: record.entryNodeJson,
                                        entryMetricJson: record.entryMetricJson,
                                    }, {
                                        cb: () => {
                                        }
                                    })
                                    rootCauseFeedBackAddAsync({
                                        // taskId: id,
                                        // feedbackTime: new Date().getTime(),
                                        feedback: {
                                            approved: 1,
                                            positive: 1,
                                            userTag: {
                                                ...JSON.parse(entryNode),
                                                ...JSON.parse(entryMetric)
                                            }
                                        },
                                        isManualSel: true,
                                        tuningBenchGenericId: record.id,
                                        entryNodeJson: record.entryNodeJson,
                                        entryMetricJson: record.entryMetricJson,
                                    }, {
                                        cb: () => {
                                            setSelfSideBarList(prev => prev.concat({
                                                ...JSON.parse(entryNode),
                                                ...JSON.parse(entryMetric)
                                            }))
                                        }
                                    })
                                    setHandelSelectModalVisible(false)
                                } else {
                                    error(IntlFormatMessage('laboratory.anomaly.informationComplete'))
                                }
                            });
                        }}
                    >
                        <Form>
                            <Item label={<span className="requird-before">
                                {IntlFormatMessage('laboratory.detail.objectBtn')}
                            </span>}
                                  {...labelLayout}>
                                {
                                    getFieldDecorator('entryNode', {
                                        initialValue: undefined,
                                        rules: [
                                            {required: false, message: '请选择对象'},
                                        ],
                                    })(
                                        <Select
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={IntlFormatMessage('laboratory.detail.selectObject')}
                                            onChange={(value) => {
                                                const params = {
                                                    pageNum: 1,
                                                    pageSize: 500,
                                                    query: {
                                                        taskId: id,
                                                        entryNodeJson: value,
                                                    }
                                                }
                                                getGroupMetriclistAsync(params)
                                            }}
                                            style={{width: '100%'}}
                                        >
                                            {
                                                (toJS(groupNodelist) || []).map(item => {
                                                    return <Option
                                                        value={item.entryNodeJson}
                                                        key={item.entryNodeJson}>
                                                        <Tooltip title={item.entryNodeJson} placement="topLeft">
                                                            {item.entryNodeJson}
                                                        </Tooltip>
                                                    </Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                            <Item label={<span className="requird-before">
                                {IntlFormatMessage('laboratory.detail.selmetric')}
                            </span>}
                                  {...labelLayout}>
                                {
                                    getFieldDecorator('entryMetric', {
                                        initialValue: undefined,
                                        rules: [
                                            {
                                                required: false,
                                                message: IntlFormatMessage('laboratory.detail.selectEntryMetric')
                                            },
                                        ],
                                    })(
                                        <Select
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={IntlFormatMessage('laboratory.detail.selectEntryMetric')}
                                            style={{width: '100%'}}
                                        >
                                            {
                                                (toJS(groupMetriclist) || []).map(item => {
                                                    let entryMetricJson = {};
                                                    try {
                                                        entryMetricJson = Object.assign({}, JSON.parse(item.entryMetricJson), {
                                                            tags: JSON.parse(JSON.parse(item.entryMetricJson).tags)
                                                        })
                                                    } catch (err) {
                                                        entryMetricJson = !!item.entryMetricJson ? Object.assign({}, JSON.parse(item.entryMetricJson)) : {}
                                                        console.log('入口指标entryMetricJson字段错误', err)
                                                    }
                                                    return <Option
                                                        value={item.entryMetricJson}
                                                        key={item.entryMetricJson}>
                                                        <Tooltip title={JSON.stringify(entryMetricJson)}
                                                                 placement="topLeft">
                                                            {JSON.stringify(entryMetricJson)}
                                                        </Tooltip>
                                                    </Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Form>
                    </Modal>
                    : null
            }

            {/*双击节点，打开弹框*/}
            {
                (!!selectedNode && !!toJS(selectedNode).length && selectNodeToCheck) ?
                    <RootTaskModel
                        setSelectNodeToCheck={setSelectNodeToCheck}
                        getGenericSericeFun={getGenericSericeFun}
                        runRootCauseAsync={runRootCauseAsync}
                        record={record}
                    />
                    : null
            }

            {/*单击节点，打开弹框*/}
            {
                (!!selectedNode && !!toJS(selectedNode).length && !selectNodeToCheck) ?
                    <RootTaskModelForClick/>
                    : null
            }

            {/*保存泛型*/}
            {
                saveGeneVisible &&
                <SaveGeneric
                    visible={saveGeneVisible}
                    currentGenericList={record}
                    deleteCurrentGenericList={() => {
                        setRecordRow({record: {}, index: 0,})
                    }}
                    onSave={() => {
                        getRootAlgorithmDetailAsync({
                            pageNum: 0,
                            pageSize: 0,
                            query: {
                                taskId: id,
                                scene: typeId,
                                isIncludeAlgorithm: true,
                            }
                        });
                    }}
                    onClose={() => {
                        setSaveGeneVisible(false)
                    }}
                />
            }
        </div>
    );

}

export default connect(({laboratoryStore, genericsStore, TopoStore}) => {
    return {
        getRootAlgorithmDetailAsync: genericsStore.getRootAlgorithmDetailAsync,
        selectedNode: TopoStore.selectedNode,
        getNodeRelationsAsync: laboratoryStore.getNodeRelationsAsync,
        handUpdate: laboratoryStore.handUpdate,
        groupTopoData: laboratoryStore.groupTopoData,
        clearGroupTopoData: laboratoryStore.clearGroupTopoData,
        getGroupNodelistAsync: laboratoryStore.getGroupNodelistAsync,
        groupNodelist: laboratoryStore.groupNodelist,
        getGroupMetriclistAsync: laboratoryStore.getGroupMetriclistAsync,
        groupMetriclist: laboratoryStore.groupMetriclist,
        getGenericSericeList: laboratoryStore.getGenericSericeList,
        rootAnalysisList: laboratoryStore.rootAnalysisList,
        modifyGenericList: laboratoryStore.modifyGenericList,
        deleteDenericList: laboratoryStore.deleteDenericList,
        addGenericList: laboratoryStore.addGenericList,
        runRootCauseAsync: laboratoryStore.runRootCauseAsync,
        updateRootAnalysisList: laboratoryStore.updateRootAnalysisList,
        getRootCauseAnalysisResultAsync: laboratoryStore.getRootCauseAnalysisResultAsync,
        rootCauseFeedBackAddAsync: laboratoryStore.rootCauseFeedBackAddAsync,
        laboratoryRecord: laboratoryStore.laboratoryRecord,
        setSelectedNode: TopoStore.setSelectedNode,
        selectNodeToCheck: TopoStore.selectNodeToCheck,
        setSelectNodeToCheck: TopoStore.setSelectNodeToCheck,
        lineType: TopoStore.lineType,
        setLineTypeReducer: TopoStore.setLineTypeReducer,

    };
})(Form.create()(RootDetail));