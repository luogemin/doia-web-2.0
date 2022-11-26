import React, {Fragment, useEffect,} from 'react';
import {
    Select,
    Modal,
    Form,
    Pagination,
    Button,
    Empty,
    Tooltip,
    Checkbox,
    Input,
    Spin
} from '@chaoswise/ui';
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from 'react-router-dom';
import {error, success, info, warning} from "@/utils/tip";
import styles from './index.less';
import moment from 'moment';
import * as echarts from 'echarts';
import ChartList from './ChartList';
import {useFetchState} from "@/components/HooksState";
import {ClearSomLocalStorage, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";

const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};
const {confirm} = Modal;
const {Option} = Select;
const {Search} = Input;
const {Group} = Checkbox;
const options = [
    {label: IntlFormatMessage('laboratory.detail.synchronize'), value: 'link'},
    {label: IntlFormatMessage('laboratory.detail.showparameter'), value: 'parameter'},
];
let timer = {
    getGroupMetriclistAsync: null,
    searchValue: null,
};

function RootTaskModelForClick(props) {

    const {
        rootCauseGenericDataAsync,
        seriesCreated,
        targetModel,
        metricKey,
        form,
        genericityData,
        getGenericSericeList,
        getResult,
        getTrigger,
        getOriginData,
        getGroupMetriclistAsync,
        groupMetricDetaillist,
        selectedNode, modifyGenericList,
        setSelectedNode, rootCauseCalculatAsync, searchAlgorithmAsync,
        getRootAlgorithmDetailAsync,
        ...rest
    } = props;
    const fromModel = JSON.parse(toJS(selectedNode[0]).id).model;
    const fromTarget = JSON.parse(toJS(selectedNode[0]).id).target;
    const fromModelAndTargetJson = toJS(selectedNode[0]).id;
    const {id} = useParams();

    const [visible, setVisible] = useFetchState(false);
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 10,
        totalSize: 0,
        searchValue: null,
    });
    const [spinning, setSpinning] = useFetchState(false);
    const [selectOption, setSelectOption] = useFetchState(['link']);
    const [chartDataList, setChartDataList] = useFetchState([]);

    useEffect(() => {
        searchAlgorithmAsync({
            pageNum: 1,
            pageSize: 500,
            query: {
                taskId: id,
                scene: 'anomaly_detection',
                isIncludeAlgorithm: true,
            }
        });

        return () => {
            //泛型选择接口algorithmGeneric
            getRootAlgorithmDetailAsync({
                pageNum: 1,
                pageSize: 500,
                query: {
                    taskId: id,
                    scene: 'root_cause_analysis',
                    isIncludeAlgorithm: true,
                }
            });
        }
    }, [])

    const getGroupMetricFun = (page = {}) => {
        ClearSomLocalStorage();
        !spinning && setSpinning(true)
        // 根据模型对象，拉取指标维度
        const params = {
            pageNum: page.pageNum || 1,
            pageSize: page.pageSize || 10,
            query: {
                taskId: id,
                entryNodeJson: fromModelAndTargetJson,
                searchValue: page.searchValue || null
            }
        }
        clearTimeout(timer.getGroupMetriclistAsync);
        timer.getGroupMetriclistAsync = setTimeout(() => {
            getGroupMetriclistAsync(params, (res) => {
                const {content = [], pageNum = 1, pageSize = 1, totalPages = 0, totalSize = 0} = res;
                setPageInfo(prev => {
                    return Object.assign({}, prev, {
                        pageNum, pageSize, totalSize
                    })
                })
                if (content.length) {
                    const modelList = content.map(item => {
                        return {
                            model: fromModel,
                            target: fromTarget,
                            ...item
                        }
                    });
                    rootCauseGenericDataAsync({
                        taskId: id,
                        isExecAll: false,
                        rawDataList: modelList,
                    }, {
                        cb: (res = []) => {
                            setChartDataList(prev => res.map((rowData, index) => {
                                const {tuningBenchResult = {}, tuningBenchGeneric = {}} = rowData;
                                return Object.assign({}, {
                                    tuningBenchResult,
                                    tuningBenchGeneric,
                                    rawData: {
                                        ...modelList[index]
                                    },
                                    fromModelAndTargetJson,
                                    ...modelList[index],
                                })
                            }));
                            setSpinning(false);
                        },
                        err: () => {
                            setChartDataList([]);
                            setSpinning(false);
                        }
                    });
                } else {
                    setChartDataList([]);
                    setSpinning(false);
                }
            })
        }, 500)
    }

    useEffect(() => {
        !visible && setVisible(true)
        getGroupMetricFun()
    }, [selectedNode])

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

    //联动和显示参数变化
    const onOptionChange = (value) => {
        setSelectOption(value)
    }

    const handleCancelEditAlo = () => {
        setSpinning(false);
    };

    const onCancel = () => {
        setSelectedNode([]);
        setVisible(false);
    }


    return (
        <Fragment>
            <Modal
                size='fullScreen'
                visible={visible}
                className={styles['root-modal-wrapper']}
                onCancel={() => onCancel()}
                footer={null}
                title={
                    <div className='labor-modal-pagi'>
                        <div className='modal-left'>
                            <span>{`${IntlFormatMessage('laboratory.detail.model')}
                            :${fromModel} - ${IntlFormatMessage('laboratory.detail.object')}:${fromTarget}`}</span>
                        </div>
                    </div>
                }
            >
                <Spin style={{height: '100%'}} spinning={spinning}>
                    <div className={'labor-modal-body'}>
                        <div className={'labor-header'}>
                            <span>{`${IntlFormatMessage('laboratory.detail.model')}
                            :${fromModel} - ${IntlFormatMessage('laboratory.detail.object')}:${fromTarget}`}</span>
                            <div>
                                <Group value={selectOption} onChange={onOptionChange} options={options}/>
                                <Tooltip title={IntlFormatMessage('laboratory.detail.resetBtn')}>
                                    <Button
                                        icon="sync"
                                        onClick={() => {
                                            getGroupMetricFun()
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="labor-body-scroll">
                            {
                                (!!chartDataList && !!chartDataList.length) ? chartDataList.map((item, index) => {
                                        return <div className={'labor-chart'} key={index}>
                                            <ChartList
                                                taskId={id}
                                                item={item}
                                                index={index}
                                                getResult={getResult}
                                                getTrigger={getTrigger}
                                                selectOption={selectOption}
                                                getOriginData={getOriginData}
                                                setSelectOption={setSelectOption}
                                                selectedNode={selectedNode}
                                                onCancel={onCancel}
                                                {...rest}
                                            />
                                        </div>
                                    })
                                    :
                                    <div className={'chart-wrapper'}>
                                        <Empty description={
                                            <span>{IntlFormatMessage('laboratory.detail.nodatafound')}</span>
                                        }/>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Pagination
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10', '20']}
                            total={pageInfo.totalSize}
                            current={pageInfo.pageNum}
                            pageSize={pageInfo.pageSize}
                            onChange={(current) => {
                                const page = Object.assign({}, pageInfo, {
                                    pageNum: current
                                });
                                setPageInfo(page)
                                getGroupMetricFun(page)
                            }}
                            onShowSizeChange={(current, pageSize) => {
                                const page = Object.assign({}, pageInfo, {
                                    pageNum: current,
                                    pageSize
                                });
                                setPageInfo(page)
                                getGroupMetricFun(page)
                            }}
                        />
                    </div>
                </Spin>
            </Modal>
        </Fragment>
    );
}

export default connect(({laboratoryStore, genericsStore, TopoStore,}) => {
    return {
        selectedNode: TopoStore.selectedNode,
        setSelectedNode: TopoStore.setSelectedNode,

        rootCauseGenericDataAsync: laboratoryStore.rootCauseGenericDataAsync,
        rootCauseCalculatAsync: laboratoryStore.rootCauseCalculatAsync,

        searchAlgorithmService: laboratoryStore.searchAlgorithmService,
        genericityData: genericsStore.list,
        getGenericSericeList: laboratoryStore.getGenericSericeList,
        addGenericList: laboratoryStore.addGenericList,
        deleteDenericList: laboratoryStore.deleteDenericList,
        modifyGenericList: laboratoryStore.modifyGenericList,
        getResult: laboratoryStore.getResult,
        getTrigger: laboratoryStore.getTrigger,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        getRootAlgorithmDetailAsync: genericsStore.getRootAlgorithmDetailAsync,
        getOriginData: laboratoryStore.getOriginData,
        getGenericsNumAsync: laboratoryStore.getGenericsNumAsync,
        getGroupMetriclistAsync: laboratoryStore.getGroupMetriclistAsync,
        groupMetricDetaillist: laboratoryStore.groupMetricDetaillist,
    };
})(Form.create()(RootTaskModelForClick));
