(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeedCompanyController', FeedCompanyController);

    FeedCompanyController.$inject = ['chart.js'];

    function FeedCompanyController() {
        var vm = this;

        vm.colors = ["rgb(159,204,0)","rgb(250,109,33)","rgb(154,154,154)"];
        vm.labels = ["Green", "Orange", "Grey"];
        vm.data = [300, 500, 100];
     
    
    }
})();