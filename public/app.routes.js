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
                    abstract: true,
                    name:'init',
                    url: '',
                    templateUrl: 'views/layouts/init.html'
                })
            $stateProvider
                .state({
                    name:'init.login',
                    url: '/',
                    controller: 'LoginController as vm',
                    templateUrl: 'views/layouts/login.html'
                })
                .state({
                    name:'init.regiterUser',
                    url: '/cadastro',
                    controller: 'RegisterController as vm',
                    templateUrl: 'views/layouts/register.html'
                })
                .state({
                    name:'init.registerCompany',
                    url: '/cadastroCompany',
                    controller: 'RegisterCompanyController as vm',
                    templateUrl: 'views/layouts/registerCompany.html'
                })

                // Home routes
                .state('main', {
                    abstract: true,
                    url: '',
                    controller: 'LayoutController as vm',
                    templateUrl: 'views/layouts/main.html',
                })
                 .state('main.feed', {
                    url: '/feed',
                    controller: 'FeedController as vm',
                    templateUrl: 'views/partials/feed.html',
                })
                .state('main.profile', {
                    url: '/profile',
                    controller: 'ProfileController as vm',
                    templateUrl: 'views/partials/profile.html',
                })
                .state('main.profileCompany', {
                    url: '/profileCompany',
                    controller: 'ProfileCompanyController as vm',
                    templateUrl: 'views/partials/profileCompany.html',
                })
                .state('main.test', {
                    url: '/test',
                    controller: 'TestController as vm',
                    templateUrl: 'views/partials/test.html',
                })
        }]);
})();
