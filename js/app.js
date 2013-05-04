var app = (function($, undefined){
  var module = {};

  function handleEditorChange(evt){
    var code;

    try {
      $("#logs").empty();
      code = editor.getCode();
      if(code.indexOf("while") !== -1){
        $("#error-notification").text("while loops are currently not supported");
      } else {
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
  };

  return module;

})(jQuery);

var log = function(obj, line){
	var text,
		  oldText,
		  $log;
	
  if(typeof line != "number" || line < 0){
		throw "wrong argument exceptiont";
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
		$("#logs").append("<div class='log' id='log-" + line +"'>"+ text +"</div>");
		$("#log-" + line).css("top", 16 * line + "px");
	}
};
