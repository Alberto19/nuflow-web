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
		});

	//NavigationController.$inject = ['dependency1'];
	function BaladaController() {
		var $ctrl = this;
		

		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})();