export const getUserById = async (app, id) => {
  try {
    // Call the users.info to retrieve user info
    const result = await app.client.users.info({
      user: id
    });
    if (result.ok) {
      return result.user;
    }
  }
  catch (error) {
    console.error(error);
  }
}
