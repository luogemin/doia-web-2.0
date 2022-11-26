import {fittingString} from './components/flow/tools';
import disaster from './assets/node-icon-disaster.svg';
import critical from './assets/node-icon-critical.svg';
import average from './assets/node-icon-average.svg';
import warning from './assets/node-icon-warning.svg';
import information from './assets/node-icon-information.svg';
import normal from './assets/node-icon-normal.svg';
import notClassified from './assets/node-icon-notClassified.svg';

const iconEnum = {
    'disaster': disaster,
    'critical': critical,
    'average': average,
    'warning': warning,
    'information': information,
    'normal': normal,
    'notClassified': notClassified
};

const initChainNode = (G6) => {
    G6.registerNode('callChainNode', {
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
        // setState(name, value, item) {
        //     const group = item.getContainer()
        //     const shape = group.get('children')[0]
        //     console.log(shape, 'group')
        // if (name === 'selected') {
        //     if (value) {
        //         shape.attr('fill', 'red')
        //     } else {
        //         shape.arrt('fill', 'transparent')
        //     }
        // }
        // },
        draw(cfg, group) {
            const {
                width,
                height,
                fromModel = '',
                fromTarget = '',
                nodeName,
                serviceId,
                metricMap,
                anchorPoints,
                isRoot,
                x,
                y
            } = cfg;
            const {healthScore, callChainFail, callChainTime} = metricMap || {};
            const strings = `${fromModel}_${fromTarget}`;
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
            // this.drawAnchors(cfg, group);
            // group.addShape('image', {
            //   attrs: {
            //     x: 16,
            //     y: 13,
            //     width: 12,
            //     height: 12,
            //     // img: iconEnum[getHealthKeyByScore(healthScore)],
            //     cursor: 'pointer'
            //   },
            //   name: 'icon'
            // });
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
                    text: fittingString(strings, width * 0.8, 12),
                    // text: fittingString(nodeName, 80, 12),
                    fill: '#262626',
                    x: (width * 0.1),
                    y: 14,
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
        drawAnchors(cfg, group) {
            const {anchorPoints, width, height} = cfg;
            if (anchorPoints && anchorPoints.length) {
                anchorPoints.forEach((anchor, index) => {
                    group.addShape(`circle`, {
                        attrs: {
                            r: 0,
                            fill: '#fff',
                            stroke: '#A7B8C9',
                            cursor: 'pointer',
                            x: anchor[0] > 0 ? width : 0,
                            y: anchor[1] !== 0.5 ? 0 : (height * 0.5)
                        },
                        draggable: true,
                        name: `anchor-${index}`
                    });
                });
            }
        }
    }, 'rect');
    G6.registerEdge('callChainEdge', {
        itemType: 'edge',
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
            const {metricMap = {}} = cfg;
            let needBack = null;
            if (!!cfg.sourceNode._cfg.model.backToModelAndTargetJson) {
                needBack = cfg.sourceNode._cfg.model;
            }

            const {
                callChainFail,
                callChainTime
            } = metricMap;
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;
            const path = !!needBack ? [
                ['M', startPoint.x + needBack.width, startPoint.y],
                ['L', startPoint.x + needBack.width * 3 / 2, startPoint.y], // 三分之一处
                ['L', startPoint.x + needBack.width * 3 / 2, startPoint.y + needBack.height], // 三分之一处
                ['L', endPoint.x - needBack.width / 2, startPoint.y + needBack.height], // 三分之二处
                ['L', endPoint.x - needBack.width / 2, endPoint.y + needBack.height / 2]
            ] : [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
                ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
                ['L', endPoint.x - 3, endPoint.y]
            ]
            const shape = group.addShape('path', {
                attrs: {
                    stroke: '#A7B8C9',
                    lineWidth: 1,
                    // startArrow: {
                    //   path: G6.Arrow.circle(3, -3),
                    //   stroke: '#A7B8C9',
                    //   d: 0
                    // },
                    endArrow: {
                        path: 'M 0,0 L 8,4 L 8,-4 Z',
                        // d: 1,
                        fill: '#A7B8C9',
                        stroke: '#A7B8C9',
                        lineWidth: 1
                    },
                    path: path,
                },
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: 'path-shape',
                className: 'path-shape'
            });
            group.addShape('text', {
                attrs: {
                    textBaseline: 'top',
                    text: Reflect.has(metricMap, 'callChainTime') ? `${callChainTime.toString() || '-'}ms` : '',
                    fill: 'rgba(40, 47, 89, 0.8)',
                    x: endPoint.x - 30,
                    y: endPoint.y - 20,
                    textAlign: 'center',
                    fontSize: 12
                },
                draggable: true,
                name: 'lineName1',
                className: 'lineName'
            });
            group.addShape('text', {
                attrs: {
                    textBaseline: 'top',
                    text: Reflect.has(metricMap, 'callChainFail') ? `${callChainFail.toString() || '-'}/min` : '',
                    fill: 'rgba(40, 47, 89, 0.8)',
                    x: endPoint.x - 30,
                    y: endPoint.y + 10,
                    textAlign: 'center',
                    fontSize: 12
                },
                draggable: true,
                name: 'lineName2',
                className: 'lineName'
            });
            return shape;
        },
    }, 'line');
};
export default initChainNode;