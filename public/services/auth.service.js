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
                    return loginData;
                },
                 (error)=>{
                      if(error.status == 404){
                          Materialize.toast(error.data, 3000);
                     }
                     if(error.status == 401){
                         Materialize.toast(error.data, 3000);
                     }
                     return error;
                });
        }

        function register(user) {
            return $http.post(config.baseApiUrl + '/user/cadastrar', user)
            .then((data)=> {
                    var loginData = data.data;
                    authData.parseData(loginData);
                },(error)=> {
                    if(error.status == 500){
                         Materialize.toast(error.data, 3000);
                         return error;
                     }
                });
        }

        function logout() {
            authData.clearData();
        }
    }
})();