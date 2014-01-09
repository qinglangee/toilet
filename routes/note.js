
/*
 * GET home page.
 */
var fs = require('fs');

var storeFile = '/home/lifeix/temp/noteslog/notes_store.js'
var logFile = '/home/lifeix/temp/noteslog/notes.log'
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
					    	log.error('Can\'t save logFile - content:' + logContent);
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
		
	    
	    var data = {"status": 1,"content": noteContent,"version": version};

		res.send(JSON.stringify(data));
    });
    
};