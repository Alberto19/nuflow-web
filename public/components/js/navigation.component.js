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

	NavigationController.$inject = ['auth','$rootScope', 'Navigation'];
	function NavigationController(auth, $rootScope, Navigation) {
		var $ctrl = this;

		$ctrl.nav = {
			button: null,
			path: null,
			profile: null
		};

		$ctrl.user = {
			name: null,
			email: null,
			picture: null
		};

		$ctrl.logout = ()=>{
			auth.logout();
			$rootScope.$emit('forbidden');
		};

		function getProfile() {
			auth.getPhoto().then(photo => {
				debugger
				$ctrl.user.picture = photo;
			});
		};
		function getNavigation(){
			Navigation.get().then(nav => {
				debugger
				$ctrl.nav.button = nav.data.button;
				$ctrl.nav.path = nav.data.path;
				$ctrl.nav.profile = nav.data.profile;
			});
		}

		////////////////

		$ctrl.$onInit = function() { 
			getProfile();
			getNavigation();	
		};
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})(jQuery);