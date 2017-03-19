(function() {
'use strict';

	// Usage:
	// 
	// Creates:
	// 

	angular
		.module('app')
		.component('navigation', {
			templateUrl:'components/html/navigation.component.html',
			controller: NavigationController,
			bindings: {
				show: '=',
			},
		});

	NavigationController.$inject = ['auth','$rootScope'];
	function NavigationController(auth, $rootScope) {
		var $ctrl = this;

		$ctrl.logout = ()=>{
			auth.logout();
			$rootScope.$emit('forbidden');
		}
		

		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})(jQuery);