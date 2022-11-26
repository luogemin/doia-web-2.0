import React, { Fragment, useEffect } from 'react';
import { Select, Button } from '@chaoswise/ui';
import { connect, toJS } from '@chaoswise/cw-mobx';
import styles from '../KafkaSource/index.less';
import { withRouter } from 'react-router-dom';
import {IntlFormatMessage} from "@/utils/util";
const { Option} = Select;

const FiledSetting = (props) => {
    const {
        sourceId,
        type
    } = props;


    useEffect(() => {

    }, [sourceId]);

    let filedList = [
        {
            name: '模型',
            desc: '哈哈哈睡觉啊空间开机大家斯欧德',
        },
        {
            name: '模型',
            desc: '哈哈哈睡觉啊空间开机大家斯欧德',
        },
        {
            name: '模型',
            desc: '哈哈哈睡觉啊空间开机大家斯欧德',
        },
        {
            name: '模型',
            desc: '哈哈哈睡觉啊空间开机大家斯欧德',
        },
        {
            name: '模型',
            desc: '哈哈哈睡觉啊空间开机大家斯欧德',
        },
        {
            name: '模型',
            desc: '哈哈哈睡觉啊空间开机大家斯欧德',
        },
    ];
    const renderField = (item, index) => {
        return <li key={index} className={styles['field-header-list']}>
            <div className={styles['field-type-list']} style={{ width: "30%" }}>
                {item.name}
            </div>
            <div className={styles['field-desc-list']} style={{ width: "30%" }}>
                {item.desc}
            </div>
            <div className={styles['field-setting-list']} style={{ width: "40%" }}>
                <Select
                    style={{ width: '100%' }}
                    // onChange={(values) => this.changeMapperType(name, values)}
                    placeholder="转换方式">
                </Select>
            </div>
        </li>;
    };

    let renderItems = [];
    filedList.forEach((item, index) => {
        renderItems.push(renderField(item, index));
    });

    const onChange = ()=>{
        
    };

    return (
        <Fragment>
            <div className={styles['filed-set']}>
            <div className={styles['filed-select']}>
                    <div className={styles['filed-select-title']}>选择数据表:</div>
                    <Select placeholder='选择数据表' onChange={onChange}>
                        <Option value='aaa'>哈哈哈</Option>
                    </Select>
                </div>
                <p>kafka源中字段的应用类型设置</p>
                <div className={styles["field-wrapper"]}>
                    <ul>
                        <li className={styles["field-header"]} key="header">
                            <div className={styles['field-type']} style={{ width: "30%" }}>{IntlFormatMessage('laboratory.anomaly.fieldMame')}</div>
                            <div className={styles['field-desc']} style={{ width: "30%" }}>描述</div>
                            <div className={styles['field-setting']} style={{ width: "40%" }}>{IntlFormatMessage('datasource.create.tableField')}</div>
                        </li>
                        {
                            renderItems
                        }
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};


export default connect(({ store, dataSourceStore }) => {
    return {
        deleteDataSourceInfo: dataSourceStore.deleteDataSourceInfo
    };
})(withRouter(FiledSetting));