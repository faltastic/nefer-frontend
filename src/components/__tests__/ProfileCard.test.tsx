import { render, screen, cleanup } from "@testing-library/react";
import { ProfileCard } from "../ProfileCard";

const mockProfile = {
  id: "prof-1",
  user_id: "user-1",
  name: "Jane Photographer",
  profile_type: "Photographer",
  short_description: "Creative eye for light and shadows.",
  long_description: "Over 10 years of experience in fashion and editorial photography.",
  image_urls: ["https://example.com/main.jpg", "https://example.com/thumb1.jpg"],
  keywords: ["fashion", "editorial"],
  slug: "jane-photographer",
  source_url: "https://portfolio.com",
  is_confirmed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("ProfileCard Component", () => {
  afterAll(() => {
    cleanup();
  });

  test("renders profile name and type", () => {
    render(<ProfileCard profile={mockProfile as any} />);
    
    expect(screen.getByText("Jane Photographer")).toBeInTheDocument();
    expect(screen.getByText("Photographer")).toBeInTheDocument();
  });

  test("renders short description", () => {
    render(<ProfileCard profile={mockProfile as any} />);
    
    expect(screen.getByText("Creative eye for light and shadows.")).toBeInTheDocument();
  });

  test("renders keywords", () => {
    render(<ProfileCard profile={mockProfile as any} />);
    
    expect(screen.getByText("fashion")).toBeInTheDocument();
    expect(screen.getByText("editorial")).toBeInTheDocument();
  });

  test("renders main image and source link if available", () => {
    render(<ProfileCard profile={mockProfile as any} />);
    
    const img = screen.getByAltText("Jane Photographer") as HTMLImageElement;
    expect(img.src).toBe("https://example.com/main.jpg");
    
    expect(screen.getByText("portfolio.com")).toBeInTheDocument();
  });
  
  test("links correctly to the public profile page", () => {
    render(<ProfileCard profile={mockProfile as any} />);
    
    const links = screen.getAllByRole("link");
    const profileLink = links.find(l => (l as HTMLAnchorElement).getAttribute('href') === "/jane-photographer");
    expect(profileLink).toBeInTheDocument();
  });
});
