import React, {useMemo, useRef} from 'react';
import {baseConfig} from './config';
import {getBrotherChildrenCount, calcNodePosition} from './util';
import Flow from '../Flow';
import {guid} from "@/utils/util";
import {omit} from 'lodash-es';

const Chain = (props) => {
    const {data, config, flowClassName, graph, ...rest} = props;
    const currentMaxY = useRef(0);
    const buildTree = (combo, config, index = 0, deep, list, parentId) => {
        const {nextList = []} = combo;
        const isRoot = parentId === '';
        const id = guid().toString()
        const count = getBrotherChildrenCount(list, index);
        const node = calcNodePosition(isRoot, config, combo, count, deep);
        const childNodes = (nextList || []).reduce((t, c, index, list) => {
            const children = buildTree(c, {
                ...config, parentNodePosition: {
                    x: node.x,
                    y: node.y
                }
            }, index, deep + 1, list, id);
            return t.concat(...children);
        }, []);
        return [{
            ...node,
            isRoot,
            deep,
            // id,
            // parentId
        }, ...childNodes];
    };
    const chainConfig = useMemo(() => {
        return {
            ...baseConfig,
            ...config
        };
    }, [config]);
    const createEdges = (nodes) => {
        return (nodes || []).reduce((t, c, index, list) => {
            const {id, ...rest} = c;
            const target = list.filter(i => i.parentId === id);
            return t.concat(...target.map(i => {
                if (!!i.backToModelAndTargetJson) {
                    return [{
                        source: i.id.toString(),
                        target: nodes.filter(first => first.fromModelAndTargetJson === i.backToModelAndTargetJson)[0].id,
                        ...omit(target, 'metricMap')
                    }, {
                        source: id.toString(),
                        target: i.id.toString(),
                        ...omit(target, 'metricMap')
                    }]
                }
                return {
                    source: id.toString(),
                    target: i.id.toString(),
                    ...omit(target, 'metricMap')
                }
            }));
        }, []);
    };
    const _data = useMemo(() => {
        const {nodes, edges} = data.reduce((t, lists, index) => {
            const {nodes, edges} = t;
            const config = {
                ...chainConfig,
                originalPoint: {
                    x: chainConfig.originalPoint.x,
                    y: index === 0 ? chainConfig.originalPoint.y : chainConfig.rootMargin + currentMaxY.current
                }
            };
            const currentNode = buildTree(lists, config, undefined, 0, [], '');
            const maxY = currentNode.reduce((t, c, index) => {
                if (index === 0) {
                    return c.y;
                } else {
                    return t > c.y ? t : c.y;
                }
            }, 0);
            currentMaxY.current = maxY;
            return {
                nodes: nodes.concat(...currentNode),
                edges: [...edges, ...createEdges(currentNode)]
            };
        }, {
            nodes: [],
            edges: []
        });
        return {
            nodes,
            edges
        };
    }, [data, chainConfig]);
    return <Flow
        className={flowClassName}
        data={_data}
        {...rest}
    />;
};

export default Chain;