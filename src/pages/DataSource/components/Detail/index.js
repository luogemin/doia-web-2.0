import React, {Component, Fragment, useEffect, useMemo,} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {Form, Tag, Tooltip, Descriptions} from '@chaoswise/ui';
import styles from './index.less';
import {useParams} from "react-router";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";
import {relationshipTypeUnit} from "@/globalConstants";

const Detail = (props) => {
    const {
        math = {},
        getDataSourceDetail,
    } = props;

    const CH_DATASOURCE = {
        metric: IntlFormatMessage('datasource.detail.metricname'),
        time: IntlFormatMessage('datasource.detail.timecolumn'),
        value: IntlFormatMessage('datasource.detail.metricvaluecolumn'),
        tags: IntlFormatMessage('datasource.detail.dimensioncolumn'),
        fromModel: IntlFormatMessage('datasource.create.originModelColumn'),
        fromTarget: IntlFormatMessage('datasource.create.originObjectColumn'),
        toModel: IntlFormatMessage('datasource.create.destinationModelColumn'),
        toTarget: IntlFormatMessage('datasource.create.destinationObjectColumn'),
        relationship: IntlFormatMessage('datasource.create.relationshipColumn'),
        targetValue: IntlFormatMessage('datasource.create.metricvaluecolumn'),
        objName: IntlFormatMessage('datasource.create.objectcolumn'),
        targetName: IntlFormatMessage('datasource.create.metricname'),
        dimension: IntlFormatMessage('datasource.create.dimensioncolumn'),
        originLog: IntlFormatMessage('datasource.create.originalLogs'),
        message: IntlFormatMessage('datasource.create.contentColumn'),
        fieldType: IntlFormatMessage('datasource.create.fieldName'),
        description: IntlFormatMessage('datasource.detail.description'),
        tableField: IntlFormatMessage('task.common.logRaw'),
        grok: IntlFormatMessage('laboratory.anomaly.contentColumns'),
        host: 'Host',
        loglevel: 'Loglevel',
        source: 'Source',
        // extendFields:'',
    };


    const [info, setInfo] = useFetchState({});
    const {sourceId} = useParams();

    useEffect(() => {
        getDataSourceDetail(sourceId, {
            cb: (data) => {
                setInfo({
                    ...info,
                    chartype: data.sourceConfig && data.sourceConfig.type,
                    fileName: data.sourceConfig && data.sourceConfig.fileName || '',
                    databaseName: data.sourceConfig && data.sourceConfig.databaseName || '',
                    tableName: data.sourceConfig && data.sourceConfig.tableName || '',
                    ...data
                });
            }
        });
    }, [sourceId]);

    const renderPrams = useMemo(() => {
        const {fieldConfig = {}, fieldConfigDisplay = {}} = info;
        return Object.entries((!!fieldConfigDisplay && Object.keys(fieldConfigDisplay).length) ? fieldConfigDisplay : fieldConfig).reduce((prev, item) => {
            if (item[0] === 'extendFields' && !!item[1] && !!item[1].length) {
                return prev.concat(item[1].map(info => {
                    return {
                        name: info.fieldType,
                        value: info.tableField
                    };
                }));
            } else if (!['type', 'extendFields'].includes(item[0])) {
                return prev.concat({
                    name: item[0],
                    value: item[1]
                });
            }
            return prev;
        }, []).filter(i => !!i);
    }, [info]);

    return (
        <div className={styles["generics-detail"]}>
            <Fragment>
                <div className='title-label-box'>{IntlFormatMessage('datasource.detail.basicinformation')}</div>
                <div className='label-rwopper'>
                    <div className="generics-detail-top">
                        <div className="title" style={{marginRight: 32}}>
                            {IntlFormatMessage('datasource.list.name')}：
                            <span className="info">{info.name}</span>
                        </div>

                    </div>
                    <div className="title" style={{marginTop: 32}}> {IntlFormatMessage('datasource.list.tag')}：
                        <span className="info">{
                            (info.dataTags || []).map(item => {
                                return <Tag key={item.id}>{item.name}</Tag>;
                            })
                        }</span>
                    </div>
                    {
                        !!info.fileName &&
                        <div className="title-des" style={{marginTop: 32}}>
                            <div className='title-description'>{IntlFormatMessage('datasource.create.fileBtn')}：</div>
                            <div className="info-des">{info.fileName}</div>
                        </div>
                    }
                    <div className="title-des" style={{marginTop: 32, display: 'flex'}}>
                        <div className='title-description'>{IntlFormatMessage('datasource.detail.description')}：</div>
                        <p className="info-des"
                           style={{width: 'calc(100% - 42px)', wordBreak: 'break-all'}}>{info.description || '-'}</p>
                    </div>
                </div>
                <div className='title-label-box'>{IntlFormatMessage('datasource.detail.fieldsettings')}</div>
                <div className='label-rwopper'>
                    <div className="generics-detail-top">
                        <div className="title"
                             style={{marginRight: 32}}> {IntlFormatMessage('datasource.list.tabletype')}：
                            <span className="info">{
                                !!relationshipTypeUnit[info.dataType] && IntlFormatMessage(relationshipTypeUnit[info.dataType])
                            }</span>
                        </div>
                        {
                            (!!info.databaseName || !!info.tableName) &&
                            <Fragment>
                                <div className="title"
                                     style={{marginRight: 32}}> {IntlFormatMessage('datasource.create.databasename')}：
                                    <span className="info">{info.databaseName}</span>
                                </div>
                                <div className="title"> {IntlFormatMessage('datasource.create.datatablename')}：
                                    <span className="info">{info.tableName}</span>
                                </div>
                            </Fragment>
                        }
                    </div>


                    <div style={{marginTop: 32}}>
                        <div className="title"
                             style={{marginBottom: 16}}>{IntlFormatMessage('datasource.detail.fieldinformation')}：
                        </div>
                        <Descriptions column={4} className={styles['detail-descriptions']}>
                            {
                                renderPrams.map((item, index) => {
                                    if (item.value) {
                                        const title = CH_DATASOURCE[item.name] ? CH_DATASOURCE[item.name] : item.name;
                                        return <Descriptions.Item key={`${item.name}-${index}`}>
                                                    <Tooltip placement="topLeft" title={`${title}：${item.value || '-'}`}>
                                                        {`${title}：${item.value || '-'}`}
                                                    </Tooltip>
                                                </Descriptions.Item>;
                                    }
                                })
                            }
                        </Descriptions>
                    </div>
                </div>
            </Fragment>
        </div>
    );
};
export default connect(({dataSourceStore, store}) => {
    return {
        getDataSourceDetail: dataSourceStore.getDataSourceDetail,
        type: dataSourceStore.type
    };
})(Form.create()(Detail));
