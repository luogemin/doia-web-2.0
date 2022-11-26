import React, {useRef, useEffect, useContext, useCallback} from 'react'
import {Select} from "@chaoswise/ui";
import {connect, toJS} from "@chaoswise/cw-mobx";
import SideBar from "./SideBar/index";
import styles from "./index.less";
import Flow from "./Flow";

const Option = Select.Option
const g6Config = {
    left: 50,
    top: 100,
    nodeMaxWidth: 157,
    nodeMaxHeight: 66,
    nodeMargin: 60,
    lineWidth: 160
}
const Topo = (props) => {
    const {
        data,
        setSelectedNode,
        setSelectedCallChainId,
        selectedNode,
        selectedCallChainId,
        ...rest
    } = props;

    // 监听调用链切换
    return <div className={styles['topo']}>
        {/*<SideBar*/}
        {/*    match={match}*/}
        {/*    location={location}*/}
        {/*    isCallChain={true}*/}
        {/*    summary={summary}*/}
        {/*/>*/}
        <Flow className={'flow'} data={data} setSelectedNode={setSelectedNode}
              setSelectedCallChainId={setSelectedCallChainId} {...rest}/>
    </div>
}

export default connect(({laboratoryStore, TopoStore, store}) => {
    return {
        setSelectedNode: TopoStore.setSelectedNode,
        selectedNode: TopoStore.selectedNode,
        setSelectedCallChainId: TopoStore.setSelectedCallChainId,
        selectedCallChainId: TopoStore.selectedCallChainId,

    };
})(Topo)