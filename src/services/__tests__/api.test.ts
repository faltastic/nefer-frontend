import { generateProfile } from "../api";

describe("api service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("generateProfile success calls the correct endpoint", async () => {
    const mockResponse = {
      name: "John Doe",
      profile_type: "Photographer",
      short_description: "Pro photographer",
      long_description: "Long about section",
      image_urls: ["img1.jpg", "img2.jpg"],
      keywords: ["photography", "studio"]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse
    });

    const result = await generateProfile({ url: "https://test.com", user_type: "Photographer" });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Verify the URL call
    const call = (global.fetch as jest.Mock).mock.calls[0];
    const url = call[0] as string;
    expect(url).toContain("/profiles/generate");
    
    // Verify headers and body
    const options = call[1] as RequestInit;
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body as string)).toEqual({ url: "https://test.com", user_type: "Photographer" });
  });

  test("generateProfile failure throws with error message", async () => {
    const mockError = { detail: "Invalid URL" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => mockError
    });

    await expect(generateProfile({ url: "invalid", user_type: "Model" }))
      .rejects.toThrow("Invalid URL");
  });

  test("generateProfile failure with generic error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error("Not JSON"); }
    });

    await expect(generateProfile({ url: "https://test.com", user_type: "Model" }))
      .rejects.toThrow("Failed to generate profile");
  });
});
