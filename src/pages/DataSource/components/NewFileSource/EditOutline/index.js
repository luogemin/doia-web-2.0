import React, {useEffect, useRef, Fragment} from 'react';
import {Tabs, Button, BasicLayout, Form, Card} from '@chaoswise/ui';
import BasicInfo from './BasicInfo';
import LinkInfo from './LinkInfo';
import {useHistory, withRouter} from 'react-router-dom';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {success} from "@/utils/tip";
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
        offFiledSetData, addList,
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
                            getDataSource();
                        }
                    });
                }
            });
        }
        if (current === 'link') {
            form.validateFields((err, values) => {
                if (!err) {
                    const {
                        type = 'TIME_SERIES', chart = {}, model, metric, target, tags, time, value,
                        fromModel, fromTarget, toModel, toTarget, relationship,
                        originLog, message, grok, host, loglevel, source, pattern, patternId,
                    } = offFiledSetData;
                    modifyDataSourceData(id, {
                        dataType: values.type || null,
                        sourceConfig: {
                            type: offBasicData.type,
                            dataStoreId: chart.value || null,
                        },
                        type: offBasicData.type,
                        fieldConfigDisplay: type === 'TIME_SERIES' ?
                            {
                                type,
                                model, metric, target, tags, time, value,
                            } : type === 'LOG' ? {
                                type, time, originLog, message, grok, host, loglevel, source,
                                pattern, patternId,
                                extendFields: toJS(addList)
                            } : {
                                type, fromModel, fromTarget, toModel, toTarget, relationship,
                            }
                    }, {
                        cb: () => {
                            success(IntlFormatMessage('datasource.create.modified'));
                            getDataSource();
                        }
                    });
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
                <TabPane tab={IntlFormatMessage('datasource.detail.fieldsettings')} key='link'>
                    <PaddingDiv>
                        <LinkInfo id={id} dataInfo={dataInfo} form={form}/>
                    </PaddingDiv>
                </TabPane>
            </Tabs>
            {
                current === 'basic' ?
                    <Footer>
                        <Button onClick={() => go(-1)} style={{marginRight: 8}}>{
                            IntlFormatMessage('common.explore.setting.modal.cancel')
                        }</Button>
                        <Button type='primary' onClick={handleSave}>{
                            IntlFormatMessage('common.explore.setting.modal.determine')
                        }</Button>
                    </Footer>
                    : null
            }
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
    };
})(Form.create()(withRouter(SourceDetail)));
