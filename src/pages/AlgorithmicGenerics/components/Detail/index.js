import React, {Component, Fragment, useEffect} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {Form, Button, Row, Col, Select, Tooltip, Spin, Descriptions, BasicLayout} from '@chaoswise/ui';
import {error, success} from '@/utils/tip';
import RcViewer from '@hanyk/rc-viewer';
import styles from './index.less';
import {useHistory, useParams} from "react-router";
import {formatType, genericsPicList} from "@/globalConstants";
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;
const Footer = BasicLayout.Footer;

const Detail = (props) => {
    const {
        getAlgorithmDetailAsync, current = {},
        form: {getFieldDecorator, validateFields}, alogParams,
    } = props;
    const {push, location} = useHistory();
    const {pathname = ""} = location;
    const {storeId = ''} = useParams();

    const {name = '', builtinDescriptions, builtinDisplayNames, nameEn = '', scene = '', algorithm = {}, parameters = [], description} = toJS(current);
    const {displayNames} = algorithm;

    useEffect(() => {
        getAlgorithmDetailAsync({id: storeId, isIncludeAlgorithm: true});
    }, []);

    return (
        <div className={styles["generics-detail"]}>
            <div
                className='title-label-box title-label-box-margin-bottom24'>{IntlFormatMessage('generics.create.basicinformation')}</div>

            <div className="label-rwopper">
                <div className="generics-detail-box">
                    <p className="title">{IntlFormatMessage('generics.create.algorithmscenario')}：</p>
                    <span className="info">
                        {(scene && formatType(scene)) ? IntlFormatMessage(formatType(scene)) : ''}
                    </span>
                </div>
                <div className="generics-detail-box">
                    <p className="title">{IntlFormatMessage('generics.edit.name')}：</p>
                    <span className="info">
                        {builtinDisplayNames || (name || '')}
                    </span>
                </div>
                <div className="generics-detail-box">
                    <p className="title"> {IntlFormatMessage('generics.info.genericity')}：</p>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: builtinDescriptions ?
                                builtinDescriptions.split('\n').join('<br/>') : (description || '-')
                        }}
                        style={{
                            color: '#333',
                            flex: 1,
                            width: '100%',
                        }}
                    />
                </div>
            </div>

            <div
                className='title-label-box title-label-box-margin-bottom32'>{IntlFormatMessage('generics.create.algorithmgenericity')}</div>

            <div className="label-rwopper">
                <div className="generics-detail-box">
                    <p className="title">{IntlFormatMessage('generics.list.algorithmname')}：</p>
                    <span className="info">{displayNames || ''}</span>
                </div>
                <div className="generics-detail-bottom-param">
                    <p className="title-bottom"> {IntlFormatMessage('generics.info.parameter')}：</p>
                    <div className="generics-detail-top">
                        <Descriptions column={4} style={{width: '100%'}}>
                            {
                                (parameters || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                                    const {name, value} = item;
                                    return <Descriptions.Item key={`${name}-${index}`} label={name}>
                                        <Tooltip title={`${name}：${value}`}>
                                            {value}
                                        </Tooltip>
                                    </Descriptions.Item>;
                                })
                            }
                        </Descriptions>

                    </div>
                </div>
            </div>
            {
                (!!builtinDisplayNames && genericsPicList[name]) ?
                    <Fragment>
                        <div className='title-label-box title-label-box-margin-bottom32' style={{marginTop: 32}}>
                            {IntlFormatMessage('generics.list.tabs.sketch')}
                        </div>
                        <div className="label-rwopper">
                            <RcViewer>
                                <img src={genericsPicList[name].img[localStorage.getItem('language')]}/>
                            </RcViewer>
                        </div>
                    </Fragment>
                    : null
            }
        </div>
    );
};

export default connect(({genericsStore, store}) => {
    return {
        getAlgorithmDetailAsync: genericsStore.getAlgorithmDetailAsync,
        current: genericsStore.current,
    };
})(Form.create()(Detail));
