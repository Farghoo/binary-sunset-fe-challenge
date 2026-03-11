// Conventional Commit types enforced on every commit message.
//
// Format: <type>(<scope>): <subject>
// Examples:
//   feat(orders): add margin percentage column
//   fix(i18n): fallback to key when translation missing
//   refactor(shared): extract formatters to shared/utils
//   test(calculations): add edge cases for zero price

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank':    [1, 'always'],
    'body-max-line-length':  [2, 'always', 100],
    'footer-leading-blank':  [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length':     [2, 'always', 100],
    'scope-case':            [2, 'always', 'lower-case'],
    'subject-case':          [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty':         [2, 'never'],
    'subject-full-stop':     [2, 'never', '.'],
    'type-case':             [2, 'always', 'lower-case'],
    'type-empty':            [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert'],
    ],
  },
};
