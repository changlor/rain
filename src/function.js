import { Php, Store, Session } from './vendor/lib/src';

import marked from 'marked';
import moment from 'moment';
import hljs from './vendor/lib/src/highlight/highlight';

//渲染md为html
const parseMarkdown = function (md, config) {
    if (Php.empty(md)) {
        md = '';
    }

    if (Php.empty(config)) {
        config = {
            highlight: (code) => {
                return hljs.highlightAuto(code).value
            },
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        };
    }
    marked.setOptions(config);
    return marked(md);
}

const formatTime = function (time, format) {
    return moment.unix(time).format(format);
}

const readUserInfo = function () {
    let userInfo = Session.get('userInfo');
    try {
        userInfo = JSON.parse(userInfo);
    } catch (e) {
        userInfo = {};
    }
    userInfo = userInfo || {};
    userInfo.token = typeof userInfo.token == 'string' ? userInfo.token : '';
    userInfo.username = typeof userInfo.username == 'string' ? userInfo.username : '';
    return userInfo;
}

const isEmptyObject = function (object) {
    for (let name in object) {
        return false;
    }
    return true;
}

const toUrl = function (url, params) {
    let paramsArr = [];
    if (params) {
        Object.keys(params).forEach(item => {
            paramsArr.push(item + '=' + params[item]);
        })
        url.search(/\?/) === -1
            ? url += '?' + paramsArr.join('&')
            : url += '&' + paramsArr.join('&');
    }
    return url;
}

const number = function (number) {
    if (typeof number == 'object') {
        const res = [];
        for (let i = 0; i < number.length; i++) {
            res.push(number[i] - 0);
        }
        return res;
    }
    return number - 0;
}

const parseUrl = function (url) {
    const query = url.match(/\?((.*?)#)/);
    if (!query) {
        return {};
    }
    const params = query[2].split('&');
    const res = {};
    let param;
    for (let i = 0; i < params.length; i++) {
        param = params[i].match(/(.*?=)(.*)/);
        res[param[1].replace('=', '')] = param[2];
    }
    return res;
}

export default {
    formatTime,
    parseMarkdown,
    readUserInfo,
    parseUrl,
    isEmptyObject,
    toUrl,
    number
}