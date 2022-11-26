import React, {Fragment, useEffect,} from 'react';
import {Empty, Input, Select, CWTable as Table, Tabs, Modal, Tooltip, Button, Badge, Form} from '@chaoswise/ui';
import moment from 'moment';
import {omit} from "lodash-es";
import styles from '../../assets/index.less';
import {
    dataStoreType,
    dataLaboratoryType,
    formatType,
    genericsPicList,
    isInPortal,
    isInPortalURL
} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {error, success} from "@/utils/tip";
import CreateTypeModal from '@/components/CreateTypeModal';
import TooltipDiv from "@/components/TooltipDiv";
import BasicTable from '@/components/BasicTable';
import PublishGenericsModal from "@/pages/AlgorithmicGenerics/components/common/PublishGenericsModal.jsx";
import RcViewer from "@hanyk/rc-viewer";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage, IsInternationalization} from "@/utils/util";
import {logGetProgressService} from "@/services/Laboratory";

const {Option} = Select;
const {Group} = Input;
const {confirm} = Modal;
const {TabPane} = Tabs;
let timer = null;
let algorithmTimer = null;

const GenericsList = (props) => {
    let {
        form, getListAsync, searchAlgorithmAsync, deleteAlgorithmAsync, publishAlgorithmAsync,
        match = {}, history, setBackTitle, pageInfo, setActiveTabsReducer, activeTab, algorithmList = [],
        dataStoreList = [], currentScene = null, currentAlgorithm = null, currentAlgorithmVersion = null,
        currentDisplayName = null, setCurrentScene,
        getGroupBySceneAsync, dashboard = [],
    } = props;
    console.log(currentDisplayName);
    let {path = ""} = match;
    const [searchBarObj, setSearchBarObj] = useFetchState({
        scene: currentScene,
        algorithm: currentAlgorithm,
        version: currentAlgorithmVersion,
        displayName: currentDisplayName
    });
    const [createModalVisible, setCreateModalVisible] = useFetchState(false);
    const [publishGenericsVisible, setPublishGenericsVisible] = useFetchState(null); //发布
    const [page, setPage] = useFetchState({pageNum: 1, pageSize: 10,});
    const [delGeneric, setDelGeneric] = useFetchState({});
    const [delVisible, setDelVisible] = useFetchState(false);

    const {pageSize = 10, totalSize, totalPages, pageNum = 1} = toJS(pageInfo);

    useEffect(() => {
        if (!window.DOIA_CONFIG.dataSceneTypeList.length) {
            getGroupBySceneAsync();
        }
    }, [window.DOIA_CONFIG.dataSceneTypeList]);

    useEffect(() => {
        return () => {
            // setCurrentScene({
            // scene: null,
            // algorithm: null,
            // });
        };
    }, []);
    /*eslint-disable*/
    const searchContent = () => {
        return [
            {
                formAttribute: {initialValue: currentScene || undefined},
                components: (forms) => {
                    const {setFieldsValue} = forms;
                    return <Select
                        allowClear
                        id='scene'
                        key='scene'
                        style={{width: 200}}
                        placeholder={IntlFormatMessage('generics.list.searchbar.scene')}
                        name='算法类型'
                        onChange={(value) => {
                            initAlgorithmList(value);
                            setSearchBarObj(prev => {
                                return Object.assign({}, prev, {
                                    version: null,
                                })
                            });
                            setFieldsValue({
                                algorithm: undefined,
                            });
                        }}
                    >
                        {
                            (window.DOIA_CONFIG.dataSceneTypeList.length ? window.DOIA_CONFIG.dataSceneTypeList :
                                ((dashboard && dashboard.length) ? toJS(dashboard) : []))
                                .map((item, index) => {
                                    return (
                                        <Option key={item.type} value={item.type}>{item.title}</Option>
                                    );
                                })
                        }
                    </Select>;
                },
                showLabel: false,
            },
            {
                formAttribute: {
                    initialValue: (!!toJS(algorithmList) && toJS(algorithmList).length && !!currentAlgorithm) ? currentAlgorithm : undefined
                },
                components: (value) => {
                    return <Select
                        allowClear
                        id='algorithm'
                        key='algorithm'
                        style={{width: 200}}
                        placeholder={IntlFormatMessage('generics.list.searchbar.algorithmname')}
                        name='算法名称'
                        onChange={(value, option) => {
                            if (!!value) {
                                const {version, name} = option.props;
                                setSearchBarObj(prev => Object.assign({}, prev, {
                                    version: version,
                                }))
                            } else {
                                setSearchBarObj(prev => Object.assign({}, prev, {
                                    version: null,
                                }))
                            }
                        }}
                    >
                        {
                            toJS(algorithmList).map((item, index) => {
                                const {displayNames, version = '', name} = item;
                                return (
                                    <Option
                                        key={item.id}
                                        value={`${name} ${version}`}
                                        version={version}
                                        name={name}
                                    >
                                        <Tooltip
                                            title={`${displayNames} ${version}`}>{`${displayNames} ${version}`}</Tooltip>
                                    </Option>
                                );
                            })
                        }
                    </Select>;
                },
                showLabel: false,
            },
            {
                formAttribute: {initialValue: currentDisplayName || undefined},
                components: (value) => {
                    return <Input.Search
                        id='displayName'
                        key='displayName'
                        style={{width: 200}}
                        placeholder={IntlFormatMessage('generics.list.searchbar.genericsname')}
                        name='应用场景'
                    />
                },
                showLabel: false,
            },
        ];
    };
    /*eslint-disable*/
    const columns = () => {
        return [
            {
                title: IntlFormatMessage('generics.list.name'),
                dataIndex: 'name',
                key: 'name',
                width: IsInternationalization() ? '15%' : '25%',
                render: (text, record) => {
                    const {builtinDisplayNames, name = ''} = record

                    return <TooltipDiv
                        title={builtinDisplayNames || name}
                        onClick={() => {
                            setBackTitle(builtinDisplayNames || name);
                            history.push(`${path}/${record.id}`);
                        }}
                    >
                        {builtinDisplayNames || name}
                    </TooltipDiv>;

                }
            },
            {
                title: IntlFormatMessage('generics.list.algorithmscenario'),
                dataIndex: 'scene',
                key: 'scene',
                width: IsInternationalization() ? '20%' : '15%',
                render: (text, record) => {
                    return IntlFormatMessage(formatType(text));
                }
            },
            {
                title: IntlFormatMessage('generics.list.algorithmname'),
                dataIndex: 'nameZh',
                key: 'nameZh',
                width: '20%',
                render: (text, record) => {
                    const {algorithm = {}} = record;
                    const {displayNames} = algorithm;
                    if (displayNames) {
                        return <TooltipDiv title={displayNames || ''}>
                            {displayNames || ''}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('generics.list.algorithmidentifier'),
                dataIndex: 'tags',
                key: 'tags',
                width: '20%',
                render: (text, record) => {
                    const {algorithm = {}} = record;
                    const {name} = algorithm;
                    return name;
                }
            },
            {
                title: IntlFormatMessage('generics.list.version'),
                dataIndex: 'algorithmVersion',
                key: 'algorithmVersion',
                width: IsInternationalization() ? '11%' : '10%',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.algorithmVersion - b.algorithmVersion,
            },
            {
                title: IntlFormatMessage('generics.list.status'),
                dataIndex: 'state',
                key: 'state',
                width: IsInternationalization() ? '14%' : '10%',
                render: (text, record) => {
                    return <div className="status-box">
                        <span className="statusDot">
                            <Badge status={text ? 'success' : 'default'}/>
                        </span>
                        {
                            text ?
                                IntlFormatMessage('generics.list.status.published') :
                                IntlFormatMessage('generics.list.status.unpublished')
                        }
                    </div>;
                }
            },
        ];
    };

    const defaultColumns = () => {
        return columns().concat(
            /*eslint-disable*/
            {
                title: IntlFormatMessage('generics.list.sketch'),
                dataIndex: 'operation',
                key: 'operation',
                width: 115,
                // fixed: 'right',
                render: (text, record) => {
                    const {name} = record;
                    if (genericsPicList[name]) {
                        return (
                            <RcViewer
                                ref="viewer"
                                className="preview-img-box"
                                options={{
                                    toolbar: {
                                        zoomIn: 4,
                                        zoomOut: 4,
                                        oneToOne: 4,
                                        reset: 4,
                                        // prev:this.prevFun,
                                        // next:this.nextFun,
                                        rotateLeft: 4,
                                        rotateRight: 4,
                                    },
                                }}
                            >
                                <img className="preview-img"
                                     src={genericsPicList[name]?.img[localStorage.getItem('language')]}/>
                            </RcViewer>
                        )
                    } else {
                        return IntlFormatMessage('laboratory.anomaly.null');
                    }
                }
            },
            /*eslint-disable*/
        )
    }

    const customColumns = () => {
        return columns().concat(
            /*eslint-disable*/
            {
                title: IntlFormatMessage('common.operation'),
                dataIndex: 'operation',
                key: 'operation',
                width: IsInternationalization() ? 145 : 115,
                // fixed: 'right',
                render: (text, record) => {
                    return (
                        <div>
                            <span className={record.state ? 'greyColorStyle' : 'nameStyle'} onClick={() => {
                                if (!record.state) {
                                    publishGenerics(record)
                                }
                            }}>{IntlFormatMessage('common.publish')}</span>
                            <span className={"operation_line"}>|</span>
                            <span className={'nameStyle'} onClick={() => {
                                setDelGeneric(record)
                                deleteGenerics(record)
                            }}>{IntlFormatMessage('common.delete')}</span>
                        </div>
                    );
                }
            },
            /*eslint-disable*/
        )
    }

    useEffect(() => {
        initAlgorithmList(searchBarObj.scene)
    }, [searchBarObj.scene]);

    const initAlgorithmList = (scene) => {
        clearTimeout(algorithmTimer)
        algorithmTimer = setTimeout(() => {
            getListAsync({
                scenes: (!scene || scene == 'null') ? null : [scene],
                includeAlgorithmGenericCount: true
            });
        }, 500)
    }
    // 初始化列表数据
    const initData = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            let newSearchBarObj = Object.assign({}, searchBarObj);
            if (searchBarObj.algorithm) {
                const result = searchBarObj.algorithm.split(' ');
                newSearchBarObj = Object.assign({}, searchBarObj, {
                    algorithm: result.slice(0, result.length - 1).join(' '),
                });
            }

            let params = {
                pageNum: page.pageNum,
                pageSize: page.pageSize,
                query: Object.assign({}, newSearchBarObj, {
                    displayName: !!newSearchBarObj.displayName ? newSearchBarObj.displayName : null,
                    isIncludeAlgorithm: true,
                    isBuiltin: !(Number(toJS(activeTab)) === 0),
                    type: Number(toJS(activeTab)),
                })
            }
            //获取数据表列表
            searchAlgorithmAsync(params);
        }, 300)
    };

    const onSearch = (value) => {
        setCurrentScene(value)
        const newObj = Object.keys(value).reduce((obj, key) => {
            if (!!value[key]) {
                obj[`${key}`] = value[key];
            } else {
                obj[`${key}`] = null;
            }
            return obj;
        }, {});
        setSearchBarObj(prev => Object.assign({}, prev, newObj));
        setPage({pageNum: 1, pageSize: 10,})
    };

    const onReset = (value) => {
        setCurrentScene({})
        setSearchBarObj({
            scene: null,
            algorithm: null,
            displayName: null,
            // version:null,
        })
        setPage({pageNum: 1, pageSize: 10,})
    }

    useEffect(() => {
        initData();
    }, [page, searchBarObj]);

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
    const redirectToCreate = () => {
        setCreateModalVisible(true);
    };

    /**
     * 发布
     **/
    const publishGenerics = (data) => {
        setPublishGenericsVisible(data)
    }

    /**
     * 删除
     */
    const deleteGenerics = (data) => {
        setDelVisible(true)
        // const {id, name} = data;
        // confirm({
        //     title: "删除提示",
        //     content: <div>确定删除<b style={{color: '#008DFF'}}> {name} </b>泛型吗?删除后任务不会停止，新建任务时将无法选择该泛型。</div>,
        //     onOk: () => {
        //         deleteAlgorithmAsync({id}, (res) => {
        //             success("算法泛型删除成功！");
        //             //重新加载数据
        //             onSearch({pageSize: 10, pageNum: 1});
        //         });
        //     }
        // });
    }

    return (
        <div className={styles['data-store']}>
            <div style={{height: 'calc(100% - 1px)'}}>
                <Tabs defaultActiveKey={toJS(activeTab) + ''} onChange={(key) => {
                    setActiveTabsReducer(key)
                    setPage({pageNum: 1, pageSize: 10,})
                }}>
                    <TabPane tab={IntlFormatMessage('generics.list.tabs.default')} key={1}/>
                    <TabPane tab={IntlFormatMessage('generics.list.tabs.recommended')} key={2}/>
                    <TabPane tab={IntlFormatMessage('generics.list.tabs.custom')} key={0}/>
                </Tabs>
                <div className={"data-store_right"}>
                    <Table
                        columns={Number(toJS(activeTab)) === 0 ? customColumns() : defaultColumns()}
                        dataSource={[].concat(toJS(dataStoreList))}
                        lazyLoading={true}
                        rowKey={record => record.id}
                        // scroll={{x: 930}}
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
                                        {IntlFormatMessage('generics.list.table.note.first')}
                                        <span style={{color: '#008DFF', cursor: 'pointer'}}
                                              onClick={redirectToCreate}> {IntlFormatMessage('generics.list.table.note.second')}{'>'}</span>
                                        </span>
                                    }/>

                        }}
                        searchBar={{
                            onSearch: onSearch,
                            // onChange: onChange,
                            onReset: onReset,
                            showSearchCount: 3,
                            showExtraCount: 2,
                            showAdvancedSearch: true,
                            extra: Number(toJS(activeTab)) === 0 ? [
                                <Button key={'add'} type='primary'
                                        onClick={redirectToCreate}>
                                    {IntlFormatMessage('generics.list.create')}
                                </Button>
                            ] : [],
                            searchContent: searchContent()
                        }}
                    />
                </div>
            </div>

            {/*新建数据弹框*/}
            <CreateTypeModal
                title={IntlFormatMessage('generics.list.createTwo')}
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                footer={null}
                centered={true}
                {...props}
                dataSource={dataLaboratoryType}
            />

            {/*发布泛型弹框*/}
            {
                !!publishGenericsVisible ?
                    <PublishGenericsModal
                        title={IntlFormatMessage('common.note')}
                        visible={!!publishGenericsVisible}
                        onSave={() => {
                            publishAlgorithmAsync(publishGenericsVisible.id, (res) => {
                                success(IntlFormatMessage('laboratory.anomaly.genericityPublished'))
                                setPublishGenericsVisible(null)
                                initData()
                            })
                        }}
                        onCancel={() => setPublishGenericsVisible(null)}
                        dataSource={publishGenericsVisible}
                    /> : null
            }

            {
                delVisible &&
                <Modal
                    title={IntlFormatMessage('common.note')}
                    visible={delVisible}
                    onCancel={() => setDelVisible(false)}
                    onOk={() => {
                        const {id} = delGeneric;
                        deleteAlgorithmAsync({id}, (res) => {
                            setDelVisible(false)
                            success(IntlFormatMessage('laboratory.anomaly.genericityDeleted'));
                            //重新加载数据
                            onSearch({pageSize: 10, pageNum: 1});
                        });
                    }}
                >
                    {
                        <div>
                            {IntlFormatMessage('generics.list.delete.note.first')}
                            <span style={{color: '#1890FF'}}>{delGeneric.name || ''} </span>
                            {IntlFormatMessage('generics.list.delete.note.second')}
                        </div>
                    }
                </Modal>
            }
        </div>
    );
};

export default connect(({genericsStore, dashboardStore, store}) => {
    return {
        setBackTitle: store.setBackTitle,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        publishAlgorithmAsync: genericsStore.publishAlgorithmAsync,
        deleteAlgorithmAsync: genericsStore.deleteAlgorithmAsync,
        dataStoreList: genericsStore.list,
        pageInfo: genericsStore.pageInfo,
        setActiveTabsReducer: genericsStore.setActiveTabsReducer,
        activeTab: genericsStore.activeTab,

        getListAsync: dashboardStore.getListAsync,
        algorithmList: dashboardStore.list,
        setCurrentScene: dashboardStore.setCurrentScene,
        currentScene: dashboardStore.currentScene,
        currentAlgorithm: dashboardStore.currentAlgorithm,
        currentAlgorithmVersion: dashboardStore.currentAlgorithmVersion,
        currentDisplayName: dashboardStore.currentDisplayName,
        dashboard: dashboardStore.dashboard,
        getGroupBySceneAsync: dashboardStore.getGroupBySceneAsync,
    };
})(Form.create()(GenericsList));
