var sharePluginApp = angular.module('sharePlugin', ['ui.tinymce']);

sharePluginApp.controller('sharePluginCtrl', ['$scope', function ($scope) {
  var editor = new buildfire.components.carousel.editor("#carousel");
  var tmrDelay = null;

  $scope.editorOptions = sharePluginShared.getEditorOptions();
  $scope.data = sharePluginShared.getDefaultScopeData();

  /*
   * Go pull any previously saved data
   */
  buildfire.datastore.get(function (err, result) {
    if (!err) {
      $scope.datastoreInitialized = true;
    } else {
      console.error("Error: ", err);
      return;
    }

    if (result && result.data && !angular.equals({}, result.data)) {
      $scope.data = result.data;
      $scope.id = result.id;
      if ($scope.data.content && $scope.data.content.carouselImages)
        editor.loadItems($scope.data.content.carouselImages);
      if (tmrDelay) clearTimeout(tmrDelay);
    }

    /*
     * watch for changes in data and trigger the saveDataWithDelay function on change
     * */
    $scope.$watch('data', saveDataWithDelay, true);

    if (!$scope.$$phase && !$scope.$root.$$phase) {
      $scope.$apply();
    }
  });

  /*
   * Call the datastore to save the data object
   */
  var saveData = function (newObj) {
    if (!$scope.datastoreInitialized) {
      console.error("Error with datastore didn't get called");
      return;
    }

    if (newObj == undefined) return;
    sharePluginShared.save(newObj);
  };

  /*
   * create an artificial delay so api isnt called on every character entered
   * */
  var saveDataWithDelay = function (newObj, oldObj) {
    if (tmrDelay) clearTimeout(tmrDelay);
    if (angular.equals(newObj, oldObj)) return;
    tmrDelay = setTimeout(function () {
      saveData(newObj);
    }, 500);
  };

  // this method will be called when a new item added to the list
  editor.onAddItems = editor.onDeleteItem = editor.onItemChange = editor.onOrderChange = function () {
    $scope.data.content.carouselImages = editor.items;
    sharePluginShared.digest($scope);
  };
}]);
