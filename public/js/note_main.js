function getText(){
	var url = "/note/view";
	$.get(url,{},function(o){
		if(o.status==1){
			$("#note_content").val(o.content);
			$("#note_version").val(o.version);
            var his = o.history;
            if(his.length > 0){
                showHistory(his);
            }
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
function showHistory(his){
    var box = $("#history_box");
    box.html("");
    for(var i=0;i<his.length;i++){
        var id = "textid" + i;
        var attr = " data-clipboard-target='#"+id+"' ";
        var hisEle = $("<div>"
        +"<textarea class='text' id='"+id+"'></textarea>"
        +"<input type='button' class='copy_btn' onclick='copyText(this)' value='复制'"+attr+"/>"
        +"</div>");
        $(".text", hisEle).html(his[i]);
        box.append(hisEle);
        
        if(i>4){
            break;
        }
    }
}
function copyText(item){
    var span = $(item).parent().find("span");
    var text = span.text();
    console.log(text);
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
function appendText(){
    var content = $("#edit_content").val();
    var save = $("#save_append").prop("checked");
    console.log("save:" +save)
    $("#result").removeClass("error_res");
    if(content.length<2){
        $("#result").addClass("error_res");
        $("#result").val("太短了，不给提交--" + new Date());
        return;
    }
    
    var version = $("#note_version").val();
	var url = "/note/append";
    $("#result").val("");
    $.post(url,{content:content, version:version, save:save},function(o){
		if(o.status==1){
			$("#result").val("添加成功--" + new Date());
			$("#note_version").val(o.version);
            getText();
		}else{
			$("#result").addClass("error_res");
			$("#result").val(o.msg + "--" + new Date());
		}
	},"json");
}
$(document).ready(function(){
    new Clipboard('.copy_btn');
});
