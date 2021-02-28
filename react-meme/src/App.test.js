import React from 'react'
import { getByTestId, render, screen, queryByAttribute } from '@testing-library/react'
import App from './App.js'
import * as examples from './App.js'
import { within } from '@testing-library/dom'
import userEvent from "@testing-library/user-event"

import '@testing-library/jest-dom/extend-expect';


it("renders without crashing", () => {
  shallow(<App />);
});


describe('examples', () => {
  it("Are Alle Buttons Rendered?", () => {
    render(<App />);
    const buttons = [
      "Download Image!", "Share Meme", "Open Image Template"
    ];

    buttons.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});