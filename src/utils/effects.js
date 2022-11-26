
//封装call方法
export const call = (func, ...res) => {
    return func.apply(null, res); //传参
};

//封装all方法
export function all(arry=[]) {
    return Promise.all(arry);
}