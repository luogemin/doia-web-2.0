import React, {useMemo, memo, forwardRef, useRef, useEffect} from 'react';
import {CWTable as Table, Icon, Modal} from '@chaoswise/ui';
import {Resizable} from 'react-resizable';
import styles from './assets/index.less';
import {useFetchState} from "@/components/HooksState";
// import { Table } from 'antd';

const ResizeableTitle = props => {
    const {
        onResize, width, initWidth,
        ...restProps
    } = props;
    if (!width || !parseInt(width)) {
        return <th {...restProps} />;
    }
    return (
        <Resizable
            width={parseInt(width)}
            height={0}
            minConstraints={[parseInt(initWidth), 0]}
            onResize={onResize}
            draggableOpts={{enableUserSelectHack: false}}
        >
            <th {...restProps} className='zzw'/>
        </Resizable>
    );
};

const BasicTable = (props, ref) => {
    const {
        dataSource,
        columns: outColumns,
        style,
        className = '',
        wrapperClassName = '',
        wrapperStyle = {},
        scroll,
        isResizable = true,
        ...rest
    } = props;
    const [columns, setColumns] = useFetchState([]);
    const [scrollY, setScrollY] = useFetchState(null);
    const tableRef = useRef(null);
    const classNames = useMemo(() => {
        return `basicList ${className}`;
    }, [className]);
    useEffect(() => {
        setColumns(outColumns.map(i => Object.assign({}, i, Reflect.has(i, 'width') ? {
            initWidth: i.width
        } : {})));
    }, [outColumns]);
    useEffect(() => {
        if (tableRef.current) {
            setScrollY(tableRef.current.clientHeight - 42 - 51);
        }
    }, [dataSource]);
    const _columns = useMemo(() => {
        return columns.map((col, index) => (isResizable ? {
            ...col,
            // onHeaderCell: column => {
            //     return {
            //         width: column.width,
            //         onResize: handleResize(index),
            //         initWidth: column.initWidth
            //     };
            // },
        } : {...col}));
    }, [columns, isResizable]);
    const handleResize = index => (e, {size}) => {
        setColumns(prevState => {
            const nextColumns = [...prevState];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return nextColumns;
        });
    };

    return <div style={wrapperStyle} className={`${wrapperClassName} ${styles['basicTable']}`} id={'tableRoot'}
                ref={tableRef}>
        <Table
            // bordered
            // components={isResizable ? {
            //     header: {
            //         cell: ResizeableTitle,
            //     },
            // } : {}}
            className={classNames}
            columns={_columns}
            dataSource={dataSource}
            style={style}
            // scroll={scroll ? scroll : {y : scrollY || 100}}
            rowKey={(record, index) => index}
            {...Object.assign({}, rest, !scroll ? {} : scroll.y === 'auto' ? {scroll: Object.assign({}, scroll, {y: scrollY || 100})} : {scroll})}
        />
    </div>;
};

export default memo(forwardRef(BasicTable));
