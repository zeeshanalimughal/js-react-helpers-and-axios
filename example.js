import ApiClient from './ApiClient';

// Assuming you have instantiated ApiClient with a base URL
const apiClient = new ApiClient('https://example.com/api');

// Example GET request
async function fetchUserData(userId) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    console.log('User data:', response);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
  }
}

// Example POST request with JSON data
async function createUser(userData) {
  try {
    const response = await apiClient.post('/users', userData);
    console.log('User created:', response);
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}

// Example PUT request with JSON data
async function updateUser(userId, updatedUserData) {
  try {
    const response = await apiClient.put(`/users/${userId}`, updatedUserData);
    console.log('User updated:', response);
  } catch (error) {
    console.error('Error updating user:', error.message);
  }
}

// Example PATCH request with JSON data
async function partiallyUpdateUser(userId, updatedUserData) {
  try {
    const response = await apiClient.patch(`/users/${userId}`, updatedUserData);
    console.log('User partially updated:', response);
  } catch (error) {
    console.error('Error partially updating user:', error.message);
  }
}

// Example DELETE request
async function deleteUser(userId) {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    console.log('User deleted:', response);
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
}

// Example POST request with form data
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.postFormData('/upload', formData);
    console.log('File uploaded:', response);
  } catch (error) {
    console.error('Error uploading file:', error.message);
  }
}

// Example cancelling a request
async function cancelRequestDemo() {
  const url = '/long-running-request';
  const options = {
    method: 'POST',
    body: JSON.stringify({ /* request body */ }),
  };

  try {
    const responsePromise = apiClient.request(url, options);
    // Cancel the request after 5 seconds
    setTimeout(() => {
      apiClient.cancelRequest(url, options);
      console.log('Request cancelled');
    }, 5000);

    const response = await responsePromise;
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
