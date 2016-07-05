crossoverApp.factory('videoService', ['$rootScope', '$http', '$stateParams',
    function($rootScope, $http, $stateParams) {
        var sessionId = $rootScope.user.sessionId;
        return {
            get: function(params) {
                var req = {
                  method: 'GET',
                  url: '/video',
                  params: {
                    "sessionId": $rootScope.user.sessionId,
                    "videoId": $stateParams.videoId
                  }
                };
                return $http(req).then(function(response){
                    return response.data.data;
                });
            },
            getList: function(params) {
                var req = {
                  method: 'GET',
                  url: '/videos',
                  params: params
                };
                return $http(req).then(function(response){
                    return response.data.data;
                });
            },

            rateVideo: function(data) {
                var req = {
                  method: 'POST',
                  url: '/video/ratings',
                  data: data,
                  params: {
                    sessionId: sessionId
                  }
                };
                return $http(req).then(function(response){
                    return response.data.data;
                });

            }
        }
    }
]);

crossoverApp.factory('ratings', [
    function() {
      return {
        getStars: function(n, full) {
          if (n === NaN || n === void 0 || n == null) {
              n = 0;
          }

          var total = 0;
          $.each(n,function() {
              total += parseInt(this);
          })
          n = Math.floor(total/n.length);
          if (!full) {
              n = 5 - n;
          }
          return new Array(n);
        }
      }
}])