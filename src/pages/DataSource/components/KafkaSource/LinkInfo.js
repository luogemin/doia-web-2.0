import React, {Fragment, useEffect} from 'react';
import {Form, Input, Radio, BasicLayout, Button} from '@chaoswise/ui';
import {connect, toJS} from '@chaoswise/cw-mobx';

const {Item} = Form;
const Footer = BasicLayout.Footer;

const formLayout = {
    labelCol: {span: 10},
    wrapperCol: {span: 12}
};


function LinkInfo(props) {
    const {
        form,
        handlePrev,
        handleNext,
        linkData,
        updateLinkInfo
    } = props;
    let linkInfo = toJS(linkData);

    const {getFieldDecorator} = form;

    const handlePrevStep = () => {
        handlePrev();
    };

    const handleNextStep = () => {
        form.validateFields((err, values) => {
            if (!err) {
                updateLinkInfo(values);
                handleNext();
            }
        });
    };
    return (
        <Fragment>
            <Item label='Kafka服务器和端口(bootstrap.server)' {...formLayout}>
                {
                    getFieldDecorator('dataSourceServer', {
                        initialValue: linkInfo.dataSourceServer || undefined
                    })(
                        <Input
                            placeholder='请输入kafka服务器和端口(bootstrap_sever)'
                            onChange={(e)=>updateLinkInfo('dataSourceServer',e.target.value)}
                        />
                    )
                }
            </Item>
            <Item label='Kafka主题(Topic Name)' {...formLayout}>
                {
                    getFieldDecorator('topicName', {
                        initialValue: linkInfo.topicName || undefined
                    })(
                        <Input
                            placeholder='请输入kafka主题(Topic Name)'
                            onChange={(e)=>updateLinkInfo('topicName',e.target.value)}
                        />
                    )
                }
            </Item>
            <Item label='消息偏移量初始化' {...formLayout}>
                {
                    getFieldDecorator('infoInit', {
                        initialValue: linkInfo.infoInit || 'a'
                    })(
                        <Radio.Group 
                            onChange={(e)=>updateLinkInfo('infoInit',e.target.value)}
                        >
                            <Radio value="a">从头开始消费</Radio>
                            <Radio value="b">从当前新产生的消息开始消费</Radio>
                        </Radio.Group>
                    )
                }
            </Item>
            <Item label='每次最大拉取的记录数(max.poll.records)' {...formLayout}>
                {
                    getFieldDecorator('pollRecords', {
                        initialValue: linkInfo.pollRecords || undefined
                    })(
                        <Input
                            placeholder='请输入每次最大拉取的记录数(max_poll_records)'
                            onChange={(e)=>updateLinkInfo('pollRecords',e.target.value)}
                        />
                    )
                }
            </Item>
        </Fragment>
    );
}

export default connect(({store, dataSourceStore}) => {
    return {
        linkData: dataSourceStore.linkData,
        updateLinkInfo: dataSourceStore.updateLinkInfo
    };
})(LinkInfo);
