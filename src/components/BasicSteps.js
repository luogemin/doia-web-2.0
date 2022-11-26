import React from 'react';
import {Form, Steps, Button} from '@chaoswise/ui';

const Step = Steps.Step;
const BasicSteps = (props) => {
  const {steps,current} = props;

  return (
    <div style={{margin:'32px 0'}}>
      <Steps size="small" current={current}>
        {steps.map(item => <Step key={item.title} title={item.title}/>)}
      </Steps>
    </div>
  );
};

export default BasicSteps;
