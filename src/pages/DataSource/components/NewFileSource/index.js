import React, {Fragment, useEffect} from 'react';
import {useFetchState} from "@/components/HooksState";
import {Steps, Button, BasicLayout, Form} from '@chaoswise/ui';
import {connect, toJS} from '@chaoswise/cw-mobx';
import styles from './index.less';
import {success, error} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";
import NewBasic from "@/pages/DataSource/components/NewFileSource/NewBasic";
import NewSet from "@/pages/DataSource/components/NewFileSource/NewSet";


const {Footer} = BasicLayout;
const {Step} = Steps;

function NewFileSource(props) {

    const {
        form,
        history,
        addFileDataSource,
        offBasicData,
        offFiledSetData, updateAddList, addList,
    } = props;

    const [current, setCurrent] = useFetchState(0);
    const [fileList, setFileList] = useFetchState([]);
    const [loading, setLoading] = useFetchState(false);
    const [csvSelectList, setCsvSelectList] = useFetchState([]);

    useEffect(() => {

        return () => {
            updateAddList([]);
        };
    }, []);

    const handlePrev = () => {
        setCurrent(current - 1);
    };
    const handleNext = () => {
        const {
            dataType = 'TIME_SERIES', dataSourceName, dataSourceTags, dataSourceDes,
        } = toJS(offBasicData);
        const {
            fromModel, fromTarget, toModel, toTarget, relationship,
            originLog, message, grok, host, loglevel, source,
            type, model, metric, target, tags, time, value, pattern, patternId
        } = offFiledSetData;
        if (current === 0) {
            // if (dataType === 'NODE_RELATION') {
            form.validateFields((err) => {
                if (!err) {
                    setCurrent(current + 1);
                }
            });
        }

        if (current === 1) {
            form.validateFields((err, values) => {
                if (!err) {
                    setLoading(true);
                    const params = {
                        dataSourceName: dataSourceName,
                        dataSourceTags: dataSourceTags || [],
                        description: dataSourceDes || null,
                        fieldConfigDisplay: JSON.stringify(dataType === 'TIME_SERIES' ? {
                            type: dataType, model, metric, target, tags, time, value,
                        } : dataType === 'LOG' ? {
                            type: dataType, time, originLog, message, grok, host, loglevel, source,
                            pattern, patternId,
                            extendFields: toJS(addList)
                        } : {
                            type: dataType, fromModel, fromTarget, toModel, toTarget, relationship,
                        }),
                    };

                    // ??????????????????
                    // let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                    //     chunkSize = 1024 * 1024 * 5, // ????????????5M
                    //     chunks = Math.ceil(file.size / chunkSize),
                    //     currentChunk = 0, // ???????????????chunk
                    //     spark = new SparkMD5.ArrayBuffer(),
                    //     // ???arrayBuffer????????????md5?????????????????????md5?????????
                    //     chunkFileReader = new FileReader(), // ?????????????????????chunkMd5
                    //     totalFileReader = new FileReader(); // ???????????????????????????fileMd5
                    //
                    // let params = {chunks: [], file: {}}, // ???????????????????????????md5??????
                    //     arrayBufferData = []; // ??????????????????chunk???arrayBuffer??????,????????????????????????
                    // params.file.fileName = file.name;
                    // params.file.fileSize = file.size;
                    //
                    // totalFileReader.readAsArrayBuffer(file);
                    // totalFileReader.onload = function (e) {
                    //     // ?????????totalFile??????md5
                    //     spark.append(e.target.result);
                    //     params.file.fileMd5 = spark.end(); // ?????????????????????fileMd5
                    // };
                    //
                    // chunkFileReader.onload = function (e) {
                    //     // ????????????????????????md5??????
                    //     spark.append(e.target.result);
                    //     // ????????????????????????????????????
                    //     let obj = {
                    //         chunk: currentChunk + 1,
                    //         start: currentChunk * chunkSize, // ???????????????????????????
                    //         end: ((currentChunk * chunkSize + chunkSize) >= file.size) ? file.size : currentChunk * chunkSize + chunkSize, // ???????????????????????????
                    //         chunkMd5: spark.end(),
                    //         chunks
                    //     };
                    //     // ???????????????onload,currentChunk????????????????????????????????????????????????
                    //     currentChunk++;
                    //     params.chunks.push(obj);
                    //
                    //     // ?????????????????????arrayBuffer?????????????????????partUpload
                    //     let tmp = {
                    //         chunk: obj.chunk,
                    //         currentBuffer: e.target.result
                    //     };
                    //     arrayBufferData.push(tmp);
                    //
                    //     if (currentChunk < chunks) {
                    //         // ???????????????????????????????????????
                    //         loadNext();
                    //
                    //         // ?????????????????????
                    //         _this.setState({
                    //             preUploading: true,
                    //             preUploadPercent: Number((currentChunk / chunks * 100).toFixed(2))
                    //         });
                    //     } else {
                    //         //????????????chunks?????????
                    //         params.file.fileChunks = params.chunks.length;
                    //         // ?????????????????????????????????????????????arrayBuffer?????????????????????
                    //         _this.setState({
                    //             preUploading: false,
                    //             uploadParams: params,
                    //             arrayBufferData,
                    //             chunksSize: chunks,
                    //             preUploadPercent: 100
                    //         });
                    //     }
                    // };
                    //
                    // fileReader.onerror = function () {
                    //     console.warn('oops, something went wrong.');
                    // };
                    //
                    // var start = currentChunk * chunkSize,
                    //     end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    // fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));

                    //?????????????????????????????????????????????list
                    addFileDataSource({
                        params,
                        file: fileList,
                        cb: (data) => {
                            const {sourceConfig = {}} = data;
                            const {totalCount = 0, invalidCount = 0} = sourceConfig;
                            setLoading(false);
                            if (totalCount === 0 && invalidCount === 0) {
                                success(`${IntlFormatMessage('laboratory.anomaly.dataSourceAdded')}`);
                            } else {
                                success(`${IntlFormatMessage('laboratory.anomaly.dataUploaded')}${totalCount},${IntlFormatMessage('laboratory.anomaly.piecesFiltered')}${invalidCount}${IntlFormatMessage('datasource.create.totalItem')}`);
                            }
                            history.push('/datasource');
                        },
                        err: () => {
                            setLoading(false);
                        }
                    });
                } else {
                    error(dataType === 'TIME_SERIES' ?
                        IntlFormatMessage('datasource.create.timeAndMetricValue')
                        : dataType === 'LOG' ?
                            `${IntlFormatMessage('laboratory.anomaly.configureOriginalLog')}${(message === 'grok' && !grok) ? `${IntlFormatMessage('laboratory.anomaly.contentColumns')}` : ''}`
                            : IntlFormatMessage('laboratory.anomaly.originConfigures'));
                }
            });
        }
    };

    //step?????????
    const steps = [
        {
            title: IntlFormatMessage('datasource.detail.basicinformation'),
            content: <NewBasic
                form={form}
                handleNext={handleNext}
                fileList={fileList}
                setFileList={setFileList}
                loading={loading}
                setCsvSelectList={setCsvSelectList}
            />,
        },
        {
            title: IntlFormatMessage('datasource.detail.fieldsettings'),
            content: <NewSet
                form={form}
                handlePrev={handlePrev}
                csvSelectList={csvSelectList}
            />,
        }
    ];

    return (
        <Fragment>
            <div className={styles['offline-wrapper']}>
                <Steps current={current} style={{marginBottom: 40}}>
                    {
                        steps.map(item => {
                            return (
                                <Step key={item.title} title={item.title}/>
                            );
                        })
                    }
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
                <Button loading={loading} onClick={handleNext} type="primary">{
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
        addFileDataSource: dataSourceStore.addFileDataSource,
        offBasicData: dataSourceStore.offBasicData,
        offFiledSetData: dataSourceStore.offFiledSetData,
        updateAddList: dataSourceStore.updateAddList,
        addList: dataSourceStore.addList,
    };
})(Form.create()(NewFileSource));