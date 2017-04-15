(function () {
    'use strict';

    angular
        .module('app')
        .factory('auth', auth);

    auth.$inject = ['$http', 'authData', 'config'];

    function auth($http, authData, config) {
        var service = {
            login: login,
            loginCompany: loginCompany,
            register: register,
            registerCompany: registerCompany,
            logout: logout
        };

        return service;

        ////////////////
        function login(user) {
            return $http.post(`${config.baseApiUrl}/user/login`, user)
                .then(data => {
                        var loginData = data.data;
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
        function loginCompany(company) {
            return $http.post(`${config.baseApiUrl}/company/login`, company)
                .then(data => {
                        var loginData = data.data;
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
            return $http.post(`${config.baseApiUrl}/user/cadastrar`, user)
                .then((data) => {
                    var registerData = data.data;
                    authData.parseData(registerData);
                    return data.data;
                }, (error) => {
                    return error;
                });
        };

        function registerCompany(company) {
            debugger
            return $http.post(`${config.baseApiUrl}/company/cadastrar`, company)
                .then((data) => {
                    debugger
                    var registerData = data.data;
                    authData.parseData(registerData);
                    return data.data;
                }, (error) => {
                    return error;
                });
        };

        function logout() {
            authData.clearData();
        };
    }
})();