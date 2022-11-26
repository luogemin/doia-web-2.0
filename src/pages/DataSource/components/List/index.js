import React, {useEffect,} from 'react';
import {Input, Select, CWTable as Table, Modal, Badge, Tooltip, Tag, Button, Empty} from '@chaoswise/ui';
import style from '../../assets/index.less';
import {dataSourceType} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {success} from "@/utils/tip";
import CreateTypeModal from '@/components/CreateTypeModal/index';
import TooltipDiv from "@/components/TooltipDiv";
import BasicTable from '@/components/BasicTable';
import styled from './index.less';
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage, IsInternationalization, strlen} from "@/utils/util";

const {Option} = Select;
const greyColorStyle = {
    color: '#c4c4c4',
    cursor: 'not-allowed',
};
const stateList = [
    {
        title: IntlFormatMessage('laboratory.anomaly.normalBtn'),
        key: 0
    },
    {
        title: IntlFormatMessage('laboratory.anomaly.processing'),
        key: 1
    },
    {
        title: IntlFormatMessage('laboratory.anomaly.abnormal'),
        key: 2
    },
    // {
    //     title: IntlFormatMessage('laboratory.anomaly.abnormal'),
    //     key: 3
    // },
];
const stateFormat = {
    0: {
        title: IntlFormatMessage('laboratory.anomaly.normalBtn'),
        status: 'success',
    },
    1: {
        title: IntlFormatMessage('laboratory.anomaly.processing'),
        status: 'processing',
    },
    // 2: {
    //     title: IntlFormatMessage('laboratory.anomaly.processing'),
    //     status: 'processing',
    // },
    2: {
        title: IntlFormatMessage('laboratory.anomaly.abnormal'),
        status: 'error',
    },
};

const SourceList = (props) => {
    const {
        match = {},
        history,
        setBackTitle,
        updateType,
        getDataSourceList,
        delDataSourceList,
        dataSourceList,
        totalCount,
        pageInfo,
        deleteDataSourceOffInfo,
        setSearchHeaderObj,
        searchHeaderObj
    } = props;
    const {type,state} = toJS(searchHeaderObj);
    const {path} = match;
    const [searchBarObj, setSearchBarObj] = useFetchState({
        type: type,
        state: state,
        name: toJS(searchHeaderObj).name,
    });
    const [createModalVisible, setCreateModalVisible] = useFetchState(false);
    const [page, setPage] = useFetchState({
        pageNum: 1,
        pageSize: 10,
    });
    const [delVisible, setDelVisible] = useFetchState(false);
    const [delId, setDelId] = useFetchState({});
    const {pageSize = 10, totalSize, totalPages, pageNum = 1} = toJS(pageInfo);
    //获取数据源列表
    const getDataSourceFun = () => {
        getDataSourceList({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            query:{
                ...searchBarObj
            }
        });
    };
    useEffect(() => {
        getDataSourceFun();
    }, [searchBarObj]);
    useEffect(() => {
        return () => {
            deleteDataSourceOffInfo();
        };
    },[]);
    //搜索行
    const searchContent = () => {
        return [
            {
                formAttribute: {initialValue: type || undefined},
                components: <Select
                    allowClear
                    allowCleartype
                    id='type'
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    key='type'
                    style={{width: 240}}
                    placeholder={IntlFormatMessage('datasource.select.datasourcetype')}
                    name='标签'
                >
                    {
                        dataSourceType[0].children.map(item => {
                            return (
                                <Option value={item.key} key={item.key}>{IntlFormatMessage(item.name)}</Option>
                            );
                        })
                    }
                </Select>,
                showLabel: false,
            },
            {
                formAttribute: {initialValue: (state || state === 0) ? state : undefined},
                components: <Select
                    allowCleartype
                    allowClear
                    id='state'
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    key='state'
                    style={{width: 240}}
                    placeholder={IntlFormatMessage('laboratory.anomaly.statusSelect')}
                    name='状态'
                >
                    {
                        stateList.map(item => {
                            return (
                                <Option value={item.key} key={item.key}>{item.title}</Option>
                            );
                        })
                    }
                </Select>,
                showLabel: false,
            },
            {
                formAttribute: {initialValue: toJS(searchHeaderObj).name || undefined},
                components: <Input.Search
                    id='name'
                    key='name'
                    style={{width: 240}}
                    placeholder={IntlFormatMessage('datasource.searchby.datasourcename')}
                    name='名称'
                >
                </Input.Search>,
                showLabel: false,
            },

        ];
    };

    const columns = [
        {
            title: IntlFormatMessage('datasource.list.name'),
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (text, record) => {
                if (text) {
                    return <TooltipDiv title={text} onClick={() => {
                        setBackTitle(text);
                        // updateType(record.type);
                        history.push(`${path}/${record.id}`);
                    }}>
                        {text}
                    </TooltipDiv>;
                } else {
                    return null;
                }
            }
        },
        {
            title: IntlFormatMessage('datasource.list.source'),
            dataIndex: 'source',
            key: 'source',
            width: 200,
            render: (text, record) => {
                return text==='FILE'?IntlFormatMessage('laboratory.detail.createofflinedata'):
                       text==='DODB'? IntlFormatMessage('laboratory.detail.adddatasource'):
                           text === 'KAFKA'?IntlFormatMessage('laboratory.anomaly.kafkaData'):null;
            }
        },
        {
            title: IntlFormatMessage('datasource.list.tabletype'),
            dataIndex: 'chart',
            key: 'chart',
            width: 200,
            render: (text, record) => {
                return text === 'TIME_SERIES' ? IntlFormatMessage('datasource.create.datatable.type') :
                    text === 'NODE_RELATION' ? IntlFormatMessage('datasource.detail.relationaldatasource') :
                        text === 'LOG' ? IntlFormatMessage('datasource.create.logDataTable') : null;
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.status'),
            dataIndex: 'state',
            key: 'state',
            width: 200,
            render: (text, record) => {
                if (stateFormat[text]) {
                    return <div>
                        <span className="statusDot">
                            <Badge status={stateFormat[text].status}/>
                        </span>
                        {stateFormat[text].title}
                    </div>;
                } else {
                    return '';
                }
            }
        },
        {
            title: IntlFormatMessage('datasource.list.tag'),
            dataIndex: 'tags',
            key: 'tags',
            width: 400,
            render: (text, record) => {
                const box = document.getElementsByClassName('ant-table-tbody')[0];
                const widthBox = (box.clientWidth - 115) * 0.3 - 32;
                if (text && text.length) {
                    let length = 0;
                    let itemNum = text.length;
                    try {
                        text.forEach((item, index) => {
                            const itemLength = strlen(item.name) * 7.7 + 24;
                            const trueLength = itemLength > 118 ? 118 : itemLength;
                            if ((length + trueLength) < widthBox * 2 - 40) {
                                length += trueLength;
                            } else {
                                itemNum = index + 1;
                                throw Error();
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    return (<div className="algorithm-box">
                        {
                            text.slice(0, itemNum).map((item, index) => {
                                return <Tag key={index} className="algorithm-item">
                                    <Tooltip title={item.name}
                                             placement={'topLeft'}>
                                        {item.name}
                                    </Tooltip>
                                </Tag>;
                            })
                        }
                        {
                            text.length > itemNum ?
                                <Tag className="algorithm-item" style={{
                                    width: 'auto'
                                }}>
                                    <Tooltip title={<div className="algorithm-box">
                                        {
                                            text.slice(itemNum).map((item, index) => {
                                                return <Tag key={index} style={{
                                                    margin: '0 8px 8px 0',
                                                    padding: '0 8px'
                                                }}>
                                                    {item.name}
                                                </Tag>;
                                            })
                                        }
                                    </div>}>
                                        +{(text.length - itemNum)}
                                    </Tooltip>
                                </Tag>
                                : null
                        }
                    </div>);
                } else {
                    return '-';
                }
            }
        },
        {
            title: IntlFormatMessage('common.description'),
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: (text, record) => {
                if (text) {
                    return <TooltipDiv title={text}>{text}</TooltipDiv>;
                } else {
                    return '-';
                }
            }
        },

        /*eslint-disable*/
        {
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: IsInternationalization() ? 130 : 120,
            fixed: 'right',
            render: (text, record) => {
                const {source} = record;
                return (
                    <div>
                            <span
                                style={source === 'KAFKA' || source === 'LOG_TIME_SERIES' ? greyColorStyle : {}}
                                className={source === 'KAFKA' ? '' : 'nameStyle'}
                                onClick={() => {
                                    if (source === 'KAFKA' || source === 'LOG_TIME_SERIES') {
                                        return false;
                                    }
                                    onSuspend(record)
                                }}
                            >
                                {IntlFormatMessage('common.edit')}
                            </span>
                        <span className="operation_line">|</span>
                        <span className={'nameStyle'} onClick={() => {
                            setDelId(record)
                            setDelVisible(true)
                        }}>{IntlFormatMessage('common.delete')}</span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];
    //编辑
    const onSuspend = (record) => {
        setBackTitle(record.name);
        // updateType(record.type);
        if (record.source === 'FILE') {
            history.push(`${path}/edit/outline/${record.id}`);
        } else {
            history.push(`${path}/edit/file/${record.id}`);
        }
    }
    //单个删除数据源
    const onOk = () => {
        const {id} = delId
        delDataSourceList(id, {
            cb: () => {
                success(IntlFormatMessage('laboratory.anomaly.deleted'))
                setDelVisible(false);
                getDataSourceFun()
            }
        })
    }
    const onSearch = (value) => {
        setSearchBarObj(value)
        setSearchHeaderObj(value)
        setPage({
            ...page,
            current: 1
        })
    }
    const changePage = (current) => {
        const newPage = toJS(pageInfo);
        setPage(Object.assign({}, newPage, {
            ...page,
            pageNum: current,
        }))
        getDataSourceFun()
    };
    const showSizeChange = (current, pageSize) => {
        const newPage = toJS(pageInfo);
        setPage(Object.assign({}, newPage, {
            pageNum: current,
            pageSize
        }))
        getDataSourceFun()
    };

    const redirectToCreate = () => {
        setCreateModalVisible(true);
    };

    return (
        <div className={style['data-source']}>
            <div className="data-source_right">
                <Table
                    columns={columns}
                    dataSource={[].concat(toJS(dataSourceList))}
                    lazyLoading={true}
                    rowKey={record => record.id}
                    scroll={{x: 1040}}
                    tableWapperClassName={styled['datasource-table-wrapper']}
                    locale={{
                        emptyText:
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span>
                                     {IntlFormatMessage('datasource.list.table.note.first')}，
                                    <span style={{color: '#008DFF', cursor: 'pointer'}}
                                          onClick={redirectToCreate}>{IntlFormatMessage('datasource.list.table.note.second')}{'>'}
                                    </span>
                                </span>}/>

                    }}
                    pagination={{
                        total: totalSize,
                        pageSize: pageSize,
                        current: pageNum,
                        onChange: changePage,
                        onShowSizeChange: showSizeChange,
                        showSizeChanger: true,
                        showTotal: total => `${IntlFormatMessage('datasource.create.total')}${total}${IntlFormatMessage('datasource.create.totalItem')}`,
                        showQuickJumper: true,
                    }}
                    searchBar={{
                        onSearch: onSearch,
                        showSearchCount: 3,
                        showExtraCount: 2,
                        showAdvancedSearch: true,
                        extra: [
                            <Button key={'add'} type='primary' onClick={redirectToCreate}>
                                {IntlFormatMessage('datasource.list.add')}
                            </Button>
                        ],
                        searchContent: searchContent()
                    }}
                />
            </div>

            <CreateTypeModal
                title={IntlFormatMessage('datasource.list.addModal')}
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                footer={null}
                centered={true}
                {...props}
                dataSource={dataSourceType}
            />
            <Modal
                title={IntlFormatMessage('common.note')}
                size='middle'
                onCancel={() => setDelVisible(false)}
                onOk={onOk}
                visible={delVisible}
            >
                <span>
                    {IntlFormatMessage('datasource.list.delete.note')}
                    <span style={{color: '#1890FF'}}> {delId.name || ''}</span>？</span>
            </Modal>
        </div>
    );
};

export default connect(({dataSourceStore, tagStore, store}) => {
    return {
        setBackTitle: store.setBackTitle,
        updateType: dataSourceStore.updateType,
        getDataSourceList: dataSourceStore.getDataSourceList,
        delDataSourceList: dataSourceStore.delDataSourceList,
        dataSourceList: dataSourceStore.dataSourceList,
        totalCount: dataSourceStore.totalCount,
        pageInfo: dataSourceStore.pageInfo,
        deleteDataSourceOffInfo: dataSourceStore.deleteDataSourceOffInfo,
        setSearchHeaderObj: dataSourceStore.setSearchHeaderObj,
        searchHeaderObj: dataSourceStore.searchHeaderObj,


    };
})(SourceList);
