import React, {useEffect, Fragment} from 'react';
import {Tabs, BasicLayout, Form, Card, Button, message} from '@chaoswise/ui';
import BasicInfo from '@/pages/Laboratory/components/SingleCheck/BasicInfo';
import AlgorithmSelect from '@/pages/Laboratory/components/SingleCheck/ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import DataSetting from '@/pages/Laboratory/components/SingleCheck/DataSetting';

const {TabPane} = Tabs;
import styles from '../../assets/index.less';
import {useFetchState} from "@/components/HooksState";
import {useHistory} from "react-router";
import {success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const Footer = BasicLayout.Footer;


function EditSource(props) {
    const {
        match = {},
        form,
        getTbDetail,
        modifyTb,
        genericityList,
        modifyGeneric,
        updateDataSetInfo,
        setDataSetInfo
    } = props;
    const {params = {}} = match;
    const {typeId = '', id = ''} = params;
    const {push, go, location} = useHistory();

    const [activeTabKey, setActiveTabKey] = useFetchState('basicInfo');
    const [dataInfo, setDataInfo] = useFetchState({});

    useEffect(() => {
        if (id) {
            getTbDetail(id, {
                cb: (data = {}) => {
                    const {
                        taskName = '', description = undefined, scene = 'anomaly_detection',
                        dataSourceList = [], aggConfig = {}, startTime = 0, endTime = 0, extendConfig = {}
                    } = data;
                    const {filtersConfig = {}, dataSource = {},} = dataSourceList[0];
                    const {metricAndTagFilters = [], modelFilter = {}, targetFilter = {}} = filtersConfig;
                    const {
                        dataProcessing = {},
                        // dataDecting = {}
                    } = extendConfig;
                    const {forecastTimeNumber = undefined, forecastTimeUnit = '', lowerThreshold = undefined, upperThreshold = undefined} = dataProcessing;
                    // const {image, to_ratio} = dataDecting;
                    const {type = 'DODB', id = '', name = ''} = dataSource;
                    const {aggFunc = '', aggTimeUnit = '', aggTimeNumber = undefined, aggPercentile = undefined} = aggConfig;
                    setDataInfo(data);
                    setDataSetInfo(Object.assign({}, data, {
                        time: [data.startTime, data.endTime],
                        scene,
                        dataSourceType: type,
                        datasourceId: {value: id, label: name},
                        method: aggFunc,
                        aggTimeUnit: aggTimeUnit,
                        aggPercentile,
                        number: aggTimeNumber,
                        forecastTimeNumber,
                        forecastTimeUnit,
                        lowerThreshold,
                        upperThreshold,
                        // image, to_ratio,
                    }));
                }
            });
        }
    }, [id]);
    const tabList = [
        {
            key: 'basicInfo',
            tab: '基本信息',
        },
        {
            key: 'dataset',
            tab: '数据设定',
        },
        {
            key: 'arithmetic',
            tab: '算法选择',
        },
    ];
    const contentList = {
        basicInfo: <BasicInfo form={form} dataInfo={dataInfo}/>,
        dataset: <DataSetting form={form} disableEdit={true} dataInfo={dataInfo}/>,
        arithmetic: <AlgorithmSelect typeId={typeId}/>
    };
    const handleSubmit = () => {
        if (activeTabKey === 'arithmetic') {
            let taskPublicGenericList = [];
            if (genericityList.length > 0) {
                taskPublicGenericList = genericityList.map(item => {
                    return {
                        algorithmGenericId: item.genericId,
                        algorithmId: item.algorithmId,
                        algorithmName: item.algorithmName,
                        algorithmVersion: item.algorithmVersion,
                        algorithmParams: item.algorithmParams.map(item => {
                            if (item.value || item.value === 0) {
                                return item;
                            }
                            return {
                                name: item.name,
                                value: null
                            };
                        }),
                        algorithmNameZh: item.algorithmNameZh,
                        genericName: item.genericityname,
                        isOverwriteForecastParams: !!(typeId === 'forecasting' && item.checked)
                    };
                });
            }
            return modifyGeneric({
                taskId: id,
                taskPublicGenericList
            }, {
                cb: () => {
                    success(IntlFormatMessage('laboratory.anomaly.edited'));
                }
            });
        }
        form.validateFields((err, value) => {
            if (!err) {
                if (activeTabKey === 'basicInfo') {
                    modifyTb({
                        id,
                        taskName: value.taskName,
                        description: value.description || null,
                    }, {
                        cb: () => {
                            success(IntlFormatMessage('laboratory.anomaly.edited'));
                        }
                    });
                }
            }
        });
    };
    return (
        <Fragment>
            <Form style={{height: '100%',}}>
                <Tabs
                    style={{height: '100%', overflowY: 'auto'}}
                    className={styles['arithmetic-tabs']}
                    activeKey={activeTabKey}
                    onChange={key => setActiveTabKey(key)}
                >
                    <TabPane tab={IntlFormatMessage('laboratory.create.basicinformation')} key="basicInfo">
                        <PaddingDiv>
                            <BasicInfo form={form} dataInfo={dataInfo}/>
                        </PaddingDiv>
                    </TabPane>
                    <TabPane tab={IntlFormatMessage('laboratory.detail.datasettings')} key="dataset">
                        <div style={{padding: '16px 32px'}}>
                            <DataSetting form={form} disableEdit={true} dataInfo={dataInfo}/>
                        </div>
                    </TabPane>
                    <TabPane tab={IntlFormatMessage('laboratory.detail.algorithmsettings')} key="arithmetic">
                        <div style={{padding: '16px 32px'}}>
                            <AlgorithmSelect typeId={typeId}/>
                        </div>
                    </TabPane>
                </Tabs>
            </Form>
            {
                activeTabKey !== 'dataset' &&
                <Footer>
                    <Button onClick={() => go(-1)} style={{marginRight: 8}}>{
                        IntlFormatMessage('common.explore.setting.modal.cancel')
                    }</Button>
                    <Button type='primary' onClick={handleSubmit}>{
                        IntlFormatMessage('common.explore.setting.modal.determine')
                    }</Button>
                </Footer>
            }
        </Fragment>
    );
}

const PaddingDiv = (props) => {
    const {children, style = {}} = props;
    return <div style={Object.assign({}, {padding: '16px 32px'}, style)}>
        {children}
    </div>;
};

export default connect(({laboratoryStore}) => {
    return {
        getTbDetail: laboratoryStore.getTbDetail,
        modifyTb: laboratoryStore.modifyTb,
        genericityList: laboratoryStore.genericityList,
        dataSetInfo: laboratoryStore.dataSetInfo,
        modifyGeneric: laboratoryStore.modifyGeneric,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        setDataSetInfo: laboratoryStore.setDataSetInfo,
    };
})(Form.create()(EditSource));
