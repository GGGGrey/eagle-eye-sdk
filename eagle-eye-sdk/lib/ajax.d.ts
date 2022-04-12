/**
 * @file ajax request file
 * @author JYkid
 * @version 0.0.1-beta
 */
declare const ajax: {
    canAjax: () => any;
    post: (url: any, data: any, timeout?: any) => void;
};
export default ajax;
