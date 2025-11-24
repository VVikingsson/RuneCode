# Backend and Frontend Template

Latest version: https://git.chalmers.se/courses/dit342/group-00-web

This template refers to itself as `group-00-web`. In your project, use your group number in place of `00`.

## Project Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| `server/` | Backend server code | All your server code |
| [server/README.md](server/README.md) | Everything about the server | **READ ME** carefully! |
| `client/` | Frontend client code | All your client code |
| [client/README.md](client/README.md) | Everything about the client | **READ ME** carefully! |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

* [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  * [Add your Git username and set your email](https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git)
    * `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    * `git config --global user.email "email@example.com"` => check `git config --global user.email`
  * > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
* [Chalmers GitLab](https://git.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  * DIT342 course group: https://git.chalmers.se/courses/dit342
  * [Setup SSH key with Gitlab](https://docs.gitlab.com/user/ssh/#generate-an-ssh-key-pair)
    * Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    * Add your public SSH key to your Gitlab profile under https://git.chalmers.se/-/user_settings/ssh_keys
    * Make sure the email you use to commit is registered under https://git.chalmers.se/-/profile/emails
  * Checkout the [Backend-Frontend](https://git.chalmers.se/courses/dit342/group-00-web) template `git clone git@git.chalmers.se:courses/dit342/group-00-web.git`
* [Server Requirements](./server/README.md#Requirements)
* [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-00-web.git

# Change into the directory
cd group-00-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

The system will provide an interactive platform where users can practice their coding skills directly in the browser and get instant feedback on their solutions. Users are motivated to keep practicing by comparing to others' solutions and climbing the leaderboard by gaining points.

### Pages

* Home: The name of the app is clearly visible. The user can choose what activity to do: challenge (opens a list of challenges) or versus session (choose a difficulty). All other pages are navigable to.
* Challenges: A list of clickable challenges.
* Challenge: A title, instructions, and a coding input window is visible. The user can write their code and submit it for validation. Can also navigate to challenge's submissions.
* Challenge submissions: A list of all submissions for a given challenge, each clickable to navigate to the submissions page. Can also navigate back to challenge page.
* Leaderboard: A leaderboard based on users points/score/rank is displayed. The top X users are shown, as well as your own position. Usernames are clickable and navigates to the profile.
* User profile: Shows user stats and allows to navigate to their submissions and challenges that they completed.
* Submission: Displays the code and the note of the author of the submission. It is also clear what challenge it was submitted for, and whether it passed or failed.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/ER.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)

## Advanced Feature Proposal
### Running and evaluating arbitrary code.
#### Context:
We are building a coding website similar to codewars or leetcode that will let users hone their coding skills through solving challenges. In our minimum viable product, the user can write Javascript into a window, that then runs in the front-end. The window is a simple html \<input\> tag, without the look and feel of a classic IDE (i.e. line numbers and syntax highlighting). After running the code, the user is informed whether their code was correct or not.

#### Feature
In this advanced feature, the user will be able to choose between two programming languages, Python and Javascript. The app will automatically detect the language and provide syntax highlighting as well as line numbers. The code will not run in the browser anymore, but in a secure container in the back-end. In addition to knowing whether the code ran successfully or not, the user will know how many tests the code passed, as well as what test the code failed at, in case it did.

#### Front-end extension:
The coding window will provide syntax highlighting, line numbers, and automatic indentation, giving an authentic coding experience to the user.

#### Back-end extension:
This feature requires that we use docker to containerize the execution of the arbitrary code, as well as communicate with the container through stdout and stdin. Algorithmic thinking is needed to solve issues such as “what if the user adds a load of print commands, messing with the stdout stream” or “what if the user writes while True: continue, and sends the code for execution?”.
