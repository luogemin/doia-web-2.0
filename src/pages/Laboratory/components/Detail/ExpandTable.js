import React, {Fragment, useEffect,} from 'react';
import {
    Table,
    Select,
    Icon,
    Modal,
    Form,
    Pagination,
    Button,
    Empty,
    Tooltip,
    Checkbox,
    Spin
} from '@chaoswise/ui';
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from 'react-router-dom';
import {error, success} from "@/utils/tip";
import styles from './index.less';
import moment from 'moment';
import SaveGeneric from './SaveGeneric';
import * as echarts from 'echarts';
import ChartList from './ChartList';
import {useFetchState} from "@/components/HooksState";
import {ClearSomLocalStorage, IntlFormatMessage, IsInternationalization} from "@/utils/util";

const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};
const {confirm} = Modal;
const {Option} = Select;
const {Group} = Checkbox;
const options = [
    {label: IntlFormatMessage('laboratory.detail.synchronize'), value: 'link'},
    {label: IntlFormatMessage('laboratory.detail.showparameter'), value: 'parameter'},
];


function ExpandTable(props) {

    const {
        expandTitle = '',
        getSeriesList,
        id = '',
        taskId = '',
        seriesCreated,
        targetModel,
        metricKey,
        form,
        getSeriesData,
        searchAlgorithmService,
        genericityData,
        getGenericSericeList,
        addGenericList,
        deleteDenericList,
        modifyGenericList,
        getResult,
        getTrigger,
        searchAlgorithmAsync,
        lowAndUpValue,
        index,
        getOriginData,
        getGenericsNumAsync,
        privateLimit,
    } = props;

    const {getFieldDecorator, setFieldsValue} = form;
    const {typeId = ''} = useParams();


    const [expand, setExpand] = useFetchState(index === 0);
    const [saveGeneVisible, setSaveGeneVisible] = useFetchState(false);
    const [dataSource, setDataSource] = useFetchState([]);
    const [page, setPage] = useFetchState({
        pageNum: 1,
        pageSize: 10,
    });
    const [simplePage, setSimplepage] = useFetchState({
        pageNum: 1,
        pageSize: 1,
    });
    const [chartData, setChartData] = useFetchState([]);
    const [visible, setVisible] = useFetchState(false);
    const [comparisonVisible, setComparisonVisible] = useFetchState(false);
    const [inputValue, setInputValue] = useFetchState(0);
    const [modelInfo, setModelInfo] = useFetchState({
        name: '',
        time: '',
        targetModel: '',
        targetName: '',
        metricTags: ''
    });
    const [currentPageInfo, setCurrentPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 1,
        totalSize: 0
    });
    const [spinning, setSpinning] = useFetchState(false);
    const [addGenericLoading, setAddGenericLoading] = useFetchState(false);
    const [currentGenericId, setCurrentGenericId] = useFetchState('');
    const [editNum, seteditNum] = useFetchState('');
    const [currentGenericList, setCurrentGenericList] = useFetchState({});
    const [selectOption, setSelectOption] = useFetchState(['link']);
    const [currentEditId, setCurrebtEditId] = useFetchState('');
    const [currentParameters, setCurrentParameters] = useFetchState(null);
    const [checked, setChecked] = useFetchState(false);
    const [genericName, setGenericName] = useFetchState(undefined);
    const [boxLoading, setBoxLoading] = useFetchState(false);


    useEffect(() => {
        if (selectOption.includes('link')) {
            echarts.connect('echartsLink');
        } else {
            echarts.connect('echartsUnLink');
        }
        return () => {
            echarts.disconnect('echartsLink');
            echarts.disconnect('echartsUnLink');
        };
    }, [selectOption]);

    useEffect(() => {
        if (index === 0) {
            getSeriesListInfo();
        }
    }, []);

    const getCurrentList = (record, page) => {
        ClearSomLocalStorage();
        setSpinning(true);
        getSeriesList({
            ...page,
            query: {
                id,
                taskId,
                seriesCreated,
                favoritesAll: 1,
                targetModel,
                metricKey
            }
        }, {
            cb: (data) => {
                const {seriesList = {}} = data;
                const {content = []} = seriesList;
                const {
                    endTime,
                    favorites,
                    id,
                    metricKey,
                    metricTags = {},
                    modelMetricId,
                    startTime,
                    targetModel = '',
                    targetName = '',
                    taskId = '',
                } = content[0];
                //metricTags 加上
                setCurrentGenericId(id);

                // let list = [];
                // for (var i in metricTags) {
                //     list = list.concat({
                //         name: i,
                //         value: metricTags[i]
                //     });
                // }
                setModelInfo({
                    ...modelInfo,
                    name: `${IntlFormatMessage('laboratory.detail.metric')}:${metricKey || '-'}`,
                    time: `${moment(startTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(endTime).format('YYYY-MM-DD HH:mm:ss')}`,
                    targetName,
                    metricTags: Object.keys(metricTags).length ? JSON.stringify(metricTags) : '',
                });


                getGenericSericeList({
                    id,
                    taskId
                }, {
                    cb: (data) => {
                        // const {data = []} = info;

                        const ids = (data || []).map(item => {
                            return item.id;
                        });
                        if (ids.length) {
                            getResult({
                                seriesId: id,
                                tuningBenchGenericIds: ids
                            }, {
                                cd: (res) => {
                                    setChartData(data.map(item => {
                                        return {
                                            ...item,
                                            seriesId: id,
                                            info: res[item.id]
                                        };
                                    }));

                                    setSpinning(false);
                                },
                                err: () => {
                                    setSpinning(false);
                                }
                            });
                        } else {
                            setChartData([]);
                            setSpinning(false);
                        }

                        // setSpinning(false);
                    }
                });
            }
        });
    };


    //获取图表数据
    const getChartData = (record, currentPage) => {
        getCurrentList(record, {
            pageNum: currentPage,
            pageSize: 1
        });
    };

    const columns = [
        {
            title: IntlFormatMessage('laboratory.detail.metric'),
            dataIndex: 'metricKey',
            key: 'metricKey',
            width: '35%',
            render: (text, record) => {
                return text || '-';
            }
        },
        /*eslint-disable*/
        {
            title: IntlFormatMessage('laboratory.detail.dimension'),
            dataIndex: 'metricTags',
            key: 'metricTags',
            width: '50%',
            render: (text, record) => {
                const {metricTags = {}} = record;
                if (Object.keys(metricTags).length) {
                    return <TooltipDiv title={JSON.stringify(metricTags)}>{JSON.stringify(metricTags)}</TooltipDiv>;
                }
                return '-';
            }
        },
        /*eslint-disable*/
        /*eslint-disable*/
        {
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: IsInternationalization() ? 115 : 100,
            // fixed: 'right',
            render: (text, record) => {
                return (
                    <div>
                        <span className={'nameStyle'} onClick={() => {
                            const currentPage = (currentPageInfo.pageNum - 1) * currentPageInfo.pageSize + record.currentIndex;
                            setSimplepage({
                                ...simplePage,
                                pageNum: currentPage
                            })
                            getChartData(record, currentPage)
                            setVisible(true)
                        }}>{IntlFormatMessage('laboratory.detail.viewresult')}</span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];


    const getSeriesListInfo = (pageInfo = {
        pageNum: 1,
        pageSize: 10
    }) => {
        setBoxLoading(true);
        getSeriesList({
            ...pageInfo,
            query: {
                id,
                taskId,
                seriesCreated,
                favoritesAll: 1,
                targetModel,
                metricKey
            }
        }, {
            cb: (info) => {
                const {seriesList = {}} = info
                const {pageNum = 1, pageSize = 10, totalSize = 0, content = []} = seriesList;
                setCurrentPageInfo({
                    pageNum,
                    pageSize,
                    totalSize
                })
                setDataSource(prev => content.map((item, index) => {
                    return {
                        ...item,
                        currentIndex: index + 1
                    }
                }));
                setBoxLoading(false);
            }
        });
    }

    const handleExpand = () => {
        setExpand(!expand);
        if (!expand) {
            getSeriesListInfo()
        }
    };

    const inputChange = (value) => {
        setInputValue(value)
    }

    const changePage = (current) => {
        setPage({
            ...page,
            pageNum: current
        })
        getSeriesListInfo({
            ...page,
            pageNum: current
        })
    }
    const showSizeChange = (current, pageSize) => {
        setPage({
            pageNum: current,
            pageSize: pageSize
        })
        getSeriesListInfo({
            pageNum: current,
            pageSize,
        })
    }

    //简单分页页码改变
    const simplePagChange = (current) => {
        setChartData([])
        setSimplepage({
            ...simplePage,
            pageNum: current,
        })
        getCurrentList(props, {
            ...simplePage,
            pageNum: current,
        })
    }

    //删除泛型
    const showConfirm = (item) => {
        const {id = ''} = item;
        confirm({
            title: IntlFormatMessage('laboratory.anomaly.wantResult'),
            okText: IntlFormatMessage('common.explore.setting.modal.determine'),
            okType: 'primary',
            cancelText: IntlFormatMessage('common.explore.setting.modal.cancel'),
            onOk() {
                deleteDenericList(id, {
                    cb: () => {
                        success(IntlFormatMessage('laboratory.anomaly.deleted'));
                        getCurrentList(props, simplePage)
                    }
                })
            },
            onCancel() {
                return;
            },
        });
    }

    //联动和显示参数变化
    const onOptionChange = (value) => {
        setSelectOption(value)
    }


    const addAlgorithmList = (param, checked) => {
        const {algorithmId = '', algorithmName = '', algorithmVersion = '', algorithmGenericId = ''} = currentGenericList;
        setAddGenericLoading(true)
        const {algorithm = {}} = param;
        if (editNum) {
            modifyGenericList({
                algorithmId: param.algorithmId || algorithmId,
                algorithmName: param.algorithmName || algorithmName,
                algorithmGenericId: param.id || algorithmGenericId,
                algorithmVersion: param.algorithmVersion || algorithmVersion,
                taskId,
                seriesId: currentGenericId,
                algorithmParams: param.parameters.map(item => {
                    if (item.value || item.value === 0) {
                        return item
                    }
                    return {
                        name: item.name,
                        value: null
                    }
                }),
                id: currentEditId,
                algorithmNameZh: algorithm.nameZh,
                genericName: param.genericityname,
                isOverwriteForecastParams: !!checked
            }, {
                cb: (data) => {
                    const {id = ''} = data;
                    success(IntlFormatMessage('laboratory.anomaly.edited'))
                    setAddGenericLoading(false)
                    seteditNum('')
                    setCurrentParameters(null)
                    handleCancelEditAlo()
                    setChartData(chartData.map(item => {
                        if (item.id === id) {
                            return {
                                ...data,
                                editBool: true
                            }
                        }
                        return item
                    }))
                    // setChartData([])
                    setChecked(false)
                    // getCurrentList(props, simplePage)
                },
                err: () => {
                    setAddGenericLoading(false)
                }
            })
        } else {
            addGenericList({
                algorithmId: param.algorithmId,
                algorithmName: param.algorithmName,
                algorithmGenericId: param.id,
                algorithmVersion: param.algorithmVersion,
                taskId,
                seriesId: currentGenericId,
                algorithmParams: param.parameters.map(item => {
                    if (item.value || item.value === 0) {
                        return item
                    }
                    return {
                        name: item.name,
                        value: null
                    }
                }),
                genericName: param.genericityname,
                algorithmNameZh: algorithm.nameZh,
                isOverwriteForecastParams: checked ? true : false
                // algorithmNameEnglish: algorithm.name
            }, {
                cb: (data) => {
                    success(IntlFormatMessage('laboratory.anomaly.addedBtn'))
                    setAddGenericLoading(false)
                    handleCancelEditAlo()
                    setCurrentParameters(null)
                    setChartData([{
                        ...data,
                        addBool: true
                    }].concat(chartData))
                    setChecked(false)
                    // getCurrentList(props, simplePage)
                },
                err: () => {
                    setAddGenericLoading(false)
                }
            })
        }
    }


    const editCurrentGeneric = (item) => {
        const {algorithmGenericId = '', id = '', algorithmParams, isOverwriteForecastParams = false, genericName} = item;
        setChecked(isOverwriteForecastParams)
        seteditNum(algorithmGenericId || id)
        setCurrentParameters(algorithmParams)
        setCurrebtEditId(id)
        setComparisonVisible(true)
        setGenericName(genericName)
    }


    const handleCancelEditAlo = () => {
        setComparisonVisible(false);
        seteditNum('')
        setGenericName(undefined)
        setCurrentParameters(null)
    }
    return (
        <div className={styles['exp-table-wrapper']}>
            <div className='exp-header'>
                <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={handleExpand}>
                    <Icon type={expand ? 'down' : 'right'} className='header-icon-img'/>
                    <span className='exp-title'>{expandTitle}</span>
                </div>
            </div>
            <div style={expand ? {} : {display: 'none'}}>
                <Spin style={{height: '100%', width: '100%'}} spinning={boxLoading}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={record => record.id}
                        scroll={{y: 200}}
                        pagination={{
                            simple: true,
                            total: currentPageInfo.totalSize,
                            current: currentPageInfo.pageNum,
                            pageSize: currentPageInfo.pageSize,
                            onChange: changePage,
                            onShowSizeChange: showSizeChange,
                        }}
                    />
                </Spin>
            </div>
            <Modal
                size='fullScreen'
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    setChartData([])
                }}
                onOk={() => {
                    setVisible(false);
                    setChartData([])
                }}
                footer={null}
                className={styles['labor-modal']}
                title={
                    <div className={styles['labor-modal-pagi']}>
                        <div className={styles['modal-left']}><span>{modelInfo.name}</span>
                            <Pagination
                                simple
                                total={currentPageInfo.totalSize}
                                current={simplePage.pageNum}
                                onChange={simplePagChange}
                                pageSize={1}
                            /></div>
                        {/* <div>最近<InputNumber value={inputValue} onChange={inputChange}></InputNumber>小时</div> */}
                    </div>
                }
            >
                <Spin style={{height: '100%'}} spinning={spinning}>
                    <div className={styles['labor-modal-body']}>
                        <div className={styles['labor-header']}>
                            <div className={styles['labor-header-desc']}>
                                <span className='labor-desc'>
                                    {IntlFormatMessage('laboratory.detail.trainingtime')}:{modelInfo.time}
                                </span>
                                <span>{IntlFormatMessage('laboratory.detail.dimension')}:
                                    <Tooltip placement='topLeft'
                                             title={modelInfo.metricTags}>{modelInfo.metricTags}
                                    </Tooltip>
                                </span>
                            </div>
                            <div>
                                <Group value={selectOption} onChange={onOptionChange} options={options}/>
                                <Button icon='sync' style={{marginRight: 8}} onClick={() => {
                                    getCurrentList(props, simplePage)
                                }}/>
                                <Tooltip
                                    title={`${IntlFormatMessage('laboratory.anomaly.specifyMaximum')} ${privateLimit}${IntlFormatMessage('laboratory.anomaly.specifyMaximumBack')}`}>
                                    <Button
                                        icon='plus' type='primary'
                                        // disabled={chartData.length >= 10 ? true : false}
                                        onClick={() => {
                                            if (chartData.length < privateLimit) {
                                                setComparisonVisible(true)
                                            } else {
                                                error(`${IntlFormatMessage('laboratory.anomaly.genericitiesNum')} ${privateLimit}${IntlFormatMessage('laboratory.anomaly.genericitiesNumBtn')}`)
                                            }
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className={styles['labor-chart']}>
                            {
                                chartData.length === 0 ?
                                    <div className={styles['chart-wrapper']}>
                                        <Empty description={
                                            <span>{IntlFormatMessage('generics.list.table.note.first')}
                                                <span onClick={() => setComparisonVisible(true)}
                                                      style={{
                                                          color: '#1890ff',
                                                          cursor: 'pointer'
                                                      }}>{IntlFormatMessage('laboratory.list.table.note.second')}{'>'}
                                                </span>
                                            </span>
                                        }/>
                                    </div>
                                    : chartData.map(item => {
                                        return <ChartList
                                            key={item.id}
                                            item={item}
                                            lowAndUpValue={lowAndUpValue}
                                            getResult={getResult}
                                            getTrigger={getTrigger}
                                            setCurrentGenericList={setCurrentGenericList}
                                            setSaveGeneVisible={setSaveGeneVisible}
                                            editCurrentGeneric={editCurrentGeneric}
                                            selectOption={selectOption}
                                            showConfirm={showConfirm}
                                            getOriginData={getOriginData}
                                            currentGenericId={currentGenericId}
                                            setSelectOption={setSelectOption}
                                        />
                                    })
                            }

                        </div>
                    </div>
                </Spin>
            </Modal>
            {
                comparisonVisible &&
                <EditAlgorithmAlert
                    title={editNum ? IntlFormatMessage('laboratory.anomaly.editContrastiveG') : IntlFormatMessage('laboratory.anomaly.addContrastiveG')}
                    visible={comparisonVisible}
                    onSave={(value, checked) => addAlgorithmList(value, checked)}
                    onCancel={handleCancelEditAlo}
                    centered={true}
                    isChecked={checked}
                    // bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
                    genericsList={genericityData}
                    setCurrentParameters={setCurrentParameters}
                    currentParameters={currentParameters}
                    genericId={editNum}
                    genericName={genericName}
                    loading={addGenericLoading}
                />
            }
            {
                saveGeneVisible &&
                <SaveGeneric
                    visible={saveGeneVisible}
                    currentGenericList={currentGenericList}
                    deleteCurrentGenericList={() => {
                        setCurrentGenericList({})
                    }}
                    onSave={() => {
                        searchAlgorithmAsync({
                            pageNum: 0,
                            pageSize: 0,
                            query: {
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

export default connect(({laboratoryStore, genericsStore}) => {
    return {
        getSeriesList: laboratoryStore.getSeriesList,
        getSeriesData: laboratoryStore.getSeriesData,
        searchAlgorithmService: laboratoryStore.searchAlgorithmService,
        genericityData: genericsStore.list,
        getGenericSericeList: laboratoryStore.getGenericSericeList,
        addGenericList: laboratoryStore.addGenericList,
        deleteDenericList: laboratoryStore.deleteDenericList,
        modifyGenericList: laboratoryStore.modifyGenericList,
        getResult: laboratoryStore.getResult,
        getTrigger: laboratoryStore.getTrigger,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        getOriginData: laboratoryStore.getOriginData,
        privateLimit: laboratoryStore.privateLimit,
    };
})(Form.create()(ExpandTable));
