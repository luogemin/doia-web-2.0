import React, {Fragment} from 'react';
import {Form} from "@chaoswise/ui";
import {IsInternationalization} from "@/utils/util";

const FormItem = Form.Item;
const DimensionBox = (props) => {
    const {index, children} = props;

    return <FormItem style={{
        width: IsInternationalization()?'90px':'50px',
        textAlign: 'right',
        color: 'rgba(0, 0, 0, 0.85)',
        whiteSpace: 'nowrap',
        marginRight: 16,

    }}>
        {children}
    </FormItem>;
};

export default DimensionBox;