(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$state', 'Profile'];

    function ProfileController($state, Profile) {
        var vm = this;
		vm.user = {
			email: null,
			date: null,
		}

		vm.getProfile = getProfile;

		 getProfile();
		function getProfile(){
			let email = {
				email: localStorage.getItem('userEmail')
			};
			Profile.getProfile(email).then(user=>{
				vm.user.email = user.data.email;
				vm.user.date = user.data.dateCreate;
			})
		}

    }
})();