(function () {
	'use strict';

	angular
		.module('app')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['auth', '$state'];

	function RegisterController(auth, $state) {
		var vm = this;
		vm.user = {
			email: null,
			password: null,
			genre: null,
			type: 'user',
		};
		vm.register = register;

		function register() {
			if (vm.user.genre === null) {
				vm.user.genre = 'masculino';
			}
			auth.register(vm.user)
				.then(result => {
					if (result.status != 500) {
						$state.go('main.profile');
					} else {
						Materialize.toast(result.data, 3000);
					}
				});
		};
	}
})();