import React, {Fragment, useEffect,} from 'react';
import {Icon, Input, Tag, CWTable as Table, Tabs, Modal, Tooltip, Button, Empty, Form} from '@chaoswise/ui';
import styles from '../../assets/index.less';
import {formatType,} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {error, success} from "@/utils/tip";
import TooltipDiv from "@/components/TooltipDiv";
import {IntlFormatMessage, IsInternationalization, strlen, unique} from "@/utils/util";
import {useFetchState} from "@/components/HooksState";

const {TabPane} = Tabs;
let timer = null;

const MultiTenancyList = (props) => {
    let {
        form, searchMultiTenancyAsync, deleteMultiTenancyAsync,
        match = {}, history, setBackTitle, pageInfo, setActiveTabsReducer, activeTab,
        dataStoreList = [], setListReducer, setCurrentSearchBar, currentName = null,
    } = props;
    let {path = ""} = match;

    const [searchBarObj, setSearchBarObj] = useFetchState({
        displayName: currentName
    });
    const [selectedRowKeys, setSelectedRowKeys] = useFetchState([]);
    const [page, setPage] = useFetchState({pageNum: 1, pageSize: 10,});
    const [delVisible, setDelVisible] = useFetchState(false);
    const [delInfo, setDelInfo] = useFetchState({});

    const {pageSize = 10, totalSize, totalPages, pageNum = 1} = toJS(pageInfo);

    const searchContent = () => {
        return [
            {
                formAttribute: {initialValue: currentName || undefined},
                components: <Input.Search
                    id='displayName'
                    key='displayName'
                    style={{width: 200}}
                    placeholder={IntlFormatMessage('multitenancy.detail.enterscenarioname')}
                    name='应用场景'
                />,
                showLabel: false,
            },
        ];
    };

    const columns = () => {
        return [
            // {
            //     title: '序号',
            //     dataIndex: 'index',
            //     key: 'index',
            //     width: 100,
            //     render: (text, record, index) => {
            //         return (pageNum - 1) * pageSize + (index + 1);
            //     }
            // },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('multitenancy.detail.name'),
                dataIndex: 'builtinDisplayNames',
                key: 'builtinDisplayNames',
                width: '20%',
                render: (text, record) => {
                    const {name = ''} = record;
                    if (text) {
                        return <TooltipDiv
                            title={text || name}
                            // onClick={() => {
                            //     setBackTitle(text);
                            //     history.push(`${path}/${record.id}`);
                            // }}
                        >
                            {text || name}
                        </TooltipDiv>
                    } else {
                        return <TooltipDiv
                            title={name}
                            // onClick={() => {
                            //     setBackTitle(text);
                            //     history.push(`${path}/${record.id}`);
                            // }}
                        >
                            {name}
                        </TooltipDiv>
                    }

                }
            },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('multitenancy.list.algorithmscenario'),
                dataIndex: 'scene',
                key: 'scene',
                width: '30%',
                render: (text, record, index) => {
                    const {algorithms = [], sceneShowAll = false} = record;
                    const box = document.getElementsByClassName('ant-table-tbody')[0];
                    const widthBox = (box.clientWidth - (Number(toJS(activeTab)) === 1 ? 115 : 70)) * 0.3 - 32;
                    if (algorithms) {
                        const sceneList = unique((algorithms || []).map(item => {
                            const {displaySceneNames, scene} = item;
                            return displaySceneNames || IntlFormatMessage(formatType(item.scene));
                        }));
                        if (sceneList.length) {
                            let length = 0;
                            let itemNum = sceneList.length;
                            try {
                                sceneList.forEach((item, index) => {
                                    const itemLength = strlen(item) * 7.7 + 24;
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
                                    sceneList.slice(0, itemNum).map((item, index) => {
                                        return <Tag key={index} className="algorithm-item">
                                            <Tooltip title={item} placement={'topLeft'}>
                                                {item}
                                            </Tooltip>
                                        </Tag>;
                                    })
                                }
                                {
                                    sceneList.length > itemNum ?
                                        <Tag className="algorithm-item" style={{
                                            width: 'auto'
                                        }}>
                                            <Tooltip title={<div className="algorithm-box">
                                                {
                                                    sceneList.slice(itemNum).map((item, index) => {
                                                        return <Tag key={index} style={{
                                                            margin: '0 8px 8px 0',
                                                            padding: '0 8px'
                                                        }}>
                                                            {item}
                                                        </Tag>;
                                                    })
                                                }
                                            </div>}>
                                                +{(sceneList.length - itemNum)}
                                            </Tooltip>
                                        </Tag>
                                        : null
                                }
                            </div>);
                        } else {
                            return '-';
                        }
                    } else {
                        return '-';
                    }
                }
            },
            {
                title: IntlFormatMessage('multitenancy.list.algorithmname'),
                dataIndex: 'algorithm',
                key: 'algorithm',
                width: '30%',
                ellipsis: true,
                render: (text, record, index) => {
                    const {algorithms = [],} = record;
                    const box = document.getElementsByClassName('ant-table-tbody')[0];
                    const widthBox = (box.clientWidth - (Number(toJS(activeTab)) === 1 ? 115 : 70)) * 0.3 - 32;
                    if (algorithms.length) {
                        let length = 0;
                        let itemNum = algorithms.length;
                        try {
                            algorithms.forEach((item, index) => {
                                const itemLength = strlen(item.displayAlgorithmNames || '') * 7.7 + 24;
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
                                algorithms.slice(0, itemNum).map((item, index) => {
                                    return <Tag key={index} className="algorithm-item">
                                        <Tooltip title={item.displayAlgorithmNames || ''}
                                                 placement={'topLeft'}>
                                            {item.displayAlgorithmNames || ''}
                                        </Tooltip>
                                    </Tag>;
                                })
                            }
                            {
                                algorithms.length > itemNum ?
                                    <Tag className="algorithm-item" style={{
                                        width: 'auto'
                                    }}>
                                        <Tooltip title={<div className="algorithm-box">
                                            {
                                                algorithms.slice(itemNum).map((item, index) => {
                                                    return <Tag key={index} style={{
                                                        margin: '0 8px 8px 0',
                                                        padding: '0 8px'
                                                    }}>
                                                        {item.displayAlgorithmNames || ''}
                                                    </Tag>;
                                                })
                                            }
                                        </div>}>
                                            +{(algorithms.length - itemNum)}
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
                width: '20%',
                render: (text, record) => {
                    if (text) {
                        return <TooltipDiv title={text}>
                            {text}
                        </TooltipDiv>;
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
                width: Number(toJS(activeTab)) === 1 ? (IsInternationalization() ? 123 : 115) : (IsInternationalization() ? 107 : 70),
                // fixed: 'right',
                render: (text, record) => {
                    return (
                        <div>

                            <span className={'nameStyle'}
                                  onClick={() => {
                                setBackTitle(record.name);
                              {
                                  Number(toJS(activeTab)) === 0 ? history.push(`${path}/edit/${record.id}`):history.push(`${path}/create/${record.id}`)
                              }

                            }}>{IntlFormatMessage('common.edit')}</span>
                            {
                                Number(toJS(activeTab)) === 1 ?
                                    <Fragment>
                                        <span className={"operation_line"}>|</span>
                                        <span className={'nameStyle'} onClick={() => {
                                            deleteGenerics(record)
                                        }}>{IntlFormatMessage('common.delete')}</span>
                                    </Fragment>
                                    : null
                            }
                        </div>
                    );
                }
            },
            /*eslint-disable*/
        ];
    };

    // 初始化列表数据
    const initData = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            let newSearchBarObj = Object.assign({}, searchBarObj);
            let params = {
                pageNum: page.pageNum,
                pageSize: page.pageSize,
                query: Object.assign({}, newSearchBarObj, {
                    displayName: !!newSearchBarObj.displayName ? newSearchBarObj.displayName : null,
                    // isIncludeAlgorithm: true,
                    isBuiltin: toJS(activeTab) !== '1',
                })
            }
            //获取数据表列表
            searchMultiTenancyAsync(params);
        })
    };

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
        setCurrentSearchBar(newObj)
    };

    const onReset = (value) => {
        setSearchBarObj({
            name: ''
        })
    }

    useEffect(() => {
        initData();

        return () => {
            setCurrentSearchBar({})
        }
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

    /**
     * 删除
     */
    const deleteGenerics = (data) => {
        setDelInfo(data)
        setDelVisible(true)
        // const {id, name} = data;
        // confirm({
        //     title: "删除提示",
        //     content: <div>确定删除<b style={{color: '#008DFF'}}> {name} </b>?<br/>
        //         删除后相应的关联任务也会被删除。</div>,
        //     onOk: () => {
        //         deleteMultiTenancyAsync({id}, (res) => {
        //             success("场景删除成功！");
        //             //重新加载数据
        //             onSearch({pageSize: 10, pageNum: 1});
        //         });
        //     }
        // });
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(prev => selectedRows.map(item => item.id))
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    return (
        <div className={styles['multi-tenancy']}>
            <div style={{height: 'calc(100% - 1px)'}}>
                <Tabs defaultActiveKey={toJS(activeTab)} onChange={(key) => {
                    setActiveTabsReducer(key)
                    setPage({pageNum: 1, pageSize: 10,})
                }}>
                    <TabPane tab={IntlFormatMessage('multitenancy.list.builtin')} key="0"/>
                    <TabPane tab={IntlFormatMessage('multitenancy.list.custom')} key="1"/>
                </Tabs>
                <div className={"data-store_right"}>
                    <Table
                        // rowSelection={rowSelection}
                        columns={columns()}
                        dataSource={[].concat(toJS(dataStoreList))}
                        lazyLoading={true}
                        rowKey={record => record.id}
                        // scroll={{x: 1050}}
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
                                        {IntlFormatMessage('multitenancy.list.table.note.first')}
                                        <span style={{color: '#008DFF', cursor: 'pointer'}}
                                              onClick={() => {
                                                  setActiveTabsReducer('1');
                                                  history.push(`${path}/create`)
                                              }}>{IntlFormatMessage('multitenancy.list.table.note.second')}{'>'}
                                        </span>
                                    </span>}/>

                        }}
                        searchBar={{
                            onSearch: onSearch,
                            // onChange: onChange,
                            onReset: onReset,
                            showSearchCount: 2,
                            showExtraCount: 2,
                            showAdvancedSearch: true,
                            extra: toJS(activeTab) === '1' ? [
                                <Button key={'add'} type='primary' onClick={() => {
                                    history.push(`${path}/create`)
                                }}>{IntlFormatMessage('multitenancy.detail.create')}</Button>,
                                /*<Button key={'start'} type='default' disabled={!selectedRowKeys.length} onClick={() => {
                                console.log(selectedRowKeys)
                                }}>批量删除</Button>*/
                            ] : [],
                            searchContent: searchContent()
                        }}
                    />
                </div>
            </div>

            {
                delVisible &&
                <Modal
                    title={IntlFormatMessage('common.note')}
                    visible={delVisible}
                    onCancel={() => {
                        setDelVisible(false)
                    }}
                    onOk={() => {
                        const {id} = delInfo
                        deleteMultiTenancyAsync({id}, (res) => {
                            success(IntlFormatMessage('laboratory.anomaly.scenarioDeleted'));
                            //重新加载数据
                            onSearch({pageSize: 10, pageNum: 1});
                            setDelVisible(false)
                        });
                    }}
                >
                    {IntlFormatMessage('multitenancy.list.delete.note.first')}
                    <span style={{color: '#1890FF'}}>{delInfo.name || ''}</span>?
                    {IntlFormatMessage('laboratory.anomaly.genericityIsDeleted')}
                </Modal>
            }

        </div>
    );
};

export default connect(({multiTenancyStore, store}) => {
    return {
        setBackTitle: store.setBackTitle,
        searchMultiTenancyAsync: multiTenancyStore.searchMultiTenancyAsync,
        deleteMultiTenancyAsync: multiTenancyStore.deleteMultiTenancyAsync,
        dataStoreList: multiTenancyStore.list,
        pageInfo: multiTenancyStore.pageInfo,
        setActiveTabsReducer: multiTenancyStore.setActiveTabsReducer,
        activeTab: multiTenancyStore.activeTab,
        setListReducer: multiTenancyStore.setListReducer,
        setCurrentSearchBar: multiTenancyStore.setCurrentSearchBar,
        currentName: multiTenancyStore.currentName,
    };
})(Form.create()(MultiTenancyList));
