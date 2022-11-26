import React from 'react';
import { Spin } from '@chaoswise/ui';

const Loading = () => {
  return (
    <div style={{textAlign: 'center', padding: 50}}>
      <Spin />
    </div>
  );
};

export default Loading;
