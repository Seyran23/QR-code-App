"use server"
import { getAccessToken } from "./auth-actions";

export const createShorthenedURL = async (values: {
  name: string;
  originalUrl: string;
}) => {
  if (!values.name || !values.originalUrl) {
    return { success: false, error: "Name and URL are required!" };
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/urls`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const createdShorthenedURL = await response.json();

    return { success: true, shorthenedUrl: createdShorthenedURL };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
};

export const updateShorthenedURL = async (id: string, values: { name: string; originalUrl: string }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) throw new Error("Failed to update QR code");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteShorthenedURL = async (id: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete QR code");
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};