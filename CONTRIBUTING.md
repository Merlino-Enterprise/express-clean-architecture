# Naming convention
In this project we make use of the 'Clean Architecture'

### Controllers

# Contributing to this project

We have very precise rules over how our Git commit messages must be formatted. This format leads to **easier to read
commit history**.

Each commit message consists of a header, a body, and a footer.

```git
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Commit Message Header

```
<type>(<scope>): <short summary>
│       │             │
│       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
│       │
│       └─⫸ Commit Scope: component name in lower case
│
└─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

#### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests

#### Scope 
The scope should be the name of the component affected (as perceived by the person reading the changelog
generated from commit messages).

#### Summary

Use the summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end
- explain what and why

### Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain why you are making
the change. You can include a comparison of the previous behavior with the new behavior in order to illustrate the
impact of the change.

### Commit Message Footer

The footer can contain information about breaking changes and is also the place to reference GitHub issues, Jira
tickets, and other PRs that this commit closes or is related to.

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a
blank line, and a detailed description of the breaking change that also includes migration instructions.

---

### Resources

- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
