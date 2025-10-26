<template>
  <div class="page active" id="signupPage">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo" @click="navigateTo('/')">
            RealPro
          </div>
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join thousands of teams using RealPro</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="signupName">
              Full Name
            </label>
            <input
              type="text"
              :class="['form-input', { 'error': errors.name }]"
              id="signupName"
              v-model="formData.name"
              @input="clearError('name')"
              required
              placeholder="Enter your full name"
            />
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signupEmail">
              Email Address
            </label>
            <input
              type="email"
              :class="['form-input', { 'error': errors.email }]"
              id="signupEmail"
              v-model="formData.email"
              @input="clearError('email')"
              required
              placeholder="Enter your email"
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signupPassword">
              Password
            </label>
            <input
              type="password"
              :class="['form-input', { 'error': errors.password }]"
              id="signupPassword"
              v-model="formData.password"
              @input="clearError('password')"
              required
              placeholder="Create a password (min. 6 characters)"
            />
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              :class="['form-input', { 'error': errors.confirmPassword }]"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              @input="clearError('confirmPassword')"
              required
              placeholder="Confirm your password"
            />
            <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" required />
              <span class="checkmark"></span>
              I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit" 
            :class="['btn', 'btn-primary', 'login-btn', { 'loading': isLoading }]"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <div class="spinner"></div>
              Creating Account...
            </template>
            <template v-else>
              Create Account
            </template>
          </button>
        </form>

        <div class="auth-divider">
          <span>Or continue with</span>
        </div>

        <div class="social-login">
          <button type="button" class="btn btn-social btn-google">
            <span class="social-icon">🔍</span>
            Google
          </button>
          <button type="button" class="btn btn-social btn-github">
            <span class="social-icon">💻</span>
            GitHub
          </button>
        </div>
        
        <div class="auth-switch">
          Already have an account?{" "}
          <a @click="navigateTo('/page/login')" class="auth-link">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Signup',
  setup() {
    const router = useRouter()
    
    const formData = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })
    
    const errors = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })
    
    const isLoading = ref(false)

    const USERS_KEY = "realpro_users"
    const AUTH_KEY = "userSession"

    const clearError = (fieldName) => {
      if (errors[fieldName]) {
        errors[fieldName] = ""
      }
    }

    // Check if email already exists
    const isEmailExists = (email) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
      return users.some(user => user.email === email)
    }

    const validateForm = () => {
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = "")
      let isValid = true

      if (!formData.name.trim()) {
        errors.name = "Name is required"
        isValid = false
      }

      if (!formData.email) {
        errors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid"
        isValid = false
      } else if (isEmailExists(formData.email)) {
        errors.email = "Email already exists"
        isValid = false
      }

      if (!formData.password) {
        errors.password = "Password is required"
        isValid = false
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
        isValid = false
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
        isValid = false
      }

      return isValid
    }

    const saveUserToLocalStorage = (userData) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
      
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this should be hashed
        createdAt: new Date().toISOString(),
        isActive: true
      }

      users.push(newUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      
      return newUser
    }

    const showToast = (message, type = "success") => {
      console.log(`${type.toUpperCase()}: ${message}`)
      alert(`${type.toUpperCase()}: ${message}`)
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    const handleSubmit = async () => {
      if (validateForm()) {
        isLoading.value = true
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        try {
          const newUser = saveUserToLocalStorage(formData)
          
          // Auto-login after signup
          const userSession = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            token: 'mock-jwt-token',
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }
          
          localStorage.setItem(AUTH_KEY, JSON.stringify(userSession))
          showToast('Account created successfully!', 'success')
          navigateTo('/dashboard')
          
        } catch (error) {
          showToast('Error creating account. Please try again.', 'error')
        } finally {
          isLoading.value = false
        }
      }
    }

    return {
      formData,
      errors,
      isLoading,
      handleSubmit,
      navigateTo,
      clearError
    }
  }
}
</script>

<style scoped>
/* Your existing land.css and form.css styles will work as-is */
</style>