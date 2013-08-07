var app = (function($, undefined){
  var module = {};

  String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
  };

  function traverse(object, visitor) {
    var key, child;

    visitor.call(null, object);
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        child = object[key];
        if (typeof child === 'object' && child !== null) {
          traverse(child, visitor);
        }
      }
    }
  }

  function buildLogString(name, line){
    return ";log(" + name + ", '" + name + "', " + line +");";
  }

  function handleEditorChange(evt){
    var code,
        parseTree,
        logMarks,
        logMark,
        logString,
        logStringOffset,
        i;

    logMarks = [];
    logStringOffset = 0;

    try {
      $("#logs").empty();
      code = editor.getCode();
      if(code.indexOf("while") !== -1){
        $("#error-notification").text("while loops are currently not supported");
      } else {
        parseTree = esprima.parse(code, {loc: true, range: true});
        traverse(parseTree, function(node){
          if(node.type === "VariableDeclaration" || node.type === "ExpressionStatement") {
            traverse(node, function(n){
              if(n.type === "Identifier"){
                logMarks.push({
                  pos: node.range[1],
                  name: n.name,
                  line: node.loc.end.line
                });
              }
            });
          }
        });
        for(i=0; i<logMarks.length; i++) {
          logMark = logMarks[i];
          logString = buildLogString(logMark.name, logMark.line);
          code = code.splice(logMark.pos + logStringOffset, 0, logString);
          logStringOffset += logString.length;
        }
        console.log(code);
        eval(code);
        editor.removeAllMarkers();
        $("#error-notification").text("");
      }

    } catch(e) {
      startRange = evt.data.range.start;
			endRange = evt.data.range.end;
      editor.addMarker(startRange.row, startRange.column, endRange.row, endRange.column);
      $("#error-notification").text(e.message);
    }
  }

  module.init = function(){
    editor.init();
    editor.onChange(handleEditorChange);
    handleEditorChange();
  };

  return module;

})(jQuery);

var log = function(obj, objName, line){
	var text,
		  oldText,
		  $log;

  line = line -1;
	
  if(typeof line != "number" || line < 0){
		throw "wrong argument exceptiont";
	}

  if(typeof obj === "function"){
    return ;
  }
	
  if(typeof obj === "object"){
		text = JSON.stringify(obj);
	} else {
		text = obj; 
	}
	
  $log = $("#log-" + line);
	
  if($log.length){
		oldText = $log.text();
		$log.text(oldText + "; " + text);
	}else{
		$("#logs").append("<div class='log' id='log-" + line +"'>"+ objName + ": " + text +"</div>");
		$("#log-" + line).css("top", 16 * line + "px");
	}
};
