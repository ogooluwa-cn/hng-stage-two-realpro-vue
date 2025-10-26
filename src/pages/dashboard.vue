<template>
  <div class="page active" id="dashboardPage">
    <div class="dashboard">
      <div class="container">
        <div class="dashboard-header">
          <h2 class="section-title">Dashboard Overview</h2>
          <div v-if="user" class="user-welcome">
            Welcome back, <strong>{{ user.name }}</strong>!
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">
              <div v-if="isLoading" class="loading-dots">...</div>
              <span v-else>{{ stats.totalTickets }}</span>
            </div>
            <div class="stat-label">Total Tickets</div>
            <div v-if="!isLoading" class="stat-subtext">All support requests</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">
              <div v-if="isLoading" class="loading-dots">...</div>
              <span v-else>{{ stats.openTickets }}</span>
            </div>
            <div class="stat-label">Open Tickets</div>
            <div v-if="!isLoading" class="stat-subtext">Awaiting response</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">
              <div v-if="isLoading" class="loading-dots">...</div>
              <span v-else>{{ stats.inProgressTickets }}</span>
            </div>
            <div class="stat-label">In Progress</div>
            <div v-if="!isLoading" class="stat-subtext">Being worked on</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">
              <div v-if="isLoading" class="loading-dots">...</div>
              <span v-else>{{ stats.closedTickets }}</span>
            </div>
            <div class="stat-label">Resolved Tickets</div>
            <div v-if="!isLoading" class="stat-subtext">Successfully closed</div>
          </div>
        </div>

        <!-- Recent Tickets Section (commented out as in original) -->
        <!--
        <div v-if="recentTickets.length > 0" class="recent-tickets">
          <h3 class="section-subtitle">Recent Tickets</h3>
          <div class="recent-tickets-grid">
            <div v-for="ticket in recentTickets" :key="ticket.id" class="recent-ticket-card">
              <div class="recent-ticket-header">
                <h4 class="recent-ticket-title">{{ ticket.title }}</h4>
                <span :class="`status-badge-sm ${getStatusBadgeClass(ticket.status)}`">
                  {{ formatStatus(ticket.status) }}
                </span>
              </div>
              <div class="recent-ticket-meta">
                <span>Priority: </span>
                <span :class="`priority-badge-sm ${getPriorityBadgeClass(ticket.priority)}`">
                  {{ formatPriority(ticket.priority) }}
                </span>
                <span>Created: {{ ticket.createdAt }}</span>
              </div>
              <p class="recent-ticket-description">
                {{ ticket.description.length > 100 
                  ? `${ticket.description.substring(0, 100)}...` 
                  : ticket.description
                }}
              </p>
            </div>
          </div>
        </div>
        -->

        <div class="dashboard-actions">
          <div class="action-card" @click="navigateTo('/ticket')">
            <div class="action-icon">🎫</div>
            <h3>Manage Tickets</h3>
            <p>View and manage all support tickets in one place</p>
          </div>
          <div class="action-card" @click="navigateTo('/create-ticket')">
            <div class="action-icon">➕</div>
            <h3>Create Ticket</h3>
            <p>Create a new support ticket for your team</p>
          </div>
          <div class="action-card">
            <div class="action-icon">📊</div>
            <h3>Analytics</h3>
            <p>View detailed reports and performance insights</p>
          </div>
          <div class="action-card" @click="handleLogout">
            <div class="action-icon">🚪</div>
            <h3>Logout</h3>
            <p>Sign out of your account securely</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    
    const stats = ref({
      totalTickets: 0,
      openTickets: 0,
      inProgressTickets: 0,
      closedTickets: 0,
      highPriorityTickets: 0
    })
    
    const recentTickets = ref([])
    const isLoading = ref(true)
    const user = ref(null)

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

    const handleLogout = () => {
      localStorage.removeItem("userSession")
      navigateTo('/')
    }

    // Calculate ticket statistics from localStorage
    const calculateTicketStats = () => {
      try {
        const savedTickets = localStorage.getItem("tickets")
        const tickets = savedTickets ? JSON.parse(savedTickets) : []

        const totalTickets = tickets.length
        const openTickets = tickets.filter(ticket => ticket.status === 'open').length
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length
        const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length
        const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'high' || ticket.priority === 'urgent').length

        // Get recent tickets (last 5)
        const recent = tickets
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)

        return {
          totalTickets,
          openTickets,
          inProgressTickets,
          closedTickets,
          highPriorityTickets,
          recentTickets: recent
        }
      } catch (error) {
        console.error("Error calculating ticket stats:", error)
        return {
          totalTickets: 0,
          openTickets: 0,
          inProgressTickets: 0,
          closedTickets: 0,
          highPriorityTickets: 0,
          recentTickets: []
        }
      }
    }

    // Get user info from session
    const getUserInfo = () => {
      const session = localStorage.getItem("userSession")
      if (!session) return null

      try {
        const userSession = JSON.parse(session)
        return {
          name: userSession.name,
          email: userSession.email
        }
      } catch {
        return null
      }
    }

    const formatStatus = (status) => {
      return status.replace('_', ' ').toUpperCase()
    }

    const formatPriority = (priority) => {
      return priority.toUpperCase()
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
        case 'urgent': return 'priority-high'
        case 'medium': return 'priority-medium'
        case 'low': return 'priority-low'
        default: return ''
      }
    }

    // Load dashboard data
    const loadDashboardData = async () => {
      if (!isAuthenticated()) {
        navigateTo('/page/login')
        return
      }

      isLoading.value = true
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const ticketStats = calculateTicketStats()
      stats.value = {
        totalTickets: ticketStats.totalTickets,
        openTickets: ticketStats.openTickets,
        inProgressTickets: ticketStats.inProgressTickets,
        closedTickets: ticketStats.closedTickets,
        highPriorityTickets: ticketStats.highPriorityTickets
      }
      recentTickets.value = ticketStats.recentTickets
      user.value = getUserInfo()
      
      isLoading.value = false
    }

    // Handle storage changes
    const handleStorageChange = () => {
      const ticketStats = calculateTicketStats()
      stats.value = {
        totalTickets: ticketStats.totalTickets,
        openTickets: ticketStats.openTickets,
        inProgressTickets: ticketStats.inProgressTickets,
        closedTickets: ticketStats.closedTickets,
        highPriorityTickets: ticketStats.highPriorityTickets
      }
      recentTickets.value = ticketStats.recentTickets
    }

    let refreshInterval

    onMounted(() => {
      loadDashboardData()

      // Set up interval to refresh data every 30 seconds
      refreshInterval = setInterval(() => {
        const ticketStats = calculateTicketStats()
        stats.value = {
          totalTickets: ticketStats.totalTickets,
          openTickets: ticketStats.openTickets,
          inProgressTickets: ticketStats.inProgressTickets,
          closedTickets: ticketStats.closedTickets,
          highPriorityTickets: ticketStats.highPriorityTickets
        }
        recentTickets.value = ticketStats.recentTickets
      }, 30000)

      // Listen for storage changes
      window.addEventListener('storage', handleStorageChange)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
      window.removeEventListener('storage', handleStorageChange)
    })

    return {
      stats,
      recentTickets,
      isLoading,
      user,
      navigateTo,
      handleLogout,
      formatStatus,
      formatPriority,
      getStatusBadgeClass,
      getPriorityBadgeClass
    }
  }
}
</script>

<style scoped>
@import '../style/dashboard.css';
@import '../style/form.css';
</style>