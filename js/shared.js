var sharePluginShared = sharePluginShared || {};

sharePluginShared.getDefaultScopeData = function () {
    return {
        content: {
            carouselImages: [],
            contentBody: "",
			shareMessage: ""
        }
    };
};

sharePluginShared.getEditorOptions = function () {
    return {
        plugins: 'advlist autolink link image lists charmap print preview',
        skin: 'lightgray',
        trusted: true,
        theme: 'modern',
        format: 'html'
    };
};

sharePluginShared.save = function (newObj) {
    buildfire.datastore.save(newObj, function (err, result) {
        if (err || !result) {
            console.error('Error saving the widget details: ', err);
        }
        else {
            console.info('Widget details saved');
        }
    });
};

sharePluginShared.digest = function ($scope) {
    if (!$scope.$$phase && !$scope.$root.$$phase) {
        $scope.$apply();
    }
};