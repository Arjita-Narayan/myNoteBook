import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5001";
  // const notesInitial = [
  //   {
  //     _id: "6693e4a20a894fd27f7d0afe",
  //     user: "6693b8497efa3803da7dc0b5",
  //     title: "My Title",
  //     description: "make food ",
  //     tag: "personal",
  //     Date: "2024-07-14T14:45:54.143Z",
  //     __v: 0,
  //   },
  //  
  //   {
  //     _id: "6693e792628ab0b2dd1b34a6",
  //     user: "6693b8497efa3803da7dc0b5",
  //     title: " schedule",
  //     description: "wake up early ",
  //     tag: "professional",
  //     Date: "2024-07-14T14:58:26.310Z",
  //     __v: 0,
  //   },
  // ];

  // const [notes, setNotes] = useState(notesInitial);
  const [notes, setNotes] = useState([]);

  //Get all notes
  const getNotes = async () => {
    //API call

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  //Add a Note
  const addNote = async (title, description, tag) => {
    //API call

    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();

    setNotes(notes.concat(note));
  };

  //Delete a Note
  const deleteNote = async (id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = response.json();
    console.log(json);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    //logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}{" "}
    </NoteContext.Provider>
  );
};

export default NoteState;
