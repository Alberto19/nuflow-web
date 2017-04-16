(function () {
	'use strict';

	angular
		.module('app')
		.controller('RegisterCompanyController', RegisterCompanyController);

	RegisterCompanyController.$inject = ['auth', '$state'];

	function RegisterCompanyController(auth, $state) {
		var vm = this;
		vm.company = {
			email: null,
			password: null,
			type: 'company',
		};
		vm.registerCompany = registerCompany;

		function registerCompany() {
			auth.register(vm.company)
				.then(result => {
					if (result.status != 500) {
						$state.go('main.profileCompany');
					} else {
						Materialize.toast(result.data, 3000);
					}
				});
		};
	}
})();