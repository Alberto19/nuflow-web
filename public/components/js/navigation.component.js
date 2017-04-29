(function($) {
'use strict';
	angular
		.module('app')
		.component('navigation', {
			templateUrl:'components/html/navigation.component.html',
			controller: NavigationController,
			bindings: {
				show: '=',
			},
		});

	NavigationController.$inject = ['$state','auth','$rootScope', 'Navigation'];
	function NavigationController($state, auth, $rootScope, Navigation) {
		var $ctrl = this;

		$ctrl.nav = {
			button: null,
			path: '',
			profile: null
		};

		$ctrl.user = {
			name: null,
			email: null,
			picture: null
		};
		$ctrl.path = () => {
			$state.go(`${$ctrl.nav.path}`);
		};
		$ctrl.profile = () => {
			$state.go(`${$ctrl.nav.profile}`);
		};

		$ctrl.logout = ()=>{
			auth.logout();
			$rootScope.$emit('forbidden');
		};

		function getProfile() {
			auth.getPhoto().then(photo => {
				$ctrl.user.picture = photo;
			});
		};
		
		function getNavigation(){
			Navigation.get().then(nav => {
				$ctrl.nav.button = nav.data.button;
				$ctrl.nav.path = nav.data.path;
				$ctrl.nav.profile = nav.data.profile;
			});
		}
		$ctrl.$onInit = function() { 
			getProfile();
			getNavigation();
		};
		$ctrl.$onChanges = function(changesObj) {
		};
		$ctrl.$onDestory = function() { };
	}
})(jQuery);