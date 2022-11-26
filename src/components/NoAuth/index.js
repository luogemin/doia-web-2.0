import React from 'react';
import {IntlFormatMessage} from "@/utils/util";

function NoAuth() {
  return (
    <div>
        {IntlFormatMessage('task.common.notAuthorized')}
    </div>
  );
}

export default NoAuth;
