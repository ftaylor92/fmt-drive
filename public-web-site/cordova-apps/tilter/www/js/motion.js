var writer= null;

recordpackage.start= function() {
	console.log("start record");

	entry.createAppender(win, );

/*window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
 
window.requestFileSystem(window.TEMPORARY, 5*1024*1024, initFS, errorHandler);
*/
//	writer= entry.createWriter(win, fail);
}

	function initFS(fileSystem) {
		console.log("gotFS: "+ fileSystem.name);
        fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, errorHandler);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample text'");
            writer.truncate(11);
            writer.onwriteend = function(evt) {
                console.log("contents of file now 'some sample'");
                writer.seek(4);
                writer.write(" different text");
                writer.onwriteend = function(evt){
                    console.log("contents of file now 'some different text'");
                }
            };
        };
        writer.write("some sample text");
    }

    function errorHandler(error) {
        console.log(error.message);
    }

	function win(writer) {
		writer.onwrite = function(evt) {
		console.log("write success");
		};
		writer.seek(writer.length);
		writer.write("appended text");
	};

