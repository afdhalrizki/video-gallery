var crossoverApp = angular.module('crossoverApp', [
        "ui.router",
        "ngAnimate",
        "angular-md5",
        "LocalStorageModule",
        "ngDialog",
        "infinite-scroll",
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.poster"
    ]);

crossoverApp.config(function($stateProvider, $urlRouterProvider){
    
    $urlRouterProvider.otherwise('videos/list');
    
    $stateProvider
    .state('content',{
        url:'/',
        abstract: true,
        authenticate: false,
        views:{
            "":{
                templateUrl: 'partials/content.html',
                controller: 'RootController'
            },
            "header@content":{
                templateUrl: 'partials/header.html',
                controller: ['$scope', '$rootScope', '$state', 'localStorageService', 
                    function($scope, $rootScope, $state, localStorageService){
                        $scope.logoff = function(){
                            $rootScope.user = null;
                            localStorageService.cookie.clearAll();
                            $state.go($state.current, {}, {reload: true});
                        }
                    }
                ]
            }
        }
        
    })
    .state('content.login',{
        url:'login',
        authenticate: false,
        views:{
            "body@content" :{
                templateUrl: 'partials/login.html',
                controller:  'LoginController'
            }
        }
        
    })
    .state('content.videos',{
        url:'videos',
        abstract: true,
        authenticate: true,
        views: {
            "body@content": {
                templateUrl: 'partials/videos.html',
                controller: 'VideoController',
                controllerAs: 'ctrVideo'
            }
        }
        
    })
    .state('content.videos.list',{
        url:'/list',
        authenticate: true,
        templateUrl: 'partials/videos-list.html',
        controller: 'VideoListController',
        controllerAs: 'ctrVideoList'
    })
    .state('content.videos.detail',{
        url:'/detail/:videoId',
        authenticate: true,
        templateUrl: 'partials/videos-detail.html',
        controller: 'VideoDetailController',
        controllerAs: 'ctrVideoDetail',
        resolve:{
            video: ['$stateParams', '$rootScope', '$http',
                function($stateParams, $rootScope, $http){
                    var req = {
                      method: 'GET',
                      url: '/video',
                      params: {
                        "sessionId": $rootScope.user.sessionId,
                        "videoId": $stateParams.videoId
                      }
                    }
                    return $http(req).then(function(response){
                        return response.data.data;
                    });
                }
            ]
        }
    })
    .state('content.log',{
        url:'log',
        views: {
            "body@content": {templateUrl: 'partials/log.html'}  
        }       
    })
    .state('content.notfound',{
        url:'notfound',
        views: {
            "body@content": {templateUrl: 'partials/page-not-found.html'}   
        }       
    })
    .state('content.error',{
        url:'error/:error',
        views:{
            "body@content":{
                templateUrl: 'partials/error.html',
                controller:["$scope", "$stateParams", 
                    function($scope, $stateParams){
                        $scope.error = {
                            message: $stateParams.error
                        }
                    }
                ]
            }
        }
    })
    
});