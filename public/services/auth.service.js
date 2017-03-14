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
            logout: logout
        };

        return service;

        ////////////////
        function login(user) {
            return $http.post(config.baseApiUrl + '/user/login',user)
            .then((data) =>{
                    var loginData = data.data;
                    authData.parseData(loginData);
                },
                 (data)=>{
                    console.log(data);
                });
        }

        function register(user) {
            return $http.post(config.baseApiUrl + '/user/cadastrar', user)
            .then((data)=> {
                    var loginData = data.data;
                    authData.parseData(loginData);
                },(data)=> {
                    console.log(data);
                });
        }

        function logout() {
            authData.clearData();
        }
    }
})();