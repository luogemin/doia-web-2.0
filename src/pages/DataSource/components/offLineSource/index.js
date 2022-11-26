import React, {Fragment, useEffect,} from 'react';
import {Steps, Button, BasicLayout, Form, message} from '@chaoswise/ui';
import {connect, toJS} from '@chaoswise/cw-mobx';
import styles from './index.less';
import BasicInfo from './BasicInfo';
import FiledSet from './FiledSet';
import {error, success} from "@/utils/tip";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const {Footer} = BasicLayout;

const {Step} = Steps;

function KafkaSource(props) {
    const {
        form,
        history,
        addDataSource, addList, offFiledSetData, updateAddList,
    } = props;

    const [current, setCurrent] = useFetchState(0);
    const [open, setOpen] = useFetchState(false);
    const [loading, setLoading] = useFetchState(false);

    useEffect(() => {

        return () => {
            updateAddList([]);
        };
    }, []);

    const handleNext = () => {
        if (current === 0) {
            form.validateFields((err) => {
                if (!err) {
                    setCurrent(current + 1);
                }
            });
        }
        if (current === 1) {
            form.validateFields((err) => {
                if (!err) {
                    setLoading(true);
                    addDataSource({
                        cb: () => {
                            success(IntlFormatMessage('laboratory.anomaly.dataSourceAdded'));
                            setLoading(false);
                            history.push('/datasource');
                        },
                        err: () => {
                            setLoading(false);
                        }
                    });
                } else {
                    const {type, message, grok} = toJS(offFiledSetData);
                    if (type === 'NODE_RELATION') {
                        error(IntlFormatMessage('laboratory.anomaly.originConfigures'));
                    } else if (type === 'TIME_SERIES') {
                        error(IntlFormatMessage('laboratory.anomaly.metricValueColumns'));
                    } else if (type === 'LOG') {
                        error(
                            `${IntlFormatMessage('laboratory.anomaly.configureOriginalLog')}${(message === 'grok' && !grok) ? `${IntlFormatMessage('laboratory.anomaly.contentColumns')}` : ''}`);
                    }
                }
            });
        }
    };


    const handlePrev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: IntlFormatMessage('datasource.detail.basicinformation'),
            content: <BasicInfo
                form={form}
                handleNext={handleNext}
            />,
        },
        {
            title: IntlFormatMessage('datasource.detail.fieldsettings'),
            content: <FiledSet
                form={form}
                setOpen={setOpen}
                handlePrev={handlePrev}
            />,
        },
    ];


    return (
        <Fragment>
            <div className={styles['offline-wrapper']} style={{overflow: open ? 'hidden' : 'auto'}}>
                <Steps current={current} style={{marginBottom: 40}}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>
                <div className={styles["offline-content"]}>{steps[current].content}</div>
            </div>
            <Footer>
                {
                    current !== 0 && (
                        <Button onClick={handlePrev} style={{marginRight: 8}}>{
                            IntlFormatMessage('common.previous')
                        }</Button>
                    )
                }
                <Button onClick={handleNext} loading={loading} type="primary">{
                    current === 0 ?
                        IntlFormatMessage('common.next') :
                        IntlFormatMessage('common.ok')
                }</Button>
            </Footer>
        </Fragment>
    );
}

export default connect(({dataSourceStore, store}) => {
    return {
        addDataSource: dataSourceStore.addDataSource,
        addList: dataSourceStore.addList,
        offFiledSetData: dataSourceStore.offFiledSetData,
        updateAddList: dataSourceStore.updateAddList,
    };
})(Form.create()(KafkaSource));
