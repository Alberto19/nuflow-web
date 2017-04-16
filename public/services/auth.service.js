(function () {
    'use strict';

    angular
        .module('app')
        .factory('auth', auth);

    auth.$inject = ['$http', 'authData', 'config'];

    function auth($http, authData, config) {
        var service = {
            login: login,
            register: register,
            getPhoto: getPhoto,
            logout: logout
        };

        return service;

        ////////////////
        function login(auth) {
            return $http.post(`${config.baseApiUrl}/auth/login`, auth)
                .then(result => {
                        var loginData = result.data;
                        authData.parseData(loginData);
                        return loginData;
                    },
                    (error) => {
                        if (error.status == 404) {
                            Materialize.toast(error.data, 3000);
                        }
                        if (error.status == 401) {
                            Materialize.toast(error.data, 3000);
                        }
                        return error;
                    });
        };

        function register(user) {
            return $http.post(`${config.baseApiUrl}/auth/cadastrar`, user)
                .then((result) => {
                    var registerData = result.data;
                    authData.parseData(registerData);
                    return result.data;
                }, (error) => {
                    return error;
                });
        };

        function getPhoto() {
            return $http.get(`${config.baseApiUrl}/auth/photo`)
                .then((result) => {
                    return result.data;
                }, (error) => {
                    return error;
                });
        };


        function logout() {
            authData.clearData();
        };
    }
})();