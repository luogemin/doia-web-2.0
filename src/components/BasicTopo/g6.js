/*
 * @Author: tiger.wang
 * @Date: 2021-07-06 10:43:14
 * @LastEditors: your name
 * @LastEditTime: 2021-08-18 09:55:32
 * @Description: In User Settings Edit
 */
import { NODE_VERTICAL, NODE_HORIZONTAL, TEXT_CLEARANCE, COMBO_PADDINGLEFT } from './constan.js';
G6.registerNode('customizedNode', {
    draw(cfg, group) {
        const { label = [] } = cfg || {};

        const shape = group.addShape('image', {
            attrs: {
                x: 0,
                y: 0,
                width: 125,
                height: (label.length * 11) + (NODE_VERTICAL * 2),
                img: './images/node-background.svg'
            },
            name: 'image-shape'
        });

        label.forEach((item = '', index) => {
            group.addShape('text', {
                attrs: {
                    y: (TEXT_CLEARANCE * index) + NODE_VERTICAL,
                    x: NODE_HORIZONTAL,
                    lineHeight: 10,
                    text: item,
                    fill: '#fff',
                },
            });
        });

        return shape;
    },
    getAnchorPoints() {
        return [
            [0.5, 0],
            [0.5, 1],
        ];
    },
}, 'rect');

const lineDash = [4, 2, 1, 2];
G6.registerEdge('customizedEdge', {
    draw(cfg, group) {
        const { startPoint, endPoint } = cfg;

        const keyShape = group.addShape('path', {
            attrs: {
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x, endPoint.y],
                ],
                stroke: '#988CFF',
                lineWidth: 2,
                startArrow: true,
            }
        });

        return keyShape;
    },
    afterDraw(cfg, group) {
        const shape = group.get('children')[0];
        let index = 9;

        shape.animate(
            () => {
                index--;
                if (index < 0) {
                    index = 9;
                }
                const res = {
                    lineDash,
                    lineDashOffset: -index,
                };
                // 返回需要修改的参数集，这里修改了 lineDash,lineDashOffset
                return res;
            },
            {
                repeat: true, // 动画重复
                duration: 7000, // 一次动画的时长为 3000
            },
        );
    },
    // 响应状态变化
    setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get('children')[0];

        if (name === 'active') {
            if (value) {
                shape.attr('stroke', '#fff');
                shape.attr('lineWidth', 3);
            } else {
                shape.attr('stroke', '#988CFF');
                shape.attr('lineWidth', 2);
            }
        }
    },
}, 'cubic');

G6.registerCombo('customizedCombo', {
    drawShape(cfg, group) {
        cfg.padding = cfg.padding || COMBO_PADDINGLEFT;
        const style = this.getShapeStyle(cfg);

        const rect = group.addShape('rect', {
            attrs: {
                ...style,
                x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
                y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
                fill: '#4553C3', //填充色
                opacity: 0.2,
                radius: 5,
                lineWidth: 0,
            },
            draggable: true,
            name: 'combo-keyShape',
        });

        const text_x = (style.width || 0) / 2;
        const text_y = (style.height || 0) * 0.37;
        const chinese = cfg.label_1.match(/[\u4e00-\u9fa5]/g)?.length || 0;
        const noChinese = cfg.label_1.length - chinese;
        const text_width = (chinese * 15) + (noChinese * 10);

        if (cfg.groupIndex === 1 && !cfg.isLastLayer) {
            group.addShape('image', {
                attrs: {
                    x: -(style.width / 2) + 5,
                    y: -10,
                    width: 13,
                    height: 13,
                    rotate: 2,
                    img: './images/arrow-on.svg'
                },
                name: 'arrow-shape'
            });
        }

        group.addShape('text', {
            attrs: {
                y: 0,
                x: -(text_x + text_width),
                text: cfg.label_1,
                fill: '#fff',
                lineWidth: 2
            },
        });

        group.addShape('text', {
            attrs: {
                y: -text_y,
                x: -(text_x * 0.96),
                text: cfg.label_2,
                fill: '#fff',
                lineWidth: 2
            }
        });
        return rect;
    }
}, 'rect');
