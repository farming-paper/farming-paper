// this is used to tell Remix to call active loaders
// after a user signs in or out
export const action = () => {
  console.log("handle supabase auth");
  return null;
};
