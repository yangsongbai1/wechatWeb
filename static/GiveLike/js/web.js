Array.prototype.in_array = function(e) {  //用法arr.in_array("a")
 for(i=0;i<this.length;i++){   if(this[i] == e)  return true;  }  
 return false;  
 }
var Cookie={get:function(name){var value='',matchs;if(matchs=document.cookie.match("(?:^| )"+name+"(?:(?:=([^;]*))|;|$)"))value=matchs[1]?unescape(matchs[1]):"";return value},set:function(name,value,expire,domain){expire=expire||30*24*3600*1000;var date=new Date(),cookie="";date.setTime(date.getTime()+expire);cookie=name+"="+escape(value)+";expires="+date.toGMTString()+";path=/;";domain&&(cookie+="domain="+domain+";");document.cookie=cookie},del:function(name,domain){Cookie.set(name,'',-1,domain)}};
var browser = {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {//移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            } (),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
 }

;(function(){

	var XML_ENTITY  = {
		'<' : '&lt;',
		'>' : '&gt;',
		'&' : '&amp;',
		'"' : '&quot;', 
		"'": '&apos;'
	},
	R_XML_CHR = /[<>'"]|&(?!(lt|gt|amp|apos|quot);)/g,
	XML_TEMP = '<?xml version="1.0" encoding="utf-8"?><products><count>1</count><kind><imgurl>{image}</imgurl><title>{title}</title><size>{size}</size><softid>{id}</softid><softVersion>{version}</softVersion></kind></products>';

    if (!Object.create) {  
        Object.create = function (o) {  
            if (arguments.length > 1) {  
                throw new Error('Object.create implementation only accepts the first parameter.');  
            }  
            function F() {}  
            F.prototype = o;  
            return new F();  
        };  
    } 
    if (!String.prototype.trim) {  
		String.prototype.trim = function(){
			return this.replace(/^\s+|\s+$/g,'');	
		}
    } 
	function scan(str, pattern){
			return str.match(pattern) || [];
	};

	function xmlEncode(str) {
			return str.replace(R_XML_CHR,function(chr){
				return 	XML_ENTITY[chr];			   
			});
	};

	function uriSearch(name){
			var query = window.location.search.slice(1),
				result = scan(query, new RegExp('\\b' + name + '=([^&\\s]+)','i' ))[1] || '';
			return 	_.decode(result);
	};
	_.templateSettings = {
		evaluate    : /\{#(.+?)\}/g,
		interpolate : /\{(.+?)\}/g
	};
	_.mixin({
		parseJson : function (json_data){
			var result;
			try {
				result = JSON.parse(json_data);
			} catch(e){
				result = eval( '(' + json_data + ')');
			}
			return result;
		},
		buildXML : function(id){
			var tags = _.split('image title size version');
			var data = _.reduce(tags,function(result, tag){

				var elem = $('[js-' + tag + '-' + id + ']'),
					text =  tag == 'image' ? elem.attr('src') : elem.text();
				result[tag] = xmlEncode(text);
				return  result;
			}, {});
			data.id = id;
			return _.template(XML_TEMP,data);
		},

		dateFill : function (date){
			return date.replace(/(-|\:)(\d[^\d])/g,'$1' + '0$2');
		},
		dateNow : function (){
			var format = '', d= new Date();
			format += [d.getFullYear(), d.getMonth() + 1,	d.getDate()].join('-');
			format += ' '
			format += [d.getHours(),d.getMinutes(),d.getSeconds()].join(':');
			return _.dateFill(format); 
		},
		decode : function(str){
			return decodeURIComponent(str.replace(/\+/g,'%20'));
		},
		encode : function(str){
			return encodeURIComponent(str);
		},
		split : function(str){
			return str.trim().split(/\s+/);
		},
		capitalize : function (str){
			return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
		},
		query : function(){
				var args = _.toArray(arguments);
				return  args.length == 1 ?
				uriSearch(args[0]) :			
				_.reduce(args, function(result,q){
					result[q] = uriSearch(q);
					return result;
				}, {});
		},
		defineMethods : function (obj, names, define){
			names = _.isString(names) ? scan(names, /\w+/g) : names;
			_.each(names, function(value){
				define.call(obj, value)
			});
		},
		toHash : function(keys, values){
			return _.reduce(keys,function(hash,key,i){
					hash[key] = values[i];
					return hash;
			}, {})
		},
		mapKeys : function(hash,iterator){
			return _.reduce(hash, function(result, value, key){
				result[iterator(key)] = value;
				return result;
			},{});
		},
		mapValues : function(hash,iterator){
			return _.reduce(hash, function(result, value, key){
				result[key] = iterator(value);
				return result;
			},{});
		},

		inherit : function(){
			return _.reduceRight(arguments, function(parent, extend){
					return _.extend(Object.create(parent), extend);
			});
		},
		clength : function(s){
			return Math.ceil( s.replace(/[^\x00-\xff]/g,'aa').length / 2)
		}
	});
})();
var logger = (function(){
    var _div;
	return function (text){
		if(!_div) _div = $('<div></div>').prependTo('body').css('color','#f30')[0];
		_div.innerHTML += text + "<br>"
	}
})();

;(function($){
	$.extend($.fn,{
		cssWidth : function(w){
			return this.css('width',w);
		},
		cssHeight : function(h){
			return this.css('height',h);
		},
		replaceClass : function( older, newer ){
			if(arguments.length == 1){
				this.removeClass();
				newer = older;
			} else {
				this.removeClass(older)
			}
			return this.addClass(newer);
		}
	});
	$.extend($, {
		 hasTouch :'ontouchstart' in window
	});

})(Zepto);
;(function($) {
	var interpolate = function (source, target, shift) { 
		return (source + (target - source) * shift); 
	};

	var easing = function (pos) { 
	    return (-Math.cos(pos * Math.PI) / 2) + .5; 
	};

	$.scroll = function(endY, duration, easingF) {
		endY = endY || ($.os.android ? 1 : 0);
		duration = duration || 200;
		(typeof easingF === 'function') && (easing = easingF);

		var startY = document.body.scrollTop,
			startT  = Date.now(),
			finishT = startT + duration;

		var animate = function() {
			var now = +(new Date()),
				shift = (now > finishT) ? 1 : (now - startT) / duration;

			window.scrollTo(0, interpolate(startY, endY, easing(shift)));

			(now > finishT) || setTimeout(animate, 15);
		};
		animate();
	};
}(Zepto));

var AjaxConnect = function(opt){
	this.options = opt;
};

AjaxConnect.prototype = {

	connect : function(opt){
		var options = this.options;
		if(opt || options.dataFilter ){
			options = $.extend({},options,opt ||{});
			if(options.dataFilter){
				var success = options.success ;	
				options.success = function(data){
					success(options.dataFilter(data));
				}
			};
		}
		$.ajax(options);
	},
	update : function(opts){
		var options = this.options;
		_.each(opts||{},function(opt, optname){
			var option = options[optname]
			if(typeof option == 'object' && typeof option == 'object'){
				$.extend(option, opt);	
			} else {
				options[optname] = opt;	
			}			
		});
		return this;
	}
};
$.extend(AjaxConnect,{
	summary : function(opt){
		opt.url = '../../../../../sajax.asp@action=3&s=0&num=80&id=' + App.id;
		$.ajax(opt);
	},
	descript : function(opt){
		opt.url =  '../../../../../sajax.asp@action=3&s=1&id=' +  App.id
		$.ajax(opt);
	},
	submitComment : function(opt){
		$.extend(opt,{
			url : '../../../../../ajax.asp',
			type : 'POST',
			data : {
			   content : opt.content,
			   SoftID :App.id,
			   Action : 2,
			   CommentTpye : 0 	// 此处为服务端接口拼写错误
			}
		});
		$.ajax(opt);
	}
});

var AjaxData = function (json_str,mapping,template){
	var data = _.parseJson(json_str),
		iterator = function(old_key){ return data[old_key]};
	this.template = template;
	this.handle = mapping.handle || {};
	this.head = _.mapValues(mapping.head, iterator);
	this.items = _.mapValues(mapping.items,iterator);
	this.length = _.values(this.items)[0].length;
};
AjaxData.prototype = {

	get : function(index){

		return _.reduce(this.items, function(result, elems, name){
				var elem = elems[index];
				result[name] = this.handle[name] ? this.handle[name](elem) : elem;
				return result;
		},{},this);
	},
	toString : function(){

		var result = ""
		_.times( this.length, function(i){
			result += _.template(this.template,this.get(i))
		},this);
		return result;
	}
};

var AjaxList = function(opt){
		var empty = function(){};
		this.options  = $.extend({
			initate : empty,
			complete : empty,
			success : empty,
			error : empty
		},opt);
		this.status = $.extend({
			loading : empty,
			success : empty,
			error : empty
		 }, opt.status || {});
		this.ajax = opt.connect;
		this.initialized = false; // 用于判断第一次链接
}
AjaxList.prototype = {
	next : function(){
		if(this.complete) return;
		this.page ? this.page++ : this.page = 1;
		this.status.loading();
		this.connect();
	},
	connect : function(){
		var list = this, updateData = {};

		updateData[this.options.pageKey] = this.page;
		this.ajax.update({data: updateData});
		this.ajax.connect({
			success : function(data){
				list.update(data);
				list.status.success(list.complete);
				if(list.none) list.status.update(true);
				list.success(data);
			},
			error : function(){
				list.status.error();
				list.options.error();				
			}
		});
	},

	success : function(data){

		this.options.success(data);	
		if(this.complete){
			this.options.complete(data);	
		}
	},
	update : function(data){
		if(!this.initialized){
			this.initialized = true;
			this.pageCount = this.options.initate(data); // initate 方法需要返回 pageCount
			this.none = this.pageCount === 0;
		}
		this.complete = (typeof this.pageCount == 'number' && this.page >= this.pageCount) ||
							!!(this.options.validate  && this.options.validate(this.page, data));
	}
};

var AjaxTip  = function(message,hold){
		this.message = message;
		this.hold = hold;
		this.show();
};

AjaxTip.prototype = {
	create : function(){
		this.tip = $('<div class="ajax-tip"><div class="inner">' + this.message + '</div></div>').appendTo('body');
	},
	show : function(){
		AjaxTip.hide();
		this.create();
		var that= this;
		if(!this.hold){
			AjaxTip.timer = setTimeout(function(){
				that.hide();			
			},1000);
		}
	},
	hide : function(){
		var that = this;
		this.tip.animate({ opacity: 0},400,'',function(){
			that.tip.remove();
		});	
	}
}

AjaxTip.hide = function(){
	$('.ajax-tip').remove();
	clearTimeout(this.timer);
};

var Event = $.hasTouch ? 
			  {tap : 'tap', enter : 'touchstart', move : 'touchmove', out: 'touchend'} :
			  {tap : 'click', enter : 'mouseover', move : 'mousemove', out: 'mouseout'} ;
var App ={
	oldAndroid :  navigator.userAgent.indexOf('Android 1.6') > -1,

	init : function(name){
		var app =  _.inherit(this.client, this), 
			pageProto = Pages[name],
			pageExtend = Pages.client[name],
			page = pageProto && pageExtend ? 
						_.inherit(pageExtend, pageProto) :	
						pageExtend || pageProto;
			app.page = page;
			page.app = app;
			page.name = name;
			$(function(){	app.init();	});
	},
	imageNotFound : function(image){
		image.src = '../../../../../img/error_icon.png';
		$(image).addClass('ico-error');
	},
	linkHover : function(){
		var events = {};
		events[Event.enter] = function(e){
			$(this).addClass('hover');	
		};
		events[Event.out] = function(e){
			$(this).removeClass('hover');	
		};
		$('body').delegate('a',events);
	},
	setWidth : function(elems,parent,offset){
		var width = this.bodyWidth(), $elems = $(elems);
		if(offset) width += offset;
		if(parent)	$elems.parent().cssWidth($elems.length*width);
		$elems.cssWidth(width);
	},

	bodyWidth : function(){
		return document.body.offsetWidth;	
	},
	bodyHeight : function (){
		return document.body.offsetHeight;	
	}
};

var LazyLoad = function(options){
	$.extend(this,{
			items : null,
			loading : { R: 40, r : 8, same: false},	
			onError : null,
			onLoad : null,
			onComplete : null,
			onAllComplete : null
		},options || {})
	this.length = this.items.length;
};

LazyLoad.prototype  =  {
	loaded : [],
	allComplete : function(){
		var i = this.length;
		while(i--){
			if(!this.loaded[i])
				return false;
		}
		return true;
	},
	load : function(index){

		 if(typeof index  == 'undefined'){
					index = 0;
		 } 
		if(this.loaded[index] || index < 0 || index >= this.length ) return;

		var that = this,
			item = this.items.eq(index),
			cssLoading = new Loading(this.loading);
			cssLoading.appendTo(item);

		item.removeClass('error');
		this.loaded[index] = true;
		$("<img>").bind('load',function(){
			cssLoading.remove();
			item.append(this);
			that.onLoad && that.onLoad.call(this,index);
			that.onComplete && that.onComplete.call(this,index);
			that.allComplete() && that.onAllComplete();
		}).bind('error',function(){
			that.loaded[index] = null;
			item.addClass('error');
			cssLoading.remove();
			new AjaxTip('图片加载出错，请稍候再试!');			
			that.onError && that.onError.call(this,index);
			that.onComplete && that.onComplete.call(this, index);
		}).attr('src', item.attr('data-img'));
	}
}

var LazyScroll = (function(){

	function _eventParse(eventStr){
		var e =  eventStr.split('.')
		return {
			event : e[0],
			action : e[1]
		}
	}
	var LazyScroll  =  function(options){
		this.options = options || {};
		this.items = $(options.items);
		this.length = this.items.length;
		var	that = this,
			loadOptions = {
				items : this.items,
				onComplete : function(i){
					that.triggerMonitor('ImageLoad', that, [i, this]);
				},
				onAllComplete : function(){
					that.removeMonitor('ScrollStart.lazyload')		
				}
			};
		this.addMonitor('ScrollStart.lazyload',function(){
				that.load(+this.currPageX + 1) ;
		});
		if(options.loading) loadOptions.loading = options.loading;	
		this.lazyload = new LazyLoad(loadOptions);
		this.length > 1  && this.initScroll();
	}
	LazyScroll.prototype = {
		initScroll : function(){
			var options = this.options,
				that = this;
			if(options.onScrollEnd){
				this.addMonitor('ScrollEnd.custom',options.onScrollEnd);
			} else if(options.nav){
				var $nav = $(this.options.nav);
				this.addMonitor('ScrollEnd.nav', function(){
						$nav.find('.cur').removeClass();
						$nav.children().eq(+this.currPageX).addClass('cur');	
					});
			}
			this.scroll = new iScroll(options.cont.slice(1), {
				snap: true,
				momentum: false,
				hScrollbar: false,
				onScrollStart: function(){
					that.triggerMonitor('ScrollStart',this,[].slice.call(arguments))
				},
				onScrollEnd : function(){
					that.triggerMonitor('ScrollEnd',this,[].slice.call(arguments));
				}
			 });

			if(App.oldAndroid || options.touch === false) this.disableScroll();
			options.button && this.initButton();		
			options.index && this.scroll.scrollToPage(options.index,0, 0);
			options.autotime && this.initAutoPlay();
		},
		monitor : function(eventName){
			var name = 'on' + eventName + 'CallBack';
			return this[name] ? this[name] : (this[name] = {});
		},

		addMonitor : function(event, callback){
			var e = _eventParse(event);
			this.monitor(e.event)[e.action] = callback;
		},
		removeMonitor : function(event){
			var e =  _eventParse(event)
			if(e.action in this.monitor(e.name)){
				delete this.monitor(e.name)[e.action];
			}
		},
		triggerMonitor  : function(event, scroll, args){
			var e =  _eventParse(event),
				callbacks = this.monitor(e.event);
			if(e.name){
				callbacks[e.name].apply(scroll,args);
				return;			
			}
			_.each(callbacks, function(callback,name){
				callback.apply(scroll,args);			   
			});
		},
		initButton : function(){
			var that = this,
				options = this.options, 
				$cont =$(options.cont),
				$prev, $next;
				$prev = $('<div class="scroll-button scroll-prev"></div>');
				$next = $('<div class="scroll-button scroll-next"></div>');
				$cont.before($prev).before($next);
				$prev.bind(Event.tap,function(){
					that.scroll.scrollToPage('prev', 0);									  
				}).show();
				$next.bind(Event.tap,function(){
					that.scroll.scrollToPage('next', 0);									  
				}).show();

				if(!options.index){
					$prev.addClass('disable');
				} else if(options.index == this.length - 1){
					$next.addClass('disable');
				}
				this.addMonitor('ScrollEnd.toggle', function(){
					this.currPageX == 0 ? $prev.addClass('disable') : $prev.removeClass('disable');
					this.currPageX == this.pagesX.length - 1 ? $next.addClass('disable') : $next.removeClass('disable');
				});
		},
		initAutoPlay : function(){
			var that = this;
			this.items.bind(Event.enter ,function(){

				that.safePause();
			}).bind(Event.out, function(){

				that.safePlay();
			});
			this.timer = false;
			this.addMonitor('ScrollStart.autoplay', function(){

				that.safePause();										 
			});
			this.addMonitor('ScrollEnd.autoplay', function(){

				that.safePlay(that.lazyload.loaded[that.scroll.currPageX]);									 
			});
			this.addMonitor('ImageLoad.autoplay', function(){

				that.safePlay();
			});
		},
		safePause : function(){

			clearTimeout(this.timer);
			this.timer = false;
		},
		safePlay : function(assert){
			assert = _.isUndefined(assert) ? this.timer === false : assert;
			assert && this.autoPlay();
		},
		autoPlay : function(){

			var that = this;
			clearTimeout(this.timer);
			this.timer = setTimeout(function(){
				var next = that.scroll.currPageX <  that.length - 1 ?  'next' : 0;
				that.scroll.scrollToPage(next, 0);	
			},this.options.autotime);
		},
		load : function(i){
			this.lazyload.load(i);
		},
		disableScroll : function(){
			this.options.button = true;
			this.scroll.disable();
		}
	}

	return  LazyScroll;

})();

var Loading = (function(){

	function replace(template,ary){
			var n = 0;
			return template.replace(/\?/g,function(){
					return ary[n++];
			});
	};
	var Loading,
		htmlBegin = '<div class="css3-loading" style="width:?px; height:?px;">',
		htmlEnd = '</div>',
		barStyle = 'width:?px; height:?px; left:?px; top:?px; -webkit-border-radius:?px;',
		barHtml = '<div style="-webkit-transform:rotate(?deg) translate(0, ?px) scale(?); opacity:?; ?"></div>';
	Loading = function(options){
			$.extend(this,{
				r : 10, R : 50,	same : true, count : 0
			},options || {})
	};
	Loading.prototype = {
		html : function(){
		  var D = this.R*2,	 d = this.r*2, ri = this.R - this.r;
		  var html = replace(htmlBegin, [D, D]),
			  basicStyle = replace(barStyle, [d, d, ri, ri, this.r]);
			for(var i = 0; i < 8; i++ ){
				var scale = this.same ? 1 : 0.2*i || 0.1,
					opacity = ((i+1)/8).toFixed(2);
				html += replace(barHtml,[45*i, ri, scale, opacity, basicStyle]);
			}
			html += htmlEnd;	
			return html;
	  },
	  appendTo : function(target){
		var that = this;
		this.elem = $(this.html()).appendTo(target);
		this.timer = setInterval(function(){
			that.rotate()
		},100);
		return this;
	  },
	  remove : function(){
		  clearInterval(this.timer);
		  this.elem.remove();
	  },
	  rotate : function(){
		this.elem.css('-webkit-transform', 'rotate('+ this.count +'deg)');
		if (this.count==360){ this.count = 0 }
		this.count+=45;
	  }
	}	  

	return Loading;
})();

var Nav = (function(){
	var isMobile =  'ontouchstart' in $('<div>').get(0);
	var CURRENT_CLASS = 'cur', DEFAULT_EVENT = isMobile ? 'ontouchstart' : 'mouseover' ;
	var Nav = function(opt){

			var nav = this;
			this.tabs = $(opt.tab);
			this.sections = $(opt.section)
			this.tabs.each(function(i){
				$(this).bind(opt.event || DEFAULT_EVENT, function(){
					nav.trigger(i);
				});
			});
			this.className = opt.className || CURRENT_CLASS;
			this.events = {};
			this.bind(this.toggle);

			if(opt.init){
				this.tabs.eq(0).addClass(this.className);
				this.sections.slice(1).hide();
			};

			opt.defer ?
				this.iIndex = opt.index	 :
			    this.trigger(opt.index);

	};
	Nav.prototype = {

		toggle : function(){
			this.tabs.eq(this.rIndex).removeClass(this.className)
			this.tabs.eq(this.cIndex).addClass(this.className);
			this.sections.eq(this.rIndex).hide();
			this.sections.eq(this.cIndex).show();
		},
		trigger : function(i){

			if( _.isUndefined(i) ){
				if( this.iIndex ){
					i = this.iIndex;
					this.iIndex = null;	
				} else {
					i = 0;	
				}
			}
			if( this.cIndex === i ) return;
			this.rIndex = this.cIndex || 0;
			this.cIndex = i;

			var callbacks = (this.events[-1]).concat(this.events[i]  || []);
					_.each( callbacks, function(callback){
						callback.call(this, i)
				},this);
	    },

		once : function(index, callback){
			if(_.isFunction(index)){
				callback = index;
				index = -1;
			}
			this.bind(index,function(i){
				this.unbind(index, arguments.callee);
				callback.call(this,i);
			});
		},
		bind : function(index, callback){
			if(_.isFunction(index)){
				callback = index;
				index = -1;
			}
			if( !this.events[index] ){
				this.events[index] = [];	
			}
			this.events[index].push(callback);
		},
		unbind : function(index, callback){
			if(_.isFunction(index)){
				index = _.keys(this.events);
			} else {
				index = [index];	
			}
			_.each(index, function(i){
				this.events[i] = _.reject(this.events[i], function(foo){
					return callback === foo;					  
				});
			}, this)
		}
	};
	return Nav;

})();

;(function(exports){

	function _prefix(prefix, name){
		return  prefix + _.capitalize(name);
	}
	var Status = function(options){
			this.options = options;
			this.statusText = _.toHash(options.methods, options.text);
			this.define(options.methods);		
	};
	Status.prototype = {
		define : function(methods){

			_.defineMethods(this,methods,function(status){
				this[status] = function(){
					this.change(status);
				};	
				this[_prefix('is', status)] = false;
			});
			this.isNone = true;
			this.text = this.statusText.none;
			this.status = 'none';
			this.pastStatus = 'isNone';
		},
		change : function(status){
			var isStatus = 	_prefix('is', status), 
				isPastStatus = _prefix('is',this.status)
				onStatus = _prefix('on', status);
			this[isPastStatus] = false;
			this.pastStatus = this.status;
			this[isStatus]  = true;
			this.status = status;
			this.text = this.statusText[status];

			this.options[onStatus] && this.options[onStatus].call(this, this.status, this.text);
			this.options.onChange && this.options.onChange.call(this,this.status, this.text);
		}
	};
	var PullStatus = function(statusText){
			var status = _.split('none stand ready loading complete'),
				text = _.map(status, function(name){
					return statusText[name]								 
				});
			Status.call(this, {
					methods : status,
   					text : text,
					onChange : function(status,text){
						this.onChange(status,text);
					}
			});
			this.container = $(this.html);
			this.bar = 	this.container.find('#pull');
			this.icon = this.bar.find('.status');
			this.message = this.bar.find('.text');
	};
	PullStatus.prototype = _.inherit({
		html :  '<footer id="pull-footer"><div id="pull"><div class="status"></div><div class="text"></div></div></footer>',
		onChange : function(status, text){
			this.bar.replaceClass(status);
			this.message.text(text);
		},
		rotate  : function(deg){
			this.icon.css('-webkit-transform', 'rotate('+ deg +'deg)');
		}
	}, Status.prototype);
	var Pull = function(scrollid, statusText, callback){
		this.scrollid = scrollid;
		this.callback = callback;
		this.init(statusText);
	};
	Pull.prototype = {
		init : function( statusText){

			var pull = this,
				touchEndShowLoading = false;
			this.scroll= new iScroll(this.scrollid.slice(1),{
				checkDOMChanges: true,
				onScrollMove : function(){
					if( pull.ready()){
						touchEndShowLoading = true;	
					};
				},

				onBeforeScrollEnd : function(){
					if(touchEndShowLoading){
						this.refresh(); // 刷新以改变scroll高度, 让 Comment的正在加载状态显示出来
						touchEndShowLoading = false;		
					} 
				},
				onScrollEnd : function(){
					pull.end();
				}
			});
			this.status = new PullStatus(statusText);
			this.status.container.appendTo( this.scrollid + '.inner');
			this.distance =  this.status.bar.get(0).offsetHeight*1.2;
		},
		isUp : function(distance){
			return !this.status.isLoading &&  this.scroll.y  + (distance || 0) < this.scroll.maxScrollY;
		},
		dragOn : function(height){
			if(height > this.distance ) height = this.distance;
			this.status.rotate( height / this.distance * 180);
		},
		ready : function(){
			this.isUp() &&	this.dragOn(this.scroll.maxScrollY - this.scroll.y);
			if( this.isUp(this.distance) ) {
				this.status.ready();
				return true;
			}
		},
		loading : function(){
			this.cssLoading = new Loading({R:12, r: 2});
			this.cssLoading.appendTo(this.status.icon);
			this.status.loading();
		},
		end : function(){
			if( this.status.isReady ){
				this.status.loading();
				this.callback && this.callback();
			} else {
				this.dragOn(0);	
			}
		},
		update : function(isNone){
			isNone === true ? this.status.none() : this.status.complete();
		},
		success : function(completed){
			this.complete();
			completed && this.disable();
		},
		error :  function(){
			this.complete();		
		},
		complete : function(){
			this.cssLoading.remove();
			this.status.stand();
			this.status.rotate(0);
		},
		disable : function(){
			$.extend(this.scroll.options ,{
				onScrollMove: null,
				onBeforeScrollEnd: null,
				onScrollEnd : null
			});
			this.status.complete();
		}
	};
	var Button = function(selector, statusText, callback){
		this.selector = selector;
		var status = _.split('normal loading complete none');
		var text = _.map(status, function(name){
					return statusText[name];
			});
		this.status = new Status({
			methods : status,
			text : text
		});

		this.callback = callback;
		this.init();
	}

	Button.prototype = {
		html : '<footer class="button-footer"><div class="text"></div><input type="button" value="更多" class="button gray"></footer>',
		init : function(){
			this.container = $(this.html).appendTo(this.selector);
			this.button =this.container.find('.button');
			this.text = this.container.find('.text');
			var button = this;
			this.button.bind(Event.tap, function(){
				if(button.status.isNormal){
					button.callback && button.callback();
				}
			});
		},
		loading : function(){
			this.cssLoading = new Loading({R:12, r: 2});
			this.cssLoading.appendTo(this.container );
			this.status.loading();
			this.showText();
		},
		success : function(allCompleted){
			this.complete(allCompleted);
		},
		error : function(){
			this.complete();		
		},
		complete : function(allCompleted){
			this.cssLoading.remove();
			if(allCompleted){
				this.status.complete();
				this.showText();			
			} else {
				this.status.normal()
				this.showButton();
			}
		},
		showButton : function(){
			this.text.hide();
			this.button.show().val(this.status.text);
			this.replaceClass();
		},
		showText : function(){
			this.button.hide();
			this.text.show().text(this.status.text);
			this.replaceClass();
		},
		update : function(isNone){
			if(isNone){
				this.status.none();
				this.showText();	
			} else {
				this.status.complete();
				this.showText();	
			}
		},
		replaceClass : function(){
			this.container.replaceClass('button-status-' + this.status.pastStatus, 'button-status-' + this.status.status);
		}
	};
	exports.Button = Button;
	exports.Pull = Pull;

})(window);

var Comment = function(){
	$.extend(this,Comment.client);
	Comment.ins = this;
};

Comment.prototype = (function(){

	var PULL_TEXT  = {
			none : '还没有用户发表评论',
			stand : '拉起查看更多',
			ready : '松开可以刷新',
			loading: '正在加载',
			complete : '没有更早的评论了'
		},
		BUTTON_TEXT = {
			normal : '更多',
			loading : '正在加载',
			complete : '没有更早的评论了',
			none : '还没有用户发表评论'
		},

		MAP_COMMENT = {
			head : {
				 count : 'RecordCount',
				 pageSize : 'PageSize',
				 pageCount : 'PageCount'
			},
			items : {
				city : 'sUserForm',
				name : 'sUserName',
				date : 'sDateAndTime',
				content : 'sContent'	
			},

			handle : {
				content: _.decode,
				date : _.dateFill
			}
		},
		TEM_COMMENT = '<li><div class="user">{city} {name}<time>{date}</time></div><p>{content}</p></li>',
		TEM_NEW_COMMENT =  '<li><div class="user mine"><strong>我的评论</strong><time>{date}</time></div><p>{content}</p></li>';
		function input_validate(input, validate){
			var timer;
			$(input).bind('focus',function(){
				timer =  setInterval(function(){
					validate();
				},200)									
			}).bind('blur',function(){
				clearInterval(timer);
			});				
		}
		function _newComment(content){
			return _.template(TEM_NEW_COMMENT, {
				content : content,
				date : _.dateNow()
			});
		}
		function _getCommentConnect(){
			return new AjaxConnect({
						url : '../../../../../sajax.asp',
						type : 'POST',
						data : {
							action : 0,
							id : App.id
						},
						dataFilter : function(json_str){
							return new AjaxData(json_str,MAP_COMMENT, TEM_COMMENT);
						}
					});
		}
		function _getCommentReader(status){
			return	new AjaxList({
						status : status,					 
						connect : _getCommentConnect(),
						initate : function(comments){
							return comments.head.pageCount;
						},
						pageKey : 'page',
						success : function(comments){
							$(comments.toString()).appendTo('#comment-list');
						},
						error : function(){
							new AjaxTip('加载内容出错，请稍候重试');	
						}
					});
		}
		var Comment = {
			init : function(pullType){
				var status, ajaxReader;
				if(App.oldAndroid || pullType == 'button'){ 
					status = new Button('#view-comment .inner', BUTTON_TEXT);
					if(App.oldAndroid){
						 new iScroll('view-comment',{
							checkDOMChanges: true
						 });
					 }
				} else {
					status = new Pull('#view-comment', PULL_TEXT);	
				}
				this.ajaxReader = ajaxReader = _getCommentReader(status);
				status.callback = function(){
					ajaxReader.next();
				};
				ajaxReader.next()
			},
			submit : function(text){
				var comment = this;
				new AjaxTip('正在提交评论，请耐心等候',true);
				AjaxConnect.submitComment({
					content: text,
					success : function(content){
						comment.onSubmit(content);
						new AjaxTip('评论已成功提交');
					},
					error : function(){
						new AjaxTip('暂时无法提交评论，请稍候再试');
					}
				});
			},
			onSubmit : function(content){
				$('#view-comment header .button').addClass('disable').unbind(Event.tap).val('已评论')
				$(_newComment(content)).prependTo('#comment-list');
				if( this.ajaxReader.none)	this.ajaxReader.status.update();
			}
		};
		return  Comment;

})();

var Descript = {
	init : function(useScroll){
		this.useScroll = useScroll === false ?  false : true;
		if(this.useScroll){
			this.scroll = new iScroll('descript');
		}
		this.summary = $('#summary');
		this.details = $('#details');
		this.button = $('#expand span');
		var descript = this;
		this.button.bind(Event.tap + ".init",function(){
			descript.loadDetails();
		});
		this.loadSummary();

	},
	initDetails : function(data){
		var desc = this;
		this.details.html(data);
		this.button.bind(Event.tap,function(){
				desc.isExpand() ? desc.packup() : desc.expand();
		});
	},
	isExpand : function(){
		return this.button.text() == '收起'
	},

	loadSummary : function(){
		var desc = this;
		AjaxConnect.summary({
			success : function(data){
				desc.summary.html(data + '...');
				desc.scroll &&　desc.scroll.refresh();
			},
			error: function(){
				new AjaxTip('加载简介出错，请稍候重试');
			}
		});
	},

	loadDetails : function(){
		this.button.text('加载中');
		var desc = this;
		AjaxConnect.descript({
			success : function(data){
				desc.button.unbind(Event.tap + ".init");
				desc.initDetails(data);
				desc.expand();
			},
			error: function(){
				new AjaxTip('加载内容出错，请稍候重试');
				desc.packup();
			}
		});
	},
	expand : function(){
			this.summary.hide();
			this.details.show();
			this.button.text('收起')
			this.useScroll && this.scroll.refresh();
	},
	packup : function(){
			this.summary.show();
			this.details.hide();
			this.button.text('展开');
			this.useScroll && this.scroll.refresh();
	}
};

var Screen = {
	init: function(opt){
		this.container = $('#images ul');
		this.items = this.container.find('li').each(function(i){
				$(this).data('index',i);												 
		});
		this.length = this.items.length;
		App.setWidth(this.items ,true,-120)
		this.startLoad(opt);
		this.initialized = true;
	},
	startLoad : function(opt){
		var options = $.extend({
			cont : '#images',
			items : this.items,
			button : true
		}, opt || {})

		this.lazyscroll = new LazyScroll(options);

		this.lazyscroll.load();

	}
};

var Pages = {};

;(function(exports){
	var Home = {

		slide : function(opt){
			var options = $.extend({
				cont : '#slide-width',
				items : '#slide-field a',
				nav : '#slide-nav',
				loading : { R: 30, r: 5, same: false},
				autotime : 10*1000
			}, opt || {});
			this.lazyscroll = new LazyScroll(options)
			this.lazyscroll.load()
		}
	};
	var Down = {
		hideEmptyRelate: function(){
			if($('.relate .group li').length)	return;
			$('.relate').css({
				visibility: 'hidden',
				height: 0 
			});
		},
		initTabNav : function(opt){
			var tabNav = new Nav({
				tab : 'nav li',
				section : 'section',
				event : Event.enter
			});
			tabNav.once(1,function(){
				Screen.init(opt);				   
			});
			tabNav.once(2,function(){
				new Comment().init();			   
			});
			return tabNav;
		}
	};
	exports.home = Home;
	exports.down = Down;

})(Pages);

var WebPages = {};
Pages.client = WebPages;

WebPages.home =  {
	init : function(){
		this.setSize();
		this.slide({
			touch : !(Browser.UC8 || this.app.isTinyScreen)
		});
		this.app.initSearch();
		var home = this;
		Resize.add(function(){
			var width = home.setSize();	
			home.lazyscroll.scroll.refresh();
		});
	},
	setSize : function(){
			var width = App.bodyWidth();
			if(width > 480) width = 480;
			var height = Math.floor(width*170/480);
			$('#slide-field li').cssWidth(width).closest('ul').cssWidth(3*width);
			$('#slide-field li a').cssWidth(width-26);
			$('#slide-field li a').cssHeight(height-26);
			$('#slide-width').cssHeight(height).cssWidth(width);
			$('#slide').cssHeight(height);
			return width;
	}
};
WebPages.category = {
	init : function(){
		this.app.initSearch();
	}
};
WebPages.series = {
	init : function(){
		this.app.initSearch();
		$('.series img').bind('error',function(){
			$(this).parent().addClass('error').end().remove();
		});
	}
};
WebPages.cms = {
	init : function(e){
		var refDownApp=function(){
			// document.title+="2"+ Cookie.get("sisDown");
			if (Cookie.get("sisDown")=="Yes"){ return false }; //只执行一次
			
			//document.title+="3";
			
		  if(browser.versions.ios) { //如果是苹果设备
		     WebApp.getDownload('../../../../../../t.itools.cn/plist/helper/g/go.php@id=10033&cid=CXMX6',e);
		  }
				
		  if(browser.versions.android) { //如果是安卓设备
		    if(confirm('推荐用豌豆荚下载你喜欢的游戏?')){ WebApp.getDownload('../../../../../../dl.wandoujia.com/files/phoenix/latest/wandoujia-meng10_ad.apk',e);}
		  }
			 
			 Cookie.set("isDown","Yes");
		}
			
		setTimeout(refDownApp , 5000);	
		//document.title+="1";
	}
};

WebPages.down = {
	init: function(){
		this.app.initDownload();
		var nav = this.initTabNav({
					touch : !(Browser.UC8 || this.app.isTinyScreen)
			});
		this.hideEmptyRelate();
		Descript.init(false);
		
		var Assid=parseInt($("#Associate").html());
	    if (Assid>0){
			$(".down").removeAttr("data-href");
			$(".down").attr("href","../../../../"+Assid+"/");
			$(".down").html("转移到手机版");
		}else{
			var catearr = [186,189,188,187,194,195,196,197,198,205,200,201,202,203,204,207,183,184,185];
			
		if(browser.versions.ios) { //如果是苹果设备
				$(".down").click(function(e){ new AjaxTip('该软件无苹果版，推荐用itools下载');  $(".down").removeAttr("data-href"); WebApp.getDownload('../../../../../../t.itools.cn/plist/helper/g/go.php@id=10033&cid=CXMX6',e); return false;});
				return false;
			}
					
			if(!catearr.in_array(App.categroyId)){
				$(".down").click(function(e){
					 if(!browser.versions.ios) { //如果不是苹果设备
					   new AjaxTip('该软件无安卓版，推荐用挖豆夹下载');	
						$(".down").removeAttr("data-href"); WebApp.getDownload('../../../../../../dl.wandoujia.com/files/phoenix/latest/wandoujia-meng10_ad.apk',e); return false;
					 }
				})		 
			}else{ //如果是安卓手机下载安卓应用
			   /*
			     var t=$(".cpname").text();
				 $(".down").click(function(e){
					if(confirm('推荐用【挖豆夹】高速下载?'+t)){
						$(".down").removeAttr("data-href"); WebApp.getDownload('../../../../../../dl.wandoujia.com/files/phoenix/latest/wandoujia-meng10_ad.apk',e); return false;
					}else{
						WebApp.initDownload();
						return false;
						}
				})
				 */
			}
		}
  
		var reScrollTimer,
		refreshStack = [],
		refreshTask = function(){
			if(!Screen.initialized) return;
			var scroll = Screen.lazyscroll.scroll;
			scroll.refresh();
			scroll.scrollToPage(scroll.currPageX || 0, 0, 200);
		},
		refreshLater = function(){

			if (nav.cIndex === 1){
				refreshTask();
			} else {
				refreshStack.length == 0 && refreshStack.push(refreshTask);
			}
		};
		nav.bind(1,function(){
			if(refreshStack.length) refreshStack.pop()();	
		});

		nav.bind(function(n){
			n == 2 ? 
			 $('body').addClass('layout-comment') :
			 $('body').removeClass('layout-comment');
		});

		Resize.add(function(){
			if(Screen.initialized){
				App.setWidth(Screen.items ,true,-120);
				clearTimeout(reScrollTimer);
				reScrollTimer = setTimeout(refreshLater, 300);
			}
		});
	},
	back : function(){
		//window.location.href = '../../../../../weblist.html@t=' + App.categroyId;
	}
};

var Browser = (function(){
	var agent = navigator.userAgent,
	rAgent = {
		UC7 : /^JUC/,
		UC8 : /\sUC\sAppleWebKit/,
		QQ : /^MQQBrowser/
	};
	return _.reduce(rAgent, function(result, regexp, browser){
		if(regexp.test(agent)) result[browser] = true;
		return result;
	},{});
})();
var WebApp = {
	name : 'web',
	isTinyScreen: false,
	init : function(){
		this.isTinyScreen = window.screen.width < 320;
		this.page.init();
		!Browser.UC8 && this.linkHover()
		var page = this.page, app = this;
		$('header.top _3E .back').bind(Event.tap, function(){

			page.back ? page.back() : app.back();													   
		});
		if(Browser.UC8){
			$('.go-top').attr('href','#');
			return;
		}
		$('.go-top').bind($.hasTouch ?  Event.enter:  Event.tap , function(e){
			$.scroll();
			e.preventDefault();
		});
	},
	back : function(){
		if(window.history.length > 1){
			window.history.back();	
		} else {
			window.location.href = '../../../../../default.htm';	
		}
	},

	initDownload : function(){

		var iframe = '<iframe style="display:none"></iframe>',
			$wrapper = $('<div style="display:none"></div>').appendTo('body'); // wrapper 防止 iframe 导致的页面错乱
		var validate = function(e){
				var $a = $(this),
					 href = $a.attr('data-href'), 
					 timer, $f;

				var error = function(){
					new AjaxTip('抱歉，暂时无法下载');	
					//$f.remove();
					//clearTimeout(timer);
				};
				$f = $(iframe).bind('load',error).attr('src',href).appendTo($wrapper);
				/*
				timer = setTimeout(function(){
					$f.unbind('load',error);

					if($.hasTouch) window.location.href = href;
				}, 500);
				*/
				e.preventDefault();							 
			}
			$('body').delegate('.down[data-href]', Event.tap, validate);

	},
		getDownload : function(href,e){ //用框架下载软件
		var iframe = '<iframe style="display:none"></iframe>',
			$wrapper = $('<div style="display:none"></div>').appendTo('body'); // wrapper 防止 iframe 导致的页面错乱
		var validate = function(e){
				var  timer, $f;

				var error = function(){
					new AjaxTip('抱歉，暂时无法下载');	
					//$f.remove();
					//clearTimeout(timer);
				};
				$f = $(iframe).bind('load',error).attr('src',href).appendTo($wrapper);
				/*
				timer = setTimeout(function(){
					$f.unbind('load',error);
					if($.hasTouch) window.location.href = href;
				}, 500);
				*/
				if(e){ e.preventDefault();}							 
			}
			
			validate(e);
	},
	initSearch : function(){
		var $input = $('.search-input');
		var isSearchVisiable = 0;

		$('.search-button').bind(Event.tap, function(e){
			if(!isSearchVisiable){
				$('header.top form').siblings().hide()
				$('.search-bar').show();	
				isSearchVisiable++;
			} 
		});
		$('header.top form').bind('submit',function(e){
				if(isSearchVisiable == 1){
					isSearchVisiable ++;
					e.preventDefault();
					return;
				}

				var keyword = $input.val().trim();
				if(keyword  == ''){
					!Browser.UC8 && new AjaxTip('请输入关键字');
					e.preventDefault();
				}
		});
		$('.search-bar .back').bind(Event.tap, function(e){
			e.preventDefault();
			if(isSearchVisiable){;
				$('.search-bar').hide();
				$('header.top form').siblings().show();
				isSearchVisiable = 0;
			}
		});
	}
};

App.client = WebApp;

Comment.client  = (function(){
	var superclass = Comment.prototype;

	var WebComment = {
		init : function(){

			superclass.init.call(this,'button');
			this.button = $('#verify');
			this.textarea = $('textarea');
			this.initSwitch();
			this.initSubmit();
		},
		initSwitch : function(){
			var that = this,
				$view = $('#view-comment'),
				$submit  = $('#submit');
			$view.find('header .button').bind(Event.tap,function (){
				$view.hide();
				$submit.show();
				$('body').addClass('layout-submit');
			});
			$('#cancel').bind(Event.tap,function (){
				$view.show();
				$submit.hide();
				$('body').removeClass('layout-submit');
			});
		},
		initSubmit : function(){
			var that = this, 
				validate = function(){
					that.validate();
				};

			App.oldAndroid ?
				input_validate(this.textarea, validate) :
				this.textarea.bind('input',validate);
			this.button.bind(Event.tap,function(){
				that.submit();
				return false;
			});
		},
		validate : function(text){
			_.clength(this.textarea.val()) >= 5 ?
				this.button.replaceClass('disable','green') :
				this.button.replaceClass('green','disable');
		},
		submit : function(){
			if(this.button.is('.disable')) return;
			superclass.submit.call(this,this.textarea.val());
		},
		onSubmit : function(text){
			superclass.onSubmit.call(this, text);		
			$('#cancel').trigger(Event.tap);	
		}
	};
	return WebComment;

})();

;(function(exports){
	var TYPE_APP = _.split("4 5 6 7 8 9 10 18 19 20 21 24"),
 		TYPE_GAME = _.split("11 12 13 14 15 16 17 22 23");

	var BUTTON_TEXT = {
		normal : '更多',
		loading : '正在加载',
		complete : '没有更多了',
		none : '什么也没有',
	};
	var MAP_LIST = {
		head : {
			 count : 'RecordCount',
			 name : 'sText',
			 pageCount : 'PageCount',
			 pageSize : 'PageSize',
			 curPage : 'AbsolutePage'
		},
		items : {
			 id : 'softId',
			 rank: 'ResRank',
			 title : 'ResName',
			 version : 'ResVer',
			 image : 'SmallImg',
			 size : 'ResSize'
		},
		handle : {
			title: _.decode,
			version : _.decode
		}
	},

	TEM_LIST = '<li>' + 
					'<a data-href="../../../../../down.asp@id={id}" class="down"><span>下载</span></a>' + 
					'<a href="../../../../{id}" class="desc" >' + 
						'<div class="pic middle"><img class="ico" src="{image}" onerror="App.imageNotFound(this);"></div>' + 
						'<p class="star lv{rank}"></p>' + 
						'<h3 class="name">{title}</h3>' + 
						'<p class="data"><span class="ver">版本: {version}</span><span class="size">大小: {size}</span></p>' + 
					'</a>' + 
				'</li>';

	function _error(){
		new AjaxTip('加载列表出错，请稍候再试!');
	}

	function _pageLimit(max){
		return function(page){
			return page >= max;
		}
	} 

	function _getAjaxConnect(type, query){
		return new AjaxConnect({

			url : '../../../../../sajax.asp',
			data :  {
				action : 4,
				t : query,
				s : type, // list: 1, search: 2
				num : 15
			},
			dataFilter : function(json_str){
				return new AjaxData(json_str,MAP_LIST, TEM_LIST);
			}
		});
	}
	function _ajaxList(options){

		var loader, laoderOptions,
			button = new Button(options.selector, BUTTON_TEXT),
			connect = _getAjaxConnect(options.type, options.query); 

		connect.update({data: options.order});
		laoderOptions = {
			status : button,					 
			connect : connect,
			initate : options.initate,
			success : options.success,
			error : _error,
			pageKey : 'p'
		};
		if(options.initate){
			laoderOptions.initate = options.initate;	
		}
		loader = new AjaxList(laoderOptions);
		button.callback = function(){ 
			loader.next()
		};
		loader.next();
	}
	function _listInitate(data){
		$('title').text(data.head.name);
		$('h1').text(data.head.name);
		return data.head.pageCount;
	}
var List = {
	init : function(){
		this.app.initDownload();
		this.app.initSearch();

		var categoryId = _.query('t');
		if(categoryId){
			this.categoryId = parseInt(categoryId);
			this.initSortNav();
			return;
		}

		this.seriesId = parseInt(_.query('s'));
		$('nav.global, #list-2, #list-3').hide();
		this.loadSeries();
	},
	initSortNav : function(){
		var list = this, nav;
		this.nav = nav = new Nav({
			tab : 'nav.global li',
			section : '.main > div',
			event : Event.tap,
			index : 2,
			defer : true
		});
		_.times(nav.tabs.length, function(i){
			nav.once(i,function(){
				list.load(i);								
			});
		});

		nav.trigger();
	},
	load : function(i){

		var list = this,
		options = {
		  selector: '#list-' + (i + 1),
		  type : 1,
		  query : this.categoryId,
		  initate : _listInitate,
		  success : function(data){
				$(data.toString()).appendTo(list.nav.sections.eq(i).find('.list'));
		  }
		};
		switch(i){
			case 0 :
				options.order = {isbest: 1};
				options.validate = _pageLimit(10);
				break;
			case 1 : 
				options.order = { o : 'hitsmonth'};
				options.validate = _pageLimit(10);
				break;
			case 2 :
				options.order = { o : 'updatetime'};
		};

		_ajaxList(options);
	},
	loadSeries : function(){
		_ajaxList({
		  selector: '#list-1',
		  type : 3,
		  query : this.seriesId,
		  order : { o : 'hitsmonth'},
		  initate : _listInitate,
		  success : function(data){
				$(data.toString()).appendTo('#list-1 .list');
		  }
		});
	},
	back : function(){
		if(this.categoryId){
			window.location.href =  _.include(TYPE_APP, this.categoryId + '') ? '../../../../../webapp.html' : '../../../../../webgame.html';
			return;
		}
		if(this.seriesId){
			window.location.href = '../../../../../webseries.html';
			return;
		}
		this.app.defaultBack();

	}
};

var Search = {
	init :function(){
		this.app.initDownload();
		this.title();
		_ajaxList({
			selector: '.main',
			type : 2,
			query : this.keyword,
			order : { o : 'hitsmonth'},
			initate : function(data){
				return data.head.pageCount;
			},
			success : function(data){
				$(data.toString()).appendTo('.list');
			}
		});
	},
	title : function(){
		var $title = $('.sub-title'),
			$input = $('.search-input'),
			keyword = _.query('t');
		$input.val(this.keyword = keyword)
		$('header.top form').bind('submit', function(){
				var q = $input.val().trim(); 	
				if(q == ''|| q == keyword)
					return false; 
		});

		$title.html(
			_.template($title.html() ,{keyword : this.keyword})
		);
	}

};

exports.list = List;
exports.search = Search;

})(WebPages);

var Resize = {
	tasks : [],
	add : function(task){
		this.tasks.push(task);
	}
};

$(window).bind('resize',function(){
	$.each(Resize.tasks,function(i,task){
		task && task();   
	});

});