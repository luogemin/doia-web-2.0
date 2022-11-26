/*
 * @Author: tiger.wang
 * @Date: 2021-07-06 10:37:55
 * @LastEditors: your name
 * @LastEditTime: 2021-08-18 09:57:15
 * @Description: In User Settings Edit
 */

import './g6.js';
import './Behavior/collapseExpand.js';
import {
    CANVAS_PADDING_LEFT,
    NODE_HEIGHT,
    NODE_OFFSET_WIDTH,
    COMBO_VERTICAL,
    COMBO_MARGIN_RIGHT,
    CANVAS_PADDING_TOP,
    COMBO_PADDING_HORIZONTAL
} from './constan.js';

export default class Index {
    graph = null;// G6 实例
    combosKey = {};// 记录-组

    /**
     * @description: 初始化
     * @param {*}
     */
    init() {
        this.graph = new G6.Graph({
            container: 'canvas',
            width: 1300,
            height: 900,
            modes: {
                default: ['collapseExpand'],
            },
            defaultNode: {
                type: 'customizedNode'
            },
            defaultEdge: {
                type: 'customizedEdge'
            },
            defaultCombo: {
                type: 'customizedCombo',
            }
        });
    }

    /**
     * @description: 更新数据
     * @param {Object} data
     */
    update(data) {
        this.recordCombos(data);
        const locationData = this.locationCalculate(data) || {};
        const endData = this.establishRelation(locationData);
        this.graph.data(endData);
        this.graph.render();
    }

    /**
     * @description: 记录组
     * @param {data} data
     */
    recordCombos({ combos = [], nodes = [] }) {
        const _combosKey = {};
        const comboSort = combos.sort((a, b) => a.layer - b.layer);
        const lastLayer = comboSort[comboSort.length - 1]?.layer;

        combos.forEach(item => {
            if (item.id) _combosKey[item.id] = { ...item };
            item.isLastLayer = !(item.layer < lastLayer);
        });

        nodes.forEach(item => {
            if (!_combosKey[item.comboId].num) _combosKey[item.comboId].num = 0;
            _combosKey[item.comboId].num++;
        });

        this.combosKey = _combosKey;
    }

    /**
     * @description: 建立节点关系
     * @param {object} data
     * @return {object}
     */
    establishRelation(data) {
        const { edges = [], nodes = [], combos = [] } = data || {};
        const node = nodes.map(item => ({ ...item }));

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
            } else if (p) {
                c.pid = [item.source];
            }
        });

        return { nodes: node, edges, combos };
    }


    /**
     * @description:
     * @param {string} key 递归查找的key
     * @param {string} id 当前id
     * @param {array} data 节点数组
     */
    searchRecursive(key = '', id = '', data = [], keyArray) {
        const _keyArray = keyArray || [];
        const { _cfg = {} } = data.find(item => item._cfg.id === id) || {};
        const item = _cfg.model || {};

        if (!item[key]) return [];

        item[key].map(i => {
            _keyArray.push(i);
            return this.searchRecursive(key, i, data, _keyArray);
        });

        return _keyArray;
    }

    /**
     * @description: 高亮
     * @param {*}
     */
    highlighted() {
        const graph = this.graph;

        graph.on('node:mouseenter', ({ item = {} }) => {
            const { id } = item._cfg || {};
            const nodes = this.graph.getNodes() || [];
            const pidArray = this.searchRecursive('pid', id, nodes, []);
            const cidArray = this.searchRecursive('cid', id, nodes, []);
            const nodeArr = [id, ...pidArray, ...cidArray];

            graph.getEdges()?.map(i => {
                const item = i?._cfg?.model || {};
                const findArray = nodeArr.filter(id => id === item.source || id === item.target);
                if (findArray.length == 2) {
                    graph.setItemState(i, 'active', true);
                }
            });
        });

        graph.on('node:mouseleave', ev => {
            graph.getEdges()?.map(i => {
                graph.setItemState(i, 'active', false);
            });
        });
    }

    /**
     * @description: 位置计算
     * @param {object} data
     * @return {object}
     */
    locationCalculate(data = { nodes: [], edges: [], combos: [] }) {
        const num = {};
        const { nodes = [], edges = [], combos = [] } = data;

        return {
            combos,
            nodes: nodes.map(item => {
                const { layer = 0, groupIndex = 1 } = this.combosKey[item.comboId];
                const { id = '' } = combos.find(item => item.layer === layer && item.groupIndex === groupIndex - 1) || {};
                const beforeNodeNum = this.combosKey[id]?.num || 0;

                if (num[item.comboId] >= 0) num[item.comboId]++;

                if (!num[item.comboId] && num[item.comboId] !== 0) num[item.comboId] = 0;

                return {
                    ...item,
                    layer,
                    x: CANVAS_PADDING_LEFT + (beforeNodeNum + num[item.comboId]) * NODE_OFFSET_WIDTH + COMBO_PADDING_HORIZONTAL + (beforeNodeNum ? COMBO_MARGIN_RIGHT : 0),
                    y: (layer - 1) * (COMBO_VERTICAL + NODE_HEIGHT) + CANVAS_PADDING_TOP
                };
            }),
            edges
        };
    }
}