(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCompanyController', LoginCompanyController);

    LoginCompanyController.$inject = ['$state', 'auth'];

    function LoginCompanyController($state, auth) {
        var vm = this;
        vm.company = {
            email: null,
            password: null
        }

        vm.loginCompany = loginCompany;
        ////////////////

        function loginCompany() {
            auth.loginCompany(vm.company)
                .then((result) => {
                    if (result.status != 401 && result.status != 404) {
                        if (result.completed == false) {
                            $state.go('main.profileCompany');
                        } else {
                            $state.go('main.feed');
                        }
                    }
                });
        }
    }
})();