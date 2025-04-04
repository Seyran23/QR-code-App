// actions/auth-actions.ts
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieConfig = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function registerAction(
  email: string,
  password: string,
  fullName: string
) {
  if (!email || !password || !fullName) {
    return { success: false, error: "All fields are required" };
  }

  try {
    // 1. First register the user
    const registerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      }
    );

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(errorData.message || "Registration failed");
    }

    // 2. Automatically log in the user after successful registration
    return await loginAction(email, password);
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function loginAction(email: string, password: string) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const { accessToken, refreshToken, user } = await response.json();

    const cookieStore = await cookies();

    // Set HTTP-only cookie with access token
    cookieStore.set("accessToken", accessToken, {
      ...cookieConfig,
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
    });

    cookieStore.set("refreshToken", refreshToken, {
      ...cookieConfig,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
    });

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    console.log("Access token missing, attempting refresh...");
    accessToken = await refreshTokens();
  }

  return accessToken;
}

export async function getRefreshToken() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value || null;
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
}

export async function refreshTokens() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log("Refresh token:", refreshToken);

  if (!refreshToken) {
    console.log("No refresh token available");
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Refresh failed: ${error}`);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await response.json();

    cookieStore.set("accessToken", accessToken, {
      ...cookieConfig,
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      ...cookieConfig,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
    });

    return accessToken;
  } catch (error) {
    console.error("Refresh error:", error);
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    redirect("/login");
  }
}
