/*
 * @Author: tiger.wang
 * @Date: 2021-08-16 11:44:33
 * @LastEditors: your name
 * @LastEditTime: 2021-08-18 09:48:48
 * @Description: In User Settings Edit
 */
G6.registerBehavior('collapseExpand', {
    getDefaultCfg() {
        return {
            multiple: true
        };
    },
    getEvents() {
        return {
            'arrow-shape:click': 'onComboClick'
        };
    },
    onComboClick(e) {
        const graph = this.graph;
        const item = e.item || {};
        const shape = item._cfg.group.get('children')[1];
        const model = item._cfg.model || {};

        const nodes = graph.getNodes();
        const edges = graph.getEdges();
        const combos = graph.getCombos();

        const nextCombos = combos.find(item => item._cfg.model.layer == (model.layer + 1));
        const nextCombosIsVisible = nextCombos ? nextCombos.get('visible') : null;

        nextCombosIsVisible ? shape.attr('img', '../images/arrow-off.svg') : shape.attr('img', '../images/arrow-on.svg');

        [...nodes, ...combos].forEach(items => {
            const models = items._cfg.model;
            if (models.layer > model.layer) {
                const shape = items._cfg.group.get('children')[1];
                if (nextCombosIsVisible) {
                    items.hide();
                    if (item._cfg.type === 'combo' && shape) shape.attr('img', '../images/arrow-off.svg');
                } else {
                    if (item._cfg.type === 'combo' && shape) shape.attr('img', '../images/arrow-on.svg');
                    items.show();
                }
            }
        });

        edges.forEach(items => {
            const source = items._cfg.source;
            const target = items._cfg.target;
            if (source.get('visible') && target.get('visible')) {
                items.show();
            } else {
                items.hide();
            }
        });
    }
});