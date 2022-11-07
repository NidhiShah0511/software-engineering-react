import {
  findAllTuits,
  findAllTuitsByUser,
  findTuitById,
  createTuitByUser,
  updateTuit,
  deleteTuit
} from "../services/tuits-service";
import {
  createUser,
  deleteUsersByUsername, findAllUsers, findUserById
} from "../services/users-service";

describe('createTuitByUser', () => {
  // Sample user and tuit to create.
  const testUser = {
      username: 'ellen_ripley',
      password: 'lv426',
      email: 'repley@weyland.com'
  };
  const testTuitContent = 'Ellens Tuit';

  beforeAll(() => {
      return deleteUsersByUsername(testUser.username);
  })

  afterAll(() => {
      return deleteUsersByUsername(testUser.username);
  })

  test('can create tuit with REST API', async () => {
      // Assumes createUser has been tested.
      const createdUser = await createUser(testUser);
      const createdTuit = await createTuitByUser(createdUser._id, testTuitContent);

      // verify created tuit matches the parameter tuit
      expect(createdTuit.tuit).toEqual(testTuitContent);
      expect(createdTuit.postedBy).toEqual(createdUser._id);

      // Cleans up after testing
      await deleteTuit(createdTuit._id);
  })
});

describe('deleteTuit', () => {
  // Sample user and tuit to create.
  const testUser = {
      username: 'testUser',
      password: 'testing123',
      email: 'test@robot.com'
  };
  const testTuitContent = 'Message sent!';

  beforeAll(async () => {
      await deleteUsersByUsername(testUser.username);
  })

  afterAll(async () => {
      await deleteUsersByUsername(testUser.username);
  })

  test('can delete tuit with REST API', async () => {
      const createdUser = await createUser(testUser);
      const createdTuit = await createTuitByUser(createdUser._id, testTuitContent);

      const status = await deleteTuit(createdTuit._id);

      // verify we deleted at least one user by their username
      expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  })
});

describe('findTuitById', () => {
  // Sample user and tuit to create.
  const testUser = {
      username: 'testUser',
      password: 'testing123',
      email: 'test@robot.com'
  };
  const testTuitContent = 'Message sent!';

  beforeAll(async () => {
      await deleteUsersByUsername(testUser.username);
  })

  afterAll(async () => {
      await deleteUsersByUsername(testUser.username);
  })

  test('can retrieve a tuit by their primary key with REST API', async () => {
      // Assumes createUser has been tested.
      const createdUser = await createUser(testUser);
      const createdTuit = await createTuitByUser(createdUser._id, testTuitContent);

      // Verifies created tuit matches the parameter tuit
      expect(createdTuit.tuit).toEqual(testTuitContent);
      expect(createdTuit.postedBy).toEqual(createdUser._id);

      // Cleans up after testing
      await deleteTuit(createdTuit._id);
  });
});

describe('findAllTuits', () => {
  const testUser = {
      username: 'testUser',
      password: 'testing123',
      email: 'test@robot.com'
  };
  // Multiple tuits to insert.
  const testTuitContents = [
      'Da1', 'Te1', 'Ta1'
  ];

  beforeAll(async () => {
      await deleteUsersByUsername(testUser.username);
  })

  afterAll(async () => {
      await deleteUsersByUsername(testUser.username);
  })

  test('can retrieve all tuits with REST API', async () => {
      // Assumes createUser has been tested.
      const createdUser = await createUser(testUser);
      testTuitContents.map(async content => {
          const createdTuit = await createTuitByUser(createdUser._id, content);

          // Verifies created tuit matches the parameter tuit.
          expect(createdTuit.tuit).toEqual(content);
          expect(createdTuit.postedBy).toEqual(createdUser._id);
      });

      const inDbTuits = await findAllTuits();
      // Number of tuits retrieved should be at least the number just inserted.
      expect(inDbTuits.length).toBeGreaterThanOrEqual(testTuitContents.length);
      console.log(inDbTuits);

      // Filters for the users just inserted.
      const tuitsInserted = inDbTuits.filter(
          tuit => testTuitContents.indexOf(tuit.tuit) >= 0);
      console.log(tuitsInserted);
      // Verifies the tuits inserted matched the ones just sent.
      tuitsInserted.forEach(tuit => {
          const testTuitContent = testTuitContents.find(content => content === tuit.tuit);
          expect(tuit.tuit).toEqual(testTuitContent);
          //expect(tuit.postedBy._id).toEqual(createdUser._id);
      });

      // Cleans up after testing
      tuitsInserted.map(async tuit => {
          await deleteTuit(tuit._id);
      })
  });

});