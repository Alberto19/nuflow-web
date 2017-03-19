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
			password:null,
			genre:null
		};
		vm.register = register;

		function register() {
			auth.register(vm.user)
				.then((response) =>{
					if(response.status != 500){
					$state.go('main.feed');
					}
				});
		};
	}
})();