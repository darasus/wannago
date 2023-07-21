export function getBaseUrl() {
  return (
    process.env.ENVIRONMENT_URL ||
    'https://wannago-git-test-automation-darasus-team.vercel.app'
  );
}
