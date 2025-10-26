<template>
  <div class="page active" id="createTicketPage">
    <div class="create-ticket">
      <div class="container">
        <div class="create-ticket-header">
          <button 
            class="btn btn-outline" 
            @click="handleCancel"
          >
            ← Back to Tickets
          </button>
          <h2 class="section-title">Create New Ticket</h2>
          <p class="create-ticket-subtitle">
            Fill in the details below to create a new support ticket
          </p>
        </div>

        <div class="create-ticket-card">
          <form @submit.prevent="handleSubmit" class="create-ticket-form">
            <div class="form-group">
              <label class="form-label" for="ticketTitle">
                Ticket Title *
              </label>
              <input
                type="text"
                :class="['form-input', { 'error': errors.title }]"
                id="ticketTitle"
                v-model="formData.title"
                @input="clearError('title')"
                placeholder="Enter a clear and descriptive title"
              />
              <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="ticketDescription">
                Description *
              </label>
              <textarea
                :class="['form-input', 'form-textarea', { 'error': errors.description }]"
                id="ticketDescription"
                v-model="formData.description"
                @input="clearError('description')"
                placeholder="Provide detailed information about the issue or request..."
                rows="6"
              />
              <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="ticketPriority">
                  Priority
                </label>
                <select
                  class="form-select"
                  id="ticketPriority"
                  v-model="formData.priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="ticketCategory">
                  Category
                </label>
                <select
                  class="form-select"
                  id="ticketCategory"
                  v-model="formData.category"
                >
                  <option value="technical">Technical Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="support">General Support</option>
                  <option value="billing">Billing Issue</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-outline" 
                @click="handleCancel"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :class="['btn', 'btn-primary', { 'loading': isSubmitting }]"
                :disabled="isSubmitting"
              >
                <template v-if="isSubmitting">
                  <div class="spinner"></div>
                  Creating Ticket...
                </template>
                <template v-else>
                  Create Ticket
                </template>
              </button>
            </div>
          </form>
        </div>

        <div class="create-ticket-info">
          <h4>💡 Tips for creating effective tickets:</h4>
          <ul>
            <li>Be specific and descriptive in your title</li>
<li>Include steps to reproduce the issue</li>
            <li>Add relevant screenshots or error messages</li>
            <li>Specify the expected vs actual behavior</li>
            <li>Choose the appropriate priority level</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CreateTicket',
  setup() {
    const router = useRouter()
    
    const formData = reactive({
      title: "",
      description: "",
      priority: "medium",
      category: "technical"
    })
    
    const errors = ref({})
    const isSubmitting = ref(false)

    const isAuthenticated = () => {
      const session = localStorage.getItem("userSession")
      if (!session) return false

      try {
        const userSession = JSON.parse(session)
        return userSession && userSession.token && userSession.expires > Date.now()
      } catch {
        return false
      }
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    const showToast = (message, type = "success") => {
      console.log(`${type.toUpperCase()}: ${message}`)
      alert(`${type.toUpperCase()}: ${message}`)
    }

    const clearError = (fieldName) => {
      if (errors.value[fieldName]) {
        errors.value[fieldName] = ""
      }
    }

    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.title.trim()) {
        newErrors.title = "Title is required"
      } else if (formData.title.length < 5) {
        newErrors.title = "Title must be at least 5 characters"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      } else if (formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters"
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Get existing tickets from localStorage or initialize empty array
        const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]")
        
        const newTicket = {
          id: Date.now(), // Use timestamp for unique ID
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          category: formData.category,
          status: "open",
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          createdBy: JSON.parse(localStorage.getItem("userSession")).email
        }

        // Add new ticket to the beginning of the array
        const updatedTickets = [newTicket, ...existingTickets]
        
        // Save to localStorage
        localStorage.setItem("tickets", JSON.stringify(updatedTickets))
        
        // Trigger events to update other components
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(new CustomEvent('ticketUpdated'))
        
        showToast('Ticket created successfully!', 'success')
        
        // Redirect to tickets page after successful creation
        setTimeout(() => {
          navigateTo('/pages/ticket')
        }, 1000)

      } catch (error) {
        console.error("Error creating ticket:", error)
        showToast('Failed to create ticket. Please try again.', 'error')
      } finally {
        isSubmitting.value = false
      }
    }

    const handleCancel = () => {
      navigateTo('/pages/ticket')
    }

    // Redirect to login if not authenticated
    onMounted(() => {
      if (!isAuthenticated()) {
        navigateTo('/page/login')
      }
    })

    return {
      formData,
      errors,
      isSubmitting,
      handleSubmit,
      handleCancel,
      clearError
    }
  }
}
</script>

<style scoped>
/* Your existing CSS styles will work as-is */
/* The component uses the same CSS classes */
</style>