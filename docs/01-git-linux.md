# Task 1: Merging, deploying and testing code

Username used throughout: `rahul.karamchund`

| # | Command(s) | Action |
|---|------------|--------|
| 1 | `cd ~/projects/app` | Enter the app repo directory |
| 2 | `git checkout main && git pull origin main && git checkout -b rc_$(date +%Y%m%d)` | Create a release candidate branch |
| 3 | `git fetch origin && git merge origin/1234-awesome-feature && git push -u origin HEAD` | Merge the feature branch and update the remote |
| 4 | `ssh rahul.karamchund@uat1.server.com` | Connect to the UAT server |
| 5 | `cd /var/www/app && git fetch origin && git checkout rc_$(date +%Y%m%d)` | Enter the repo and switch to the RC branch |
| 6 | `upgrade_app` | Run the upgrade script |
| 7 | `less log/production.log` | Check the log for errors |

`$(date +%Y%m%d)` gives today's date, e.g. `rc_20261126`. If the server step happens on a different day you'd need to type the actual branch name instead.

## Notes on each step

**1.** `~` is the home directory, so this is `/home/rahul.karamchund/projects/app`.

**2.** I switch to `main` and pull first so the RC branch starts from the latest remote main and not whatever happened to be on my machine. `checkout -b` creates the branch and switches to it. Using `&&` means that if the pull fails, the branch doesn't get created.

**3.** `fetch` makes sure I have the latest version of the feature branch, then I merge `origin/1234-awesome-feature` into the RC. That works even if I've never checked the feature branch out locally. `push -u origin HEAD` pushes the current branch and sets it to track the remote, so later pushes and pulls don't need the branch name.

If the merge conflicts, git stops and I'd fix the files, `git add` them and `git commit` before pushing.

**4.** Standard SSH. The first time you connect it asks you to accept the server's host key.

**5.** The install folder is a clone of the repo, so it's the same as locally: fetch so the new branch exists on the server, then check it out.

**6.** The script is on the PATH so it can be run by name. It might need `sudo` depending on how the server is set up.

**7.** `less` lets you scroll and search the file (type `/error`). Other options I'd use:

```bash
tail -n 100 log/production.log
tail -f log/production.log
grep -i error log/production.log
```
