crossoverApp.directive('videoThumbnail', ['ratings', '$sce', function(ratings, $sce) {
    return {
        restrict: 'E',
        scope: {
            v: '=',
            players: '=',
            index: '@',
            onPlayerReady: '&',
            onUpdateState: '&'
        },
        templateUrl: '/assets/html/directives/video-thumbnail.html',
        replace: true,
        link: function (scope, element, attr) {
            scope.index = parseInt(scope.index)
            scope.v.theme = "/bower_components/videogular-themes-default/videogular.css";
            scope.v.url = $sce.trustAsResourceUrl(scope.v.url);
            scope.ratingStars = function(n, full) {
                return ratings.getStars(n, full);
            }
        }
    }
}]);