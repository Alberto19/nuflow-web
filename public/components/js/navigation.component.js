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

	NavigationController.$inject = ['auth','$rootScope', 'Profile', 'ProfileCompany'];
	function NavigationController(auth, $rootScope, Profile, ProfileCompany) {
		var $ctrl = this;
		$ctrl.getProfile = getProfile;
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

		function getProfile() {
			Profile.getProfile().then(user => {
				$ctrl.user.email = user.data.email;
				$ctrl.user.name = user.data.name;
				$ctrl.user.picture = user.data.picture;
			});
		};


		

		////////////////

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})(jQuery);