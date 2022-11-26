import React, {Fragment, useEffect,} from 'react';
import {
    Icon,
    Input,
    Select,
    CWTable as Table,
    Tooltip,
    Dropdown,
    Modal,
    Menu,
    Button,
    Descriptions,
    Form
} from '@chaoswise/ui';
import moment from 'moment';
import {omit} from "lodash-es";
import {useHistory, useParams} from "react-router";
import styles from './index.less';
import {genericsPicList,} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import RcViewer from "@hanyk/rc-viewer";
import {IntlFormatMessage} from "@/utils/util";

const Detail = (props) => {
    let {
        algorithmInfo = {}
    } = props;
    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const {typeId = ''} = useParams();
    const {displaySceneNames, displayNames, name, descriptions, parameters = []} = algorithmInfo;
    useEffect(() => {
        if (!Object.keys(algorithmInfo).length) {
            go(-1);
        }
    }, [algorithmInfo]);

    return (
        <div className={styles['dashboard-detail-info']}>
            <div className='title-label-box title-label-box-margin-bottom32'>{IntlFormatMessage('dashboard.detail.algorithmInformation')}</div>
            <div className="label-rwopper">
                <div className="generics-detail-top">
                    <p className="title"> {IntlFormatMessage('dashboard.detail.algorithmscenario')}：
                        <span className="info">
                            {displaySceneNames || ''}
                        </span>
                    </p>
                    <p className="title"> {IntlFormatMessage('dashboard.detail.algorithmname')}：
                        <span className="info">
                            {displayNames || ''}
                        </span>
                    </p>
                </div>
                <p className="title"> {IntlFormatMessage('dashboard.detail.algorithmdescription')}：
                    <span
                        dangerouslySetInnerHTML={{
                            __html: descriptions ?
                                descriptions.split('\n').join('<br/>') : '-'
                        }}
                        style={{
                            color: '#333',
                        }}
                    />
                </p>
            </div>
            <div className='title-label-box title-label-box-margin-bottom32'>{IntlFormatMessage('dashboard.detail.parameter')}</div>
            <div className="label-rwopper">
                <Descriptions column={4} style={{width: '100%'}}>
                    {
                        (parameters || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                            return <Descriptions.Item key={`${item.name}-${index}`} label={item.name}>
                                <Tooltip title={`${item.name}：${item.value}`}>
                                    {item.value}
                                </Tooltip>
                            </Descriptions.Item>;
                        })
                    }
                </Descriptions>
            </div>
            {
                (!!displayNames && genericsPicList[name]) ?
                    <Fragment>
                        <div className='title-label-box title-label-box-margin-bottom32' style={{marginTop: 32}}>
                            {IntlFormatMessage('dashboard.detail.sketch')}
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

export default connect(({dashboardStore, store}) => {
    return {
        algorithmInfo: dashboardStore.algorithmInfo,
    };
})(Form.create()(Detail));
