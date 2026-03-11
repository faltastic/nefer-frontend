jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveProfile } from "../actions";

describe("account actions", () => {
  const mockInsert = jest.fn();
  const mockFrom = jest.fn(() => ({
    insert: mockInsert,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });
  });

  test("saveProfile successfully inserts and redirects", async () => {
    const fakeUser = { id: "user-123" };
    (requireAuth as jest.Mock).mockResolvedValue(fakeUser);
    mockInsert.mockResolvedValue({ error: null });
    (redirect as unknown as jest.Mock).mockImplementation(() => { throw new Error("NEXT_REDIRECT"); });

    const profileData = {
      name: "Test User!",
      profile_type: "Model",
      short_description: "Short",
      long_description: "Long",
      image_urls: ["img.jpg"],
      keywords: ["test"],
      source_url: "https://example.com"
    };

    await expect(saveProfile(profileData)).rejects.toThrow("NEXT_REDIRECT");

    // Let the promise rejection happen and tick the event loop to check the mocks
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(requireAuth).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith("profiles");
    
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.user_id).toBe("user-123");
    expect(insertCall.name).toBe("Test User!");
    expect(insertCall.slug).toMatch(/^test-user--\d+$/);
    
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/account");
    expect(redirect).toHaveBeenCalledWith("/account");
  });

  test("saveProfile returns error if insert fails", async () => {
    const fakeUser = { id: "user-123" };
    (requireAuth as jest.Mock).mockResolvedValue(fakeUser);
    mockInsert.mockResolvedValue({ error: { message: "Database error" } });

    const result = await saveProfile({
      name: "Test User",
      profile_type: "Model",
      short_description: "Short",
      long_description: "Long",
      image_urls: [],
      keywords: [],
      source_url: ""
    });

    expect(result).toEqual({ error: "Database error" });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
