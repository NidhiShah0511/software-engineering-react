import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as likesService from "../../services/likes-service";
import * as dislikesService from "../../services/dislike-service";
import { findAllTuits } from "../../services/tuits-service";

const Tuits = ({tuits = [], deleteTuit, refreshTuits}) => {
  const likeTuit = (tuit) =>
    likesService
      .userTogglesTuitLikes("me", tuit._id)
      .then(refreshTuits)
      .catch(e => console.log(e))

  const dislikeTuit = (tuit) =>
    dislikesService.userTogglesTuitDislikes("me", tuit._id)
        .then(refreshTuits)
        .catch(e => 
          console.log(e)
        )

  return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit => {
            return (
              <Tuit key={tuit._id} deleteTuit={deleteTuit} likeTuit={likeTuit} tuit={tuit} dislikeTuit={dislikeTuit}/>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Tuits;