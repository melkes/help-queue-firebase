import React, {useState, useEffect} from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import EditTicketForm from './EditTicketForm';
import TicketDetail from './TicketDetail';
import { db, auth } from './../firebase.js';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc  } from "firebase/firestore";

function TicketControl() {
  const [formVisibleOnPage, setFormVisibleOnPage] = useState(false);
  const [mainTicketList, setMainTicketList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { 
    const unSubscribe = onSnapshot(
      collection(db, "tickets"), 
      (collectionSnapshot) => {
        // do something with ticket data
        const tickets = [];
      collectionSnapshot.forEach((doc) => {
          tickets.push({
            names: doc.data().names, 
            location: doc.data().location, 
            issue: doc.data().issue, 
            id: doc.id
          });
      });
      setMainTicketList(tickets);
      }, 
      (error) => {
        // do something with error
        setError(error.message)
        // above line should have been added for this commit, not earlier
      }
    );

    return () => unSubscribe();
  }, []);
  if(error){

  }

  const handleClick = () => {
    if (selectedTicket != null) {
      setFormVisibleOnPage(false);
      setSelectedTicket(null);
      setEditing(false);
    }else {
      setFormVisibleOnPage(!formVisibleOnPage);
    }
  }
  
    const handleDeletingTicket = async (id) => {
    await deleteDoc(doc(db, "tickets", id));
    setSelectedTicket(null);
  } 

  const handleEditClick = () => {
    setEditing(true);
  }

  const handleEditingTicketInList = async (ticketToEdit) => {
    const ticketRef = doc(db, "tickets", ticketToEdit.id);
    // ticketRef is a DocumentReference object that points to the 
    // document with ID ticketToEdit.id in the tickets collection.
    await updateDoc(ticketRef, ticketToEdit);
    // This uses that reference to update 
    // the data for that document with the ticketToEdit object.
    setEditing(false);
    setSelectedTicket(null);
  }

  const handleAddingNewTicketToList = async (newTicketData) => {
    const collectionRef = collection(db, "tickets");
    await addDoc(collectionRef, newTicketData);
    setFormVisibleOnPage(false);
  }

  const handleChangingSelectedTicket = (id) => {
    const selection = mainTicketList.filter(ticket => ticket.id === id)[0];
    setSelectedTicket(selection);
  }

  let currentlyVisibleState = null;
  let buttonText = null; 

  if (editing) {      
    currentlyVisibleState = 
      <EditTicketForm 
        ticket = {selectedTicket} 
        onEditTicket = {handleEditingTicketInList} />;
    buttonText = "Return to Ticket List";
  } else if (selectedTicket != null) {
    currentlyVisibleState = 
      <TicketDetail 
        ticket={selectedTicket} 
        onClickingDelete={handleDeletingTicket}
        onClickingEdit = {handleEditClick} />;
    buttonText = "Return to Ticket List";
  } else if (formVisibleOnPage) {
    currentlyVisibleState = 
      <NewTicketForm 
        onNewTicketCreation={handleAddingNewTicketToList}/>;
    buttonText = "Return to Ticket List"; 
  } else {
    currentlyVisibleState = 
      <TicketList 
        onTicketSelection={handleChangingSelectedTicket} 
        ticketList={mainTicketList} />;
    buttonText = "Add Ticket"; 
  }

  return (
    <React.Fragment>
      {currentlyVisibleState}
      { error ? null : <button onClick={handleClick}>{buttonText}</button> }
    </React.Fragment>
  );
}

export default TicketControl;
