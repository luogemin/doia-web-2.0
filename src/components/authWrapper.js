import React from 'react';
import useAuth from '@/hooks/useAuth';
import {IntlFormatMessage} from "@/utils/util";

const authWrapper = (WrappedComponent) => {

  const Component = props => {

    const { getAuth, status } = useAuth();
    
    if(status === 'loading') {
      return 'loading...';
    }
    if(status === 'error') {
      return IntlFormatMessage('task.common.authorizationFails');
    }

    return <WrappedComponent getAuth={getAuth} {...props} />;
  };

  return Component;
  
};

export default authWrapper;
