import React, {useEffect, useMemo, useRef} from 'react'
import CallChain from "@/components/BasicFlow";

const Flow = props => {
    const {data = {}, setSelectedNode, setSelectedCallChainId, ...rest} = props
    const selectNodesIdList = useRef({
        selected: [],
        hover: []
    })
    const {callChainTypologies, callChainVo = {}} = data;

    const getRule = (factor) => {
        return factor.map(i => {
            return i.map(j => j.throughNode)
        })
    }
    const getChain = (node) => {
        const parent = node.parentList;
        const child = returnChildId(node.nextList || []);
        return [...parent, node.id, ...child].filter(Boolean);
    };
    const returnChildId = (list) => list.reduce((t, c) => {
        const {nextList, id} = c;
        const res = returnChildId(nextList || []);
        return t.concat(id, ...res);
    }, []);
    const nodeDoubleClick = (graph, params) => {
        const {event} = params;
        const node = event.item;
        setSelectedNode([node._cfg.model])
        const selectedNodes = graph.findAllByState('node', 'selected');
        const selectedEdges = graph.findAllByState('edge', 'selected');
        const hoverNodes = graph.findAllByState('node', 'hover');
        const hoverEdges = graph.findAllByState('edge', 'hover');
        [...selectedNodes, ...hoverNodes, ...selectedEdges, ...hoverEdges].filter(Boolean).forEach(item => {
            graph.setItemState(item, 'hover', false);
            graph.setItemState(item, 'selected', false);
        });
        graph.setItemState(node, 'selected', true);
    };
    const changeNodeState = (graph, params, type) => {
        const {event} = params;
        const node = event.item;
        const idList = getChain(node._cfg.model);
        selectNodesIdList.current[type] = idList;
        const hasSelected = node.hasState(type);
        idList.forEach(id => {
            const edges = graph.findById(id.toString()).getInEdges();
            edges.forEach(edge => {
                const {_cfg: {model: {source}}} = edge
                idList.includes(source) && graph.setItemState(edge, type, !hasSelected);
            });
            graph.setItemState(id.toString(), type, !hasSelected);
        });
    };
    const cancelSelected = (graph, type) => {
        const selectedNodes = graph.findAllByState('node', 'selected');
        (selectNodesIdList.current[type].concat(...selectedNodes.map(node => node._cfg.id))).filter(Boolean).forEach(id => {
            const edges = graph.findById(id.toString()).getInEdges();
            edges.forEach(edge => {
                graph.setItemState(edge, type, false);
            });
            graph.setItemState(id.toString(), type, false);
        });
        selectNodesIdList.current[type] = [];
    };
    const command = useMemo(() => {
        return ({
            onNodeClick: {
                name: 'onNodeClick',
                execute(graph, params) {
                    cancelSelected(graph, 'selected')
                    changeNodeState(graph, params, 'selected');
                }
            },
            onNodeDoubleClick: {
                name: 'onNodeDoubleClick',
                execute(graph, params) {
                    nodeDoubleClick(graph, params);
                }
            },
            onNodeMouseOver: {
                name: 'onNodeMouseOver',
                execute(graph, params) {
                    changeNodeState(graph, params, 'hover');
                }
            },
            onNodeMouseLeave: {
                name: 'onNodeMouseLeave',
                execute(graph, params) {
                    cancelSelected(graph, 'hover');
                    // changeNodeState(graph, params, 'selected');
                }
            },
            onCanvasClick: {
                name: 'onCanvasClick',
                execute(graph) {
                    cancelSelected(graph, 'selected');
                    setSelectedNode([])
                }
            },
            onNodeSelected: {
                name: 'onNodeSelected',
                execute(graph, params) {
                    changeNodeState(graph, params, 'hover');
                }
            }
        })
    }, [callChainTypologies])
    const rule = useMemo(() => {
        const {callChainShowRule} = callChainVo || {};
        return callChainShowRule ? getRule(JSON.parse(callChainShowRule)) : null
    }, [callChainVo])
    useEffect(() => {
        if (callChainTypologies && callChainTypologies.length) {
            setSelectedCallChainId(callChainTypologies[0].rootGroupId)
        }
    }, [callChainTypologies])
    useEffect(() => {
        return () => {
            setSelectedNode([])
        }
    }, [])
    return <CallChain data={callChainTypologies} command={command} rule={rule} {...rest}/>
}

export default Flow