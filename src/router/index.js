import { createRouter, createWebHistory } from 'vue-router'

// Import your components
const Landing = () => import('../pages/landing.vue')
const Login = () => import('../pages/login.vue')
const Signup = () => import('../pages/signup.vue')
const Ticket = () => import('../pages/ticket.vue')
const CreateTicket = () => import('../pages/create-ticket.vue')
const Dashboard = () => import('../pages/dashboard.vue')

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/page/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/page/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/pages/ticket',
    name: 'Ticket',
    component: Ticket
  },
  {
    path: '/pages/create-ticket',
    name: 'CreateTicket',
    component: CreateTicket
  },
  {
    path: '/pages/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router