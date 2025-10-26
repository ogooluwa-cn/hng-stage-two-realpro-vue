<template>
  <div class="page active" id="ticketsPage">
    <div class="ticket-management">
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading tickets...</p>
        </div>

        <!-- Main Content -->
        <div v-else>
          <div class="management-header">
            <h2 class="section-title" style="margin: 0">Ticket Management</h2>
            <button 
              class="btn btn-primary" 
              @click="navigateTo('/pages/create-ticket')"
            >
              + Create Ticket
            </button>
          </div>

          <div class="filters">
            <div class="search-box">
              <input
                type="text"
                class="form-input"
                placeholder="Search tickets..."
                v-model="searchTerm"
              />
            </div>
            <div class="filter-group">
              <select
                class="form-select"
                v-model="statusFilter"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select
                class="form-select"
                v-model="priorityFilter"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button 
                v-if="searchTerm || statusFilter || priorityFilter"
                class="btn btn-outline btn-sm" 
                @click="clearFilters"
                style="white-space: 'nowrap'"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div class="tickets-summary">
            <div class="summary-item">
              <span class="summary-label">Total Tickets:</span>
              <span class="summary-value">{{ tickets.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Open:</span>
              <span class="summary-value">
                {{ tickets.filter(t => t.status === 'open').length }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">In Progress:</span>
              <span class="summary-value">
                {{ tickets.filter(t => t.status === 'in_progress').length }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Closed:</span>
              <span class="summary-value">
                {{ tickets.filter(t => t.status === 'closed').length }}
              </span>
            </div>
          </div>

          <div class="tickets-grid" id="ticketsList">
            <div 
              v-for="ticket in filteredTickets" 
              :key="ticket.id" 
              class="ticket-card"
            >
              <div class="ticket-header">
                <div class="ticket-title">{{ ticket.title }}</div>
                <span :class="['status-badge', getStatusBadgeClass(ticket.status)]">
                  {{ formatStatus(ticket.status) }}
                </span>
              </div>
              <div class="ticket-meta">
                <span>Created: {{ ticket.createdAt }}</span>
                <span :class="['priority-badge', getPriorityBadgeClass(ticket.priority)]">
                  {{ formatPriority(ticket.priority) }} PRIORITY
                </span>
                <span v-if="ticket.category" class="ticket-category">{{ ticket.category }}</span>
              </div>
              <p class="ticket-description">{{ ticket.description }}</p>
              <div class="ticket-actions">
                <button 
                  class="btn btn-primary btn-sm" 
                  @click="editTicket(ticket.id)"
                >
                  Edit
                </button>
                <button 
                  class="btn btn-outline btn-sm" 
                  @click="viewTicket(ticket.id)"
                >
                  View
                </button>
                <button 
                  class="btn btn-danger btn-sm" 
                  @click="deleteTicket(ticket.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredTickets.length === 0" class="empty-state" id="emptyState">
            <div class="empty-state-icon">🎫</div>
            <h3>No tickets found</h3>
            <p>
              {{ searchTerm || statusFilter || priorityFilter 
                ? "Try adjusting your search or filters" 
                : "Create your first ticket to get started!"
              }}
            </p>
            <button 
              class="btn btn-primary" 
              @click="navigateTo('/pages/create-ticket')" 
              style="margin-top: 1rem"
            >
              Create Your First Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Ticket',
  setup() {
    const router = useRouter()
    
    const tickets = ref([])
    const searchTerm = ref("")
    const statusFilter = ref("")
    const priorityFilter = ref("")
    const isLoading = ref(true)

    // Check if user is authenticated
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

    // Redirect to login if not authenticated
    onMounted(() => {
      if (!isAuthenticated()) {
        navigateTo('/page/login')
      }
    })

    const showToast = (message, type = "success") => {
      console.log(`${type.toUpperCase()}: ${message}`)
      alert(`${type.toUpperCase()}: ${message}`)
    }

    // Load tickets from localStorage
    const loadTickets = () => {
      try {
        const savedTickets = localStorage.getItem("tickets")
        if (savedTickets) {
          const parsedTickets = JSON.parse(savedTickets)
          tickets.value = parsedTickets
        } else {
          // If no tickets in localStorage, initialize with empty array
          tickets.value = []
        }
      } catch (error) {
        console.error("Error loading tickets:", error)
        tickets.value = []
      } finally {
        isLoading.value = false
      }
    }

    // Filter tickets based on search and filters
    const filteredTickets = computed(() => {
      let filtered = tickets.value

      // Search filter
      if (searchTerm.value) {
        filtered = filtered.filter(ticket =>
          ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
      }

      // Status filter
      if (statusFilter.value) {
        filtered = filtered.filter(ticket => ticket.status === statusFilter.value)
      }

      // Priority filter
      if (priorityFilter.value) {
        filtered = filtered.filter(ticket => ticket.priority === priorityFilter.value)
      }

      return filtered
    })

    const deleteTicket = (id) => {
      if (window.confirm('Are you sure you want to delete this ticket?')) {
        const updatedTickets = tickets.value.filter(ticket => ticket.id !== id)
        tickets.value = updatedTickets
        localStorage.setItem("tickets", JSON.stringify(updatedTickets))
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(new CustomEvent('ticketUpdated'))
        
        showToast('Ticket deleted successfully!', 'success')
      }
    }

    const editTicket = (id) => {
      showToast(`Edit ticket ${id} - Feature coming soon!`, 'info')
    }

    const viewTicket = (id) => {
      const ticket = tickets.value.find(t => t.id === id)
      if (ticket) {
        const ticketDetails = `
🎫 TICKET DETAILS

📋 Title: ${ticket.title}
📝 Description: ${ticket.description}
🔄 Status: ${formatStatus(ticket.status)}
🚨 Priority: ${formatPriority(ticket.priority)}
📂 Category: ${ticket.category}
📅 Created: ${ticket.createdAt}
✏️ Last Updated: ${ticket.updatedAt}
👤 Created By: ${ticket.createdBy || 'Unknown'}
🆔 Ticket ID: ${ticket.id}
        `
        alert(ticketDetails)
      }
    }

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'open': return 'status-open'
        case 'in_progress': return 'status-in-progress'
        case 'closed': return 'status-closed'
        default: return ''
      }
    }

    const getPriorityBadgeClass = (priority) => {
      switch (priority) {
        case 'high': return 'priority-high'
        case 'urgent': return 'priority-urgent'
        case 'medium': return 'priority-medium'
        case 'low': return 'priority-low'
        default: return ''
      }
    }

    const formatStatus = (status) => {
      return status.replace('_', ' ').toUpperCase()
    }

    const formatPriority = (priority) => {
      return priority.toUpperCase()
    }

    const clearFilters = () => {
      searchTerm.value = ""
      statusFilter.value = ""
      priorityFilter.value = ""
    }

    // Event listeners for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "tickets") {
        loadTickets()
      }
    }

    const handleTicketUpdate = () => {
      loadTickets()
    }

    // Initialize component
    onMounted(() => {
      loadTickets()

      // Set up event listeners
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('ticketUpdated', handleTicketUpdate)
    })

    // Cleanup event listeners
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('ticketUpdated', handleTicketUpdate)
    })

    return {
      tickets,
      searchTerm,
      statusFilter,
      priorityFilter,
      isLoading,
      filteredTickets,
      navigateTo,
      deleteTicket,
      editTicket,
      viewTicket,
      getStatusBadgeClass,
      getPriorityBadgeClass,
      formatStatus,
      formatPriority,
      clearFilters
    }
  }
}
</script>

<style scoped>
/* Your existing ticket.css and land.css styles will work as-is */
</style>