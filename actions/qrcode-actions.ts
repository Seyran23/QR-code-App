// actions/qrcode-actions.ts
"use server";


import { getAccessToken } from "./auth-actions";

export const createQRCode = async (values: {
  name: string;
  originalUrl: string;
}) => {
  if (!values.name || !values.originalUrl) {
    return { success: false, error: "Name and URL are required!" };
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${process.env.API_URL}/qr-codes`,
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

    const createdQRCode = await response.json();

    return { success: true, qrCode: createdQRCode };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
};

export const getQRCodeDetailById = async (id: string) => {
  if (!id) {
    return { success: false, error: "ID is required!" };
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/qr-codes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
      });
      if (response.status === 404) return null;
      throw new Error("Failed to fetch QR code details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error fetching QR code",
    };
  }
};

export const updateQRCode = async (
  id: string,
  values: { name: string; originalUrl: string }
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/qr-codes/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) throw new Error("Failed to update QR code");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteQRCode = async (id: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/qr-codes/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to delete QR code");
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
