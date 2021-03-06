/**
 * @file ajax request file
 * @author JYkid
 * @version 0.0.1-beta
 */


/* eslint-disable */
const ajax =  (function() {
  return {
    canAjax: function() {
      return (window.XMLHttpRequest && window.JSON);
    },
    post: function(url: any, data: any, timeout?: any) {
      var xhr = new XMLHttpRequest();
      xhr.open("post", url, true);
      xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.timeout = timeout || 30000;
      // @ts-ignore
      xhr.sendByEagle = true;
      xhr.onload = function () {
        if (!xhr?.responseText || typeof xhr?.responseText !== 'string') {
          return
        }
        var result = JSON.parse(xhr.responseText || "");
        if (result.status === 1) {
          // changeStatus()
        }
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (!xhr?.responseText || typeof xhr?.responseText !== 'string') {
              return
            }
            var result = JSON?.parse(xhr.responseText || "");
            if (result.status === 1) {
              // changeStatus()
            }
          } else {
            // throw new Error("eagle-eye: 网络请求错误，请稍后再试～");
          }
        }
      };
      xhr.send(window.JSON.stringify(data));
    }
  }
})();

export default ajax;
