<template>
  <div class="page active" id="loginPage">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo" @click="navigateTo('/')">
            RealPro
          </div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="loginEmail">
              Email Address
            </label>
            <input
              type="email"
              :class="['form-input', { 'error': errors.email }]"
              id="loginEmail"
              v-model="formData.email"
              @input="clearError('email')"
              required
              placeholder="Enter your email"
            />
            <div v-if="errors.email" class="error-message" id="loginEmailError">
              {{ errors.email }}
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-label-container">
              <label class="form-label" for="loginPassword">
                Password
              </label>
              <a class="forgot-password" @click="showToast('Password reset feature coming soon!', 'info')">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              :class="['form-input', { 'error': errors.password }]"
              id="loginPassword"
              v-model="formData.password"
              @input="clearError('password')"
              required
              placeholder="Enter your password"
            />
            <div v-if="errors.password" class="error-message" id="loginPasswordError">
              {{ errors.password }}
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" />
              <span class="checkmark"></span>
              Remember me
            </label>
          </div>
          
          <button 
            type="submit" 
            :class="['btn', 'btn-primary', 'login-btn', { 'loading': isLoading }]"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <div class="spinner"></div>
              Signing In...
            </template>
            <template v-else>
              Sign In
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
          Don't have an account?{" "}
          <a @click="navigateTo('/page/signup')" class="auth-link">
            Sign up here
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    
    const formData = reactive({
      email: "",
      password: ""
    })
    
    const errors = reactive({
      email: "",
      password: ""
    })
    
    const isLoading = ref(false)

    const USERS_KEY = "realpro_users"
    const AUTH_KEY = "userSession"

    // Generate a secure random token
    const generateToken = () => {
      const randomBytes = new Uint8Array(32)
      crypto.getRandomValues(randomBytes)
      return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')
    }

    // Check if user is authenticated
    const isAuthenticated = () => {
      const session = localStorage.getItem(AUTH_KEY)
      if (!session) return false

      try {
        const userSession = JSON.parse(session)
        const isValid = userSession && 
                       userSession.token && 
                       userSession.expires > Date.now()
        return isValid
      } catch {
        return false
      }
    }

    // Check if user exists in localStorage
    const validateUserCredentials = (email, password) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
      const user = users.find(user => 
        user.email === email && user.password === password && user.isActive
      )
      return user || null
    }

    const showToast = (message, type = "success") => {
      console.log(`${type.toUpperCase()}: ${message}`)
      alert(`${type.toUpperCase()}: ${message}`)
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    const clearError = (fieldName) => {
      if (errors[fieldName]) {
        errors[fieldName] = ""
      }
    }

    const validateForm = () => {
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = "")
      let isValid = true

      // Email validation
      if (!formData.email) {
        errors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid"
        isValid = false
      }

      // Password validation
      if (!formData.password) {
        errors.password = "Password is required"
        isValid = false
      }

      return isValid
    }

    const login = async (email, password) => {
      isLoading.value = true
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      try {
        const user = validateUserCredentials(email, password)
        
        if (user) {
          // Generate secure token
          const token = generateToken()
          const expirationTime = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          
          const userSession = {
            id: user.id,
            email: user.email,
            name: user.name,
            token: token,
            expires: expirationTime,
            issuedAt: Date.now(),
            role: user.role || 'user' // Default role
          }
          
          localStorage.setItem(AUTH_KEY, JSON.stringify(userSession))
          showToast('Login successful!', 'success')
          navigateTo('/dashboard')
          return true
        } else {
          // Check if email exists but password is wrong
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
          const emailExists = users.some(user => user.email === email)
          
          if (emailExists) {
            errors.password = "Invalid password"
            showToast('Invalid password. Please try again.', 'error')
          } else {
            errors.email = "Email not found. Please sign up first."
            showToast('Account not found. Please sign up to create an account.', 'error')
          }
          return false
        }
      } catch (error) {
        showToast('Login failed. Please try again.', 'error')
        return false
      } finally {
        isLoading.value = false
      }
    }

    const handleSubmit = () => {
      if (validateForm()) {
        login(formData.email, formData.password)
      }
    }

    // Redirect if already authenticated
    onMounted(() => {
      if (isAuthenticated()) {
        navigateTo('/dashboard')
      }
    })

    return {
      formData,
      errors,
      isLoading,
      handleSubmit,
      navigateTo,
      clearError,
      showToast
    }
  }
}
</script>

<style scoped>
/* Your existing CSS styles will work as-is */
</style>