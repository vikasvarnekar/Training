# Contributing

## Commit requirements

1. Commit(s) should have related issue
2. Every commit should be well granulated
    Commit should contain minimal set of changes.

    Commit should change system from working state to working state (it is not allowed to break logic in first commit and fix it in second commit even if these commits in one Pull Request)

    There are a few problems with large monolithic commits:
    * Hard to review commits
    * History of the development of code is lost. With large commits, the process of code development is obscured and not discoverable within git. (`git blame` becomes less useful)
    * Detecting a problem change is much harder. Even when debugging manually by checking out different commits, having granular commits makes it much simpler to find the lines of code that are actually the source of the bug. (`git bisect` becomes useless)

    Modifications should be in separate commits if:
    * They have different origins, such as third-party and in-house code (if you add a modified version of something from another project, commit a pristine copy in one commit, change it in the next)
    * They fix different bugs
    * They are done for different reasons
    * They're at different conceptual levels of the system ("refactor session handling" would be in a different level from "add user shoe size to Session")
    etc...

3. Local build should pass for every commit
4. Tests should pass for every commit