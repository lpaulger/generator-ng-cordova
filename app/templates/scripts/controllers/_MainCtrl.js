'use strict';

angular.module('<%= appname %>')
  .controller('MainCtrl', function($scope){
    $scope.items = ['Phonegap', 'Angular', 'Yeoman'];
  });