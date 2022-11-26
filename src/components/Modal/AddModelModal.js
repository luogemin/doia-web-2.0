import React, { Component } from 'react';
import { Modal, Input, Select, Form } from '@chaoswise/ui';
import CreateTag from '@/components/CreateTag';
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;

const formItemLayout ={
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

class AddModelModal extends Component {
    constructor(){
        super();
        this.state={
            resave:false,
        };
    }

    /**
     * 补充选中的tag
     */
    appendToSelected = (tag)=>{
        const { form } = this.props;
        const selectedTags = form.getFieldValue("tags");
        form.setFieldsValue({tags:selectedTags.concat([`${tag}`])});
    }

    saveModel = (resave=false) =>{
        const {
            form,
            setTempState,
            onSave
        } = this.props;
        this.setState({
            resave:resave
        });
        form.validateFields((err, values) => {
            if (!err) {
                if( setTempState instanceof Function){
                    setTempState(values,()=>{
                        onSave(resave);
                    });
                }
            }
        });
    }

    filterTagOption = (inputVal,option)=>{
        if(option && inputVal){
            if(option.props.children.indexOf(inputVal)>-1){
                return true;
            }
        }
        return false;
    }

    render() {
        const self = this;
        const {
            form,
            model,
            tagList,
            addTagHandler,
            handleCancelModal,
            visible=false,
            saveLoading
        } = this.props;
        const {
            resave
        } = this.state;
        const {
            getFieldDecorator
        } = form;

        let tags = model.tags ? model.tags.filter(tag=>tag.id) : [];
        tags = tags.map((tag)=>{return `${tag.id}`;});

        let tagOptions = [];
        tagList && tagList.map((tag,index)=>tagOptions.push(<Select.Option key={index} value={"" + tag.id}>{tag.name}</Select.Option>));


        return (
            <Modal
                className={"customModal modelModal"}
                title={IntlFormatMessage('common.add.model.modal.save.model')}
                visible={visible}
                onOk={()=>this.saveModel(false)}
                onCancel={handleCancelModal}
                okText={IntlFormatMessage('common.add.model.modal.save')}
                confirmLoading={!resave && saveLoading}
                cancelText={IntlFormatMessage('common.add.model.modal.save.as')}
                cancelButtonProps={
                    {
                        onClick:()=>self.saveModel(true),
                        disabled: !model.id,
                        loading: (model.id && resave) ? saveLoading : false
                    }
                }
            >
                <FormItem {...formItemLayout} label={(
                    <span>
                        {IntlFormatMessage('common.add.model.modal.model.name')}
                    </span>
                )}>
                    {
                        getFieldDecorator("modelName",{
                            rules:[
                                {required:true,message:IntlFormatMessage('common.add.model.modal.required')},
                            ],
                            initialValue:model.name || ""
                        })(
                            <Input
                                placeholder={IntlFormatMessage('common.add.model.modal.enter.model.name')}
                                size="default"
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    key="3"
                    label={IntlFormatMessage('common.add.model.modal.select.label')}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("tags",{
                            initialValue:tags || []
                        })(
                            <Select
                                mode="multiple"
                                style={{ width: '90%' }}
                                filterOption={this.filterTagOption}
                                tokenSeparators={['|']}
                            >
                                {tagOptions}
                            </Select>
                        )
                    }

                    <CreateTag
                        addTagHandler={addTagHandler}
                        addTagSuccess={(tag)=>{self.appendToSelected(tag);}}
                    />
                </FormItem>
                {
                    /*
                        <FormItem key="4" {...formItemLayout} label="描述">
                            {
                                getFieldDecorator("description",{
                                    initialValue:""
                                })(
                                    <Input.TextArea rows={4} />
                                )
                            }
                        </FormItem>
                    */
                }
            </Modal>
        );
    }
}

export default Form.create()(AddModelModal);
