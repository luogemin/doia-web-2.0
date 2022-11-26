import React, {Fragment, useEffect,} from 'react';
import {Empty, Input, Select, CWTable as Table, Modal, Button, Spin,} from '@chaoswise/ui';
import moment from 'moment';
import style from '@/pages/Laboratory/assets/index.less';
import {formatArithmeticType, dataLaboratoryType, formatType} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {debounce, isEmpty, omit} from "lodash-es";
import {downFileFun, uuid} from "@/utils/common";
import {error, success} from "@/utils/tip";
// import CreateModal from '@/components/Modal/CreateModal';
import CreateTypeModal from '@/components/CreateTypeModal/index';
import TooltipDiv from "@/components/TooltipDiv";
import BasicTable from '@/components/BasicTable';
import dashboardStore from "@/stores/dashboard";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage, IsInternationalization} from "@/utils/util";

const {Search} = Input;
const {Option} = Select;
const {Group} = Input;
const {confirm} = Modal;
const greyColorStyle = {
    color: '#c4c4c4',
    cursor: 'not-allowed',
};
let timer = null;

const GenericsList = (props) => {
    let {
        match = {},
        history,
        setBackTitle,
        getDataList,
        dataList,
        pageInfo,
        delTbList,
        updataCurrentList,
        updateDataSetInfo,
        deleteDataSetInfo, dashboard, setLaboratoryRecord, setSearchHeaderData, searchHeader,
    } = props;
    let {path = ""} = match;
    let prefixPath = path + '/create';

    const {scene,taskName} = toJS(searchHeader);

    const [searchObj, setSearchObj] = useFetchState({
        scene: scene,
        taskName: taskName
    });
    const [delVisible, setDelVisible] = useFetchState(false);
    const [tableLoading, setTableLoading] = useFetchState(false);
    const [page, setPage] = useFetchState({
        pageNum: 1,
        pageSize: 10,
    });
    const [delId, setDelId] = useFetchState({});
    const [createModalVisible, setCreateModalVisible] = useFetchState(false);

    const {pageSize = 10, totalSize, totalPages, pageNum = 1} = toJS(pageInfo);

    useEffect(() => {
        setTableLoading(false);
    }, [dataList]);

    useEffect(() => {
        deleteDataSetInfo();
        getDataList({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            query:{
                ...searchObj
            }
        });
    }, []);
    const searchContent = () => {
        return [
            {
                formAttribute: {initialValue: scene || undefined},
                components: <Select
                    id='scene'
                    key='scene'
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    allowClear
                    style={{width: 240}}
                    placeholder={IntlFormatMessage('laboratory.list.selectalgorithmscenario')}
                    name='任务名称'
                >
                    {
                        (window.DOIA_CONFIG.dataSceneTypeList.length ? window.DOIA_CONFIG.dataSceneTypeList :
                            ((dashboard && dashboard.length) ? toJS(dashboard) : [])).slice(0, 5)
                            .map((item, index) => {
                                return (
                                    <Option key={item.type} value={item.type}>{item.title}</Option>
                                );
                            })
                    }
                </Select>,
                showLabel: false,
            },
            {
                formAttribute: {initialValue: taskName || undefined},
                components: <Search
                    id='taskName'
                    key='taskName'
                    style={{width: 240}}
                    placeholder={IntlFormatMessage('laboratory.list.searchbytaskname')}
                    name='算法类型'
                />,
                showLabel: false,
            },
        ];
    };

    const columns = () => {
        let {path = ""} = match;
        return [
            {
                title: IntlFormatMessage('laboratory.list.taskname'),
                dataIndex: 'taskName',
                key: 'taskName',
                width: 300,
                render: (text, record) => {
                    if (text) {
                        return <TooltipDiv title={text} onClick={() => {
                            setBackTitle(`${record.taskName}`);
                            setLaboratoryRecord(record);
                            localStorage.setItem('laboratoryRecord', JSON.stringify(record));
                            history.push(`${path}/${record.scene}/${record.id}`);
                        }}>
                            {text}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('laboratory.list.algorithmscenario'),
                dataIndex: 'scene',
                key: 'scene',
                width: 200,
                render: (text, record) => {
                    const {displaySceneNames} = record || {};
                    // let desc = formatArithmeticType()[text] || text;
                    return displaySceneNames || IntlFormatMessage(formatType(text));
                }
            },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('laboratory.list.datasource'),
                dataIndex: 'dataSourceName',
                key: 'dataSourceName',
                width: 200,
                render: (text, record) => {
                    return <TooltipDiv title={text}>
                        {text}
                    </TooltipDiv>;
                }
            },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('laboratory.list.creationtime'),
                dataIndex: 'createdTime',
                key: 'createdTime',
                width: 200,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.createdTime - b.createdTime,
                render: (text, record) => {
                    const result = moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss');
                    return result;
                }
            },
            {
                title: IntlFormatMessage('laboratory.list.createdby'),
                dataIndex: 'createdUserName',
                key: 'createdUserName',
                width: IsInternationalization() ? 120 : 100,
                render: (text, record) => {
                    if (text) {
                        return text;
                    } else {
                        return '-';
                    }
                }
            },
            /*eslint-disable*/
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
            /*eslint-disable*/
            {
                title: IntlFormatMessage('common.operation'),
                dataIndex: 'operation',
                key: 'operation',
                width: IsInternationalization() ? 268 : 245,
                fixed: 'right',
                render: (text, record) => {
                    const ifCanConfigure = ['anomaly_detection', 'forecasting'].includes(record.scene);
                    return (
                        <div>
                            {
                                ifCanConfigure ?
                                    <Fragment>
                                        <span className={'nameStyle'} onClick={() => {
                                            setBackTitle(record.taskName)
                                            history.push(`${path}/${record.scene}/original/${record.id}/collect`)
                                        }}>{IntlFormatMessage('laboratory.list.configure')}</span>
                                        <span className="operation_line">|</span>
                                    </Fragment>
                                    : null
                            }
                            <span className={'nameStyle'} onClick={() => {
                                setBackTitle(IntlFormatMessage('laboratory.anomaly.copyTask'))
                                updataCurrentList(record)
                                history.push(`${path}/copy/${record.scene}/${record.id}`)
                            }}> {IntlFormatMessage('common.copy')}</span>
                            <span className="operation_line">|</span>
                            <span className={'nameStyle'} onClick={() => {
                                setBackTitle(record.taskName);
                                history.push(`${path}/${record.scene}/edit/${record.id}`)
                            }}> {IntlFormatMessage('common.edit')}</span>
                            <span className="operation_line">|</span>
                            <span className={'nameStyle'} onClick={() => {
                                setDelId(record)
                                openDelModal()
                            }}> {IntlFormatMessage('common.delete')}</span>

                        </div>
                    );
                }
            },
            /*eslint-disable*/
        ];
    };

    const onSearch = (value) => {
        setTableLoading(true)
        setSearchObj(value);
        setSearchHeaderData(value);
        clearTimeout(timer);
        timer = setTimeout(() => {
            getDataList({
                pageNum: page.pageNum,
                pageSize: page.pageSize,
                query: {
                    ...value
                }
            })
        }, 500)
    };

    const changePage = (current) => {
        const newPage = toJS(pageInfo);
        setPage(Object.assign({}, newPage, {
            ...page,
            pageNum: current,
        }))

        getDataList({
            pageNum: current,
            pageSize: page.pageSize,
            query: {
                ...searchObj
            }
        })
    };
    const showSizeChange = (current, pageSize) => {
        const newPage = toJS(pageInfo);
        setPage(Object.assign({}, newPage, {
            pageNum: current,
            pageSize
        }))
        getDataList({
            pageNum: current,
            pageSize,
            query: {
                ...searchObj
            }
        })
    };
    const createExperiment = () => {
        setCreateModalVisible(true)
    }
    const onClickType = (value) => {
        history.push(`${prefixPath}/${value}`);
    }

    const openDelModal = () => {
        setDelVisible(true)
    }

    const handleOk = () => {
        const {id} = delId
        delTbList(id, {
            cb: () => {
                getDataList({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    query: {
                        ...searchObj
                    }
                })
            }
        })
        setDelVisible(false)
    }

    return (
        <div className={style['data-store']}>
            <div className={style["data-store_right"]}>
                <Spin spinning={tableLoading}>
                    <Table
                        columns={columns()}
                        dataSource={[].concat(toJS(dataList).map(item => {
                            return {
                                ...item,
                                dataSourceName: (item.dataSourceList || []).map(source => {
                                    const {dataSource = {}} = source;
                                    return dataSource.name
                                }).join('、')
                            }
                        }))}
                        lazyLoading={true}
                        rowKey={record => record.id}
                        scroll={{x: 1040}}
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
                        locale={{
                            emptyText:
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span>
                                    {IntlFormatMessage('laboratory.list.table.note.first')}
                                    <span style={{color: '#008DFF', cursor: 'pointer'}}
                                          onClick={createExperiment}>{IntlFormatMessage('laboratory.list.table.note.second')}{'>'}
                                    </span>
                                </span>}/>

                        }}
                        searchBar={{
                            onSearch: onSearch,
                            // onChange: onChange,
                            // onReset: onReset,
                            showSearchCount: 2,
                            showExtraCount: 2,
                            showAdvancedSearch: true,
                            extra: [
                                <Button key={'add'} type='primary'
                                        onClick={createExperiment}>{IntlFormatMessage('laboratory.list.create')}</Button>
                            ],
                            searchContent: searchContent()
                        }}
                    />
                </Spin>
            </div>
            <Modal size='small' visible={delVisible} title={IntlFormatMessage('common.note')}
                   onCancel={() => setDelVisible(false)} onOk={handleOk}>
                {IntlFormatMessage('laboratory.list.delete.note')}<span
                style={{color: '#1890FF'}}>{delId.taskName || ''}</span>？
            </Modal>
            <CreateTypeModal
                title={IntlFormatMessage('laboratory.detail.createBtn')}
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                footer={null}
                centered={true}
                onClickType={onClickType}
                {...props}
                dataSource={dataLaboratoryType}  //公共路由
            />
        </div>
    );
};

export default connect(({laboratoryStore, store, dashboardStore}) => {
    return {
        setBackTitle: store.setBackTitle,
        getDataList: laboratoryStore.getDataList,
        dataList: laboratoryStore.dataList,
        pageInfo: laboratoryStore.pageInfo,
        delTbList: laboratoryStore.delTbList,
        updataCurrentList: laboratoryStore.updataCurrentList,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        deleteDataSetInfo: laboratoryStore.deleteDataSetInfo,
        setLaboratoryRecord: laboratoryStore.setLaboratoryRecord,
        setSearchHeaderData: laboratoryStore.setSearchHeaderData,
        searchHeader: laboratoryStore.searchHeader,

        dashboard: dashboardStore.dashboard,
    };
})(GenericsList);
