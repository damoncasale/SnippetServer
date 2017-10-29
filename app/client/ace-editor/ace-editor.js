angular.module('snippetSaver')
.directive('aceEditor', function($state, EditorManager){
  return {
    restrict:"A",
    scope: {
      aceEditor:'=',
      language: '=',
      relatedId: '=',
      readonly: '@'
    },
    require: '?ngModel',
    link:function(scope, iElem, iAttrs, ngModel){
      if (!ngModel) return; // do nothing if no ng-model

      var editor = ace.edit(iElem[0]);
      editor.setTheme("ace/theme/monokai");
      console.log(scope.readonly);
      editor.setReadOnly(scope.readonly=='true');

      var deregister = scope.$watchGroup(['language', 'relatedId'], function(newVals){
        if(!newVals || !newVals[0])
          return;
        if(newVals[0])
        {
          if(newVals[0]=="C" || newVals[0] == "C++")
            newVals[0] = "c_cpp";
          if(newVals[0]=="JS")
            newVals[0] = "javascript";
          editor.getSession().setMode("ace/mode/"+newVals[0].toLowerCase());
        }
        if(newVals[1]){
          EditorManager.updateEditorMap(newVals[1], editor);
        }
      })
      
      editor.commands.addCommand({
          name: 'save',
          bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
          exec: function(editor) {
              $state.go('root.mainBrowse');
          },
          readOnly: true // false if this command should not apply in readOnly mode
      });


      // Specify how UI should be updated
      ngModel.$render = function() {
        editor.setValue(ngModel.$viewValue || '')
        editor.getSelection().clearSelection();
      };

      // Listen for change events to enable binding
      editor.on('change', function() {
        scope.$evalAsync(read);
      });
      //read(); // initialize

      // Write data to the model
      function read() {
        var value = editor.getValue();
        ngModel.$setViewValue(value);
      }
    }
  }
});