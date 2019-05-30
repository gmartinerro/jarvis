import axios from 'axios';

/**
 * Instead of calling axios right away, we create a new "API" instance with a predefined base URL for every call.
 */
export default axios.create({ baseURL: 'http://127.0.0.1:5000/api' });
