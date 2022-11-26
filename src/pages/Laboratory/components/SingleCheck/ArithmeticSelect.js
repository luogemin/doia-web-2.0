import React, {Fragment, useEffect} from 'react';
import {Table, Button, Icon, Tooltip, Empty} from '@chaoswise/ui';
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {error, success} from "@/utils/tip";
import EditGenericsAlert from "@/components/EditGenericsAlert";
import {useFetchState} from "@/components/HooksState";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";

const AlgorithmSelect = (props) => {
    const {
        genericityList,
        delGenericityList,
        searchAlgorithmAsync,
        getRootAlgorithmDetailAsync,
        addGenericityList,
        modifyGenericityList,
        dataSetInfo,
        updataSelectRow,
        setGenericityList,
        getGenericsNumAsync,
        publicLimit,
    } = props;

    const [edtId, setEdtId] = useFetchState(null);
    const {selectRowKey = []} = toJS(dataSetInfo);

    const columns = [
        /*eslint-disable*/
        {
            title: IntlFormatMessage('laboratory.detail.name'),
            dataIndex: 'genericityname',
            key: 'genericityname',
            width: '25%',
            ellipsis: true,
            render: (text, record, index) => {
                const {algorithmNameZh = '', algorithmName = '', algorithmShowAll = false} = record;
                return <TooltipDiv
                    title={text}
                    onClick={() => {
                        record['algorithmShowAll'] = !algorithmShowAll;
                        const data = [].concat(toJS(genericityList));
                        data[index] = record;
                        setGenericityList(data);
                    }}
                >
                    <Icon type={algorithmShowAll ? 'down' : 'right'} style={{
                        marginRight: 8,
                        fontSize: 12,
                    }}/>
                    {text || ''}
                </TooltipDiv>;
            }
        },
        /*eslint-disable*/
        {
            title: IntlFormatMessage('laboratory.detail.algorithmname'),
            dataIndex: 'algorithmNameZh',
            key: 'algorithmNameZh',
            width: '15%',
            ellipsis: true,
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
            title: IntlFormatMessage('laboratory.detail.version'),
            dataIndex: 'algorithmVersion',
            key: 'algorithmVersion',
            width: '15%',
            ellipsis: true,
        },
        {
            title: IntlFormatMessage('laboratory.detail.parameter'),
            dataIndex: 'algorithmParams',
            key: 'algorithmParams',
            width: '45%',
            ellipsis: true,
            render: (text, record) => {
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
            width: IsInternationalization() ? 135 : 115,
            render: (text, record) => {
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                            <span className={'nameStyle'} onClick={() => {
                                setCurrentGenerics(record)
                                setEdtId(record.eid)
                                setEditGenericsModal(true)
                            }}>{IntlFormatMessage('laboratory.detail.edit')}</span>
                        <span style={{
                            display: 'inline-block',
                            width: '1px',
                            height: '14px',
                            backgroundColor: '#E9E9E9',
                            margin: '0 8px'
                        }}/>
                        <span className={'nameStyle'} onClick={() => {
                            delGenericityList(record.eid)
                        }}>{IntlFormatMessage('laboratory.detail.delete')}</span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];
    const [currentGenerics, setCurrentGenerics] = useFetchState({});
    const [editGenericsModal, setEditGenericsModal] = useFetchState(false);

    useEffect(() => {
        getGenericsNumAsync()
        if (dataSetInfo.scene === 'root_cause_analysis') {
            getRootAlgorithmDetailAsync(
                {
                    pageNum: 1,
                    pageSize: 500,
                    query: {
                        scene: dataSetInfo.scene,
                        isIncludeAlgorithm: true,
                        isSelectRelationSource: !!dataSetInfo.datasourceId && !!dataSetInfo.datasourceId.value, //关系型是true
                    }
                }
            )
        } else {
            searchAlgorithmAsync({
                pageNum: 1,
                pageSize: 500,
                query: {
                    scene: dataSetInfo.scene,
                    isIncludeAlgorithm: true,
                    // isSelectRelationSource: !!dataSetInfo.datasourceId //关系型是true
                }
            })
        }
    }, [])

    //添加指标
    const onGenericsSave = (params, checked) => {
        if (Object.keys(currentGenerics).length > 0) {
            modifyGenericityList(edtId, params, checked);
        } else {
            addGenericityList(params, checked)
        }
        onCancel()
    }
    const onCancel = () => {
        setEditGenericsModal(false)
        setCurrentGenerics({})
    }

    const rowSelection = {
        // columnTitle: '12312312',
        columnWidth: '100px',
        selectedRowKeys: toJS(selectRowKey),
        onChange: (selectedRowKeys, selectedRows) => {
            updataSelectRow(selectedRowKeys)
            // setSelectedRowKeys(prev => selectedRows.map(item => item.id))
        },
    };
    //删除指标

    return <Fragment>
        <Tooltip
            title={`${IntlFormatMessage('laboratory.anomaly.specifyMaximum')} ${publicLimit}${IntlFormatMessage('laboratory.anomaly.specifyMaximumBack')}`}>
            <Button type="primary" icon='plus' style={{margin: '0 0 24px'}} onClick={() => {
                if (toJS(genericityList).length < publicLimit) {
                    setEditGenericsModal(true)
                } else {
                    error(`${IntlFormatMessage('laboratory.anomaly.genericitiesNum')} ${publicLimit}${IntlFormatMessage('laboratory.anomaly.genericitiesNumBtn')}`)
                }
            }}>{IntlFormatMessage('laboratory.list.createNew')}
            </Button>
        </Tooltip>
        <div style={{height: 'calc(100% - 72px)'}}>
            <Table
                columns={columns}
                // rowSelection={dataSetInfo.scene ==='forecasting'? rowSelection : null}
                dataSource={toJS(genericityList)}
                lazyLoading={true}
                rowKey={record => guid()}
                locale={{
                    emptyText:
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<span>{IntlFormatMessage('laboratory.detail.nogenericityfound')}<span
                                style={{color: '#008DFF', cursor: 'pointer'}}
                                onClick={() => {
                                    setEditGenericsModal(true)
                                }}>{IntlFormatMessage('laboratory.list.table.note.second')}{'>'}</span></span>
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
                    typeId={dataSetInfo.scene}
                /> : null
        }
    </Fragment>
}

export default connect(({laboratoryStore, genericsStore}) => {
    return {
        genericityList: laboratoryStore.genericityList,
        delGenericityList: laboratoryStore.delGenericityList,
        modifyTb: laboratoryStore.modifyTb,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        getRootAlgorithmDetailAsync: genericsStore.getRootAlgorithmDetailAsync,
        addGenericityList: laboratoryStore.addGenericityList,
        modifyGenericityList: laboratoryStore.modifyGenericityList,
        dataSetInfo: laboratoryStore.dataSetInfo,
        setGenericityList: laboratoryStore.setGenericityList,
        updataSelectRow: laboratoryStore.updataSelectRow,
        getGenericsNumAsync: laboratoryStore.getGenericsNumAsync,
        publicLimit: laboratoryStore.publicLimit,
    };
})(AlgorithmSelect)