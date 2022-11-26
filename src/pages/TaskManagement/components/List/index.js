import React, {Fragment, useEffect, useMemo,} from 'react';
import {Icon, Input, Select, CWTable as Table, Spin, Badge, Modal, Menu, Button, Empty, Tabs} from '@chaoswise/ui';
import {Resizable} from 'react-resizable';
import moment from 'moment';
import {omit} from "lodash-es";
import {Link} from 'react-router-dom';
import styles from '@/pages/TaskManagement/assets/index.less';
import {formatType, isInPortal, isInPortalURL, timeType} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {downFileFun, uuid} from "@/utils/common";
import {error, success} from "@/utils/tip";
import CreateTypeModal from '@/components/CreateTypeModal';
import TooltipDiv from "@/components/TooltipDiv";
import BasicTable from '@/components/BasicTable';
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import {useFetchState} from "@/components/HooksState";

const {Option} = Select;
const {Group} = Input;
const {confirm} = Modal;
const {TabPane} = Tabs;
let timer = null;

const TaskList = (props) => {
    let {
        form, searchTaskAsync, deleteTaskAsync, startAndStopTaskAsync, setListReducer,
        match = {}, history, setBackTitle, pageInfo,
        getTaskSceneAsync, sceneList = [], dataStoreList = [],
    } = props;
    let {path = ""} = match;
    const taskType = path.slice(path.indexOf('task/') + 5);

    const [searchBarObj, setSearchBarObj] = useFetchState({
        // scene: '',
        // bizSceneId: '',
        // name: ''
    });
    const [selectedRowKeys, setSelectedRowKeys] = useFetchState([]);
    const [isWaitingResult, setIsWaitingResult] = useFetchState(false);
    const [page, setPage] = useFetchState({pageNum: 1, pageSize: 10,});
    const [visible, setVisible] = useFetchState(false);
    const [batchVisible, setBatchVisible] = useFetchState(false);
    const [delInfo, setDelInfo] = useFetchState({});

    const {pageSize = 10, totalSize, totalPages, pageNum = 1} = toJS(pageInfo);

    const searchContent = () => {
        return [
            {
                components: <Select
                    allowClear
                    id='bizSceneId'
                    key='bizSceneId'
                    style={{width: 200}}
                    placeholder={IntlFormatMessage('task.detail.selectbusinesscenario')}
                    name='业务场景'
                >
                    {(toJS(sceneList) || []).map((item) => {
                        const {builtinDisplayNames, name = '',builtin} = item;
                        return <Option
                            key={item.id}
                            value={item.id}
                        >
                            {builtinDisplayNames || name}
                            {builtin ?
                                ` (${IntlFormatMessage('common.builtin')})` :null
                            }
                        </Option>;
                    })}
                </Select>,
                showLabel: false,
            },
            {
                components: <Input.Search
                    id='name'
                    key='name'
                    style={{width: 200}}
                    placeholder={IntlFormatMessage('task.list.searchbytaskname')}
                    name='任务名称'
                />,
                showLabel: false,
            },
        ];
    };

    /*eslint-disable*/
    const _columns = [
        // {
        //     title: '序号',
        //     dataIndex: 'index',
        //     key: 'index',
        //     width: '10%',
        //     render: (text, record, index) => {
        //         return (pageNum - 1) * pageSize + (index + 1);
        //     }
        // },
        {
            title: IntlFormatMessage('task.list.taskname'),
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, record) => {
                if (text) {
                    return <TooltipDiv
                        title={text}
                        onClick={() => {
                            const {timeConfig = {}} = record;
                            const {timeFrameNumber = 0, timeFrameUnit = 'MINUTE'} = timeConfig;
                            setBackTitle(text);
                            /*********把更新周期转化成毫秒**********/
                            const time = timeType(timeFrameNumber, timeFrameUnit);
                            history.push(`${path}/${record.id}/${record.version}/${time}`);
                        }}
                    >
                        {text}
                    </TooltipDiv>;
                } else {
                    return null;
                }
            }
        },
        // {
        //     title: '算法场景',
        //     dataIndex: 'scene',
        //     key: 'scene',
        //     width: '20%',
        //     render: (text, record) => {
        //         const {displaySceneNames} = record || {};
        //         return displaySceneNames || formatType(text);
        //     }
        // },
        {
            title: IntlFormatMessage('task.detail.businesscenario'),
            dataIndex: 'bizSceneName',
            key: 'bizSceneName',
            width: '20%',
            render: (text, record) => {
                const {displayBizSceneName} = record;
                return IsInternationalization() ? (displayBizSceneName?.en || text): (displayBizSceneName?.zh || text)
            }
        },
        {
            title: IntlFormatMessage('task.list.datasource'),
            dataIndex: 'sourceName',
            key: 'sourceName',
            width: '20%',
            render: (text, record) => {
                return text;
            }
        },
        {
            title: IntlFormatMessage('task.list.status'),
            dataIndex: 'state',
            key: 'state',
            width: '15%',
            render: (text, record) => {
                return <div className="status-box">
                    <span className="statusDot">
                        <Badge status={text === 1 ? 'success' : 'default'}/>
                    </span>
                    {text === 1
                        ? IntlFormatMessage('common.operation.start')
                        : IntlFormatMessage('common.operation.stop')}
                </div>;
            }
        },
        {
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: IsInternationalization() ? 216 : 200,
            // fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div>
                         <span className={!!record.loading ? 'greyColorStyle' : 'nameStyle'} onClick={() => {
                             record['loading'] = true;
                             // const data = [].concat(toJS(dataStoreList));
                             // data[index] = record;
                             // setListReducer(data);
                             changeStatus(record)
                         }}>{record.state === 1
                             ? IntlFormatMessage('common.operation.stopBtn') :
                             IntlFormatMessage('common.operation.startBtn')
                         }</span>
                        <span className={"operation_line"}>|</span>
                        <span className={'nameStyle'}
                              onClick={() => { setBackTitle(IntlFormatMessage('common.back'))
                                history.push(`/task/${taskType}/copy/${record.id}`)
                        }}>{IntlFormatMessage('common.operation.copy')}</span>
                        <span className={"operation_line"}>|</span>
                        {
                            record.state === 1 ?
                                <Fragment>
                                    <span className={'greyColorStyle'}>{IntlFormatMessage('task.detail.edit')}</span>
                                    <span className={"operation_line"}>|</span>
                                    <span className={'greyColorStyle'}>{IntlFormatMessage('task.detail.delete')}</span>
                                </Fragment> :
                                <Fragment>
                                        <span className={'nameStyle'} onClick={() => {
                                            setBackTitle(record.name);
                                            history.push(`${path}/modify/${record.id}`);
                                        }}>{IntlFormatMessage('common.operation.edit')}</span>
                                    <span className={"operation_line"}>|</span>
                                    <span className={'nameStyle'} onClick={() => {
                                        deleteGenerics(record)
                                    }}>{IntlFormatMessage('common.operation.delete')}</span>
                                </Fragment>
                        }
                    </div>
                );
            }
        },
    ];
    /*eslint-disable*/

    // 初始化列表数据
    const initData = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            let newSearchBarObj = Object.assign({}, searchBarObj);
            let params = {
                pageNum: page.pageNum,
                pageSize: page.pageSize,
                query: Object.assign({}, newSearchBarObj, {
                    name: !!newSearchBarObj.name ? newSearchBarObj.name : null,
                    scene: taskType,
                })
            }
            //获取数据表列表
            searchTaskAsync(params);
        }, 200)
    };

    useEffect(() => {
        initData();

        return () => {
            setListReducer([])
        }
    }, [page, searchBarObj]);

    useEffect(() => {
        getTaskSceneAsync(path.slice(path.indexOf('task/') + 5))
    }, [])

    const onSearch = (value) => {
        const newObj = Object.keys(value).reduce((obj, key) => {
            if (!!value[key]) {
                obj[`${key}`] = value[key];
            } else {
                obj[`${key}`] = '';
            }
            return obj;
        }, {});
        setSearchBarObj(newObj);
    };
    const changePage = (value, pageSize) => {
        const newPage = toJS(pageInfo);
        setPage(Object.assign({}, newPage, {
                pageSize,
                pageNum: value,
            })
        );
    };
    const showSizeChange = (current, pageSize) => {
        const newPage = toJS(pageInfo);
        setPage(Object.assign({}, newPage, {
                pageSize,
                pageNum: current,
            })
        );
    };

    // 启动/停止
    const changeStatus = (record) => {
        setIsWaitingResult(true)
        const {state, id} = record;
        const params = {
            id: id,
            target: state
        }
        startAndStopTaskAsync(params, res => {
            handleRes(res, state)
        })
    }
    const handleRes = (res, status) => {
        if (!!res && res.status == "success") {
            success(`${status? IntlFormatMessage('laboratory.anomaly.taskStopped') :IntlFormatMessage('laboratory.anomaly.taskStarted')}`)
            initData()
        } else {
            error(`${status ? IntlFormatMessage('laboratory.anomaly.taskStopFaied') : IntlFormatMessage('laboratory.anomaly.taskFailed')}`)
        }
        setIsWaitingResult(false)
    }

    /**
     * 删除
     */
    const deleteGenerics = (data) => {
        setVisible(true)
        setDelInfo(data)
    }
    //联动的选择框
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setDelInfo(selectedRows[0] || {})
            setSelectedRowKeys(prev => selectedRows.map(item => item.id))
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    return (
        <Spin spinning={isWaitingResult}>
            <div className={styles['task-management']}>
                <div className={"data-store_right"}>
                    <Table
                        rowSelection={rowSelection}
                        columns={_columns}
                        dataSource={[].concat(toJS(dataStoreList))}
                        lazyLoading={true}
                        rowKey={record => record.id}
                        locale={{
                            emptyText:
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span>
                                        {IntlFormatMessage('task.list.table.note.first')}
                                        <span style={{color: '#008DFF', cursor: 'pointer'}}
                                              onClick={() => {
                                                  setBackTitle(IntlFormatMessage('common.back'))
                                                  history.push(`/task/${taskType}/create`)
                                              }}>{IntlFormatMessage('task.list.table.note.second')}{'>'}
                                        </span>
                                    </span>}/>

                        }}
                        // scroll={{x: 1020}}
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
                            // onChange: onChange,
                            showSearchCount: 2,
                            showExtraCount: 2,
                            showAdvancedSearch: true,
                            extra: selectedRowKeys.length ?
                                [
                                    <Button key={'add'} type='primary' onClick={() => {
                                        setBackTitle(IntlFormatMessage('common.back'))
                                        history.push(`/task/${taskType}/create`)
                                    }}>{IntlFormatMessage('task.list.create')}</Button>,
                                    <Button key={'start'} type='default' onClick={() => {
                                        setBatchVisible(true)
                                    }}>{IntlFormatMessage('task.create.batchdelete')}</Button>
                                ] : [
                                    <Button key={'add'} type='primary' onClick={() => {
                                        setBackTitle(IntlFormatMessage('common.back'))
                                        history.push(`/task/${taskType}/create`)
                                    }}>{IntlFormatMessage('task.list.create')}</Button>,
                                ],
                            searchContent: searchContent()
                        }}
                    />
                </div>
            </div>
            {
                visible &&
                <Modal
                    title={IntlFormatMessage('common.note')}
                    onCancel={() => setVisible(false)}
                    visible={visible}
                    onOk={() => {
                        const {id} = delInfo;
                        deleteTaskAsync({ids: [id]}, (res) => {
                            setVisible(false)
                            success(IntlFormatMessage('laboratory.anomaly.taskDeleted'));
                            //重新加载数据
                            onSearch({pageSize: 10, pageNum: 1});
                        });
                    }}
                >
                    {IntlFormatMessage('datasource.list.delete.note')}<span
                    style={{color: '#1890FF'}}> {delInfo.name}</span>？
                </Modal>
            }
            {
                batchVisible &&
                <Modal
                    title={IntlFormatMessage('common.note')}
                    onCancel={() => setBatchVisible(false)}
                    visible={batchVisible}
                    onOk={() => {
                        deleteTaskAsync({ids: selectedRowKeys}, (res) => {
                            success(IntlFormatMessage('task.list.deleteBatch'));
                            setBatchVisible(false)
                            //重新加载数据
                            onSearch({pageSize: 10, pageNum: 1});
                        });
                    }}
                >
                {IsInternationalization()?
                    <Fragment>Are you sure that you want to delete the {selectedRowKeys.length || 0} tasks including
                        <span style={{color: '#1890FF'}}> {delInfo.name || ''}</span>
                        ?</Fragment>
                    :<Fragment>确认删除<span style={{color: '#1890FF'}}>{delInfo.name || ''}</span>等{selectedRowKeys.length || 0}个任务吗?</Fragment>
                }
                </Modal>
            }
        </Spin>
    );
};

export default connect(({taskManagementStore, store}) => {
    return {
        setBackTitle: store.setBackTitle,
        searchTaskAsync: taskManagementStore.searchTaskAsync,
        setListReducer: taskManagementStore.setListReducer,
        deleteTaskAsync: taskManagementStore.deleteTaskAsync,
        startAndStopTaskAsync: taskManagementStore.startAndStopTaskAsync,
        dataStoreList: taskManagementStore.list,
        pageInfo: taskManagementStore.pageInfo,
        getTaskSceneAsync: taskManagementStore.getTaskSceneAsync,
        sceneList: taskManagementStore.sceneList,
    };
})(TaskList);
