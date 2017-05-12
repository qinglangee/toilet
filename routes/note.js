
/*
 * GET home page.
 */
var fs = require('fs');

var storeFile = '/home/zhch/document/noteslog/notes_store.js'
var logFile = '/home/zhch/document/noteslog/notes.log'

function writeLog(){
    
}

exports.append = function(req, res){
	var lastContent = req.body.content;
    var versionStr = req.body.version;
    var saveContent = req.body.save;
    

	var version = 0;
	var store = {};
	var NL = '\n';
    
    var ip = req.connection.remoteAddress;
    
    
    fs.readFile(storeFile, function(err,data){
    	if(err) throw err;
    	store = JSON.parse(data);
    	var version = store["note_version"];
    	var content = store["note_content"];



		var userVersion = -1;
		try{
			userVersion = new Number(versionStr);
		}catch(e){}
		// 检查版本号
		console.log("u:" + userVersion + " v:" + version);
		if(userVersion == version){
			version++;
			store["note_version"] = version;
            if(saveContent == "true"){
                store["note_content"] = content + NL + lastContent;
            }
            var history = store["history"];
            console.log(history)
            if(history == null || history == undefined){
                history = [];
                store["history"] = history;
            }
            history.splice(0,0,lastContent);
            if(history.length > 10){
                history.splice(10); // 超过１０把多的删掉
            }
            
			fs.writeFile(storeFile, JSON.stringify(store), function (err) {
			    if (err){
			    	console.error('Can\'t save storeFile - content:' + content);
			    	res.send('{"status":0, "version":'+version+'}');
			    };

				try{
					var logContent = '';
					logContent += ip + " -- new content: =========================" + new Date() + NL;
					logContent += content + NL;
					fs.appendFile(logFile, logContent, function (err) {
					    if (err){
					    	console.error('Can\'t save logFile - content:' + logContent);
					    }
                        
			    		res.send('{"status":1, "version":'+version+'}');
					});

				}catch (e){//Catch exception if any
                    console.error(e);
					res.send('{"status":0, "msg":"写日志出错了"}');
				}

			});
		}else{
			res.send('{"status":0, "msg":"版本不对,先更新"}');
		}

    });
}
exports.save = function(req, res){

	var content = req.body.content;
    var versionStr = req.body.version;


	console.log("ver:" + versionStr + " content:" + content);
    var ip = req.connection.remoteAddress;


	var version = 0;
	var store = {};
	var NL = '\n';

    fs.readFile(storeFile, function(err,data){
    	if(err) throw err;
    	store = JSON.parse(data);
    	var version = store["note_version"];



		var userVersion = -1;
		try{
			userVersion = new Number(versionStr);
		}catch(e){}
		// 检查版本号
		console.log("u:" + userVersion + " v:" + version);
		if(userVersion == version){
			version++;
			store["note_version"] = version;
			store["note_content"] = content;
			fs.writeFile(storeFile, JSON.stringify(store), function (err) {
			    if (err){
			    	console.error('Can\'t save storeFile - content:' + content);
			    	res.send('{"status":0, "version":'+version+'}');
			    };

				try{
					var logContent = '';
					logContent += ip + " -- new content: =========================" + new Date() + NL;
					logContent += content + NL;
					fs.appendFile(logFile, logContent, function (err) {
					    if (err){
					    	console.error('Can\'t save logFile - content:' + logContent);
					    }
			    		res.send('{"status":1, "version":'+version+'}');
					});

				}catch (e){//Catch exception if any
					res.send('{"status":0, "msg":"写日志出错了"}');
				}

			});
		}else{
			res.send('{"status":0, "msg":"版本不对,先更新"}');
		}

    });
};


exports.view = function(req, res){

	var content = req.query.content;
    var versionStr = req.query.version;
    var ip = req.connection.remoteAddress;


	var version = 0;
	var store = {};
    fs.readFile(storeFile, function(err,data){
    	if(err){
    		res.send('{"status":0, "msg":"Get content error!!"}');
    	};
    	store = JSON.parse(data);
    	
		var noteContent = store["note_content"];
		version = store.note_version;
	    
	    var data = {"status": 1,"content": noteContent,"version": version, history:store.history};

		res.send(JSON.stringify(data));
    });
    
};
