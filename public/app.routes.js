(function () {
    'use strict';

    angular
        .module('app')
        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', ($locationProvider, $stateProvider, $urlRouterProvider)=> {
            // Use URLs without hash
            $locationProvider.html5Mode(true);

            // Login routes
            $stateProvider
                .state({
                    name:'login',
                    url: '/',
                    controller: 'LoginController as vm',
                    templateUrl: 'views/layouts/login.html'
                })
                .state({
                    name:'register',
                    url: '/cadastro',
                    controller: 'RegisterController as vm',
                    templateUrl: 'views/layouts/register.html'
                })

                // Home routes
                .state('main', {
                    abstract: true,
                    url: '/main',
                    controller: 'LayoutController as vm',
                    templateUrl: 'views/layouts/idex.html',
                })

        }]);
})();
