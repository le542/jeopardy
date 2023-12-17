# Jeopardy Game

## Description
- This a static web app for a two-team, 5-topic, customizable Jeopardy game with a built-in scoreboard.
- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- Deployed using Netlify: [**CLICK HERE TO PLAY**](https://boisterous-empanada-e86c26.netlify.app/)

## How to setup a game:
1) Create a copy of [this Google Slides Jeopardy Template](https://docs.google.com/presentation/d/1N_5IbXUY3y2PCuhFQ0YA7ZuREwC7ew1Q3fyILBnEBQA/edit#slide=id.p).
2) Customize each slide to your liking. Note: the first 3 slides of this template are not used.
3) Export Google Slides as PDF: File > Download > PDF Document (.pdf).
4) Go to the [app](https://boisterous-empanada-e86c26.netlify.app/), click the **Upload File** button on the bottom.
5) Click **Choose File**, then import your file, and click **Upload PDF**.
6) If you kept the first 3 slides in the PDF, keep page offset to 3. If you deleted them, page offset is 0.
7) Click outside popup to close.
8) Edit category titles on the gameboard by clicking on the text.

## How to play game:
1) Click a number to open the question.
2) Click the **Show Question/Answer** to toggle between the question and answer screen.
3) Choose which team to get the points using the radio buttons on the bottom.
4) Click outside popup to close.
5) The **Final Jeopardy** button is located on the bottom.
6) To reset the gameboard, click **Reset Game**.

## Why was this created?
The slide template alone can be used for a jeopardy game through Presentation mode. However:
1) The numbers do not disappear after being clicked.
2) Accident prone: clicking a part of the slide that isn't a button will move to the next slide.
3) No scoreboard to keep track of which team won what category + amount.

This app solves the problems listed above, while still utilizing the creative flexibility that Google Slides provides users.

## Development instructions

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


