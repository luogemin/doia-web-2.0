import React, {useEffect,} from 'react';
import {
    Icon,
    Input,
    Select,
    CWTable as Table,
    Tooltip,
    Badge,
    Modal,
    Menu,
    Button,
    InputNumber,
    Form
} from '@chaoswise/ui';
import moment from 'moment';
import {omit} from "lodash-es";
import {useHistory, useParams} from "react-router";
import styles from './index.less';
import {formatType,} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import TooltipDiv from "@/components/TooltipDiv";
import dashboardStore from "@/stores/dashboard";
import ViewParamModal from "@/pages/Dashboard/components/DetailList/ViewParamModal.jsx";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage, IsInternationalization} from "@/utils/util";

const {Option} = Select;
const {Group} = Input;
const {confirm} = Modal;

const DetailList = (props) => {
    let {
        form, clearListData, getListAsync, dataStore = [], setCurrentScene, setBackTitle, setCurrentAlgorithm,
    } = props;
    const {push, location} = useHistory();
    const {pathname = ""} = location;
    const {typeId = ''} = useParams();

    const [viewParamVisible, setViewParamVisible] = useFetchState(null); //查看参数

    useEffect(() => {
        setBackTitle(`${(typeId && formatType(typeId)) && IntlFormatMessage(formatType(typeId))} `);
    }, [typeId]);

    /*eslint-disable*/
    const columns = () => {
        return [
            {
                title: IntlFormatMessage('dashboard.list.number'),
                dataIndex: 'index',
                key: 'index',
                width: '12%',
                render: (text, record, index) => {
                    return (index + 1);
                }
            },
            {
                title: IntlFormatMessage('dashboard.list.algorithmname'),
                dataIndex: 'displayNames',
                key: 'displayNames',
                width: IsInternationalization() ? "17%" : "20%",
                render: (text, record) => {
                    if (text) {
                        return <TooltipDiv title={text} onClick={() => {
                            setBackTitle(text);
                            setCurrentAlgorithm(record);
                            push(`${pathname}/detail`);
                        }}>
                            {text}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('dashboard.list.algorithmidentifier'),
                dataIndex: 'name',
                key: 'name',
                width: '23%',
                render: (text, record) => {
                    if (text) {
                        return <TooltipDiv title={text}>
                            {text}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('dashboard.list.version'),
                dataIndex: 'version',
                key: 'version',
                width: IsInternationalization() ? '12%' : '10%',
                sorter: (a, b) => a.version - b.version,
            },
            {
                title: IntlFormatMessage('dashboard.list.status'),
                dataIndex: 'isActive',
                key: 'isActive',
                width: '12%',
                render: (text, record) => {
                    return <div className="status-box">
                        <span className="statusDot">
                            <Badge status={text ? 'success' : ''}/>
                        </span>
                        {text ?
                            IntlFormatMessage('dashboard.list.started') :
                            IntlFormatMessage('dashboard.list.notstarted')
                        }
                    </div>;
                }
            },
            {
                title: IntlFormatMessage('dashboard.list.algorithmgenericity'),
                dataIndex: 'algorithmGenericCount',
                key: 'algorithmGenericCount',
                width: IsInternationalization() ? "23%" : "20%",
                sorter: (a, b) => a.algorithmGenericCount - b.algorithmGenericCount,
                render: (text, record) => {
                    return <TooltipDiv onClick={() => {
                        setCurrentScene({
                            scene: record.scene,
                            algorithm: `${record.name} ${record.version}`,
                            version: record.version,
                        }, () => {
                            push(`/generics`);
                        });
                    }}>
                        {text ? text : 0}
                    </TooltipDiv>;
                }
            },
            {
                title: IntlFormatMessage('common.description'),
                dataIndex: 'descriptions',
                key: 'descriptions',
                width: '15%',
                render: (text, record) => {
                    if (text) {
                        return <TooltipDiv title={text}>
                            {text}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('common.operation'),
                dataIndex: 'operation',
                key: 'operation',
                width: IsInternationalization() ? 150 : 100,
                render: (text, record) => {
                    return (
                        <div>
                            <span className={'nameStyle'} onClick={() => {
                                viewParam(record)
                            }}>{IntlFormatMessage('dashboard.list.viewparameters')}</span>
                        </div>
                    );
                }
            },
        ];
    };
    /*eslint-disable*/

    // 初始化列表数据
    const initData = () => {
        let params = {
            // pageNum: page.pageNum,
            // pageSize: page.pageSize,
            scenes: [typeId],
            includeAlgorithmGenericCount: true
        };
        //获取数据表列表
        getListAsync(params);
    };

    useEffect(() => {
        initData();
        return () => {
            clearListData()
        }
    }, []);

    /**
     * 查看参数
     **/
    const viewParam = (data) => {
        setViewParamVisible(data)
    }

    return (
        <div className={styles['dashboard-detail']}>
            <Table
                columns={columns()}
                dataSource={[].concat(toJS(dataStore))}
                lazyLoading={true}
                rowKey={record => record.id}
                // pagination={{
                //     total: totalCount,
                //     pageSize: pageSize,
                //     current: currentPageNum,
                //     onChange: changePage,
                //     onShowSizeChange: showSizeChange,
                //     showSizeChanger: true,
                //     showTotal: total => `共${total}条`,
                //     showQuickJumper: true,
                // }}
            />
            {
                !!viewParamVisible ?
                    <ViewParamModal
                        title={IntlFormatMessage('dashboard.list.viewparameters')}
                        visible={!!viewParamVisible}
                        showFooter={false}
                        onSave={() => {
                            const {validateFields} = form;
                            validateFields((err, values) => {
                                if (!err) {
                                    console.log(values);
                                } else {
                                    console.log(err)
                                }
                            });
                        }}
                        onCancel={() => setViewParamVisible(null)}
                        dataSource={viewParamVisible}
                        form={form}
                    /> : null
            }
        </div>
    );
};

export default connect(({dashboardStore, store}) => {
    return {
        getListAsync: dashboardStore.getListAsync,
        dataStore: dashboardStore.list,
        page: dashboardStore.page,
        clearListData: dashboardStore.clearListData,
        setCurrentScene: dashboardStore.setCurrentScene,
        setCurrentAlgorithm: dashboardStore.setCurrentAlgorithm,

        setBackTitle: store.setBackTitle,
    };
})(Form.create()(DetailList));
