// in-memory-user-model.js
const crypto = require('crypto');

class UserStore {
  constructor() {
    this.users = new Map();
    this.emailIndex = new Map();
    this.usernameIndex = new Map();
  }

  // Create a new user
  createUser(username, email, password) {
    // Check if username or email already exists
    if (this.usernameIndex.has(username)) {
      throw new Error('Username already exists');
    }
    if (this.emailIndex.has(email)) {
      throw new Error('Email already exists');
    }

    // Generate a unique ID
    const userId = crypto.randomUUID();
    
    // Create the user object with plain password
    const user = {
      id: userId,
      username,
      email,
      password // storing plain password
    };
    
    // Store user in our maps
    this.users.set(userId, user);
    this.emailIndex.set(email, userId);
    this.usernameIndex.set(username, userId);
    
    return user;
  }

  // Get user by ID
  getUserById(userId) {
    return this.users.get(userId);
  }
  
  // Get user by email
  getUserByEmail(email) {
    const userId = this.emailIndex.get(email);
    return userId ? this.users.get(userId) : null;
  }
  
  // Get user by username
  getUserByUsername(username) {
    const userId = this.usernameIndex.get(username);
    return userId ? this.users.get(userId) : null;
  }
  
  // Authenticate user
  authenticate(usernameOrEmail, password) {
    let user = this.getUserByEmail(usernameOrEmail);
    if (!user) {
      user = this.getUserByUsername(usernameOrEmail);
    }
    
    if (!user) {
      return null; // User not found
    }
    
    // Direct password comparison
    if (user.password === password) {
      return user;
    }
    
    return null; // Invalid password
  }
  
  // Update user
  updateUser(userId, updates) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Handle username update
    if (updates.username && updates.username !== user.username) {
      if (this.usernameIndex.has(updates.username)) {
        throw new Error('Username already exists');
      }
      this.usernameIndex.delete(user.username);
      this.usernameIndex.set(updates.username, userId);
      user.username = updates.username;
    }
    
    // Handle email update
    if (updates.email && updates.email !== user.email) {
      if (this.emailIndex.has(updates.email)) {
        throw new Error('Email already exists');
      }
      this.emailIndex.delete(user.email);
      this.emailIndex.set(updates.email, userId);
      user.email = updates.email;
    }
    
    // Handle password update
    if (updates.password) {
      user.password = updates.password; // Update with plain password
    }
    
    return user;
  }
  
  // Delete user
  deleteUser(userId) {
    const user = this.getUserById(userId);
    if (!user) {
      return false;
    }
    
    this.usernameIndex.delete(user.username);
    this.emailIndex.delete(user.email);
    this.users.delete(userId);
    
    return true;
  }
  
  // Get all users
  getAllUsers() {
    return Array.from(this.users.values());
  }
}

module.exports = new UserStore();