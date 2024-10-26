angular.module('agrimartApp', ['ngAnimate'])
.controller('MainController', ['$scope','$window', '$timeout', '$http', function($scope,$window, $timeout) {
       $scope.searchQuery = '';

            $scope.search = function() {
                const query = $scope.searchQuery.toLowerCase();

                // Mapping keywords to corresponding pages
                const pages = {
                    'seeds': 'seeds.html',
                    'saplings': 'saplings.html',
                    'fertilizers': 'fertilizers.html',
                    'pesticides': 'pesticides.html',
                    'tools': 'tools.html'
                };

                // Find the page corresponding to the search query
                let found = false;
                for (const keyword in pages) {
                    if (query.includes(keyword)) {
                        // Navigate to the respective page
                        $window.location.href = pages[keyword];
                        found = true;
                        break; // Exit the loop once a match is found
                    }
                }

                // Alert if no matching page is found
                if (!found) {
                    alert('No matching page found for: ' + $scope.searchQuery);
                }
            };
     $scope.images = [
        { src: 'front1.jpg', alt: 'Slide 1' },
        { src: 'image2.jpg', alt: 'Slide 2' },
        { src: 'image3.jpg', alt: 'Slide 3' },
        { src: 'image1.jpeg', alt: 'Slide 3' }

    ];

    $scope.currentSlide = 0;

    $scope.isActive = function(index) {
        return $scope.currentSlide === index;
    };

    $scope.nextSlide = function() {
        $scope.currentSlide = ($scope.currentSlide + 1) % $scope.images.length;
    };

    $scope.prevSlide = function() {
        $scope.currentSlide = ($scope.currentSlide - 1 + $scope.images.length) % $scope.images.length;
    };
     $scope.brands = [
        { src: 'kaveri.png', alt: 'Rallis India', link: 'rallis-india.html' },
        { src: 'fmc.png', alt: 'FMC', link: 'fmc.html' },    
        { src: 'bayer.png', alt: 'Bayer', link: 'bayer.html' },
        { src: 'syngenta.png', alt: 'Syngenta', link: 'syngenta.html' },
        { src: 'seminis.png', alt: 'Seminis', link: 'seminis.html' },
        { src: 'janatha.png', alt: 'Janatha Agro', link: 'janatha-agro.html' },
        { src: 'geolife.png', alt: 'Tapas by BigHaat', link: 'tapas.html' },
        { src: 'dhanuka.png', alt: 'Dhanuka', link: 'dhanuka.html' },
        { src: 'vnr.png', alt: 'Nandhari Seeds', link: 'nandhari-seeds.html' },
            ];

     $scope.items = [
        { src: 'ex1.jpg', alt: 'Crop Nutrients', link: 'fertilizers.html' },
        { src: 'ex2.jpg', alt: 'Herbicides', link: 'pesticides.html' },
        { src: 'ex3.jpg', alt: 'Seeds', link: 'seeds.html' },
        { src: 'ex4.jpg', alt: 'Nematodes Solution', link: 'pesticides.html' }
    ];

}]);

angular.module('signupApp', [])
.controller('SignupController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.user = {};
    $scope.errors = {
        username: '',
        email: '', general: ''  
    };

    $scope.signup = function() {
        // Ensure form validation is checked
        if ($scope.signupForm.$valid) {
            // Check if username and email already exist in the backend
            $http.post('http://localhost:3000/api/checkUser', {
                username: $scope.user.username,
                email: $scope.user.email
            }).then(function(response) {
                if (response.data.exists) {
                    // If user exists, store data and redirect to index.html
                    localStorage.setItem('username', $scope.user.username);
                    localStorage.setItem('email', $scope.user.email);
                    $window.location.href = 'index.html';
                } else {
                    // If user doesn't exist, show error below the signup button
                    $scope.errors.general = 'Username or email does not exist';
                }
            }).catch(function(error) {
                console.error('Error checking user:', error);
                $scope.errors.general = 'Sorry! Account Doesnot Exists';
            });
        } else {
            $scope.errors.general = 'Please fill out all required fields correctly.';
        }
    };

    $scope.resetError = function() {
        $scope.errors.general = '';  // Clear the general error on focus
    
    };

    $scope.validateField = function(fieldName) {
        if ($scope.signupForm[fieldName].$error.required) {
            $scope.errors[fieldName] = 'Please fill out this field';
        } else if ($scope.signupForm[fieldName].$error.email) {
            $scope.errors[fieldName] = 'Enter a valid email address';
        } else {
            $scope.errors[fieldName] = '';
        }
    };

    $scope.resetError = function(fieldName) {
        $scope.errors[fieldName] = '';
    };
}]);

angular.module('accountApp', [])
.controller('AccountController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.user = {};
    $scope.errors = {
        username: '',
        email: '',
        phone: '',
        gender: '',
        doorNo: '',
        street: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        nationality: '',
        general: ''  // Add a general error message field
    };

    $scope.createAccount = function() {
        // Reset general error message
        $scope.errors.general = '';

        // Check if the form is valid
        if ($scope.accountForm.$valid) {
            // Send account data to the server
            $http.post('http://localhost:3000/api/accounts', $scope.user)
            .then(function(response) {
                $window.location.href = 'index.html'; // Redirect to index.html after successful account creation
            }).catch(function(error) {
                console.error('Error creating account:', error);
            });
        } else {
            // Set general error message if form is invalid
            $scope.errors.general = 'Please fill all the required fields.';
        }
    };

    $scope.validateField = function(fieldName) {
        var field = $scope.accountForm[fieldName];

        // Reset error message for the field initially
        $scope.errors[fieldName] = '';

        // Validation for the phone number
        if (fieldName === 'phone') {
            if (field.$error.required) {
                $scope.errors.phone = 'Please fill out this field';
            } else if (field.$viewValue && field.$viewValue.length !== 10) {
                $scope.errors.phone = 'Phone number must be 10 digits';
            }
        }

        // Validation for the email
        if (fieldName === 'email') {
            if (field.$error.required) {
                $scope.errors.email = 'Please fill out this field';
            } else if (field.$error.email) {
                $scope.errors.email = 'Enter a valid email address';
            } else {
                // Check if email exists in the database
                $http.get(`http://localhost:3000/api/accounts/check-email/${$scope.user.email}`)
                .then(function(response) {
                    if (response.data.exists) {
                        $scope.errors.email = 'An account with this email ID already exists';
                    }
                }).catch(function(error) {
                    console.error('Error checking email:', error);
                });
            }
        }

        // Generic required field validation
        if (field.$error.required && fieldName !== 'email' && fieldName !== 'phone') {
            $scope.errors[fieldName] = 'Please fill out this field';
        } else if (fieldName === 'gender' && !$scope.user.gender) {
            $scope.errors.gender = 'Select anyone gender';
        }
    };

    $scope.resetError = function(fieldName) {
        $scope.errors[fieldName] = '';
    };
}]);
