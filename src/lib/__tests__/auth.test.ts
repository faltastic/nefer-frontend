const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (...args: any[]) => mockRedirect(...args),
}));

const mockAuthGetUser = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve({
    auth: {
      getUser: mockAuthGetUser,
    }
  }),
}));

import { getUser, requireAuth } from "../auth";

describe("auth helpers", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockAuthGetUser.mockClear();
  });

  test("getUser returns user when session exists", async () => {
    const fakeUser = { id: "123", email: "test@example.com" };
    mockAuthGetUser.mockResolvedValue({ data: { user: fakeUser } });

    const user = await getUser();
    expect(user).toEqual(fakeUser);
    expect(mockAuthGetUser).toHaveBeenCalledTimes(1);
  });

  test("getUser returns null when no session", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: null } });

    const user = await getUser();
    expect(user).toBeNull();
  });

  test("requireAuth returns user when session exists", async () => {
    const fakeUser = { id: "123", email: "test@example.com" };
    mockAuthGetUser.mockResolvedValue({ data: { user: fakeUser } });

    const user = await requireAuth();
    expect(user).toEqual(fakeUser);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test("requireAuth calls redirect when no session exists", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: null } });

    // simulate Next.js redirect throwing an error
    mockRedirect.mockImplementation(() => { throw new Error("NEXT_REDIRECT"); });

    await expect(requireAuth()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/join");
  });
});
