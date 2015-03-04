---
title: "Pausing and Resuming my workflow"
date: 2014-08-17
template: posts.hbt
preview: Some hopeful musing on a workflow that can easily be paused and resumed.
---
Ok, so I think I have come up with and idea for this partial work on files idea. It’s not fully ironed out though.
When you have some partial work done of files but need to move on elsewhere or something use ‘git stash’ which is like a second repository you can ‘stash’ things in.
Specifically I use “git stash save -p “a description of my partial work””
and then make an alias of ‘gss’ to “git stash list && git status”
So whenever i list the status (which is a lot) i will see if i have any stashes as well
Instead of just leaving those files hanging around in non-staged files

cat, echo, supercat with colour/syntax aware printout to screen reads of a TODO file in the current directory.
