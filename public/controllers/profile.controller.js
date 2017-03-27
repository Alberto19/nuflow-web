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
			genre: null,
			picture: null
		}

		vm.getProfile = getProfile;

		 getProfile();
		function getProfile(){
			Profile.getProfile().then(user=>{
				debugger;
				vm.user.email = user.data.email;
				vm.user.genre = user.data.genre;
				vm.user.date = user.data.dateCreate;
			})
		}

    }
})();