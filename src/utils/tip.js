import {message} from '@chaoswise/ui';
import {POPUP_EXPIRE} from '@/globalConstants';

message.config({
  maxCount: 2
});

export function info(msg = null, expire = POPUP_EXPIRE) {
  if (msg) {
    message.info(msg, expire);
  }
}

export function success(msg = null, expire = POPUP_EXPIRE) {
  if (msg) {
    message.success(msg, expire);
  }
}

export function error(msg = null, expire = POPUP_EXPIRE) {
  if (msg) {
    message.error(msg, expire);
  }
}

export function warning(msg = null, expire = POPUP_EXPIRE) {
  if (msg) {
    message.warning(msg, expire);
  }
}
