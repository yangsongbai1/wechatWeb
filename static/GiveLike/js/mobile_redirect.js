/*var Cookie={get:function(name){var value='',matchs;if(matchs=document.cookie.match("(?:^| )"+name+"(?:(?:=([^;]*))|;|$)"))value=matchs[1]?unescape(matchs[1]):"";return value},set:function(name,value,expire,domain){expire=expire||30*24*3600*1000;var date=new Date(),cookie="";date.setTime(date.getTime()+expire);cookie=name+"="+escape(value)+";expires="+date.toGMTString()+";path=/;";domain&&(cookie+="domain="+domain+";");document.cookie=cookie},del:function(name,domain){Cookie.set(name,'',-1,domain)}};
(function(){
	var agent = window.navigator.userAgent,
		isWebKit = /AppleWebKit.+Safari/.test(agent),
		visitContinue =  +Cookie.get('visitcontinue'); // '','0','1'
		if(isWebKit || visitContinue){
			return;
		} 
		Cookie.set('hopevisit',window.location.href);
		window.location.href = '../webvisit.html'; 

})();*/