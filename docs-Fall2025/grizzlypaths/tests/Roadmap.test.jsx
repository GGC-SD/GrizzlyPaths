// tests/Roadmap.test.jsx
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Roadmap from "../src/Roadmap";

const click = (el) => fireEvent.click(el);

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  vi.restoreAllMocks();
});

// --------------------------- MOCK DATA ---------------------------
const COURSE_CSV_TEXT = `
COURSE_NUMBER,COURSE_NAME,COURSE_SKILLS
ITEC 2120,Intro to Programming,"[\\"JavaScript\\", \\"Algorithms\\", \\"Debugging\\"]"
ITEC 2130,Web Technologies,"[\\"HTML\\", \\"CSS\\", \\"React\\"]"
ITEC 2150,OOP & Data Structures,"[\\"Java\\", \\"OOP\\", \\"Data Structures\\"]"
ITEC 3110,Systems Analysis,"[\\"UML\\", \\"Requirements\\", \\"SQL\\"]"
ITEC 3700,AI Fundamentals,"[\\"Python\\", \\"ML\\", \\"Statistics\\"]"
`.trim();

const JOBS_CSV_TEXT = `
job_title,job_description,skills
Software Developer,"Build UIs; strong communication and collaboration","React, JavaScript, HTML, CSS"
Software Engineer,"APIs; problem solving; teamwork","Node, SQL, JavaScript"
Cloud Engineer,"Cloud; Docker; CI/CD; communication","Docker, CI/CD, SQL"
`.trim();

function mockFetchForRoadmap() {
  const coursesURL =
    "https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Fall2025/grizzlypaths/src/Component/Course.csv";
  const jobsURL =
    "https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Spring2025/final_files/merged_jobs_cleaned%20(6).csv";

  vi.spyOn(global, "fetch").mockImplementation((input) => {
    const url = typeof input === "string" ? input : input?.url;
    if (url === coursesURL) {
      return Promise.resolve(
        new Response(COURSE_CSV_TEXT, { status: 200, headers: { "Content-Type": "text/plain" } })
      );
    }
    if (url === jobsURL) {
      return Promise.resolve(
        new Response(JOBS_CSV_TEXT, { status: 200, headers: { "Content-Type": "text/plain" } })
      );
    }
    return Promise.reject(new Error(`Unexpected fetch to: ${url}`));
  });
}

// ------------------------------ TESTS ------------------------------
describe("Roadmap (integrated with real parsing)", () => {
  it("renders majors and shows SW job-type buckets after selecting a major", async () => {
    mockFetchForRoadmap();
    render(<Roadmap onBack={() => {}} />);

    const sw = await screen.findByText(/Software Development/i);
    const dm = screen.getByText(/Digital Media/i);
    expect(sw).toBeInTheDocument();
    expect(dm).toBeInTheDocument();

    click(sw);

    expect(await screen.findByRole("button", { name: /Software Engineer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Software Developer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Project Manager/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cloud/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Automation Engineer/i })).toBeInTheDocument();

    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  });

  it("opens 'Software Developer' and shows hard skills, soft skills (<=5), and courses", async () => {
    mockFetchForRoadmap();
    render(<Roadmap onBack={() => {}} />);

    click(await screen.findByText(/Software Development/i));
    click(await screen.findByRole("button", { name: /Software Developer/i }));

    // Wait for the skills section to mount
    await screen.findByText(/Skills\s+for\s+.*Software Developer/i);

    // HARD SKILLS:
    // With one posting, integerizeCounts awards the single count to the first skill by tie-breaker (CSS).
    // So we only assert CSS is visible as a hard-skill card (role="button" w/ aria-label "CSS").
    await screen.findByRole("button", { name: /^CSS$/i });

    // SOFT SKILLS — also cards; assert a couple
    expect(screen.getByText(/Common Soft Skills/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Communication$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Collaboration$/i })).toBeInTheDocument();

    // COURSES — course card button label `${code} — ${name}`
    expect(screen.getByRole("button", { name: /ITEC 2130 — Web Technologies/i })).toBeInTheDocument();
  });

  it("changing to Digital Media resets the active type view (skills disappear)", async () => {
    mockFetchForRoadmap();
    render(<Roadmap onBack={() => {}} />);

    click(await screen.findByText(/Software Development/i));
    click(await screen.findByRole("button", { name: /Software Developer/i }));

    // Ensure skills section is up, then confirm the CSS skill exists
    await screen.findByText(/Skills\s+for\s+.*Software Developer/i);
    await screen.findByRole("button", { name: /^CSS$/i });

    // Switch major -> activeType resets (skill buttons disappear)
    click(screen.getByText(/Digital Media/i));
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /^CSS$/i })).toBeNull();
      expect(screen.getByRole("button", { name: /Marketing/i })).toBeInTheDocument();
    });
  });
});
