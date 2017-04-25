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
		// if(localStorage.getItem('token') != null){
		// $ctrl.getProfile();
		// }

		// function getProfile() {
		// 	Profile.getProfile().then(user => {
		// 		$ctrl.user.email = user.data.email;
		// 		$ctrl.user.name = user.data.name;
		// 		$ctrl.user.picture = user.data.picture;
		// 	});
		// };
		getNavigation();
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
			
		};
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})(jQuery);