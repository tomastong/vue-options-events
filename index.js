/**
  * @file vue实例中使用events选项
  * 用trigger触发操作
  * @author donghongyan01@baidu.com
  */

import Vue from 'vue';

const bus = new Vue({});

// value null也是object
function isObject (value) {
	const type = typeof value;
	return !!value && type === 'object';
}

function isString (value) {
	if (typeof value === 'string') {return true;}
	if (typeof value !== 'object') {return false;}
	return Object.prototype.toString.call(null, value) === '[object String]';
}

function isFunction (value) {
	const type = typeof value;
	return !!value && type === 'function';
}

/**
  * @param {Object, array} 
    如果是object，元素是es6函数，或只是函数名字键值对（映射到methods中寻找）
    如果是array，元素是具名函数，或只是函数名字（直接去methods中寻找）
  * @param handler 回调函数
  */
const each = (collection, handler) => {
	return collection && Array.isArray(collection) 
		? collection.forEach(func => handler(func, func.name || func))
		: Object.keys(collection).forEach(key => handler(collection[key], key));
}

// 变量式无法绑定this 采用声明式
function bindEvents (isOn) {
	const action = isOn ? '$on' : '$off'; 
	each (this.handlerEvents, (handler, key) => {
		bus[action](key, handler);
	});
}

bus.install = (_Vue) => {
	_Vue.mixin({
		created() {
			const me = this;
			if (!this.$options.events) {
				return;
			}
			this.handlerEvents = {};
			each (this.$options.events, (handler, key) => {
				let fn = null;
				// 如果是函数，直接events寻找
				if (isFunction(handler)) {
					fn = handler;
				}
				// 如果是键值字符串，去methods寻找
				else if (isString(handler)) {
					fn = me.$options.methods[handler];
				}
				else {
					return;
				}
				me.handlerEvents[key] = (...args) => {
					// me保证操作业务在当前实例上
					fn && fn.apply(me, args);
				};
			});

			bindEvents.call(this, true);

		},
		beforeDestroy() {
			bindEvents.call(this, false);
		}
	})
	// 添加到全局函数上
	_Vue.prototype.$trigger = (...args) => {
		_Vue.prototype.$emit.apply(bus, args);
	}
}

export default bus;