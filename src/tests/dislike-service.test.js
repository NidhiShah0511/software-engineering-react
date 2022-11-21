import {userTogglesTuitDislikes} from "../services/dislike-service";
import {
  createUser,
  deleteUsersByUsername
} from "../services/users-service";
import {
  findTuitById,
  createTuitByUser
} from "../services/tuits-service";

describe('user toggles tuit dislikes', () => {
  // user to insert
  const testUser = {
    username: 'ellen_ripley',
    password: 'lv426',
    email: 'repley@weyland.com'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(testUser.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(testUser.username);
  })

  test('user can dislike and remove dislike for a tuit', async () => {
    // insert new user in the database
    const testTuitContent = 'Message sent!';
    const newUser = await createUser(testUser);
    const createdTuit = await createTuitByUser(newUser._id, testTuitContent);
    
    await userTogglesTuitDislikes(newUser._id, createdTuit._id);

    const updatedTuit = await findTuitById(createdTuit._id);
    expect(updatedTuit.stats.dislikes).toEqual(1);
    expect(updatedTuit.stats.likes).toEqual(0);

    await userTogglesTuitDislikes(newUser._id, createdTuit._id);

    const updatedTuit2 = await findTuitById(createdTuit._id);
    expect(updatedTuit2.stats.dislikes).toEqual(0);
  });
});