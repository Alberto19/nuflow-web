(function () {
	'use strict';

	angular
		.module('app')
		.controller('ProfileCompanyController', ProfileCompanyController);

	ProfileCompanyController.$inject = ['$state', 'ProfileCompany', 'auth'];

	function ProfileCompanyController($state, ProfileCompany, auth) {
		var vm = this;
		vm.company = {
			name: null,
			email: null,
			photos: null,
			adress: null,
			location: [-23.6159617,-46.66452300000003],
			rating: null,
			mapsUrl: null,
			country: null,
			uf: null,
			reviews: null,
			phone: null,
			days: null,
			drinkPrice: null,
			site: null,
			file: null,
			picture: null,
		};

		vm.uf = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
		 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN','RS','RO','RR','SC','SP','SE','TO'];

		vm.getProfileCompany = getProfileCompany;
		vm.updateProfileCompany = updateProfileCompany;
		vm.uploadPhoto = uploadPhoto;

		getProfileCompany();

		function getProfileCompany() {
			ProfileCompany.getProfileCompany().then(company => {
				vm.company.name = company.data.name;
				vm.company.email = company.data.email;
				vm.company.photos = company.data.photo;
				vm.company.adress = company.data.adress;
				vm.company.rating = company.data.rating;
				vm.company.mapsUrl = company.data.mapsUrl;
				vm.company.country = company.data.country;
				vm.company.uf = company.data.uf;
				vm.company.reviews = company.data.reviews;
				vm.company.phone = company.data.phone;
				vm.company.days = company.data.days;
				vm.company.drinkPrice = company.data.drinkPrice;
				vm.company.site = company.data.site;

				auth.getPhoto().then(photo => {
					if (photo.status != 404) {
						vm.company.picture = photo;
					}
				});
			});
		};

		function updateProfileCompany() {
			if (vm.company.picture != null) {
				vm.company.picture = null;
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

		function uploadPhoto() {
			ProfileCompany.uploadPhoto(vm.company.file).then(() => {
				auth.getPhoto().then(photo => {
					vm.company.picture = photo;
				});
				Materialize.toast('Imagem Atualizada com sucesso', 3000);
			});
		}

	}
})();