const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
    }
  }),
}));

import { loginUser, signupUser } from "../actions";

describe("join actions", () => {
  beforeEach(() => {
    mockSignInWithPassword.mockClear();
    mockSignUp.mockClear();
  });

  test("loginUser successful", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const result = await loginUser({ email: "test@test.com", password: "password" });
    expect(result).toEqual({ success: true });
    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: "test@test.com", password: "password" });
  });

  test("loginUser failure", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: "Invalid credentials" } });
    const result = await loginUser({ email: "test@test.com", password: "password" });
    expect(result).toEqual({ error: "Invalid credentials" });
  });

  test("signupUser successful", async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const result = await signupUser({ email: "test@test.com", password: "password" });
    expect(result).toEqual({ success: true });
    expect(mockSignUp).toHaveBeenCalledWith({ email: "test@test.com", password: "password" });
  });

  test("signupUser failure", async () => {
    mockSignUp.mockResolvedValue({ error: { message: "Email already exists" } });
    const result = await signupUser({ email: "test@test.com", password: "password" });
    expect(result).toEqual({ error: "Email already exists" });
  });
});
