import G6 from '@antv/g6';
import React, {useEffect, useMemo, useRef} from "react";
import {fittingString} from "@/components/BasicFlow/components/flow/tools";
import ToolBar from "@/components/BasicFlow/ToolBar";
import {useFetchState} from "@/components/HooksState";

const width = 100;
const height = 40;
G6.registerNode('customizedNode', {
    options: {
        stateStyles: {
            hover: {
                stroke: '#008DFF',
                fill: '#FFFFFF',
                lineWidth: 2
            },
            selected: {
                stroke: '#008DFF',
                fill: '#FFFFFF',
                lineWidth: 2
            }
        }
    },
    draw(cfg, group) {
        const {
            label,
            x,
            y
        } = cfg;

        const shape = group.addShape('rect', {
            attrs: {
                width,
                height,
                fill: '#FFFFFF',
                //stroke: 'transparent',
                radius: 3,
                shadowOffsetX: 0,
                shadowBlur: 4,
                shadowColor: 'rgba(55,70,95,0.2)',
                shadowOffsetY: 2,
                cursor: 'pointer'
            },
            draggable: true,
            name: 'background'
        });
        group.addShape('rect', {
            attrs: {
                width: 4,
                radius: 3,
                height,
                x: -2,
                y: 0,
                fill: '#008DFF',
                // fill: '#D8D8D8',
                // stroke: 'rgba(123,128,168,0.3)',
            },
            name: 'border-box'
        });
        group.addShape('text', {
            attrs: {
                textBaseline: 'top',
                text: fittingString(label, width * 0.8, 12),
                // text: fittingString(nodeName, 80, 12),
                fill: '#262626',
                x: (width * 0.1),
                y: 8,
                // textAlign: 'center',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
            },
            draggable: true,
            name: 'nodeName'
        });
        return shape;
    },
}, 'rect');
G6.registerEdge('customizedEdge', {
    itemType: 'edge',
    labelPosition: 'center',
    labelAutoRotate: true,
    options: {
        stateStyles: {
            hover: {
                stroke: '#008DFF',
                lineWidth: 2,
                endArrow: {
                    path: 'M 0,0 L 8,4 L 8,-4 Z',
                    fill: '#008DFF',
                    stroke: '#008DFF',
                    lineWidth: 1
                }
            },
            selected: {
                stroke: '#008DFF',
                lineWidth: 2,
                endArrow: {
                    path: 'M 0,0 L 8,4 L 8,-4 Z',
                    fill: '#008DFF',
                    stroke: '#008DFF',
                    lineWidth: 1
                }
            }
        }
    },
    draw(cfg, group) {
        const {startPoint = {}, endPoint = {}} = cfg;
        const {width = 0, height = 0} = cfg.targetNode._cfg.model;

        const shape = group.addShape('path', {
            attrs: {
                stroke: '#A7B8C9',
                lineWidth: 1,
                endArrow: {
                    path: 'M 0,0 L 8,4 L 8,-4 Z',
                    // d: 1,
                    fill: '#A7B8C9',
                    stroke: '#A7B8C9',
                    lineWidth: 1
                },
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
                    ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
                    ['L', endPoint.x - 3, endPoint.y]
                ]
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'path-shape',
            className: 'path-shape'
        });
        return shape;
    },
    // 响应状态变化
    // setState(name, value, item) {
    //     const group = item.getContainer();
    //     const shape = group.get('children')[0];
    //
    //     if (['hover', 'selected'].includes(name)) {
    //         // if (value) {
    //         shape.attr('stroke', '#008DFF');
    //         shape.attr('lineWidth', 2);
    //         // } else {
    //         //     shape.attr('stroke', '#A7B8C9');
    //         //     shape.attr('lineWidth', 1);
    //         // }
    //     }
    // },
});

const TopoWilr = (props) => {
    const {
        data = {nodes: [], edges: []}, setSelectedNode, getGraph, onReady, showSideBar, lineType = 'polyline',
        ...rest
    } = props;

    const graph = useRef(null);
    const selectNodesIdList = useRef({
        selected: [],
        hover: []
    });

    const [graphReady, setGraphReady] = useFetchState(null);

    /**
     * @description: 建立节点关系
     * @param {object} data
     * @return {object}
     */
    const establishRelation = (data) => {
        const {edges = [], nodes = [], combos = []} = data || {};
        const node = nodes.map(item => ({...item}));

        edges.forEach(item => {
            const p = node.find(items => items.id == item.source);

            if (p && p.cid) {
                p.cid.push(item.target);
            } else if (p) {
                p.cid = [item.target];
            }

            const c = node.find(items => items.id === item.target);

            if (c && c.pid) {
                c.pid.push(item.source);
            } else if (c && p) {
                c['pid'] = [item.source];
            }
        });

        return {nodes: node, edges, combos};
    };
    /**
     * @description:
     * @param {string} key 递归查找的key
     * @param {string} id 当前id
     * @param {array} data 节点数组
     */
    const searchRecursive = (key = '', id = '', data = [], keyArray) => {
        try {
            const _keyArray = keyArray || [];
            if (_keyArray.length < 15) {
                const node = data.find(item => item.id === id) || {};
                const item = node.model || {};

                if (!item[key]) return [];

                item[key].map(i => {
                    _keyArray.push(i);
                    return searchRecursive(key, i, data, _keyArray);
                });
            }
            return _keyArray;

        } catch (err) {
            console.log(err);
        }
    };

    const returnChildId = (list) => list.reduce((t, c) => {
        const {nextList, id} = c;
        const res = returnChildId(nextList || []);
        return t.concat(id, ...res);
    }, []);
    const nodeDoubleClick = (graph, params) => {
        const node = params._cfg.model;
        setSelectedNode([node]);
        // const selectedNodes = graph.findAllByState('node', 'selected');
        // const selectedEdges = graph.findAllByState('edge', 'selected');
        // const hoverNodes = graph.findAllByState('node', 'hover');
        // const hoverEdges = graph.findAllByState('edge', 'hover');
        // [...selectedNodes, ...hoverNodes, ...selectedEdges, ...hoverEdges].filter(Boolean).forEach(item => {
        //     graph.setItemState(item, 'hover', false);
        //     graph.setItemState(item, 'selected', false);
        // });
        // graph.setItemState(node, 'selected', true);
    };
    const changeNodeState = (graph, node = {}, type) => {
        const {_cfg = {}} = node;
        const {id} = _cfg.model;
        const nodes = (graph.getNodes() || []).map(node => node._cfg);
        if (type === 'selected' && !rest.selectNodeToCheck) {
            const selectedNodes = nodes.filter(i => i.id === id);
            setSelectedNode(selectedNodes);
        }
        const pidArray = searchRecursive('pid', id, nodes, []);
        const cidArray = searchRecursive('cid', id, nodes, []);

        const idList = [id].concat(pidArray).concat(cidArray);
        selectNodesIdList.current[type] = idList;
        const hasSelected = node.hasState(type);
        idList.forEach(id => {
            const edges = graph.findById(id.toString()).getInEdges();
            edges.forEach(edge => {
                const {_cfg: {model: {source}, id,}} = edge;
                idList.includes(source) && graph.setItemState(edge._cfg.id.toString(), type, !hasSelected);
            });
            graph.setItemState(id.toString(), type, !hasSelected);
        });
    };
    //链路高亮专用
    const changeNodeStateSideBar = (graph, nodeList = [{}], type) => {
        const {idList, edgeList} = nodeList.reduce((prev, node) => {
            return Object.assign({}, prev, {
                idList: prev.idList.concat(node.model),
                edgeList: prev.edgeList.concat(node.edge),
            });
        }, {
            idList: [],
            edgeList: [],
        });

        selectNodesIdList.current[type] = idList;
        idList.forEach(id => {
            const edges = graph.findById(id.toString()).getInEdges();
            edges.forEach(edge => {
                const {_cfg: {model: {source}, id,}} = edge;
                edgeList.includes(id) && graph.setItemState(edge._cfg.id.toString(), type, true);
            });
            graph.setItemState(id.toString(), type, true);
        });
        // edgeList.forEach(id => {
        //     graph.setItemState(id.toString(), type, true);
        // });
    };
    const cancelSelected = (graph, type) => {
        if (graph) {
            const selectedNodes = graph.findAllByState('node', 'selected');
            (selectNodesIdList.current[type].concat(...selectedNodes.map(node => node._cfg.id))).filter(Boolean).forEach(id => {
                const edges = graph.findById(id.toString()).getInEdges();
                edges.forEach(edge => {
                    graph.setItemState(edge, type, false);
                });
                graph.setItemState(id.toString(), type, false);
            });
            selectNodesIdList.current[type] = [];
        }
    };
    const command = useMemo(() => {
        return {
            onNodeDoubleClick: (e => {
                nodeDoubleClick(graph.current, e.item);
            }),
            onNodeMouseOver: (e => {
                changeNodeState(graph.current, e.item, 'hover');
            }),
            onNodeMouseLeave: (e => {
                cancelSelected(graph.current, 'hover');
            }),
            onCanvasClick: (e => {
                cancelSelected(graph.current, 'selected');
                setSelectedNode([]);
            }),
            onNodeSelected: (e => {
                changeNodeState(graph.current, e.item, 'hover');
            }),
            onNodeClick: (e => {
                cancelSelected(graph.current, 'selected');
                changeNodeState(graph.current, e.item, 'selected');
            }),
        };
    }, [data]);

    useEffect(() => {
        if (!!data && !!data.nodes.length) {
            const container = document.getElementById('topo-box');
            const width = container.scrollWidth;
            const height = container.scrollHeight || 500;
            const nodeToolTip = new G6.Tooltip({
                offsetX: 40,
                offsetY: -60,
                getContent(e) {
                    const {_cfg = {}} = e.item;
                    const {model = {}} = _cfg;
                    const outDiv = document.createElement('div');
                    outDiv.className = 'nodeToolTip';
                    outDiv.innerHTML = `<div class='container'>
            <div class='title'>${'Node'}：</div>
            <div class='info'>${model.label || '-'}</div>
        </div>`;
                    return outDiv;
                },
                itemTypes: ['node']
            });

            !!graph.current && graph.current.clear();
            !!graph.current && graph.current.destroy();
            !!graph.current && unbindEvents(graph.current);
            graph.current = null;
            graph.current = new G6.Graph({
                container: container,
                width,
                height,
                fitView: true,
                modes: {
                    default: ['drag-canvas', 'drag-node'],
                },
                layout: {
                    type: (data?.edges?.length) ? 'dagre' : 'grid',
                    rankdir: 'LR',
                    sortByCombo: true,//同一层节点是否根据每个节点数据中的 comboId 进行排序，以防止 combo 重叠
                    // workerEnabled: true,
                    preventOverlap: true, //'grid'布局时，防止重叠
                    nodeSize: 100,
                    preventOverlapPadding: 50, //避免重叠时节点的间距 padding。preventOverlap 为 true 时生效
                    // cols: Math.floor(width / 150), //网格的列数，为 undefined 时算法根据节点数量、布局空间、rows（若指定）自动计算
                    nodeSep: 10,
                    rankSep: 50,
                },
                defaultNode: {
                    type: 'customizedNode'
                },
                defaultEdge: {
                    type: lineType,
                    style: {
                        stroke: '#A7B8C9',
                        lineWidth: 1,
                        endArrow: {
                            // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
                            path: 'M 0,0 L 8,4 L 8,-4 Z',
                            // d: 1,
                            fill: '#A7B8C9',
                            stroke: '#A7B8C9',
                            lineWidth: 1
                        },
                    },
                    stateStyles: {
                        stroke: '#008DFF',
                        lineWidth: 2,
                        hover: {
                            stroke: '#008DFF',
                            lineWidth: 2,
                            endArrow: {
                                path: 'M 0,0 L 8,4 L 8,-4 Z',
                                fill: '#008DFF',
                                stroke: '#008DFF',
                                lineWidth: 1
                            }
                        },
                        selected: {
                            stroke: '#008DFF',
                            lineWidth: 2,
                            endArrow: {
                                path: 'M 0,0 L 8,4 L 8,-4 Z',
                                fill: '#008DFF',
                                stroke: '#008DFF',
                                lineWidth: 1
                            }
                        }
                    }
                },
                plugins: [nodeToolTip]
            });
            // graph.current.initPlugin(graph.current, command);
            const endData = establishRelation(data);

            graph.current.data(endData);
            setTimeout(() => {
                if (endData.nodes.length <= 8) {
                    graph.current.zoom(0.4);
                    graph.current.fitCenter(); //画布中心对齐
                } else {
                    graph.current.zoomTo(1);
                    graph.current.fitView(); //自适应画布大小
                }
            });
            graph.current.render();

            setGraphReady(graph.current);
            onReady({graph: graph.current, graphBox: container});
            getGraph((traceList) => {
                if (!!traceList && !!traceList.length) {
                    // const nodes = graph.current.getNodes();
                    // const nodesObj = nodes.reduce((prev, cent) => {
                    //     const obj = JSON.parse(cent._cfg.id);
                    //     return Object.assign({}, prev, {
                    //         [`${obj.model}-${obj.target}`]: cent,
                    //     });
                    // }, {});
                    // const nodeList = ids.map(id => {
                    //     const obj = JSON.parse(id);
                    //     return nodesObj[`${obj.model}-${obj.target}`];
                    // });
                    // if (nodeList) {
                    cancelSelected(graph.current, 'selected');
                    changeNodeStateSideBar(graph.current, traceList, 'selected');
                    // } else {
                    //     cancelSelected(graph.current, 'selected');
                    // }
                } else {
                    cancelSelected(graph.current, 'selected');
                }
            });
            !!graph.current && bindEvents(graph.current);
        }
    }, [data, rest.selectNodeToCheck, lineType]);

    useEffect(() => {
        return () => {
            !!graph.current && graph.current.clear();
            !!graph.current && graph.current.destroy();
            !!graph.current && unbindEvents(graph.current);
            graph.current = null;
        };
    }, []);

    const emitEvent = (type, event) => {
        graph.current.executeCommand(type, {}, {
            event
        });
    };
    const bindEvents = (graph) => {
        if (!rest.selectNodeToCheck) {
            graph.on('node:click', command.onNodeClick);
        } else {
            graph.on('node:dblclick', command.onNodeDoubleClick);
        }
        graph.on('canvas:click', command.onCanvasClick);
        // graph.on('addNode', addNode);
        graph.on('node:mouseleave', command.onNodeMouseLeave);
        graph.on('node:mouseover', command.onNodeMouseOver);
        // graph.on('dragLineMoving', dragLineMoving);
        // graph.on('keydown', keyDown);
        // graph.on('addEdge', addEdge);
        // graph.on('edge:click', edgeClick);
        // graph.on('edge:dblclick', edgeDoubleClick);
    };
    const unbindEvents = (graph) => {
        graph.on('node:click', emitEvent);
        graph.on('node:dblclick', emitEvent);
        graph.on('canvas:click', emitEvent);
        // graph.on('addNode', addNode);
        graph.on('node:mouseleave', emitEvent);
        graph.on('node:mouseover', emitEvent);
        // graph.on('dragLineMoving', dragLineMoving);
        // graph.on('keydown', keyDown);
        // graph.on('addEdge', addEdge);
        // graph.on('edge:click', edgeClick);
        // graph.on('edge:dblclick', edgeDoubleClick);
    };

    return <div id="topo-box">
        <ToolBar
            graph={graphReady}
            lineType={lineType}
            {...rest}
        />
    </div>;

};

export default TopoWilr;
