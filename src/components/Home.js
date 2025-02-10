import React, { useState, useEffect } from "react";

import { signOut } from "firebase/auth";
import { db, auth } from "../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import "../css/Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseYear, setNewReleaseYear] = useState("");
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const [editMovieId, setEditMovieId] = useState(null);
  const [editMovieTitle, setEditMovieTitle] = useState("");

  const [loading, setLoading] = useState(false);

  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    getMovieList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  auth.onAuthStateChanged((c_user) => {
    if (c_user) {
      setUser(c_user);
    } else {
      setUser(null);
    }
  });

  const signOutCurrentUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const getMovieList = async () => {
    setLoading(true);
    try {
      const data = await getDocs(moviesCollectionRef);
      const finalData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovieList(finalData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const addMovie = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseYear: Number(newReleaseYear),
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      setNewMovieTitle("");
      setNewReleaseYear("");
      setIsNewMovieOscar(false);
      await getMovieList();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteMovie = async (id) => {
    setLoading(true);
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      setMovieList(movieList.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const startEditMovie = (id, title) => {
    setEditMovieId(id);
    setEditMovieTitle(title);
  };

  const saveEditMovie = async (id) => {
    setLoading(true);
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: editMovieTitle });
      setEditMovieId(null);
      setEditMovieTitle("");
      getMovieList();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="home-title">
          {user != null
            ? `Welcome, ${user?.displayName || user?.email}!`
            : "Welcome, Guest..."}
        </h1>
        <button className="signout-button" onClick={signOutCurrentUser}>
          Sign Out
        </button>
        <form className="add-movie-form" onSubmit={addMovie}>
          <input
            type="text"
            name="title"
            className="add-movie-input"
            placeholder="Movie Title"
            value={newMovieTitle}
            onChange={(e) => setNewMovieTitle(e.target.value)}
            required
          />
          <input
            type="number"
            name="releaseYear"
            className="add-movie-input"
            placeholder="Release Year"
            value={newReleaseYear}
            onChange={(e) => setNewReleaseYear(e.target.value)}
            required
          />
          <label className="add-movie-label">
            <input
              type="checkbox"
              name="receivedAnOscar"
              checked={isNewMovieOscar}
              onChange={(e) => setIsNewMovieOscar(e.target.checked)}
            />
            Received an Oscar
          </label>
          <button type="submit" className="add-movie-button">
            Add Movie
          </button>
        </form>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="movie-list">
            {movieList.map((movie) => (
              <div key={movie.id} className="movie-item">
                {editMovieId === movie.id ? (
                  <div className="edit-movie">
                    <input
                      type="text"
                      className="edit-movie-input"
                      value={editMovieTitle}
                      onChange={(e) => setEditMovieTitle(e.target.value)}
                    />
                    <button
                      className="delete-button"
                      style={{ marginRight: "75px" }}
                      onClick={() => {
                        setEditMovieId(null);
                        setEditMovieTitle("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={() => saveEditMovie(movie.id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="movie-title">{movie.title}</h2>
                    <button
                      className="edit-button"
                      onClick={() => startEditMovie(movie.id, movie.title)}
                    >
                      Edit
                    </button>
                  </>
                )}
                <p className="movie-year">Release Year: {movie.releaseYear}</p>
                <p className="movie-oscar">
                  Oscar: {movie.receivedAnOscar ? "Yes" : "No"}
                </p>
                {editMovieId !== movie.id && (
                  <button
                    className="delete-button"
                    onClick={() => deleteMovie(movie.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
