function getText(){
	var url = "/note/view";
	$.get(url,{},function(o){
		if(o.status==1){
			$("#note_content").val(o.content);
			$("#note_version").val(o.version);
		}
	},"json");
    flushInterval();
}
var flushTimer;
function flushInterval(){
    flushTime=15;
    clearInterval(flushTimer);
    flushTimer = setInterval(function(){
        flushTime--;
        $("#flush_btn").val("更新 " + flushTime);
        if(flushTime==0){
            getText();
        }
    }, 1000);
}
function submitText(){
	var content = $("#note_content").val();
	var version = $("#note_version").val();
	var url = "/note/save";
	$("#result").val("");
	$("#result").removeClass("error_res");
	$.post(url,{content:content, version:version},function(o){
		if(o.status==1){
			$("#result").val("提交成功--" + new Date());
			$("#note_version").val(o.version);
		}else{
			$("#result").addClass("error_res");
			$("#result").val(o.msg + "--" + new Date());
		}
	},"json");
}
