var app = angular.module('github-issues-tracking', []);

app.controller('IssueController', ['$scope', '$http', function ($scope, $http) {

    // table data
    $scope.data = {
        'total': 0, 
        'last_24': 0, 
        'last_week': 0, 
        'before_last_week': 0
    };

    // data loading status flags
    $scope.loading_data = false;
    $scope.data_loaded = false;
    $scope.load_error = false;

    // updates the link and calls the API for fresh data
    $scope.updateLink = function (link) {
        console.log(`changing repo link to ${link}`);
        const username = link.split('/')[3];
        const repository = link.split('/')[4];
        updateTable(username, repository);
    }

    // updates the table of information about issues
    function updateTable(username, repository) {
        $scope.loading_data = true;
        $scope.data_loaded = false;
        console.log('loading fresh data...');
        
        $http.get(`/${username}/${repository}`)
        .then(function (response) {
            const data = response.data;

            if (data.error) {
                $scope.load_error = true;
                console.error(data.info);
            } else {
                $scope.data = data.issues;
                console.log($scope.data);
                $scope.load_error = false;
                $scope.data_loaded = true;
            }
            $scope.loading_data = false;

        }).catch(function (err) {
            $scope.loading_data = false;
            $scope.load_error = true;
            console.error(err);
        });
    }
}]);