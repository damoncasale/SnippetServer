angular.module("snippetSaver")
  .controller('BrowseCtrl', function(SnippetService, EditorManager, $timeout, copyTextToClipboard, $scope) {
    $scope.currentPage = 1 ;
    $scope.pageSize = 9;
    var ctrl = this;
    ctrl.SnippetService = SnippetService;
    ctrl.showDescription = {}

    ctrl.toggleDescription = value => SnippetService.snippets.forEach( item => ctrl.showDescription[item.id] = value);


    ctrl.copy = (snippetId) => {
      var editor = EditorManager.snippetIdToEditor(snippetId);
      editor.selectAll();
      copyTextToClipboard(editor.getCopyText());

      ctrl.lastCopied = snippetId;
      $timeout(() => {
        ctrl.lastCopied = null;
      }, 1000)

      editor.getSelection().clearSelection();
    };

    $scope.pageChangeHandler = function(num) {
      console.log("COMING page no = " + num );
    }

    $scope.filterByText = function (crieteria) {
          return function(item){

              if(crieteria == undefined || ( crieteria != undefined && crieteria.trim().length == 0 )) {
                return true ;
              }
              else {
                    var splitSearchChars = crieteria.split(" ");
                  //  console.log("Item = " + JSON.stringify(item) + " Crieteria = " + crieteria);
                    var k = 0 ;
                    var found = true ;
                    for(; k < splitSearchChars.length ; k++)  {
                      if( item.searchText.toLowerCase().indexOf(splitSearchChars[k]) >= 0 )
                        found = true ;
                      else {
                        found = false;
                        break;
                      }
                  }
                   //console.log("RETURNING FOUND = " + found);
                   return found ;
              }

          }
    }
  });
