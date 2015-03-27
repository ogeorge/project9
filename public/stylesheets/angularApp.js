angular.module('weatherNews', ['ui.router'])
.factory('postFactory', ['$http', function($http){
  var o = {
    posts: []
  };
   o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
   });
   o.create = function(post) {
    return $http.post('/posts', post).success(function(data){
      o.posts.push(data);
    });
  };
  return o;
}])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      });
    $urlRouterProvider.otherwise('home');
}])
.controller('MainCtrl', [
  '$scope',
  'postFactory',
  function($scope,postFactory){
    postFactory.getAll();
    $scope.posts = postFactory.posts;
//     $scope.incrementUpvotes = function(post) {
//      post.upvotes += 1;
//    };
    $scope.addPost = function() {
      if($scope.formContent === '') { return; }
      postFactory.create({
	title: $scope.formContent,
	});
     // $scope.posts.push({title:$scope.formContent,upvotes:0,comments:[]});
      $scope.formContent='';
    };
$scope.incrementUpvotes = function(post) {
		postFactory.upvote(post);
	};
  }
])
.controller('PostCtrl', [
  '$scope',
  '$stateParams',
  'postFactory', 
  function($scope, $stateParams, postFactory){
    $scope.post = postFactory.posts[$stateParams.id];
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        upvotes: 0
      });
      $scope.body = '';
    };
  $scope.incrementUpvotes = function(comment){
    comment.upvotes += 1; 
  };
}]);

