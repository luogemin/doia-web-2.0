import React, {Component, useEffect,} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {Form, CWTable as Table, Select, Tooltip, Spin, Input, RangePicker, Pagination, Modal} from '@chaoswise/ui';
import {error, success} from '@/utils/tip';
import moment from 'moment';
import {omit} from "lodash-es";
import styles from './index.less';
import {useHistory, useParams} from "react-router";
import InputNumber from "@chaoswise/ui/lib/Antd/InputNumber";
import TaskInfoModel from "@/pages/TaskManagement/components/common/TaskInfoModel";
import localStorageUtils from "@/utils/storageUtils/localStorageUtils";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import {useFetchState} from "@/components/HooksState";

const {Option} = Select;
let timer = null;

const Detail = (props) => {
    const {
        form, searchTaskDetailListAsync, taskList, setTaskListReducer, setCurrentDetailInfoReducer, getTaskDetailAsync,
        searchModelListAsync, taskModelList = {}, setCurrentReducer,
        // setTaskModelList
    } = props;
    const {getFieldDecorator, validateFields} = form;

    const {push, location} = useHistory();
    const {pathname = ""} = location;
    const {taskId = '', taskVersion = '', cycleNumber = 0, typeId = ''} = useParams();

    const [searchBarObj, setSearchBarObj] = useFetchState({
        model: null,
        metric: null,
    });
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 10,
        total: 0,
    });
    const [timeSpace, setTimeSpace] = useFetchState([new Date().getTime() - cycleNumber, new Date().getTime()]);
    const [taskModelVisible, setTaskModelVisible] = useFetchState(false);
    const [isLoadingList, setIsLoadingList] = useFetchState(false);
    const [lowAndUpValue, setLowAndUpValue] = useFetchState({
        uperValue: undefined,
        lowerValue: undefined
    });


    const callBack = (res) => {
        const {extendConfig = {}} = res;
        const {dataProcessing = {}} = extendConfig;
        const {lowerThreshold, upperThreshold} = dataProcessing;
        setLowAndUpValue({
            uperValue: upperThreshold,
            lowerValue: lowerThreshold
        });
    };

    useEffect(() => {
        if (typeId === "forecasting") {
            getTaskDetailAsync({id: taskId}, callBack, false);
        }
    }, [taskId]);

    const optionFun = () => {
        searchModelListAsync({
            taskId, taskVersion,
            startTime: timeSpace[0],
            endTime: timeSpace[1],
            model: searchBarObj.model ? searchBarObj.model : null,
            metric: searchBarObj.metric ? searchBarObj.metric : null,
        });
    };

    useEffect(() => {
        optionFun();
    }, [taskId, taskVersion, timeSpace,searchBarObj.model,searchBarObj.metric]);

    const columns = [
        {
            title: IntlFormatMessage('task.detail.metric'),
            dataIndex: 'metric',
            key: 'metric',
            width: '50%',
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
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: IsInternationalization() ? 115 : 100,
            // fixed: 'right',
            render: (text, record) => {
                const {metric, model} = record;
                return (
                    <div>
                        <span className={'nameStyle'} onClick={() => {
                            setCurrentDetailInfoReducer({
                                startTime: timeSpace[0],
                                endTime: timeSpace[1],
                                model: model, metric: metric
                            });
                            setTaskModelVisible(true);
                        }}>
                            {IntlFormatMessage('task.detail.viewresult')}
                        </span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];

    useEffect(() => {
        if (taskId) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                initData(pageInfo)
            }, 200);
        }

        return () => {
            setTaskListReducer([]);
            setCurrentReducer({});
        };
    }, [taskId, taskVersion, searchBarObj, timeSpace]);

    const initData = (page) => {
        setIsLoadingList(true);
        // optionFun()
        searchTaskDetailListAsync({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            query: {
                taskId,
                taskVersion,
                model: !!searchBarObj.model ? searchBarObj.model : null,
                metric: !!searchBarObj.metric ? searchBarObj.metric : null,
                startTime: timeSpace[0],
                endTime: timeSpace[1],
            }
        }, (info) => {
            const {data = {}} = info;
            // setTaskModelList(data.content || {})
            const {pageNum = 1, pageSize = 10, totalSize = 0} = data;
            setPageInfo({
                pageNum,
                pageSize,
                total: totalSize
            })
            setIsLoadingList(false);
        });
    }

    const onModelCancel = () => {
        setTaskModelVisible(false);
    };
    const changePage = (page) => {
        initData({
            pageNum: page,
            pageSize: pageInfo.pageSize
        })
    }
    const showSizeChange = (page, pageSize) => {
        initData({
            pageNum: page,
            pageSize: pageSize
        })
    }

    return (
        <div className={styles["task-detail"]}>
            <Spin spinning={isLoadingList}>
                <div className="search-box flex-box">
                    <div className="flex-box">
                        <Select allowClear style={{width: 200, marginLeft: 8}}
                                placeholder={IntlFormatMessage('task.detail.selectmetric')}
                                onChange={(value) => {
                                    setSearchBarObj(prev => Object.assign({}, prev, {metric: value}));
                                }}>
                            {
                                (taskModelList.metric || []).map((item, index) => {
                                    return (
                                        <Option key={item} value={item}>{item}</Option>
                                    );
                                })
                            }
                        </Select>
                    </div>
                    <RangePicker
                        style={{width: 450, marginLeft: 8}}
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        showTime={true}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={[IntlFormatMessage('task.create.starttime'), IntlFormatMessage('task.common.endTime')]}
                        value={timeSpace.length ? [moment(timeSpace[0]), moment(timeSpace[1])] : []}
                        onChange={(value) => {
                            if (value.length) {
                                setTimeSpace([new Date(value[0]).getTime(), new Date(value[1]).getTime()]);
                            } else {
                                setTimeSpace([])
                            }
                        }}
                    />

                </div>
                <Table
                    columns={columns}
                    dataSource={toJS(taskList).length ? [].concat(toJS(taskList)) : []}
                    rowKey={record => `${record.model}-${record.metric}`}
                    pagination={{
                        total: pageInfo.total,
                        current: pageInfo.pageNum,
                        pageSize: pageInfo.pageSize,
                        onChange: changePage,
                        onShowSizeChange: showSizeChange,
                        showSizeChanger: true,
                        showTotal: total => `${IntlFormatMessage('datasource.create.total')}${total}${IntlFormatMessage('datasource.create.totalItem')}`,
                        showQuickJumper: true,
                    }}
                />
            </Spin>
            {
                taskModelVisible ?
                    <TaskInfoModel
                        visible={taskModelVisible}
                        onCancel={onModelCancel}
                        lowAndUpValue={lowAndUpValue}
                    />
                    : null
            }
        </div>
    );
};

export default connect(({taskManagementStore, store}) => {
    return {
        setBackTitle: store.setBackTitle,
        searchTaskDetailListAsync: taskManagementStore.searchTaskDetailListAsync,
        searchModelListAsync: taskManagementStore.searchModelListAsync,
        taskModelList: taskManagementStore.taskModelList,
        taskList: taskManagementStore.taskList,
        setCurrentDetailInfoReducer: taskManagementStore.setCurrentDetailInfoReducer,
        setCurrentReducer: taskManagementStore.setCurrentReducer,
        setTaskListReducer: taskManagementStore.setTaskListReducer,
        getTaskDetailAsync: taskManagementStore.getTaskDetailAsync,
        // setTaskModelList: taskManagementStore.setTaskModelList,
    };
})(Form.create()(Detail));