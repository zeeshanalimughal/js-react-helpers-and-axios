// apiClient.js
class ApiClient {
    constructor(baseURL) {
      this.baseURL = baseURL;
      this.accessToken = '';
      this.defaultHeaders = {
        'Content-Type': 'application/json',
      };
      this.controllers = new Map(); // Map to store AbortController instances for request cancellation
    }
  
    setAccessToken(token) {
      this.accessToken = token;
    }
  
    async refreshToken() {
      try {
        const response = await fetch('your_token_refresh_endpoint');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to refresh access token');
        }
        this.accessToken = data.access_token;
      } catch (error) {
        throw new Error('Failed to refresh access token');
      }
    }
  
    async request(url, options = {}) {
      const controller = new AbortController(); // Create a new AbortController instance for this request
      const signal = controller.signal; // Get the signal from the controller
  
      const requestOptions = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
          Authorization: this.accessToken ? `Bearer ${this.accessToken}` : undefined,
        },
        signal, // Assign the signal to the request options
      };
  
      const requestKey = `${url}-${JSON.stringify(options)}`; // Generate a unique key for this request
  
      this.controllers.set(requestKey, controller); // Store the AbortController instance for potential cancellation
  
      try {
        const response = await fetch(`${this.baseURL}${url}`, requestOptions);
  
        // Remove the controller from the map upon request completion
        this.controllers.delete(requestKey);
  
        if (!response.ok) {
          if (response.status === 401) {
            await this.refreshToken();
            if (this.accessToken) {
              requestOptions.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.request(url, requestOptions);
            } else {
              throw new Error('No access token available after refresh');
            }
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Request failed with status: ' + response.status);
        }
        return response.json();
      } catch (error) {
        throw new Error('Network error occurred: ' + error.message);
      }
    }
  
    async cancelRequest(url, options = {}) {
      const requestKey = `${url}-${JSON.stringify(options)}`;
      const controller = this.controllers.get(requestKey);
      if (controller) {
        controller.abort();
        this.controllers.delete(requestKey);
      }
    }
  
    async get(url, options = {}) {
      return this.request(url, { ...options, method: 'GET' });
    }
  
    async post(url, body, options = {}) {
      return this.request(url, { ...options, method: 'POST', body: JSON.stringify(body) });
    }
  
    async put(url, body, options = {}) {
      return this.request(url, { ...options, method: 'PUT', body: JSON.stringify(body) });
    }
  
    async patch(url, body, options = {}) {
      return this.request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) });
    }
  
    async delete(url, options = {}) {
      return this.request(url, { ...options, method: 'DELETE' });
    }
  
    async postFormData(url, formData, options = {}) {
      const formDataOptions = {
        ...options,
        method: 'POST',
        body: formData,
      };
  
      formDataOptions.headers = {
        ...this.defaultHeaders,
        ...options.headers,
        Authorization: this.accessToken ? `Bearer ${this.accessToken}` : undefined,
        'Content-Type': 'multipart/form-data', // Set the Content-Type header for form data
      };
  
      try {
        const response = await fetch(`${this.baseURL}${url}`, formDataOptions);
        if (!response.ok) {
          if (response.status === 401) {
            await this.refreshToken();
            if (this.accessToken) {
              formDataOptions.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.postFormData(url, formData, formDataOptions);
            } else {
              throw new Error('No access token available after refresh');
            }
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Request failed with status: ' + response.status);
        }
        return response.json();
      } catch (error) {
        throw new Error('Network error occurred: ' + error.message);
      }
    }
  }
  
  export default ApiClient;
  