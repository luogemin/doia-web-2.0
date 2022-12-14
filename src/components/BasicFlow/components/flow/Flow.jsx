import React, {useEffect, useRef, Fragment} from 'react';
import G6 from '@antv/g6';
import InitToolbarPlugin from './plugins/InitToolBarPlugin';
import Command from './plugins/CommandLifeCycle';
// import {commands, flowProps, graphBaseConfig} from './types';
import {initToolBarsCommand} from './commons/initCommands';
// import registerLayout from './layouts';
import registerShape from './shape';
import {mix, clone, isString} from '@antv/util';
import {FormattedMessage, injectIntl} from 'react-intl';
import {useFetchState} from "@/components/HooksState";

const language = localStorage.getItem('language');

const nodeToolTip = new G6.Tooltip({
    offsetX: 40,
    offsetY: -60,
    getContent(e) {
        const {fromModel = '-|-'} = e.item.getModel();
        const strings = fromModel.split('|');
        const outDiv = document.createElement('div');
        outDiv.className = 'nodeToolTip';
        outDiv.innerHTML = `<div class='container'>
            <div class='title'>${language === 'zh' ? '节点' : 'Node'}：</div>
            <div class='info'>${strings[0] || '-'}</div>
        </div>
        <div class='container'>
            <div class='title'>${language === 'zh' ? '服务' : 'Service'}：</div>
            <div class ='info'>${strings[1] || '-'}</div>
        </div>`
        return outDiv
    },
    itemTypes: ['node']
})
const Flow = (props) => {
    const {
        data,
        registerCustomNode,
        className,
        getGraph,
        toolBars,
        sideBar,
        customCommands,
        plugins,
        ...rest
    } = props;
    const [isReady, setIsReady] = useFetchState(false);
    const toolBarRef = useRef(null);
    const sideBarRef = useRef(null);
    const graph = useRef(null);
    const flowRef = useRef(null);
    const commandRef = useRef({});
    useEffect(() => {
        if (!graph.current) {
            // registerLayout(G6);
            registerShape(G6);
            if (registerCustomNode) {
                registerCustomNode(G6);
            }
            let _plugins = [];//[nodeToolTip];

            // 初始化 Command系统实例, 并保存到ref中, 保留在 数据更新或用户传入customCommands 时增加系统command的能力(通过在useEffect监听的变量更新时调用initPlugin实现)
            commandRef.current = new Command();
            _plugins.push(commandRef.current);

            const basePlugins = mix({
                toolBar: toolBarRef.current && InitToolbarPlugin
            }, plugins);
            Object.keys(basePlugins).forEach(plugin => {
                if (basePlugins[plugin]) {
                    if (plugin === 'toolBar') {
                        // 如果渲染工具栏就初始化 ToolBar 实例
                        _plugins.push(new basePlugins[plugin]({
                            container: toolBarRef.current
                        }));
                    } else {
                        _plugins.push(new basePlugins[plugin]());
                    }
                }
            });
            // const fisheye = new G6.Fisheye({
            //   trigger: 'mousemove',
            //   d: 1.5,
            //   r: 200,
            //   maxD: 10,
            //   showLabel: true,
            //   showDPercent: false,
            //   scaleDBy: 'drag'
            // });
            // console.log(fisheye);
            // plugins.push(fisheye);
            // 继承父元素的宽高
            const wrapperWidth = flowRef.current.offsetWidth;
            const wrapperHeight = flowRef.current.offsetHeight;
            // 注册Layout
            const baseConfig = {
                container: flowRef.current,
                height: wrapperHeight,
                width: wrapperWidth,
                plugins: _plugins
            };
            const mixConfig = mix(baseConfig, {
                ...rest
            });
            // @ts-ignore
            graph.current = new G6.Graph(mixConfig);

            // 根据 mode 不同 初始化对应的commands
            commandRef.current.initPlugin(graph.current, {
                ...initToolBarsCommand
            });
            initGlobalEvents(graph.current);
            // graph.current.data(data);
            // graph.current.render();
            graph.current.read(data)
            setIsReady(true);
            bindEvents(graph.current);
        }
        return () => {
            unbindGlobalEvents(graph.current);
            unbindEvents(graph.current);
            graph.current = null;
        };
    }, []);
    useEffect(() => {
        if (graph.current) {
            const {edges, nodes} = data
            const edgeList = [];
            const nodeList = [];
            nodes.forEach((node, index) => {
                const targetNode = nodes.filter(i => i.fromModelAndTargetJson === node.toModelAndTargetJson)[0];
                nodeList.push(Object.assign({}, node, {
                    // x: index * node.width * 2,
                    // y: 50,
                }));
                edgeList.push({
                    source: node.id,
                    target: !!targetNode ? targetNode.id : '',
                    "width": 150,
                    "height": 70,
                    "x": 400,
                    "y": 100,
                })
            })
            const result = {
                nodes: nodeList,
                edges: edgeList,
            }
            graph.current.read(data)
        }
    }, [data])
    useEffect(() => {
        if (getGraph && isReady) {
            getGraph(graph.current);
        }
    }, [getGraph, isReady]);

    useEffect(() => {
        if (customCommands) {
            commandRef.current.initPlugin(graph.current, customCommands);
        }
    }, [customCommands]);
    useEffect(() => {
        if (registerCustomNode && graph.current) {
            registerCustomNode(G6);
        }
    }, [registerCustomNode]);
    const emitEvent = (type, event) => {
        graph.current.executeCommand(type, {}, {
            event
        });
    };
    const bindEvents = (graph) => {
        graph.on('node:click', emitEvent.bind(this, 'onNodeClick'));
        graph.on('node:dblclick', emitEvent.bind(this, 'onNodeDoubleClick'));
        graph.on('canvas:click', emitEvent.bind(this, 'onCanvasClick'));
        // graph.on('addNode', addNode);
        graph.on('node:mouseleave', emitEvent.bind(this, 'onNodeMouseLeave'));
        graph.on('node:mouseover', emitEvent.bind(this, 'onNodeMouseOver'));
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
    const beforeCommandExecute = (params) => {
    };

    const afterCommandExecuted = (params) => {
    };

    const initGlobalEvents = (graph) => {
        graph.on('afterrender', () => {
            // graph.fitView()
        })
        graph.on('beforeCommandExecute', beforeCommandExecute);
        graph.on('afterCommandExecuted', afterCommandExecuted);
    };

    const unbindGlobalEvents = (graph) => {
        if (graph) {
            graph.off('beforeCommandExecute', beforeCommandExecute);
            graph.off('afterCommandExecuted', afterCommandExecuted);
        }
    };
    return <Fragment>
        {toolBars && React.cloneElement(toolBars, {
            ref: toolBarRef,
            graph: graph.current
        })}
        {
            sideBar && React.cloneElement(sideBar, {
                ref: sideBarRef,
                graph: graph.current
            })
        }
        <div className={className} ref={flowRef}></div>
    </Fragment>;
};
Flow.defaultProps = {
    registerCustomNode: () => {
    }
};
export default injectIntl(Flow);