import {Tuits} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";

jest.mock('axios');

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];

const MOCKED_TUITS = [
  "alice's tuit", "bob's tuit", "charlie's tuit"
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>);
  const linkElement = screen.getByText(/charlie's tuit/i);
  expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
  const testUser = await createUser(MOCKED_USER);
  const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);

  const tuits = await findAllTuits();
  render(
      <HashRouter>
          <Tuits tuits={tuits}/>
      </HashRouter>);
  const linkElement = screen.getByText(/charlie's tuit/i);
  expect(linkElement).toBeInTheDocument();

  // Cleans up.
  await deleteTuit(createdTuit._id);
  await deleteUsersByUsername(MOCKED_USER.username)
})

test('tuit list renders mocked', async () => {
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
      <HashRouter>
          <Tuits tuits={tuits}/>
      </HashRouter>);

  const linkElement = screen.getByText(/charlie's tuit/i);
  expect(linkElement).toBeInTheDocument();
});