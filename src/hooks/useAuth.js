import { useEffect } from 'react';
import { getAuthApi } from '@/services/auth';
import store from '@/stores/globalStore';
import {useFetchState} from "@/components/HooksState";

const useAuth = () => {

  const [authMap, setAuthMap] = useFetchState({});
  const [status, setStatus] = useFetchState('loading'); // loading 获取权限中, error 获取权限失败

  useEffect(() => {
    getAuthApi().then(res => {
      if(res && res.iuser) {
      localStorage.setItem('userdata', JSON.stringify(res.iuser));
        const authMap = {};
        res.authResults.forEach(item => {
          authMap[item.code] = item.selected;
        });
        setAuthMap(authMap);
        // 挂载权限数据到store
        store.updateAuth(authMap);
        // 改变状态
        setStatus('');
      } else {
        setStatus('error');
      }
    }).catch(error => {
      if(error && error.response) {
        if(error.response.status !== 401) {
          setStatus('error');
        }
      }
    });
  }, []);


  return {
    auth: authMap,
    status,
    getAuth: code => {
      if(code) {
        return authMap[code];
      }
      return true;
    } 
  };
};

export default useAuth;
