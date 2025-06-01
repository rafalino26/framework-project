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