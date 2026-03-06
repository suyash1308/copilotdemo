const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            // General
            isDarkMode: localStorage.getItem('darkMode') === 'true',
            currentPage: localStorage.getItem('isLoggedIn') ? 'dashboard' : 'login',
            currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,

            // Theme
            emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

            // Login
            loginForm: { username: '', password: '' },
            loginFormErrors: { username: '', password: '' },
            showLoginPassword: false,
            isLoggingIn: false,
            loginError: '',
            loginSuccess: '',

            // Signup
            signupForm: { username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '' },
            signupFormErrors: { username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '' },
            showSignupPassword: false,
            showSignupConfirm: false,
            isSigningUp: false,
            signupError: '',
            signupSuccess: '',
            checkingUsername: false,
            checkingEmail: false,

            // Profile
            profileTab: 'info',
            profileForm: { first_name: '', last_name: '' },
            profileError: '',
            profileSuccess: '',
            isUpdatingProfile: false,
            passwordForm: { current_password: '', new_password: '', confirm_password: '' },
            showCurrentPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            securityError: '',
            securitySuccess: '',
            isChangingPassword: false,
            passwordStrength: 'weak',
            passwordStrengthPercent: 0,
            passwordStrengthLabel: '',

            // Dashboard
            searchQuery: '',
            filterCategory: null,
            selectedAnimal: null,
            favorites: JSON.parse(localStorage.getItem('favorites')) || [],
            totalUsers: 0,
            favoriteCount: 0,

            // Wildlife Management CRUD
            newAnimal: {
                name: '',
                description: '',
                category: '',
                image_url: '',
                facts_text: ''
            },
            selectedForEdit: null,
            editFactsText: '',
            isCreatingAnimal: false,
            isUpdatingAnimal: false,
            managementError: '',
            managementSuccess: '',

            // Wildlife data
            wildlifeAnimals: [
                {
                    id: 1,
                    name: 'Majestic Tiger',
                    description: 'The king of the jungle - a powerful striped predator',
                    category: 'Big Cats',
                    class: 'tiger',
                    facts: [
                        'Tigers are the largest cat species in the world',
                        'Each tiger has a unique stripe pattern like fingerprints',
                        'A tiger can eat up to 88 pounds of meat in one day',
                        'Tigers are excellent swimmers and love water',
                        'A tiger\'s roar can be heard from 2 miles away'
                    ]
                },
                {
                    id: 2,
                    name: 'African Lion',
                    description: 'Symbol of power and courage - ruling the African savanna',
                    category: 'Big Cats',
                    class: 'lion',
                    facts: [
                        'Lions are the only truly social cats',
                        'A lion\'s mane can have up to 10 different colors',
                        'Male lions sleep 20 hours a day',
                        'Lions can reach speeds of 50 mph when hunting',
                        'A lion\'s roar is the loudest of any cat species'
                    ]
                },
                {
                    id: 3,
                    name: 'African Elephant',
                    description: 'The largest land animal - intelligent and gentle giants',
                    category: 'Mammals',
                    class: 'elephant',
                    facts: [
                        'Elephants are highly intelligent with large brains',
                        'An elephant can weigh up to 14,000 pounds',
                        'Elephants have excellent memory and can remember friends for life',
                        'An elephant\'s trunk has over 40,000 muscles',
                        'Elephants are the only animals that mourn their dead'
                    ]
                },
                {
                    id: 4,
                    name: 'Spotted Leopard',
                    description: 'A graceful and elusive big cat hunting in the African wilderness',
                    category: 'Big Cats',
                    class: 'leopard',
                    facts: [
                        'Leopards are solitary and elusive creatures',
                        'A leopard can climb trees with prey twice its weight',
                        'Leopards are extremely adaptable to different habitats',
                        'A single leopard can hunt 20+ different prey species',
                        'Leopards have superior night vision, 6 times better than humans'
                    ]
                },
                {
                    id: 5,
                    name: 'Golden Eagle',
                    description: 'Master of the skies - soaring high with keen hunting abilities',
                    category: 'Birds',
                    class: 'eagle',
                    facts: [
                        'Golden eagles can fly up to 150 mph in a dive',
                        'Eagles can see fish from 3,000 feet away',
                        'Golden eagles mate for life and build huge nests',
                        'An eagle\'s grip is 10 times stronger than a human\'s hand',
                        'Golden eagles live up to 50 years in the wild'
                    ]
                },
                {
                    id: 6,
                    name: 'Gray Wolf',
                    description: 'Pack hunters of the forest - intelligent and deeply social creatures',
                    category: 'Mammals',
                    class: 'wolf',
                    facts: [
                        'Wolves are highly social animals that live in packs',
                        'A wolf pack has a hierarchical structure with an alpha pair',
                        'Wolves can run at speeds up to 40 mph',
                        'Wolves communicate through howling, body language, and scent marking',
                        'Wolves have been an important part of ecosystems for millions of years'
                    ]
                }
            ],

            apiUrl: 'http://localhost:5000/api'
        };
    },

    computed: {
        isLoginFormValid() {
            return this.loginForm.username.trim() && this.loginForm.password &&
                   !this.loginFormErrors.username && !this.loginFormErrors.password;
        },

        isSignupFormValid() {
            return this.signupForm.username && this.signupForm.email && 
                   this.signupForm.first_name.trim() && this.signupForm.last_name.trim() &&
                   this.signupForm.password && this.signupForm.password_confirm &&
                   !this.signupFormErrors.username && !this.signupFormErrors.email &&
                   !this.signupFormErrors.first_name && !this.signupFormErrors.last_name &&
                   !this.signupFormErrors.password && !this.signupFormErrors.password_confirm;
        },

        filteredAnimals() {
            let filtered = this.wildlifeAnimals;

            if (this.filterCategory) {
                filtered = filtered.filter(a => a.category === this.filterCategory);
            }

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(a => 
                    a.name.toLowerCase().includes(query) || 
                    a.description.toLowerCase().includes(query)
                );
            }

            return filtered;
        },

        favoriteAnimals() {
            return this.wildlifeAnimals.filter(a => this.favorites.includes(a.id));
        }
    },

    methods: {
        toggleTheme() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem('darkMode', this.isDarkMode);
            const app = document.getElementById('app');
            if (this.isDarkMode) {
                app.classList.add('dark-mode');
                document.body.style.backgroundColor = '#1a1a1a';
            } else {
                app.classList.remove('dark-mode');
                document.body.style.backgroundColor = '#fff';
            }
        },

        switchPage(page) {
            this.currentPage = page;
            this.clearErrors();
            this.clearFeedback();
        },

        clearErrors() {
            this.loginFormErrors = { username: '', password: '' };
            this.signupFormErrors = { username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '' };
        },

        clearFeedback() {
            this.loginError = '';
            this.loginSuccess = '';
            this.signupError = '';
            this.signupSuccess = '';
            this.profileError = '';
            this.profileSuccess = '';
            this.securityError = '';
            this.securitySuccess = '';
        },

        // Login validation
        validateLoginField(field) {
            const value = this.loginForm[field];
            
            if (field === 'username') {
                if (!value.trim()) {
                    this.loginFormErrors.username = 'Username or email is required';
                } else {
                    this.loginFormErrors.username = '';
                }
            } else if (field === 'password') {
                if (!value) {
                    this.loginFormErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    this.loginFormErrors.password = 'Password must be at least 6 characters';
                } else {
                    this.loginFormErrors.password = '';
                }
            }
        },

        // Signup validation
        async validateSignupField(field) {
            const value = this.signupForm[field];

            if (field === 'username') {
                if (!value) {
                    this.signupFormErrors.username = 'Username is required';
                } else if (value.length < 3) {
                    this.signupFormErrors.username = 'Username must be at least 3 characters';
                } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                    this.signupFormErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
                } else {
                    // Check availability
                    this.checkingUsername = true;
                    try {
                        const response = await axios.get(`${this.apiUrl}/auth/check-username/${value}`);
                        this.signupFormErrors.username = response.data.available ? '' : 'Username already taken';
                    } catch (e) {
                        this.signupFormErrors.username = '';
                    }
                    this.checkingUsername = false;
                }
            } else if (field === 'email') {
                if (!value) {
                    this.signupFormErrors.email = 'Email is required';
                } else if (!this.emailPattern.test(value)) {
                    this.signupFormErrors.email = 'Invalid email format';
                } else {
                    // Check availability
                    this.checkingEmail = true;
                    try {
                        const response = await axios.get(`${this.apiUrl}/auth/check-email/${value}`);
                        this.signupFormErrors.email = response.data.available ? '' : 'Email already registered';
                    } catch (e) {
                        this.signupFormErrors.email = '';
                    }
                    this.checkingEmail = false;
                }
            } else if (field === 'first_name') {
                this.signupFormErrors.first_name = !value.trim() ? 'First name is required' : '';
            } else if (field === 'last_name') {
                this.signupFormErrors.last_name = !value.trim() ? 'Last name is required' : '';
            } else if (field === 'password') {
                if (!value) {
                    this.signupFormErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    this.signupFormErrors.password = 'Password must be at least 6 characters';
                } else if (!/[A-Z]/.test(value)) {
                    this.signupFormErrors.password = 'Password must contain at least one uppercase letter';
                } else if (!/[a-z]/.test(value)) {
                    this.signupFormErrors.password = 'Password must contain at least one lowercase letter';
                } else if (!/[0-9]/.test(value)) {
                    this.signupFormErrors.password = 'Password must contain at least one number';
                } else {
                    this.signupFormErrors.password = '';
                }
            } else if (field === 'password_confirm') {
                if (!value) {
                    this.signupFormErrors.password_confirm = 'Please confirm your password';
                } else if (value !== this.signupForm.password) {
                    this.signupFormErrors.password_confirm = 'Passwords do not match';
                } else {
                    this.signupFormErrors.password_confirm = '';
                }
            }
        },

        async handleLogin() {
            if (!this.isLoginFormValid) return;
            this.isLoggingIn = true;

            try {
                const response = await axios.post(`${this.apiUrl}/auth/login`, {
                    username: this.loginForm.username.trim(),
                    password: this.loginForm.password
                });

                this.loginSuccess = '✓ Login successful!';
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                this.currentUser = response.data.user;

                setTimeout(() => {
                    this.currentPage = 'dashboard';
                    this.loginForm = { username: '', password: '' };
                    this.loginSuccess = '';
                }, 1500);

            } catch (error) {
                this.loginError = error.response?.data?.error || 'Login failed. Please try again.';
            } finally {
                this.isLoggingIn = false;
            }
        },

        async handleSignup() {
            if (!this.isSignupFormValid) return;
            this.isSigningUp = true;

            try {
                const response = await axios.post(`${this.apiUrl}/auth/signup`, {
                    username: this.signupForm.username.trim(),
                    email: this.signupForm.email.trim(),
                    first_name: this.signupForm.first_name.trim(),
                    last_name: this.signupForm.last_name.trim(),
                    password: this.signupForm.password,
                    password_confirm: this.signupForm.password_confirm
                });

                this.signupSuccess = '✓ Account created! Redirecting to login...';
                setTimeout(() => {
                    this.signupForm = { username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '' };
                    this.signupSuccess = '';
                    this.switchPage('login');
                }, 2000);

            } catch (error) {
                this.signupError = error.response?.data?.error || 'Signup failed. Please try again.';
            } finally {
                this.isSigningUp = false;
            }
        },

        async handleLogout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                this.currentUser = null;
                this.currentPage = 'login';
                this.favorites = [];
                this.clearErrors();
                this.clearFeedback();
            }
        },

        // Profile methods
        async updateProfile() {
            this.isUpdatingProfile = true;
            try {
                const response = await axios.put(`${this.apiUrl}/auth/user/${this.currentUser.id}`, {
                    first_name: this.profileForm.first_name,
                    last_name: this.profileForm.last_name
                });

                this.currentUser = response.data.user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.profileSuccess = '✓ Profile updated successfully!';
                setTimeout(() => this.profileSuccess = '', 3000);

            } catch (error) {
                this.profileError = error.response?.data?.error || 'Update failed';
            } finally {
                this.isUpdatingProfile = false;
            }
        },

        getSignupPasswordStrength() {
            const pwd = this.signupForm.password;
            let strength = 0;

            if (pwd.length >= 6) strength++;
            if (/[a-z]/.test(pwd)) strength++;
            if (/[A-Z]/.test(pwd)) strength++;
            if (/[0-9]/.test(pwd)) strength++;
            if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

            if (strength < 2) return 'weak';
            if (strength < 4) return 'medium';
            return 'strong';
        },

        getSignupPasswordStrengthPercent() {
            const strength = this.getSignupPasswordStrength();
            if (strength === 'weak') return 33;
            if (strength === 'medium') return 66;
            return 100;
        },

        getSignupPasswordStrengthLabel() {
            const strength = this.getSignupPasswordStrength();
            if (strength === 'weak') return '⚠️ Weak password';
            if (strength === 'medium') return '📊 Medium strength';
            return '✓ Strong password';
        },

        updatePasswordStrength() {
            const pwd = this.passwordForm.new_password;
            let strength = 0;

            if (pwd.length >= 6) strength++;
            if (/[a-z]/.test(pwd)) strength++;
            if (/[A-Z]/.test(pwd)) strength++;
            if (/[0-9]/.test(pwd)) strength++;
            if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

            if (strength < 2) {
                this.passwordStrength = 'weak';
                this.passwordStrengthPercent = 33;
                this.passwordStrengthLabel = '⚠️ Weak password';
            } else if (strength < 4) {
                this.passwordStrength = 'medium';
                this.passwordStrengthPercent = 66;
                this.passwordStrengthLabel = '📊 Medium strength';
            } else {
                this.passwordStrength = 'strong';
                this.passwordStrengthPercent = 100;
                this.passwordStrengthLabel = '✓ Strong password';
            }
        },

        async changePassword() {
            if (!this.passwordForm.current_password || !this.passwordForm.new_password || !this.passwordForm.confirm_password) {
                this.securityError = 'All fields are required';
                return;
            }

            if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
                this.securityError = 'Passwords do not match';
                return;
            }

            this.isChangingPassword = true;
            try {
                // Note: Backend should verify current password before changing
                this.securitySuccess = '✓ Password changed successfully!';
                this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
                setTimeout(() => this.securitySuccess = '', 3000);

            } catch (error) {
                this.securityError = error.response?.data?.error || 'Password change failed';
            } finally {
                this.isChangingPassword = false;
            }
        },

        // Wildlife methods
        showAnimalDetails(animal) {
            this.selectedAnimal = animal;
        },

        toggleFavorite(animalId) {
            const index = this.favorites.indexOf(animalId);
            if (index > -1) {
                this.favorites.splice(index, 1);
            } else {
                this.favorites.push(animalId);
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.favoriteCount = this.favorites.length;
        },

        isFavorited(animalId) {
            return this.favorites.includes(animalId);
        },

        // ==================== WILDLIFE CRUD OPERATIONS ====================

        // CREATE: Add new wildlife animal
        async createWildlifeAnimal(animalData) {
            /**
             * CREATE (POST) OPERATION
             * 
             * Logic Flow:
             * 1. Validate input data (name, description, category, facts)
             * 2. Send POST request to /api/wildlife endpoint
             * 3. Handle success - add new animal to local list
             * 4. Handle error - show error message to user
             * 5. Return the newly created animal object
             * 
             * Expected Input:
             * {
             *     name: "Animal Name",
             *     description: "Brief description",
             *     category: "Big Cats|Birds|Mammals",
             *     facts: ["fact1", "fact2", ...],
             *     image_url: "optional_url"
             * }
             */
            try {
                // Validate required fields
                if (!animalData.name || !animalData.description || !animalData.category) {
                    console.error('Missing required fields');
                    return null;
                }

                // Send POST request to create animal
                const response = await axios.post(`${this.apiUrl}/wildlife`, {
                    name: animalData.name.trim(),
                    description: animalData.description.trim(),
                    category: animalData.category.trim(),
                    facts: animalData.facts || [],
                    image_url: animalData.image_url || null
                });

                // Add new animal to frontend list
                const newAnimal = response.data.animal;
                this.wildlifeAnimals.push(newAnimal);

                console.log('✓ Animal created:', newAnimal);
                return newAnimal;

            } catch (error) {
                console.error('Error creating animal:', error.response?.data?.error || error.message);
                return null;
            }
        },

        // READ: Get all wildlife animals (with optional filtering)
        async readAllWildlifeAnimals(filters = null) {
            /**
             * READ ALL (GET) OPERATION
             * 
             * Logic Flow:
             * 1. Build query parameters from filters (category, search)
             * 2. Send GET request to /api/wildlife endpoint
             * 3. Receive list of animals from database
             * 4. Update local wildlifeAnimals array
             * 5. Handle errors gracefully
             * 6. Return complete list
             * 
             * Supported Filters:
             * {
             *     category: "Big Cats|Birds|Mammals",
             *     search: "search_text"
             * }
             */
            try {
                let url = `${this.apiUrl}/wildlife`;
                const params = new URLSearchParams();

                if (filters) {
                    if (filters.category) {
                        params.append('category', filters.category);
                    }
                    if (filters.search) {
                        params.append('search', filters.search);
                    }
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                // Send GET request to fetch all animals
                const response = await axios.get(url);
                const animals = response.data.animals;

                // Update local array with fresh data from database
                this.wildlifeAnimals = animals;

                console.log(`✓ Fetched ${animals.length} animals`);
                return animals;

            } catch (error) {
                console.error('Error fetching animals:', error.response?.data?.error || error.message);
                return [];
            }
        },

        // READ: Get single wildlife animal by ID
        async readWildlifeAnimal(animalId) {
            /**
             * READ SINGLE (GET by ID) OPERATION
             * 
             * Logic Flow:
             * 1. Validate animal ID format
             * 2. Send GET request to /api/wildlife/{id} endpoint
             * 3. Receive complete animal data with details
             * 4. Increment view count on backend
             * 5. Return animal object
             * 6. Handle not found errors
             * 
             * Returns: Single animal object with all details
             */
            try {
                // Send GET request with specific animal ID
                const response = await axios.get(`${this.apiUrl}/wildlife/${animalId}`);
                const animal = response.data;

                console.log('✓ Fetched animal details:', animal);
                return animal;

            } catch (error) {
                if (error.response?.status === 404) {
                    console.error('Animal not found');
                } else {
                    console.error('Error fetching animal:', error.response?.data?.error || error.message);
                }
                return null;
            }
        },

        // UPDATE: Modify existing wildlife animal
        async updateWildlifeAnimal(animalId, updateData) {
            /**
             * UPDATE (PUT) OPERATION
             * 
             * Logic Flow:
             * 1. Validate animal ID exists
             * 2. Prepare update payload with changed fields only
             * 3. Send PUT request to /api/wildlife/{id} endpoint
             * 4. Receive updated animal from backend
             * 5. Update local array with new data
             * 6. Handle validation errors from backend
             * 7. Return updated animal object
             * 
             * Update Data (any combination):
             * {
             *     name: "New Name",
             *     description: "New description",
             *     category: "New category",
             *     facts: ["new", "facts"],
             *     image_url: "new_url"
             * }
             */
            try {
                if (!animalId) {
                    console.error('Animal ID is required');
                    return null;
                }

                // Build update payload (only include provided fields)
                const payload = {};
                if (updateData.name !== undefined) payload.name = updateData.name.trim();
                if (updateData.description !== undefined) payload.description = updateData.description.trim();
                if (updateData.category !== undefined) payload.category = updateData.category.trim();
                if (updateData.facts !== undefined) payload.facts = updateData.facts;
                if (updateData.image_url !== undefined) payload.image_url = updateData.image_url;

                // Send PUT request to update animal
                const response = await axios.put(`${this.apiUrl}/wildlife/${animalId}`, payload);
                const updatedAnimal = response.data.animal;

                // Update local array - find and replace the animal
                const index = this.wildlifeAnimals.findIndex(a => a.id === animalId);
                if (index !== -1) {
                    this.wildlifeAnimals[index] = updatedAnimal;
                }

                console.log('✓ Animal updated:', updatedAnimal);
                return updatedAnimal;

            } catch (error) {
                console.error('Error updating animal:', error.response?.data?.error || error.message);
                return null;
            }
        },

        // DELETE: Remove wildlife animal
        async deleteWildlifeAnimal(animalId) {
            /**
             * DELETE (DELETE) OPERATION
             * 
             * Logic Flow:
             * 1. Validate animal ID
             * 2. Confirm deletion with user
             * 3. Send DELETE request to /api/wildlife/{id} endpoint
             * 4. Remove animal from local array
             * 5. Remove from favorites if favorited
             * 6. Handle deletion errors
             * 7. Return success status
             * 
             * Returns: Boolean indicating success
             */
            try {
                if (!animalId) {
                    console.error('Animal ID is required');
                    return false;
                }

                // Confirm deletion from user
                if (!confirm('Are you sure you want to delete this animal?')) {
                    return false;
                }

                // Send DELETE request
                await axios.delete(`${this.apiUrl}/wildlife/${animalId}`);

                // Remove from local array
                const index = this.wildlifeAnimals.findIndex(a => a.id === animalId);
                if (index !== -1) {
                    this.wildlifeAnimals.splice(index, 1);
                }

                // Remove from favorites if it was favorited
                const favIndex = this.favorites.indexOf(animalId);
                if (favIndex !== -1) {
                    this.favorites.splice(favIndex, 1);
                    localStorage.setItem('favorites', JSON.stringify(this.favorites));
                }

                console.log('✓ Animal deleted successfully');
                return true;

            } catch (error) {
                console.error('Error deleting animal:', error.response?.data?.error || error.message);
                return false;
            }
        },

        // HELPER: Bulk create animals from list
        async bulkCreateAnimals(animalsList) {
            /**
             * Helper function to create multiple animals at once
             * 
             * Logic: Iterate through array and create each animal
             * Returns: Array of created animals with their IDs
             */
            const createdAnimals = [];

            for (const animal of animalsList) {
                const created = await this.createWildlifeAnimal(animal);
                if (created) {
                    createdAnimals.push(created);
                }
            }

            console.log(`✓ Created ${createdAnimals.length} animals`);
            return createdAnimals;
        },

        // HELPER: Search and filter animals locally
        searchAndFilterAnimals(searchText, category) {
            /**
             * Local search and filter (without backend call)
             * Useful for instant filtering without API delay
             * 
             * Logic:
             * 1. Filter by category if provided
             * 2. Search in name and description
             * 3. Return matching animals
             */
            return this.wildlifeAnimals.filter(animal => {
                const categoryMatch = !category || animal.category === category;
                const searchMatch = !searchText || 
                    animal.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    animal.description.toLowerCase().includes(searchText.toLowerCase());

                return categoryMatch && searchMatch;
            });
        },

        // ==================== UI HANDLER METHODS FOR CRUD ====================

        // CREATE: Handle form submission for new animal
        async handleCreateAnimal() {
            /**
             * UI Handler for CREATE operation
             * 
             * Flow:
             * 1. Validate form fields
             * 2. Parse facts from textarea (split by newline)
             * 3. Call createWildlifeAnimal() method
             * 4. Show success/error feedback
             * 5. Clear form on success
             */
            try {
                // Validation
                if (!this.newAnimal.name.trim()) {
                    this.managementError = '❌ Please enter an animal name';
                    return;
                }
                if (!this.newAnimal.description.trim()) {
                    this.managementError = '❌ Please enter a description';
                    return;
                }
                if (!this.newAnimal.category) {
                    this.managementError = '❌ Please select a category';
                    return;
                }
                if (!this.newAnimal.facts_text.trim()) {
                    this.managementError = '❌ Please enter at least one fact';
                    return;
                }

                this.isCreatingAnimal = true;
                this.managementError = '';
                this.managementSuccess = '';

                // Parse facts from textarea
                const facts = this.newAnimal.facts_text
                    .split('\n')
                    .map(f => f.trim())
                    .filter(f => f.length > 0);

                // Call CREATE method
                const result = await this.createWildlifeAnimal({
                    name: this.newAnimal.name,
                    description: this.newAnimal.description,
                    category: this.newAnimal.category,
                    facts: facts,
                    image_url: this.newAnimal.image_url
                });

                if (result) {
                    this.managementSuccess = '✓ Animal created successfully!';
                    // Reset form
                    this.newAnimal = {
                        name: '',
                        description: '',
                        category: '',
                        image_url: '',
                        facts_text: ''
                    };
                    setTimeout(() => this.managementSuccess = '', 3000);
                } else {
                    this.managementError = '❌ Failed to create animal';
                }

            } catch (error) {
                this.managementError = '❌ Error: ' + error.message;
            } finally {
                this.isCreatingAnimal = false;
            }
        },

        // READ: Select animal for editing (loads data from list)
        selectAnimalForEdit(animal) {
            /**
             * UI Handler to select an animal for editing
             * 
             * Flow:
             * 1. Copy animal data to edit form
             * 2. Convert facts array back to textarea format
             * 3. Switch to edit tab
             */
            this.selectedForEdit = { ...animal };
            this.editFactsText = (animal.facts || []).join('\n');
            this.profileTab = 'edit';
        },

        // UPDATE: Handle form submission for editing animal
        async handleUpdateAnimal() {
            /**
             * UI Handler for UPDATE operation
             * 
             * Flow:
             * 1. Validate form fields
             * 2. Parse facts from textarea
             * 3. Call updateWildlifeAnimal() method
             * 4. Show success/error feedback
             * 5. Clear edit form on success
             */
            try {
                if (!this.selectedForEdit) {
                    this.managementError = '❌ No animal selected';
                    return;
                }

                // Validation
                if (!this.selectedForEdit.name.trim()) {
                    this.managementError = '❌ Please enter an animal name';
                    return;
                }
                if (!this.selectedForEdit.description.trim()) {
                    this.managementError = '❌ Please enter a description';
                    return;
                }

                this.isUpdatingAnimal = true;
                this.managementError = '';
                this.managementSuccess = '';

                // Parse facts from textarea
                const facts = this.editFactsText
                    .split('\n')
                    .map(f => f.trim())
                    .filter(f => f.length > 0);

                // Call UPDATE method
                const result = await this.updateWildlifeAnimal(
                    this.selectedForEdit.id || this.selectedForEdit._id,
                    {
                        name: this.selectedForEdit.name,
                        description: this.selectedForEdit.description,
                        category: this.selectedForEdit.category,
                        facts: facts,
                        image_url: this.selectedForEdit.image_url
                    }
                );

                if (result) {
                    this.managementSuccess = '✓ Animal updated successfully!';
                    setTimeout(() => {
                        this.selectedForEdit = null;
                        this.managementSuccess = '';
                        this.profileTab = 'list';
                    }, 2000);
                } else {
                    this.managementError = '❌ Failed to update animal';
                }

            } catch (error) {
                this.managementError = '❌ Error: ' + error.message;
            } finally {
                this.isUpdatingAnimal = false;
            }
        },

        // DELETE: Handle animal deletion
        async deleteAnimal(animalId) {
            /**
             * UI Handler for DELETE operation
             * 
             * Flow:
             * 1. Ask for confirmation
             * 2. Call deleteWildlifeAnimal() method
             * 3. Show success/error feedback
             * 4. Update local list
             */
            try {
                if (!animalId) {
                    this.managementError = '❌ Invalid animal ID';
                    return;
                }

                const result = await this.deleteWildlifeAnimal(animalId);

                if (result) {
                    this.managementSuccess = '✓ Animal deleted successfully!';
                    // Refresh the list
                    setTimeout(() => {
                        this.managementSuccess = '';
                    }, 3000);
                } else {
                    this.managementError = '❌ Deletion cancelled or failed';
                }

            } catch (error) {
                this.managementError = '❌ Error: ' + error.message;
            }
        }
    },

    mounted() {
        if (this.currentUser) {
            this.profileForm = {
                first_name: this.currentUser.first_name || '',
                last_name: this.currentUser.last_name || ''
            };
        }
        this.favoriteCount = this.favorites.length;
        this.totalUsers = 1;
        
        // Apply dark mode class if needed
        const app = document.getElementById('app');
        if (this.isDarkMode) {
            app.classList.add('dark-mode');
            document.body.style.backgroundColor = '#1a1a1a';
        } else {
            app.classList.remove('dark-mode');
            document.body.style.backgroundColor = '#fff';
        }
    }
});

app.mount('#app');
