//>>built
define("dojox/embed/Flash",["dojo/_base/lang","dojo/_base/unload","dojo/_base/array","dojo/query","dojo/has","dojo/dom","dojo/on","dojo/window"],function(_1,_2,_3,_4,_5,_6,on,_7){function _8(_9){return String(_9).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");};var _a,_b;var _c=9;var _d="dojox-embed-flash-",_e=0;var _f={expressInstall:false,width:320,height:240,swLiveConnect:"true",allowScriptAccess:"sameDomain",allowNetworking:"all",style:null,redirect:null};function _10(_11){_11=_1.delegate(_f,_11);if(!("path" in _11)){console.error("dojox.embed.Flash(ctor):: no path reference to a Flash movie was provided.");return null;}if(!("id" in _11)){_11.id=(_d+_e++);}return _11;};if(_5("ie")){_a=function(_12){_12=_10(_12);if(!_12){return null;}var p;var _13=_12.path;if(_12.vars){var a=[];for(p in _12.vars){a.push(encodeURIComponent(p)+"="+encodeURIComponent(_12.vars[p]));}_12.params.FlashVars=a.join("&");delete _12.vars;}var s="<object id=\""+_8(String(_12.id))+"\" "+"classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" "+"width=\""+_8(String(_12.width))+"\" "+"height=\""+_8(String(_12.height))+"\""+((_12.style)?" style=\""+_8(String(_12.style))+"\"":"")+">"+"<param name=\"movie\" value=\""+_8(String(_13))+"\" />";if(_12.params){for(p in _12.params){s+="<param name=\""+_8(p)+"\" value=\""+_8(String(_12.params[p]))+"\" />";}}s+="</object>";return {id:_12.id,markup:s};};_b=(function(){var _14=10,_15=null;while(!_15&&_14>7){try{_15=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_14--);}catch(e){}}if(_15){var v=_15.GetVariable("$version").split(" ")[1].split(",");return {major:(v[0]!=null)?parseInt(v[0]):0,minor:(v[1]!=null)?parseInt(v[1]):0,rev:(v[2]!=null)?parseInt(v[2]):0};}return {major:0,minor:0,rev:0};})();_2.addOnWindowUnload(function(){console.warn("***************UNLOAD");var _16=function(){};var _17=_4("object").reverse().style("display","none").forEach(function(i){for(var p in i){if((p!="FlashVars")&&typeof i[p]=="function"){try{i[p]=_16;}catch(e){}}}});});}else{_a=function(_18){_18=_10(_18);if(!_18){return null;}var p;var _19=_18.path;if(_18.vars){var a=[];for(p in _18.vars){a.push(encodeURIComponent(p)+"="+encodeURIComponent(_18.vars[p]));}_18.params.flashVars=a.join("&");delete _18.vars;}var s="<embed type=\"application/x-shockwave-flash\" "+"src=\""+_8(String(_19))+"\" "+"id=\""+_8(String(_18.id))+"\" "+"width=\""+_8(String(_18.width))+"\" "+"height=\""+_8(String(_18.height))+"\""+((_18.style)?" style=\""+_8(String(_18.style))+"\" ":"")+"pluginspage=\""+window.location.protocol+"//www.adobe.com/go/getflashplayer\" ";if(_18.params){for(p in _18.params){s+=" "+_8(p)+"=\""+_8(String(_18.params[p]))+"\"";}}s+=" />";return {id:_18.id,markup:s};};_b=(function(){var _1a=navigator.plugins["Shockwave Flash"];if(_1a&&_1a.description){var v=_1a.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split(".");return {major:(v[0]!=null)?parseInt(v[0]):0,minor:(v[1]!=null)?parseInt(v[1]):0,rev:(v[2]!=null)?parseInt(v[2]):0};}return {major:0,minor:0,rev:0};})();}var _1b=function(_1c,_1d){if(location.href.toLowerCase().indexOf("file://")>-1){throw new Error("dojox.embed.Flash can't be run directly from a file. To instatiate the required SWF correctly it must be run from a server, like localHost.");}this.available=_b.major;this.minimumVersion=_1c.minimumVersion||_c;this.id=null;this.movie=null;this.domNode=null;if(_1d){_1d=_6.byId(_1d);}setTimeout(_1.hitch(this,function(){if(_1c.expressInstall||this.available&&this.available>=this.minimumVersion){if(_1c&&_1d){this.init(_1c,_1d);}else{this.onError("embed.Flash was not provided with the proper arguments.");}}else{if(!this.available){this.onError("Flash is not installed.");}else{this.onError("Flash version detected: "+this.available+" is out of date. Minimum required: "+this.minimumVersion);}}}),100);};_1.extend(_1b,{onReady:function(_1e){},onLoad:function(_1f){},onError:function(msg){},_onload:function(){clearInterval(this._poller);delete this._poller;delete this._pollCount;delete this._pollMax;this.onLoad(this.movie);},init:function(_20,_21){this.destroy();_21=_6.byId(_21||this.domNode);if(!_21){throw new Error("dojox.embed.Flash: no domNode reference has been passed.");}var p=0,_22=false;this._poller=null;this._pollCount=0;this._pollMax=15;this.pollTime=100;if(_1b.initialized){this.id=_1b.place(_20,_21);this.domNode=_21;setTimeout(_1.hitch(this,function(){this.movie=this.byId(this.id,_20.doc);this.onReady(this.movie);this._poller=setInterval(_1.hitch(this,function(){try{p=this.movie.PercentLoaded();}catch(e){console.warn("this.movie.PercentLoaded() failed",e,this.movie);}if(p==100){this._onload();}else{if(p==0&&this._pollCount++>this._pollMax){clearInterval(this._poller);throw new Error("Building SWF failed.");}}}),this.pollTime);}),1);}},_destroy:function(){try{this.domNode.removeChild(this.movie);}catch(e){}this.id=this.movie=this.domNode=null;},destroy:function(){if(!this.movie){return;}var _23=_1.delegate({id:true,movie:true,domNode:true,onReady:true,onLoad:true});for(var p in this){if(!_23[p]){delete this[p];}}if(this._poller){on(this,"Load",this,"_destroy");}else{this._destroy();}},byId:function(_24,doc){doc=doc||document;if(doc.embeds[_24]){return doc.embeds[_24];}if(doc[_24]){return doc[_24];}if(window[_24]){return window[_24];}if(document[_24]){return document[_24];}return null;}});_1.mixin(_1b,{minSupported:8,available:_b.major,supported:(_b.major>=_b.required),minimumRequired:_b.required,version:_b,initialized:false,onInitialize:function(){_1b.initialized=true;},__ie_markup__:function(_25){return _a(_25);},proxy:function(obj,_26){_3.forEach((_26 instanceof Array?_26:[_26]),function(_27){this[_27]=_1.hitch(this,function(){return (function(){return eval(this.movie.CallFunction("<invoke name=\""+_27+"\" returntype=\"javascript\">"+"<arguments>"+_3.map(arguments,function(_28){return __flash__toXML(_28);}).join("")+"</arguments>"+"</invoke>"));}).apply(this,arguments||[]);});},obj);}});_1b.place=function(_29,_2a){var o=_a(_29);_2a=_6.byId(_2a);if(!_2a){_2a=_7.doc.createElement("div");_2a.id=o.id+"-container";_7.body().appendChild(_2a);}if(o){_2a.innerHTML=o.markup;return o.id;}return null;};_1b.onInitialize();_1.setObject("dojox.embed.Flash",_1b);return _1b;});