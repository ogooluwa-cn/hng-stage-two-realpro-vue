<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
@import './style/style.css';
@import './style/nav.css';
@import './style/land.css';
@import './style/dashboard.css';
@import './style/form.css';
@import './style/ticket.css';
</style>