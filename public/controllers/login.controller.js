(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'auth'];

    function LoginController($state, auth) {
        var vm = this;
        vm.auth = {
            email: null,
            password: null
        }

        vm.login = login;
        ////////////////

        function login() {
            auth.login(vm.auth)
                .then((result) => {
                    if (result.status != 401 && result.status != 404) {
                        if(result.auth.type === 'user'){
                            if (result.auth.completed === false) {
                                $state.go('main.profile');
                            } else {
                                $state.go('main.feed');
                            }
                        }else{
                             if (result.auth.completed === false) {
                                $state.go('main.profileCompany');
                            } else {
                                $state.go('main.feed');
                            }
                        }
                    }
                });
        }
    }
})();