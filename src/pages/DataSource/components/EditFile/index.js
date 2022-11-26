import React, {useEffect, useRef, Fragment} from 'react';
import {Tabs, Button, BasicLayout, Form, Card} from '@chaoswise/ui';
import BasicInfo from './BasicInfo';
import LinkInfo from './LinkInfo';
import {useHistory, withRouter} from 'react-router-dom';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {error, success} from "@/utils/tip";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const {TabPane} = Tabs;
const Footer = BasicLayout.Footer;

function SourceDetail(props) {
    const {
        match = {},
        form,
        getDataSourceDetail,
        modifyDataSourceBasic,
        modifyDataSourceData,
        offBasicData,
        offFiledSetData, addList, updateAddList,
    } = props;
    const {params} = match;
    const {id = ''} = params;
    const {push, go, location} = useHistory();

    const [current, setCurrent] = useFetchState('basic');
    const [dataInfo, setDataInfo] = useFetchState({});

    useEffect(() => {
        getDataSource();
    }, [id]);

    //根据id获取信息
    const getDataSource = () => {
        getDataSourceDetail(id, {
            cb: (data) => {
                setDataInfo(data);
            }
        });
    };

    const changeTabs = (key) => {
        setCurrent(key);
    };

    const handleSave = () => {
        //拿到ref基本信息页面的修改后的值
        if (current === 'basic') {
            if (dataInfo.type === 'DODB' || dataInfo.type === 'FILE') {
                form.validateFields((err, values) => {
                    if (!err) {
                        modifyDataSourceBasic(id, {
                            name: values.dataSourceName,
                            description: values.dataSourceDes || null,
                            dataTags: (values.dataSourceTags || []).map(item => {
                                return {
                                    id: item
                                };
                            })
                        }, {
                            cb: () => {
                                success(IntlFormatMessage('datasource.create.modified'));
                                // getDataSource();
                            }
                        });
                    }
                });
            }
        }
        if (current === 'link') {
            form.validateFields((err, values) => {
                const {
                    type, chart = {}, model, metric, target, tags, time, value, fromModel, fromTarget, toModel, toTarget, relationship,
                    originLog, message, grok, host, loglevel, source,
                } = toJS(offFiledSetData);
                if (!err) {
                    modifyDataSourceData(id, {
                        dataType: values.type || null,
                        sourceConfig: {
                            type: offBasicData.type,
                            dataStoreId: chart.value || null,
                        },
                        type: offBasicData.type,
                        fieldConfig: type === 'TIME_SERIES' ?
                            {
                                type,
                                model, metric, target, tags, time, value,
                            } : type === 'LOG' ? {
                                type, time, originLog, message, grok, host, loglevel, source,
                                extendFields: toJS(addList)
                            } : {
                                type, fromModel, fromTarget, toModel, toTarget, relationship,
                            }
                    }, {
                        cb: () => {
                            success(IntlFormatMessage('datasource.create.modified'));
                            // getDataSource();
                        }
                    });
                } else {
                    if (type === 'NODE_RELATION') {
                        error(IntlFormatMessage('laboratory.anomaly.leaseObject'));
                    } else if (type === 'TIME_SERIES') {
                        error(IntlFormatMessage('laboratory.anomaly.metricValueColumns'));
                    } else if (type === 'LOG') {
                        error(`${IntlFormatMessage('laboratory.anomaly.configureOriginalLog')}${(message === 'grok' && !grok) ? `${IntlFormatMessage('laboratory.anomaly.contentColumns')}` : ''}`);
                    }
                }
            });
        }

    };
    return (
        <div style={{height: '100%'}}>
            <Tabs
                style={{height: '100%', overflowY: 'auto'}}
                activeKey={current}
                onChange={changeTabs}
            >
                <TabPane tab={IntlFormatMessage('datasource.detail.basicinformation')}
                         key='basic'>
                    <PaddingDiv>
                        <BasicInfo id={id} form={form} dataInfo={dataInfo} type={dataInfo.type}/>
                    </PaddingDiv>
                </TabPane>
                {
                    (dataInfo.type === 'DODB' || dataInfo.dataType !== 'TIME_SERIES') &&
                    <TabPane tab={IntlFormatMessage('datasource.detail.fieldsettings')} key='link'>
                        <PaddingDiv>
                            <LinkInfo id={id} dataInfo={dataInfo} form={form}/>
                        </PaddingDiv>
                    </TabPane>
                }
            </Tabs>

            <Footer>
                <Button onClick={() => {
                    updateAddList([]);
                    go(-1);
                }} style={{marginRight: 8}}>{
                    IntlFormatMessage('common.explore.setting.modal.cancel')
                }</Button>
                <Button type='primary' onClick={handleSave}>{
                    IntlFormatMessage('common.explore.setting.modal.determine')
                }</Button>
            </Footer>


        </div>
    );
}

const PaddingDiv = (props) => {
    const {children} = props;
    return <div style={{padding: '0 32px'}}>
        {children}
    </div>;
};

export default connect(({store, dataSourceStore}) => {
    return {
        type: dataSourceStore.type,
        getDataSourceDetail: dataSourceStore.getDataSourceDetail,
        modifyDataSourceBasic: dataSourceStore.modifyDataSourceBasic,
        modifyDataSourceData: dataSourceStore.modifyDataSourceData,
        offFiledSetData: dataSourceStore.offFiledSetData,
        offBasicData: dataSourceStore.offBasicData,
        addList: dataSourceStore.addList,
        updateAddList: dataSourceStore.updateAddList,
    };
})(Form.create()(withRouter(SourceDetail)));
