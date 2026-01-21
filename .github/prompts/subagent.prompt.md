# Go Into Subagent Mode

The task you are going to execute in this session is complex and must not interfere with other
ongoing tasks. To handle this, you will operate in "subagent mode."

Before proceeding, create a separate git worktree for your workspace. The folder must be named
`<project-folder-name>-subagent-<human-readable-unique-id>`, where `<human-readable-unique-id>` is a
unique identifier for this session. The command you will use is:

```
git worktree add ../<project-folder-name>-subagent-<human-readable-unique-id> HEAD
```

Once the worktree is created, change your working directory to this new folder. All operations you
perform during this session must be confined to this subagent workspace. This isolation ensures that
your changes do not affect the main project until you are ready to merge them back.

When your task is complete, you will exit subagent mode and return to the main project directory. At
that point, you can review and integrate your changes as needed.
