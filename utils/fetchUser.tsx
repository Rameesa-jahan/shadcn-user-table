import axios from "axios";

export async function fetchUsers() {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users");
    return response.data;
  }