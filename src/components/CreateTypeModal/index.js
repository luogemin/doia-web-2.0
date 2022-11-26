import React, {Component, useEffect} from 'react';
import {Modal, Input, Tooltip, Carousel} from '@chaoswise/ui';
import {Link, useHistory, useLocation} from 'react-router-dom';
import styles from '@/components/CreateTypeModal/index.less';
import {connect} from "@chaoswise/cw-mobx";
import {IntlFormatMessage} from "@/utils/util";
import {useFetchState} from "@/components/HooksState";


const CreateTypeModal = (props) => {
    const {dataSource, onClickType, ...rest} = props;
    const {pathname} = useLocation();
    const history = useHistory();
    const prefixPath = pathname + '/create';

    const [resultData, setResultData] = useFetchState([]);
    const [selected, setSelected] = useFetchState(0);

    useEffect(() => {
        const sourcelist = dataSource[0] && dataSource[0].children;
        const result = [];
        for (let i = 0; i < sourcelist.length; i += 4) {
            result.push(sourcelist.slice(i, i + 4));
        }
        setResultData(result);
    }, [dataSource]);

    return (
        <Modal
            className={styles['createTypeModal']}
            {...rest}
        >
            <div className="modal-body"
                 style={Object.assign({},
                     (!!resultData && !!resultData[0] && resultData[0].length > 2) ? {height: 340} : {maxHeight: 340},
                     !!resultData && resultData.length > 1 ? {paddingBottom: 24} : {}
                 )}>
                <div className="createTypeModal_box" style={{
                    // width: `${resultData.length * 100}%`,
                    // marginLeft: `-${selected * 100}%`
                }}>
                    {resultData.map((item, int) => {
                        return <div className="createTypeModal_box_item" key={int} style={{
                            display: selected === int ? 'flex' : 'none',
                        }}>
                            {
                                item.map((child, index) => {
                                    return (
                                        <div key={index} className="createTypeModal_item" onClick={() => {
                                            if (onClickType) {
                                                return onClickType(child.id);
                                            }
                                            history.push(`${prefixPath}/type/` + child.id);
                                        }}>
                                            <div className="img_box">
                                                <img src={child.icon} alt={IntlFormatMessage(child.name)}/>
                                            </div>
                                            <div className="item-detail_box">
                                                <p className="item_title">
                                                    <Tooltip title={IntlFormatMessage(child.name)}>
                                                        {IntlFormatMessage(child.name)}
                                                    </Tooltip>
                                                </p>
                                                <p className="item_info">
                                                    <Tooltip title={IntlFormatMessage(child.desc)}>
                                                        {IntlFormatMessage(child.desc)}
                                                    </Tooltip>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>;
                    })}
                </div>
                {
                    !!resultData && resultData.length > 1 ?
                        <div className="createTypeModal_dot flex-box-center">
                            {
                                resultData.map((item, index) => {
                                    return <div key={index} className="createTypeModal_dot_item" style={{
                                        backgroundColor: selected === index ? '#1890FF' : '',
                                    }} onClick={() => {
                                        setSelected(index);
                                    }}>

                                    </div>;
                                })
                            }
                        </div>
                        : null
                }
            </div>
        </Modal>
    );
};

export default connect(({genericsStore, dataSourceStore}) => {
    return {
        current: genericsStore.current,
        setSingleDataSourceAsync: dataSourceStore.setSingleDataSourceAsync,
    };
})(CreateTypeModal);
