google doc: https://docs.google.com/document/d/15GRGsJ9_VsUKPIzcfdf-skhttTQm-rXJ9ItUB6OVqio/edit#

# LineLevel
An app where musicians can host online album release parties to share new music with their fans


![Line Level front page mockup](https://github.com/the-scholarminati/linelevel/blob/master/designs:mockups/linelevel_frontpage_demo.png?raw=true)


# The Team

- Alex - product owner and backend engineer
- Logan - scrum master and frontend engineer
- Charles - backend engineer
- Diedra - frontend engineer


# Tech Stack

- Mobile-first design, browser based app.
- Angular + React
- Youtube API ---> Webcam/audio interaction
- Node.js + Express
- Firebase for database and hosting
- Look into Redis
- Auth0 for Authentication
- Tape for testing


# MVP feature list

- video/music streaming (youtube API)
- user accounts
- chat
- mobile-first design
- unit tests for client and server
- integration test for api calls


# Stretch goals

- music file upload
- develop our own streaming feature (from scratch?)
- rewards/incentives
- add other genres, film screenings and game demos
- store/hosting past parties
- buy album
- event rsvp, book dates in advance for promotion
- display list of upcoming promotions for different genres

# Git Flow

- create fork via github
- clone to local repo
- // if feature branch does not exist
- make branch on local repo: git checkout -b branch-name
- push branch to upstream: git push upstream branch-name
- // repeat from here if making changes to existing feature
- make changes to branch until ready to push       
- rebase from dev:  git rebase (--continue | --skip | --abort)
- fix conflicts: git pull --rebase upstream dev
- push to forked branch: git push origin branch-name
- create pull request: base team-repo:dev compare your-forked-repo:branch-name
- repeat until feature is complete

# Getting Started
(please add any instructions other team members need to know to run your code here)

To run the test suite, you may need to globally install a few dependencies:

```
npm install -g karma
npm install -g karma-jasmine
npm install -g karma-coverage
npm install -g karma-chrome-launcher
npm install -g karma-ng-html2js-preprocessor
```
To run the actual tests, navigate to the project directory in your terminal and run the command
```
karma start
```
A new browser window should open stating that Karma connected successfully.

# Deploying on firebase

Install Firebase Tools

```
npm install -g firebase-tools

firebase deploy
