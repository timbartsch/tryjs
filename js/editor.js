var editor = (function($, undefined){
  var module = {},
      session,
      aceEditor,
      Range;

  module.init = function(){
    Range = ace.require('ace/range').Range;
    aceEditor = ace.edit("editor");
    aceEditor.setShowPrintMargin(false);
    session = aceEditor.getSession();
    session.setMode("ace/mode/javascript");
  };

  module.addMarker = function(startRow, startCol, endRow, endCol) {
    var range;

    range = new Range(startRow, startCol, endRow, endCol);
		return session.addMarker(range, "error-marker","text");
  };

  module.getCode = function(){
    return session.getValue();
  };

  module.onChange = function(func){
    session.on("change", func); 
  }

  module.removeAllMarkers = function() {
    var markers,
        markerId;

    markers = session.getMarkers();
    for(markerId in markers) {
      session.removeMarker(markerId);
    }
  };

  return module;
   
})(jQuery);
