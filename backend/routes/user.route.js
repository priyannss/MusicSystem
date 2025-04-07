import { Router } from "express";
import { verifyToken } from "../middleware/user.middleware.js";
import {
  getLikedSongs,
  getPlaylists,
  getRecommendations,
  getRecentlyPlayed,
  getUser,
  login,
  addSongs,
  getAllSongFromBackend,
  getSelectedSong,
  getDatabaseUser,
  setLikedSongs,
  removeLikedSongs,
  saveRecentlyPlayed,
} from "../controller/user.controller.js";
const router = Router();

// router.post("/getRecommendations", getRecommendations);
// router.post("/getUser", getUser);
// router.post("/getSelectedSong", getSelectedSong);


router.post("/getLikedSongs", getLikedSongs);
router.post("/getPlaylists", getPlaylists);
router.post("/getRecentlyPlayed", getRecentlyPlayed);
router.get("/getAllSongs", getAllSongFromBackend);
router.post("/addSong", addSongs);
router.post("/login", login);
router.get("/alluser", getDatabaseUser);
router.post("/setLikedSong", setLikedSongs);
router.post("/removeLikedSong", removeLikedSongs);
router.post("/setRecentlyPlayed", saveRecentlyPlayed);

export default router;
