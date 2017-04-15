(function () {
	'use strict';

	angular
		.module('app')
		.controller('ProfileCompanyController', ProfileCompanyController);

	ProfileCompanyController.$inject = ['$state','ProfileCompany'];

	function ProfileCompanyController($state, ProfileCompany) {
		var vm = this;
		vm.company = {
				name: null,
				email: null,
				photos: null,
				adress: null,
				location: null,
				rating: null,
				mapsUrl: null,
				country: null,
				uf: null,
				reviews: null,
				phone: null,
				days: null,
				drinkPrice: null,
				site: null,
				files: null
			};

		vm.getProfileCompany = getProfileCompany;
		vm.updateProfileCompany = updateProfileCompany;
		vm.uploadCompanyPhotos = uploadCompanyPhotos;

		// getProfileCompany();

		function getProfileCompany() {
			ProfileCompany.getProfileCompany().then(company => {
				vm.company.name  = company.data.name;
				vm.company.email = company.data.email;
				vm.company.photos = company.data.photo;
				vm.company.adress = company.data.adress;
				vm.company.location = company.data.location;
				vm.company.rating = company.data.rating;
				vm.company.mapsUrl = company.data.mapsUrl;
				vm.company.county = company.data.country;
				vm.company.uf = company.data.uf;
				vm.company.reviews = company.data.reviews;
				vm.company.phone = company.data.phone;
				vm.company.days = company.data.days;
				vm.company.drinkPrice = company.data.drinkPrice;
				vm.company.site = company.data.site;
			});
		};

		function updateProfileCompany() {
			if (vm.company.photos != null) {
				vm.company.photos = null;
				vm.company.file = null;
			}
			ProfileCompany.updateProfileCompany(vm.company).then(() => {
				Materialize.toast('Cadastro Atualizado com sucesso', 3000);
					 $state.go('main.feed');
				},
				(err) => {
					Materialize.toast('Erro ao Atualizar Cadastro', 3000);
				});
		};

		function uploadCompanyPhotos() {
			ProfileCompany.uploadCompanyPhotos(vm.company.files).then(() => {
				ProfileCompany.getProfileCompany().then(company => {
					vm.company.photos = company.data.photos;
				});
				Materialize.toast('Imagem Atualizada com sucesso', 3000);
			});
		}

	}
})();