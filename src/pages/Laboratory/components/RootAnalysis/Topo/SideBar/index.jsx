import React, {Fragment, useContext, useEffect, useMemo, useRef} from 'react'
import {Icon, Drawer, Progress, Tooltip, Form} from '@chaoswise/ui';
import {eventManager, IsInternationalization} from "@/utils/util";
import BasicScrollBar from "@/components/BasicScrollBar";
import {IntlFormatMessage} from "@/utils/util";
import G6 from '@antv/g6';
import styles from "../index.less";
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";

const colorUnit = {
    0: '#FF8781',
    1: '#FEB965',
    2: '#94E0ED',
}

const SideBar = (props) => {
    const {
        showSideBar, setShowSideBar, sideBarSelected, setSideBarSelected,
        setHandelSelectModalVisible,
        sideBarList = [], setSideBarList, sideBarTraceList,
        selfSideBarList = [], setSelfSideBarList,
        record = {}, rootCauseFeedBackAddAsync,
        graph,
    } = props;

    //点赞
    const giveThink = (type, params, index, from) => {
        if (from === 'hand') {
            setSelfSideBarList(prev => {
                return prev.map((item, cIndex) => {
                    if (index === cIndex) {
                        return Object.assign({}, item, type === '1' ?
                            {likeFlag: true, likeClick: true,} :
                            {unLikeFlag: true, unLikeClick: true}
                        )
                    }
                    return item;
                })
            })
        } else {
            setSideBarList(prev => {
                return prev.map((item, cIndex) => {
                    if (index === cIndex) {
                        return Object.assign({}, item, type === '1' ?
                            {likeFlag: true, likeClick: true,} :
                            {unLikeFlag: true, unLikeClick: true}
                        )
                    }
                    return item;
                })
            })
        }

        setTimeout(() => {
            giveThinkAfter(index, from)
        }, 1000)
        rootCauseFeedBackAddAsync({
            feedback: {
                approved: 1,
                positive: type,
                userTag: {
                    ...params,
                }
            },
            tuningBenchGenericId: record.id,
            entryNodeJson: record.entryNodeJson,
            entryMetricJson: record.entryMetricJson,

        }, {
            cb: () => {
            }
        })
    }

    const giveThinkAfter = (index, from) => {
        if (from === 'hand') {
            setSelfSideBarList(prev => {
                return prev.map((item, cIndex) => {
                    if (index === cIndex) {
                        return Object.assign({}, item, {
                                likeFlag: false, likeClick: false,
                                unLikeFlag: false, unLikeClick: false
                            }
                        )
                    }
                    return item;
                })
            })
        } else {
            setSideBarList(prev => {
                return prev.map((item, cIndex) => {
                    if (index === cIndex) {
                        return Object.assign({}, item, {
                            likeFlag: false, likeClick: false,
                            unLikeFlag: false, unLikeClick: false
                        })
                    }
                    return item;
                })
            })
        }
    }

    //高亮
    const textHighlight = (data) => {
        const result = data.reverse().map((itemSide, iIndex) => {
            return {
                model: itemSide[0],
                edge: iIndex + 1 < data.length ?
                    `${itemSide[0]}&&${data[iIndex + 1][0]}`
                    : '',
            }
        })
        graph(result)
    }

    useEffect(() => {
        return () => {
            graph([])
            setSideBarSelected('');
            setSelfSideBarList([]);
        }
    }, [])
    return <div className={styles["topo-sider-box"]} style={{
        display: showSideBar ? 'inline-block' : 'none'
    }}>
        <div className="flex-box topo-sider-box-header">
            <p>{IntlFormatMessage('laboratory.detail.faultLocalization')
            }:</p>
            <Icon type="close" className="header-close" onClick={() => {
                setShowSideBar(prev => !prev)
            }}/>
        </div>
        <div className="topo-sider-box-body">
            {
                (sideBarList || []).map((item, index) => {
                    const metricScoreObj = (!!item.metricScoreList && !!item.metricScoreList[0]) ? item.metricScoreList[0] : {};
                    const params = {
                        model: item.model,
                        target: item.target,
                        metric: metricScoreObj.metric || '',
                        tags: metricScoreObj.tags || '',
                    }
                    return <div
                        className="flex-box-start body-item"
                        key={index}
                        style={{
                            backgroundColor: sideBarSelected === item.node_id ? '#E7F7FF' : 'transparent',
                        }}
                    >
                        <div className="flex-box body-item-num" style={{
                            backgroundColor: !!colorUnit[index] ? colorUnit[index] : '#5FAFFF',
                        }}>{index + 1}</div>
                        <p className="body-item-text only-show-two-line" onClick={() => {
                            setSideBarSelected(item.node_id)
                            const trace = [].concat(sideBarTraceList[index]);
                            textHighlight(trace)
                        }}>
                            <Tooltip
                                title={
                                    IsInternationalization() ? `Root cause possibility ${!!metricScoreObj.metric ? `for ${metricScoreObj.metric}-${metricScoreObj.tags || ''}` : ''} of ${item.model || ''}-${item.target || ''}: ${Number((item.node_score * 100).toFixed(2))}%`
                                        :
                                        `${item.model || ''}-${item.target || ''}${!!metricScoreObj.metric ? `的${metricScoreObj.metric}-${metricScoreObj.tags || ''}` : ''}为根因的概率为:${Number((item.node_score * 100).toFixed(2))}%`
                                }
                                placement="topLeft"
                            >
                                {
                                    IsInternationalization() ?
                                        `${!!metricScoreObj.metric ? `${metricScoreObj.metric}-${metricScoreObj.tags || ''} of ` : ''}${item.model || ''}-${item.target || ''}`
                                        :
                                        `${item.model || ''}-${item.target || ''}${!!metricScoreObj.metric ? `的${metricScoreObj.metric}-${metricScoreObj.tags || ''}` : ''}`
                                }
                            </Tooltip>
                        </p>
                        <div className="body-item-progress">
                            <Tooltip title={`${Number((item.node_score * 100).toFixed(2))}%`}>
                                {/*<Progress*/}
                                {/*    percent={Number((item.node_score * 100).toFixed(2))}*/}
                                {/*    status="active"/>*/}
                                {Number((item.node_score * 100).toFixed(2))}%
                            </Tooltip>
                        </div>
                        <LikeIcon item={item} click={() => giveThink('1', params, index)}/>
                        <UnLikeIcon item={item} click={() => giveThink('0', params, index)}/>
                        {
                            sideBarSelected === item.node_id ?
                                <div className="body-item-selected-icon flex-box-center">
                                    <span className="icon">√</span>
                                </div>
                                : null
                        }
                    </div>
                })
            }

            <div className="flex-box body-item">
                {IntlFormatMessage('laboratory.detail.noDesiredOption')}&nbsp;<TooltipDiv onClick={() => {
                setHandelSelectModalVisible(true)
            }}> {IntlFormatMessage('laboratory.detail.manualSelection')}
            </TooltipDiv>
            </div>

            {
                (selfSideBarList || []).map((item, index) => {
                    const params = {
                        model: item.model,
                        target: item.target,
                        metric: item.metric,
                        tags: item.tags,
                        node_id: JSON.stringify({
                            model: item.model,
                            target: item.target,
                            index,
                        })
                    }
                    return <div
                        className="flex-box body-item"
                        key={index}
                        style={{backgroundColor: sideBarSelected === params.node_id ? '#E7F7FF' : 'transparent'}}
                    >
                        <p className="body-item-text" onClick={() => {
                            setSideBarSelected(params.node_id)
                            const result = [{
                                model: JSON.stringify({
                                    model: params.model,
                                    target: params.target,
                                })
                            }]
                            graph(result)
                        }}>
                            <Tooltip
                                title={IsInternationalization() ?
                                    `${item.metric}-${item.tags} of ${item.model}-${item.target}` :
                                    `${item.model}-${item.target}的${item.metric}-${item.tags}`

                                }
                                placement="topLeft"
                            >
                                {
                                    IsInternationalization() ? `${item.metric}-${item.tags} of ${item.model}-${item.target}` :
                                        `${item.model}-${item.target}的${item.metric}-${item.tags}`

                                }
                            </Tooltip>
                        </p>
                        <LikeIcon item={item} click={() => giveThink('1', params, index, 'hand')}/>
                        <UnLikeIcon item={item} click={() => giveThink('0', params, index, 'hand')}/>
                        {
                            sideBarSelected === params.node_id ?
                                <div className="body-item-selected-icon flex-box-center">
                                    <span className="icon">√</span>
                                </div>
                                : null
                        }
                    </div>
                })
            }
        </div>
    </div>
}

export default connect(({laboratoryStore, genericsStore, TopoStore}) => {
    return {
        rootCauseFeedBackAddAsync: laboratoryStore.rootCauseFeedBackAddAsync,
    };
})(Form.create()(SideBar));

const LikeIcon = (props) => {
    const {item, click} = props;

    return item.likeFlag ?
        <Icon type="like" theme="filled" className="body-item-hand" style={{
            color: '#FAAD14',
            fontSize: 24,
        }} onMouseDown={() => {
            click()
        }}/>
        :
        <Icon type="like" className="body-item-hand" onMouseDown={() => {
            click()
        }}/>
}

const UnLikeIcon = (props) => {
    const {item, click,} = props;

    return item.unLikeFlag ?
        <Icon type="dislike" theme="filled" className="body-item-hand" style={{
            color: 'rgba(0,0,0,0.65)',
            fontSize: 24,
        }} onMouseDown={() => {
            click()
        }}/>
        :
        <Icon type="dislike" className="body-item-hand" onMouseDown={() => {
            click()
        }}/>
}
