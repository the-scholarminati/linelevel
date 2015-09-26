# Lineevel
An app where musicians can host online album release parties to share new music with their fans


![Linelevel about page screenshot](http://i132.photobucket.com/albums/q17/dierat/software%20dev%20portfolio%20images/Screen%20Shot%202015-09-18%20at%206.02.07%20PM.png)
![Linelevel home page screenshot](http://i132.photobucket.com/albums/q17/dierat/software%20dev%20portfolio%20images/Screen%20Shot%202015-09-18%20at%206.02.20%20PM.png)


# The Team

- [Logan - scrum master and frontend engineer](https://github.com/xlogz)
- [Alex - product owner and backend engineer](https://github.com/al3xR)
- [Charles - backend engineer](https://github.com/ccrame)
- [Diedra - frontend engineer](https://github.com/dierat)


# Tech Stack

- Mobile-first design, browser based app.
- Angular
- WebRTC + Peer.js
- Node.js + Express
- Firebase for database and hosting
- Karma and Jasmine for testing


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


# Contributing
(please add any instructions other team members need to know to run your code here)

To get started, fork and clone the repo, then run
```
npm install
```
to install the dependencies.



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


Please use lint by running
```
gulp lint
```
to find syntax errors before submitting a pull request.


# Deploying on firebase

Install Firebase Tools and deploy!

```
npm install -g firebase-tools

firebase deploy
```
