import React, { Component } from 'react';
import { Modal } from '@chaoswise/ui';
import CustomIcon from '@/components/Icon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { success } from '@/utils/tip';
import { getApiDomain } from '@/utils/common';
import { moduleName } from '@/globalConstants';

import styles from './copyApi.less';
import {IntlFormatMessage} from "@/utils/util";

const modelOpenApi = `${getApiDomain()}/${moduleName}/api/v1/dataquerymodels/`;
const contentType = "application/json";

const renderItem = (item) => {
    return (
        <div className='listItem'>
            <div className='title'>
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
            <div className='value'>
                <pre>
                    {item.value}
                </pre>
            </div>
        </div>
    );
};

class CopyModelApi extends Component {
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
            model,
            handleCancelModal
        } = this.props;

        const { confJson = {} } = model;
        const { params = {} } = confJson;
        let newParams = JSON.parse(JSON.stringify(params));
        const url = modelOpenApi + model.pathId + "/query";
        let curl = (window.location.protocol == "https:") ? ["curl -k --request POST "] : ["curl --request POST "];
        // let curl = ["curl --request POST "];
        curl.push(` --url ${url} `);
        curl.push(` --header \'content-type:${contentType}\' `);
        curl.push(` --header \'CWAccessToken:${token}\' `);
        curl.push(` --data \'{"params":${JSON.stringify(newParams)}}\' `);

        return (
            <Modal
                className={styles["customModal"]}
                title={IntlFormatMessage('task.common.request')}
                visible
                onCancel={handleCancelModal}
                footer={null}
            >
                <div className='detailItem'>
                    {renderItem({ name: IntlFormatMessage('task.common.requestAddress'), value: url })}
                    {renderItem({ name: "contentType", value: contentType })}
                    {renderItem({ name: IntlFormatMessage('task.common.token'), value: token })}
                </div>
                <div className='listItem'>
                    <div className='title'>
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
                    <div className='value'>
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

export default CopyModelApi;
