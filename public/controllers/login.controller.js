(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'auth'];

    function LoginController($state, auth) {
        var vm = this;
        vm.user = {
            email: null,
            password: null
        }

        vm.login = login;
        ////////////////

        function login() {
            auth.login(vm.user)
                .then((result) => {
                    if (result.status != 401 && result.status != 404) {
                        if (result.completed == false) {
                            $state.go('main.profile');
                        } else {
                            $state.go('main.feed');
                        }
                    }
                });
        }
    }
})();