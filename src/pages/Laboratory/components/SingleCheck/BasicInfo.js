import React, { Fragment, } from 'react';
import { Form, Input, BasicLayout, Select } from '@chaoswise/ui';
import { connect } from "@chaoswise/cw-mobx";
import { labelLayout } from "@/globalConstants";
import {IntlFormatMessage} from "@/utils/util";

const { Item } = Form;



function checkoutChartName() {
    return {
        pattern: /^.{1,200}$/,
        message: IntlFormatMessage('laboratory.anomaly.charactersMaximum')
    };
}

function BasicInfo(props) {

    const {
        form,
        dataSetInfo,
        updateDataSetInfo 
    } = props;


    const { getFieldDecorator } = form;




    return (
        <Fragment>
            <Item label={IntlFormatMessage('laboratory.list.taskname')}
                  {...labelLayout}>
                {
                    getFieldDecorator('taskName', {
                        initialValue: dataSetInfo.taskName || undefined,
                        rules: [
                            { required: true, message: IntlFormatMessage('laboratory.list.searchbytaskname') },
                            checkoutChartName(),
                        ],
                    })(
                        <Input
                            placeholder={IntlFormatMessage('laboratory.list.searchbytaskname')}
                            onChange={(e) => updateDataSetInfo('taskName', e.target.value)}
                        />
                    )
                }
            </Item>
            <Item label={IntlFormatMessage('laboratory.create.description')}
                  {...labelLayout}>
                {
                    getFieldDecorator('description', {
                        initialValue: dataSetInfo.description || undefined,
                        rules: [
                            {
                                max: 200,
                                message: IntlFormatMessage('laboratory.anomaly.charactersMaximumTwo'),
                            },
                        ],
                    })(
                        <Input.TextArea
                            placeholder={IntlFormatMessage('laboratory.detail.enterdescription')}
                            autoSize={{minRows: 4}}
                            onChange={(e) => updateDataSetInfo('description', e.target.value)}
                        />
                    )
                }
            </Item>
        </Fragment>
    );
}


export default connect(({ laboratoryStore }) => {
    return {
        dataSetInfo: laboratoryStore.dataSetInfo,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        dataSetTableList: laboratoryStore.dataSetTableList
    };
})(BasicInfo);
