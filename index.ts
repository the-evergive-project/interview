// Import necessary modules and types
import axios from 'axios';

// Define the User type
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a UserService class to manage API interactions
class UserService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllUsers(): Promise<any> { 
    try {
      const response = await axios.get(`${this.baseUrl}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; 
    }
  }


  async getUserById(id: number): Promise<User | undefined> { 
    try {
      const response = await axios.get(`${this.baseUrl}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return undefined; 
    }
  }


  async createUser(user: any): Promise<User> { 
    try {
      const response = await axios.post(`${this.baseUrl}/users`, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; 
    }
  }


  async updateUser(id: number, user: any): Promise<User | null> { 
    try {
      const response = await axios.put(`${this.baseUrl}/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return null; 
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
    }
  }
}

// Export the UserService class
export default UserService;
