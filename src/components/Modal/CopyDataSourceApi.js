import React, { Component } from 'react';
import { Modal } from '@chaoswise/ui';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CustomIcon from '@/components/Icon';
import { success } from '@/utils/tip';
import { getApiDomain } from '@/utils/common';
import { moduleName } from '@/globalConstants';
import styles from './copyApi.less';
import {IntlFormatMessage} from "@/utils/util";

const dataSourceOpenApi = `${getApiDomain()}/${moduleName}/api/v1/data/`;
const contentType = "application/json";

const renderItem = (item) => {
    return (
        <div className={"listItem"}>
            <div className={"title"}>
                {item.name || ""}:
                <div style={{ float: "right", cursor: "pointer" }}>
                    <CopyToClipboard
                        text={item.value}
                        onCopy={() => success(`${item.name} ${IntlFormatMessage('task.common.copied')}`)}
                    >

                        <CustomIcon type="clipboard" />
                    </CopyToClipboard>
                </div>
            </div>
            <div className={"value"}>
                <pre>
                    {item.value}
                </pre>
            </div>
        </div>
    );
};

class CopyDataSourceApi extends Component {
    constructor() {
        super();
        this.state = {
            errorModal: false,
            errorMsg: ""
        };
        this.tagInput = null;
    }


    render() {
        const {
            token,
            dataSource = {},
            handleCancelModal
        } = this.props;

        const url = dataSourceOpenApi + dataSource.uuid;
        let curl = (window.location.protocol == "https:") ? ["curl -k --request POST "] : ["curl --request POST "];
        // let curl = ["curl --request POST "];
        curl.push(` --url ${url} `);
        curl.push(` --header \'content-type:${contentType}\' `);
        curl.push(` --header \'CWAccessToken:${token}\' `);

        let fieldDesc = [];
        if (dataSource.schemaConf && dataSource.schemaConf.fieldDescs) {
            fieldDesc = dataSource.schemaConf.fieldDescs || [];
        }
        //获取转换设置
        let storeTransform = dataSource.storeTransform ? dataSource.storeTransform : [];
        let storeTransformObj = {};
        let jsonPathFlag = false;
        storeTransform.forEach((trans) => {
            storeTransformObj[trans.fieldName] = trans.transformConf || {};
            if (trans.transformConf) {
                let transConf = trans.transformConf;
                if (transConf.type == "xpath") jsonPathFlag = true;
                if (transConf.type == "defaultValue" && transConf.conf && transConf.conf.sourceXPath && transConf.conf.sourceXPath.length > 0) jsonPathFlag = true;
                if (transConf.type == "datetime" && transConf.conf && transConf.conf.sourceXPath && transConf.conf.sourceXPath.length > 0) jsonPathFlag = true;
            }
        });

        let data = [];
        //如果没有进行过jsonpath转换
        if (!jsonPathFlag) {
            let pushFields = {};
            fieldDesc.forEach((field, index) => {
                //如果有转换，则按照转换处理
                if (storeTransformObj[field.name]) {
                    let { type = "", conf = {} } = storeTransformObj[field.name];
                    if (type == "defaultValue") {
                        pushFields[field.name] = conf.value || "";
                    } else if (type == "datetime") {
                        pushFields[field.name] = conf.sampleTime || "";
                    }
                } else {
                    if (field.type == "VARCHAR" || field.type == "BLOB") {
                        pushFields[field.name] = '';
                    } else if (field.type == "BIGINT" || field.type == "DOUBLE" || field.type == "INTEGER" || field.type == "FLOAT") {
                        pushFields[field.name] = 0;
                    } else if (field.type == "BOOLEAN") {
                        pushFields[field.name] = true;
                    } else if (field.type == "TIMESTAMP") {
                        pushFields[field.name] = Date.now();
                    } else if (field.type == "DATE") {
                        const date = new Date();
                        let month = date.getMonth() + 1;
                        month = month > 9 ? month : `0${month}`;
                        pushFields[field.name] = `${date.getFullYear()}-${month}-${date.getDate()}`;
                    } else if (field.type == "UUID") {
                        pushFields[field.name] = '00000000-0000-0000-0000-000000000000';
                    }
                }
            });

            data.push(pushFields);
        }

        curl.push(` --data \'${JSON.stringify(data)}\' `);

        return (
            <Modal
                className={styles["customModal"]}
                title={IntlFormatMessage('task.common.dataRequest')}
                visible
                onCancel={handleCancelModal}
                footer={null}
            >
                <div className={"detailItem"}>
                    {renderItem({ name: IntlFormatMessage('task.common.requestAddress'), value: url })}
                    {renderItem({ name: "contentType", value: contentType })}
                    {renderItem({ name: IntlFormatMessage('task.common.token'), value: token })}
                </div>

                <div className={"listItem"}>
                    <div className={"title"}>
                        {IntlFormatMessage('task.common.sample')}
                        <div style={{ float: "right", cursor: "pointer" }}>
                            <CopyToClipboard
                                text={curl.join("\\\r\n")}
                                onCopy={() => success(IntlFormatMessage('task.common.sampleCopied'))}
                            >

                                <CustomIcon type="clipboard" />
                            </CopyToClipboard>
                        </div>
                    </div>
                    <div className={"value"}>
                        <pre>
                            {curl.map((item, index) => {
                                if (index == curl.length - 1) {
                                    return `${item} \n`;
                                } else {
                                    return `${item} \\\n`;
                                }
                            })}
                        </pre>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default CopyDataSourceApi;
