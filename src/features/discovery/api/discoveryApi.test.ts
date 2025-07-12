import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiscoveryApi } from "./discoveryApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockSupabase: any = {};
mockSupabase.from = vi.fn(() => mockSupabase);
mockSupabase.select = vi.fn(() => ({ data: mockData, error: null, count: 1 }));
mockSupabase.eq = vi.fn(() => mockSupabase);
mockSupabase.in = vi.fn(() => mockSupabase);
mockSupabase.ilike = vi.fn(() => mockSupabase);
mockSupabase.overlaps = vi.fn(() => mockSupabase);
mockSupabase.order = vi.fn(() => mockSupabase);
mockSupabase.range = vi.fn(() => mockSupabase);
mockSupabase.limit = vi.fn(() => mockSupabase);
mockSupabase.single = vi.fn(() => ({ data: mockData[0], error: null }));

vi.mock("@/lib/supabase", () => ({
  supabase: mockSupabase,
}));

const mockData = [
  {
    id: "1",
    title: "Test Note",
    is_public: true,
    tags: [],
    difficulty: "beginner",
    created_at: "",
    updated_at: "",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockSupabase.select = vi.fn(() => ({
    data: mockData,
    error: null,
    count: 1,
  }));
  mockSupabase.eq = vi.fn(() => mockSupabase);
  mockSupabase.in = vi.fn(() => mockSupabase);
  mockSupabase.ilike = vi.fn(() => mockSupabase);
  mockSupabase.overlaps = vi.fn(() => mockSupabase);
  mockSupabase.order = vi.fn(() => mockSupabase);
  mockSupabase.range = vi.fn(() => mockSupabase);
  mockSupabase.limit = vi.fn(() => mockSupabase);
  mockSupabase.single = vi.fn(() => ({ data: mockData[0], error: null }));
});

describe("DiscoveryApi", () => {
  it("getNotes returns notes", async () => {
    const res = await DiscoveryApi.getNotes({});
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.hasMore).toBe(false);
  });

  it("getRoadmaps returns roadmaps", async () => {
    const res = await DiscoveryApi.getRoadmaps({});
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.hasMore).toBe(false);
  });

  it("getStudyRooms returns study rooms", async () => {
    const res = await DiscoveryApi.getStudyRooms({});
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.hasMore).toBe(false);
  });

  it("searchContent aggregates results", async () => {
    const res = await DiscoveryApi.searchContent({
      query: "",
      filters: {},
      page: 1,
      limit: 10,
    });
    expect(res.results.length).toBeGreaterThan(0);
  });

  it("getTrending returns trending content", async () => {
    const res = await DiscoveryApi.getTrending();
    expect(res.length).toBeGreaterThan(0);
  });

  it("getUserRecommendations returns recommendations", async () => {
    const res = await DiscoveryApi.getUserRecommendations();
    expect(res.length).toBeGreaterThan(0);
    expect(res[0]).toHaveProperty("reason");
  });

  it("handles errors", async () => {
    mockSupabase.select = vi.fn(() => ({
      data: null,
      error: { message: "fail" },
    }));
    await expect(DiscoveryApi.getNotes({})).rejects.toThrow(
      "Failed to fetch notes"
    );
  });
});
