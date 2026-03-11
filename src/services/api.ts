export interface GenerateProfileRequest {
  url: string;
  user_type: string; // e.g., 'Photographer', 'Model', 'Brand', 'Other'
}

export interface GenerateProfileResponse {
  name: string;
  profile_type: string;
  short_description: string;
  long_description: string;
  image_urls: string[];
  keywords: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function generateProfile(data: GenerateProfileRequest): Promise<GenerateProfileResponse> {
  const response = await fetch(`${API_URL}/profiles/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to generate profile';
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (e) {
      // Ignore JSON parse error if response is not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
