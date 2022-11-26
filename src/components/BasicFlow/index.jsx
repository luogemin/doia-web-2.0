import React, {useEffect, useMemo, useRef} from 'react';
import ToolBar from './ToolBar';
import './index.less';
import initChainNode from './config';
import {Chain, G6, InitToolbarPlugin} from './components/flow';
import {guid} from "@/utils/util";

const config = {
    originalPoint: {
        x: 100,
        y: 100
    },
    nodeSepFunc: () => 150,
    rankSepFunc: () => 60,
    nodeSize: {
        width: 150,
        height: 70
    },
    rootMargin: 200
};

const CallChain = (props) => {
    const {className, command, data, rule, ...rest} = props
    const commands = useMemo(() => {
        return (data) => command;
    }, [data]);
    const filterCondition = (node) => {
        if (!rule || !rule.length) {
            return node
        }
        const {parentChain = [], fromModel} = node
        const content = [...(parentChain || [])].map(i => i.fromModel).concat(fromModel)
        const res = rule[0].map(i => content.includes(i)).filter(Boolean)
        return res.length < rule[0].length ? 0 : 1
    };
    const handleData = (node, parentList, filterCondition, list, parentId, parentChain) => {
        const id = guid().toString()
        const {callChainTopologyBasicList, fromModel} = node;
        if (!callChainTopologyBasicList || !callChainTopologyBasicList.length) {
            const isContain = filterCondition({
                ...node,
                id,
                parentChain
            })
            return {
                ...node,
                id,
                parentId,
                parentList,
                parentChain,
                isContain
            }
        }
        const _nextList = (callChainTopologyBasicList || []).map(list => {
            return handleData(list, parentList.concat(id), filterCondition, list, id, parentChain.concat(node))
        });
        const hasContain = _nextList.filter(i => i.isContain)
        const _node = {
            ...node,
            id,
            nextList: hasContain,
            //nextList: _nextList.filter(Boolean),
            parentId,
            parentList,
            parentChain,
            isContain: hasContain.length
        }
        return _node
    };
    const flat2Tree = (nodes) => {
        return nodes;
    };
    const _data = useMemo(() => {
        return (data || []).map(i => handleData(i, [], filterCondition, flat2Tree(data), '', [])).filter(Boolean);
    }, [data, rule]);
    return (
        <Chain
            modes={{
                default: ['drag-canvas']
            }}
            defaultNode={{
                type: 'callChainNode'
            }}
            defaultEdge={{
                type: 'callChainEdge'
            }}
            registerCustomNode={initChainNode}
            data={_data}
            config={config}
            customCommands={commands(data)}
            toolBars={<ToolBar/>}
            // sideBar={<SideBar/>}
            flowClassName={className}
            {...rest}
        />
    );
};

export default CallChain