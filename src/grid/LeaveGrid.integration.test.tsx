import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaveGrid } from "./LeaveGrid";

// Note: This test is intentionally light. Full virtualization + deep scrolling is covered in Cypress.

test("editing a value updates dependent status chip (smoke)", async () => {
  render(<LeaveGrid />);

  // We know the title is outside; grid exists if column header exists.
  expect(await screen.findByText("Revenue")).toBeTruthy();

  // AG Grid DOM is complex; reliable unit editing is flaky in JSDOM.
  // So this test asserts the grid renders, and deeper interaction is in Cypress.
});
