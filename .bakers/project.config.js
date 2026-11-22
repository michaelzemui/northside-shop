// @bakers-schema-version 1
// The project's bakers.build configuration — committed and identical for
// everyone. A conductor is this machine (machine.config.js) + this project +
// the variant (project.<name>.config.js). Connections are private files.
//
// Each addon in `addons` fills its slots through its preset: herdr supplies
// the executor and the worktree. The server comes from the connection,
// by default @bakers-build/addon-remote-drupal.

/** @type {import('@bakers-build/core').ProjectConfig} */
export default {
  schema_version: 1,
  project: { name: "Northside shop", workspace: "bakers" },
  // The run budget (max_parallel) is set on the machine in the backend.
  // Transcripts upload only where the server's run-log storage allows it.
  // Set to false to keep this conductor's transcripts local even then.
  // Metrics are unaffected either way.
  capture_logs: true,
  // Lifecycle hooks are conductor-owned: they live at the config top
  // level — NOT on a plugin descriptor's `with.hooks`.
  hooks: { after_create: "sh .bakers/scripts/prepare.sh" },
  // Agent plugins every run installs into a per-run agent home, so each
  // machine runs the same skills: the bakers plugin supplies bb-workflow.
  marketplaces: [
    { url: "https://github.com/bakers-build/bakers-build.git", ref: "main", plugins: ["bakers"] },
    // The superpowers recipe (bb-recipe-superpowers) needs the obra/superpowers skills.
    { url: "https://github.com/obra/superpowers.git", ref: "main", plugins: ["superpowers"] },
  ],
  addons: [ { use: "@bakers-build/addon-herdr" }],
};
