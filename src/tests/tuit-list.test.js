import Tuits from "../components/tuits";
import '@testing-library/jest-dom';
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createTuitByUser, deleteTuit, findAllTuits} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";
import axios from "axios";
//jest.mock('axios');


const MOCKED_USERS = [
  {username: 'ellen_ripley', password: 'lv426', email: 'repley@weyland.com'},
  {username: 'sarah_conor', password: 'illbeback', email: 'sarah@bigjeff.com'},
]

const MOCKED_TUITS = [
    {tuit: "ellen_ripley's tuit", postedBy: {"username": "ellen_ripley"}, _id: "123",
        image: null, youtube: null, published: "Jan 20, 2022"},
    {tuit: "sarah_conor's tuit", postedBy: {"username": "sarah_conor"}, _id: "234",
        image: null, youtube: null, published: "Aug 30, 2022"}
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>);
  const linkElement = screen.getByText(/ellen_ripley's tuit/i);
  expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
  const testUser = await createUser(MOCKED_USERS[0]);
  const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[0].tuit);
  const tuits = await findAllTuits();
  render(
      <HashRouter>
          <Tuits tuits={tuits}/>
      </HashRouter>);
  const linkElement = screen.getByText(/ellen_ripley's tuit/i);
  expect(linkElement).toBeInTheDocument();

  // Cleans up.
  await deleteTuit(createdTuit._id);
  await deleteUsersByUsername(MOCKED_USERS[0].username)
})

test('tuit list renders mocked', async () => {
  jest.spyOn(axios, 'get').mockImplementation()
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
      <HashRouter>
          <Tuits tuits={tuits}/>
      </HashRouter>);

  const linkElement = screen.getByText(/sarah_conor's tuit/i);
  expect(linkElement).toBeInTheDocument();
});