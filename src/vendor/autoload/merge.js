// 加载类库函数
import { Php, Func } from '../lib';
// 加载根组件
import App from '../../App';
// 加载框架内部模块配置文件
import vendorModuleConfig from '../config/load';
// 自动加载类
class AutoLoad {
    constructor () {
        // 绑定类方法
        ::this.initialize;
        ::this.loadAppOptions;
        ::this.loadAppSetting;
        ::this.loadVendorModule;
        ::this.loadVendorComponents;
        // 初始化自动加载类变量
        this.initialize();
        // 加载框架模块
        this.loadVendorModule();
        // 加载框架组件
        this.loadVendorComponents();
        // 加载程序入口配置选项
        this.loadAppOptions();
    }

    initialize () {
        // 框架模块配置
        this.vendorModuleConfig = vendorModuleConfig;
        // 框架模块
        this.vendorModule = [];
        // 程序入口配置选项
        this.appOptions = {};
        // 框架内部组件
        this.vendorComponents = [];
    }
    // 加载程序入口配置选项
    loadAppOptions () {
        // 设置程序文档结点
        this.appOptions.el = '#app';
        // 设置程序模板
        this.appOptions.template = '<App />';
        // 设置程序根组件
        this.appOptions.components = { App };
        // 循环加载各个模块的程序配置选项
        this.vendorModule.map((vendorModule) => {
            if (vendorModule.hasOwnProperty('appOptions')) {
                Object.assign(this.appOptions, vendorModule.appOptions);
            }
        })
    }
    // 加载框架内部模块
    loadVendorModule () {
        // 循环加载模块
        for (let [key, value] of Object.entries(vendorModuleConfig)) {
            const module = require('../' + value + '/load');
            this.vendorModule.push(module.default);
        }
    }
    // 加载框架内部组件
    loadVendorComponents () {
        let components = {};
        // 循环加载各个模块的组件
        this.vendorModule.map((vendorModule) => {
            if (vendorModule.hasOwnProperty('appSetting') && vendorModule.appSetting.hasOwnProperty('components')) {
                for (let [key, value] of Object.entries(vendorModule.appSetting.components)) {
                    this.vendorComponents.push(value);
                    this.vendorComponentsLength++;
                }
            }
        })
    }
    // 加载Vue配置
    loadAppSetting (Vue, components) {
        Vue.component('vendor-components', {
            render: function (createElement) {
                return createElement('div',
                    Array.apply(null, { length: 2 }).map((value, key) => {
                        return createElement(components[key], {
                            attrs: {
                                class: 'core-' + key
                            }
                        })
                    })
                );
            }
        })
    }
}

// 实例化autoload
const options = new AutoLoad();
// 程序配置选项
const appOptions = options.appOptions;
// 程序设置
const appSetting = (Vue) => {
    options.loadAppSetting(Vue, options.vendorComponents);
}
// 框架内部模块插件
const vendorModulePlugin = {};

export { appOptions, appSetting, vendorModulePlugin };
