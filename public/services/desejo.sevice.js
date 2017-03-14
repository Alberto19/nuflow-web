(function () {
    'use strict';

    angular
        .module('app')
        .factory('Desejo', Desejo);

    Desejo.$inject = ['$http', 'config'];

    function Desejo($http, config) {
        var service = {
            getDesejos: getDesejos,
            cadastrar:cadastrar,
            getDesejo:getDesejo,
            editar:editar,
            deletar:deletar
        };

        return service;

        ////////////////
        function getDesejos() {
            return $http.get(config.baseApiUrl + '/desejo');
        };
        function cadastrar(desejo){
            return $http.post(config.baseApiUrl + '/desejo/create', desejo);
        };
        function getDesejo(desejo) {
            return $http.get(config.baseApiUrl + '/desejo/edit/' + desejo);
        }
        function editar(desejo) {
            return $http.post(config.baseApiUrl + '/desejo/editar/', desejo);
        }
        function deletar(desejo) {
            return $http.post(config.baseApiUrl + '/desejo/delete/' + desejo);
        }
    }
})();
