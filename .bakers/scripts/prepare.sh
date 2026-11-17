#!/bin/sh
# bakers.build after_create hook: install the locked dependencies in the
# ticket worktree. Safe to repeat; a ready worktree is left as it is.
set -eu
cd "${BAKERS_WORKTREE_PATH:-.}"
npm ci
