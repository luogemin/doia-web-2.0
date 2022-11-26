import React, {Fragment,} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {Steps, Button, BasicLayout, Form} from '@chaoswise/ui';
import styles from './index.less';
import BasicInfo from './BasicInfo';
import LinkInfo from './LinkInfo';
import FiledSet from './FiledSet';
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const {Footer} = BasicLayout;

const {Step} = Steps;

function KafkaSource(props) {
    const {
        form,
        updateBasicInfo,
        updateLinkInfo,
        deleteDataSourceInfo,
        history
    } = props;

    const [current, setCurrent] = useFetchState(0);
    //基本信息页面点击下一步
    const handleNextStepBasic = () => {
        form.validateFields((err, values) => {
            if (!err) {
                // updateBasicInfo(values);
            }
        });

    };

    //链接信息点击下一步
    const handleNextStepLink = () => {
        form.validateFields((err, values) => {
            if (!err) {
                // updateLinkInfo(values);
            }
        });
    };

    const handleNext = () => {
        if (current === 0) {
            handleNextStepBasic();
        }
        if (current === 1) {
            handleNextStepLink();
        }
        if (current === 2) {
            deleteDataSourceInfo();
            history.push('/datasource');
            return;
        }
        setCurrent(current + 1);
    };

    const handleDone = () => {

    };

    const handlePrev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: '基本信息',
            content: <BasicInfo
                form={form}
                handleNext={handleNext}
            />,
        },
        {
            title: '链接信息',
            content: <LinkInfo
                form={form}
                handleNext={handleNext}
                handlePrev={handlePrev}
            />,
        },
        {
            title: '字段设置',
            content: <FiledSet
                form={form}
                handlePrev={handlePrev}
                handleDone={handleDone}
            />,
        },
    ];


    return (
        <Fragment>
            <div className={styles['kafka-wrapper']}>
                <Steps current={current} style={{marginBottom: 40}}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>
                <div className={styles["kafka-content"]}>{steps[current].content}</div>
            </div>
            <Footer>
                {
                    current !== 0 && (
                        <Button onClick={handlePrev} style={{marginRight: 8}}>{
                            IntlFormatMessage('common.previous')
                        }</Button>
                    )
                }
                <Button type='primary' onClick={handleNext}>{
                    current === 2 ?
                        IntlFormatMessage('common.explore.setting.modal.determine')
                        :
                        IntlFormatMessage('common.next')
                }</Button>
            </Footer>
        </Fragment>
    );
}

export default connect(({dataSourceStore, store}) => {
    return {
        basicData: dataSourceStore.basicData,
        updateBasicInfo: dataSourceStore.updateBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        updateLinkInfo: dataSourceStore.updateLinkInfo,
        deleteDataSourceInfo: dataSourceStore.deleteDataSourceInfo
    };
})(Form.create()(KafkaSource));
