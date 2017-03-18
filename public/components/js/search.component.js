(function () {
	'use strict';
	angular
		.module('app')
		.component('search', {
			templateUrl: 'components/html/search.component.html',
			controller: SearchController,
			bindings: {
				Binding: '=',
			},
		});

	function SearchController() {
		var $ctrl = this;


		////////////////

		$ctrl.$onInit = function () {};
		$ctrl.$onChanges = function (changesObj) {};
		$ctrl.$onDestory = function () {};
	}
})();