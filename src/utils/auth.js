// Authentication utility functions

// Logout function
export const logout = () => {
  // Remove user session from localStorage
  localStorage.removeItem('userSession');
  
  // Clear any other auth-related data
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Dispatch event for other components to react to logout
  window.dispatchEvent(new Event('logout'));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const session = localStorage.getItem('userSession');
  if (!session) return false;

  try {
    const userSession = JSON.parse(session);
    return userSession && userSession.token && userSession.expires > Date.now();
  } catch {
    return false;
  }
};

// Get current user info
export const getCurrentUser = () => {
  const session = localStorage.getItem('userSession');
  if (!session) return null;

  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if token is expired
export const isTokenExpired = () => {
  const session = localStorage.getItem('userSession');
  if (!session) return true;

  try {
    const userSession = JSON.parse(session);
    return userSession.expires <= Date.now();
  } catch {
    return true;
  }
};