crossoverApp.run(['$rootScope', '$state', 'localStorageService', 
    function($rootScope, $state, localStorageService) {
        $rootScope.accessLog = new Array();         
        $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
                if(toState.authenticate && !$rootScope.user){
                    if(localStorageService.cookie.get("user")) {
                        $rootScope.user = localStorageService.cookie.get("user");
                        $state.go('content.videos.list');
                    } else {
                        event.preventDefault();
                        $state.go('content.login');
                    }   
                }
            }
        );
        
        $rootScope.$on('$stateNotFound', 
            function(event, unfoundState, fromState, fromParams){
                event.preventDefault();
                $state.go('content.notfound');
            }
        );
        
        $rootScope.$on('$stateChangeSuccess', 
            function(event, toState, toParams, fromState, fromParams){
                 $rootScope.accessLog.push({
                     user: $rootScope.user,
                     from: fromState.name,
                     to: toState.name,
                     date: new Date()
                 });
            }
        );
        
        $rootScope.$on('$stateChangeError', 
            function(event, toState, toParams, fromState, fromParams, error){
                event.preventDefault();
                $state.go('content.error', {error: error});
            }
        );
    }
]);

crossoverApp.controller('RootController', ['$scope', '$state', '$rootScope',
            function($scope, $state, $rootScope){
            }
]);

crossoverApp.controller('LoginController', ['$scope', '$state', '$rootScope', '$http', 'md5', 'localStorageService',
    function($scope, $state, $rootScope, $http, md5, localStorageService){
        $scope.login = function(user, password, valid){
            if(!valid){
                return;
            }
            
            password = md5.createHash(password || '');
            var data = {
                'username': user,
                'password': password
            }
            var req = {
              method: 'POST',
              url: '/user/auth',
              data: data
            }
            $http(req).then(function(response){
                if (response.data.status === 'success') {
                    $rootScope.user = {
                        username: response.data.username,
                        sessionId: response.data.sessionId
                    };
                    localStorageService.cookie.set('user', {
                        username: response.data.username,
                        sessionId: response.data.sessionId
                    });
                    $state.go('content.videos.list');
                } else {
                    $scope.message = response.data.error;      
                }
            });
        }
    }
]);

crossoverApp.controller('VideoController', ['$scope', '$state', '$http', '$rootScope',
    function($scope, $state, $http, $rootScope){
    }
]);

crossoverApp.controller('VideoListController', ['$scope', '$state', '$http', '$rootScope', 'videoService',
    function($scope, $state, $http, $rootScope, videoService){
        this.reading = false;
        $scope.videos = new Array();
        params = {
                "sessionId": $rootScope.user.sessionId,
                "limit": 10,
                "skip": 0
        }
        this.init = function() {
            videoService.getList(params).then(function(data){
                $scope.videos = data;
                this.reading = true;
            });
        }

        $scope.loadMoreVideos = function() {
            params.skip += 10; 
            videoService.getList(params).then(function(data){
                for (var i = 0; i < data.length; i++) {
                    $scope.videos.push(data[i]);
                }
            });
        }
        $scope.players = [];

        $scope.onPlayerReady = function (API, index) {
            $scope.players[index] = API;
        };

        $scope.onUpdateState = function (state, index) {
            if (state === 'play') {
                // pause other players
                for (var i=0, l=$scope.players.length; i<l; i++) {
                    if (i !== parseInt(index)) {
                        $scope.players[i].pause();
                    }
                }
            }
        };
    }
]);

crossoverApp.controller('VideoDetailController', ['$scope', 'ngDialog', 'video', 'videoService', 'ratings', '$state',
    function($scope, ngDialog, video, videoService, ratings, $state){
        video.theme = "/bower_components/videogular-themes-default/videogular.css";
        $scope.video = video;
        $scope.ratingStars = function(n, full) {
            return ratings.getStars(n,full);
        }

        refreshVideo = function() {
            $scope = null;
            $state.go($state.current, {}, {reload: true});
        }

        $scope.rateVideo = function() {
            ngDialog.open({
                template: "/assets/html/popups/rate-video.html",
                className: 'ngdialog-theme-default',
                controller: ['$scope', 
                    function($scope) {
                        $scope.submit = function(inputs) {
                            inputs.videoId = video._id
                            videoService.rateVideo(inputs).then(function(data){
                                $scope.closeThisDialog();
                                refreshVideo();
                            });
                        }               
                    }
                ]
            });    
        }
    }
]);