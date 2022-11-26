import { LocalStorageConf } from '@/globalConstants';

const APP_KEY = LocalStorageConf.prefix || 'do';

export class LocalStorageUtils {

  setLoginTimes() {
    let times = this.getLoginTimes() || 0;
    times +=1;
    return localStorage.setItem('loginTimes', JSON.stringify(times));
  }
  clearLoginTimes() {
    return localStorage.setItem('loginTimes', JSON.stringify(0));
  }

  getLoginTimes(){
    try {
      const times = JSON.parse(localStorage.getItem(`${APP_KEY}_loginTimes`));
      return times;
    } catch (e) {
      return {};
    }
  }

  getUserData() { 
    try {
      const userData = JSON.parse(localStorage.getItem('userdata'));
      if (typeof userData !== 'object') {
        return {};
      }
      return userData;
    } catch (e) {
      return {};
    }
  }

  setUserData(user) {
    return localStorage.setItem(`${APP_KEY}_user`, JSON.stringify(user));
  }

  clearUserData() {
    return localStorage.removeItem(`${APP_KEY}_user`);
  }

  getAuthToken() {
    return this.getUserData() && this.getUserData().token;
  }


  setItem(key,value){
    return localStorage.setItem(`${APP_KEY}_${key}`, JSON.stringify(value));
  }

  clearItem(key) {
    return localStorage.removeItem(`${APP_KEY}_${key}`);
  }

  getItem(key){
    try {
      const data = JSON.parse(localStorage.getItem(`${APP_KEY}_${key}`));
      return data;
    } catch (e) {
      return {};
    }
  }

}

const localStorageUtils = typeof localStorage !== 'undefined' ? new LocalStorageUtils() : undefined;

export default localStorageUtils;
