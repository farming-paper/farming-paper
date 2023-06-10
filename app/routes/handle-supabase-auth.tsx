// this is used to tell Remix to call active loaders
// after a user signs in or out
export const action = () => {
  // eslint-disable-next-line no-console
  console.log("handle supabase auth");
  return null;
};
