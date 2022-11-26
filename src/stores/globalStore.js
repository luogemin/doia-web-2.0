
import { getDemoApi } from '@/services/auth';
import { call } from '@/utils/effects';
import { toMobx } from '@chaoswise/cw-mobx';
import { 
	getTokenService,
	getVersionService
} from '@/services/global';

const globalStore = {

	namespace: 'globalStore',

	state: {
		num: 0,
		auth: {},
		versionData:{
			collapsed: false,
			version:"",
			versionDetail:"",
		}
	},

	effects: {
		*addNumSync() {
			const res = yield getDemoApi();
			this.num = res.data;
			this.addNum();
		},
		// 获取token
		* getAccessTokenAsync(callback,withoutToken=false){
			const response = yield call(getTokenService,withoutToken);
			if(response && response.status == "success"){
				let data = response.data;
				if (data && (data instanceof Object)) {
					callback && callback(data);
				}
			}else{
				callback && callback({
					empty:true,
					msg: response ? response.msg : null
				});
			}
		},

		//获取版本信息
		* getVersionAsync(withoutToken=false){
			const response = yield call(getVersionService,withoutToken);
			if(response && response.status == "success"){
				const versionDetail = response.data;
				const version = versionDetail.split('-')[0];
				this.versionData = {...this.versionData, version, versionDetail};
			}
		}
	},

	reducers: {
		addNum() {
			this.num = this.num + 100;
		},
		updateAuth(auth) {
			this.auth = auth;
		}
	},

	computeds: {
		getDoubleNum() {
			return this.num * 2;
		}
	}

};

export default toMobx(globalStore);