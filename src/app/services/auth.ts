import api from "./api";

export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true } // ⬅️ DITAMBAHKAN agar cookies diterima di browser
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login Failed");
  }
}

export async function registerUser(userData: {
  email: string;
  password: string;
  fullname: string;
  username: string;
  nimNidn: string;
  phoneNumber: string;
}) {
  try {
    const response = await api.post("/auth/register", userData, {
      withCredentials: true,
    });
    console.log("Register response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw new Error(
      Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join("\n")
        : error.response?.data?.message || "Register Failed"
    );
  }
}
