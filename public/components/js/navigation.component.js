(function() {
'use strict';

	// Usage:
	// 
	// Creates:
	// 

	angular
		.module('app')
		.component('navigation', {
			templateUrl:'js/components/html/navigation.component.html',
			controller: NavigationController,
			bindings: {
				show: '=',
			},
		});

	//NavigationController.$inject = ['dependency1'];
	function NavigationController() {
		var $ctrl = this;
		

		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})();