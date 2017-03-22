(function() {
'use strict';

	// Usage:
	// 
	// Creates:
	// 

	angular
		.module('app')
		.component('balada', {
			templateUrl:'components/html/balada.component.html',
			controller: BaladaController,
			bindings: {
				name: '=',
				adress: '=',
				phone: '=',
				rating: '=',
				site: '=',
				mapsUrl: '=',
				days: '=',
				reviews: '=',
				photos: '=',
			},
		}).directive('starRating', starRating);

	//NavigationController.$inject = ['dependency1'];
	function BaladaController() {
		var $ctrl = this;
			$ctrl.isReadonly = true;
		
		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}

	  function starRating() {
    return {
      restrict: 'EA',
      template:
        `<ul class="star-rating" ng-class="{readonly: readonly}">
          <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">
            <i class="material-icons">stars</i>
          </li>
        </ul>`,
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }
})();