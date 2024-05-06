"use client"; 
import Navbar from "@/components/Navbar";
import { auth, db, app } from "@/firebase-config"; //import database from firebase
import { getDatabase, onValue } from "firebase/database";
import { ref } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword  } from "firebase/auth"; //added signInWithEmailAndPassword
import { useEffect, useState } from "react";
import React from 'react'; //component formatting
import Link from "next/link";



export default function Account() {
    // 1. read user info from firebase
    const [user, setUser] = useState(null); //null type is because we expect the user to be an object
    const [userRequests, setUserRequests] = useState([]); //[] type is because we expect userRequests to be a list
    const db = getDatabase();
    const auth = getAuth();

    //temporary manual login. will remove once login page is built
    signInWithEmailAndPassword(auth, "test2@gmail.com", "123456")
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
    //delete everything above until previous comment

    


    function getUser() {
        //this function first checks if the user is logged in and sets the user to the user object
        onAuthStateChanged(auth, (user) => {
            if (user) {
              //assign user object
              setUser(auth.currentUser)
             
              // ...
            } else {
                //TODO: define logged out logic, idk redirect back to the login page or home page
              console.log("User is signed out");
            }
        });
        
    }

    //define a function where we make a firebase call to retrieve the requests the user has made. the user is represented as customerID
    function getUserRequests(){
        onAuthStateChanged(auth, (user) => {
            if (user) {
              //assign user object
              let response = ref("Requests/");
              if(response == null){
                console.log("No requests found")
              }else{
                // setUserRequests(response); uncomment this line when the ref function is making the right call and pulling based on customerID = uid

                //Dummy data, delete this segment
                setUserRequests([
                    {
                        "RequestDescription": "lorem ipsum",
                        "ScheduleDate": "2020",
                        "Status": "pending"
                    },
                    {
                        "RequestDescription": "lorem ipsum",
                        "ScheduleDate": "2021",
                        "Status": "pending"
                    },
                    {
                        "RequestDescription": "lorem ipsum",
                        "ScheduleDate": "2022",
                        "Status": "pending"
                    }
                ])
              }
              
             
              
            } else {
                //TODO: define logged out logic, idk redirect back to the login page or home page
              console.log("User is signed out");
            }
        });
    }
    //this part of the code actually calls the function we defined to get the user info
    useEffect(() => {
        getUser();
    }, [])

    //this part of the codecalls the function we defined to get the service requests a user has made, the [user] means it waits for the getUser to finish loading
    useEffect(() => {
        getUserRequests();
    }, [user])

   

    

    

    return (
        <div>
            <Navbar />  
            {/* welcome the user*/} {/*the ? prevents the code from breaking if the user object is null (this means the user isnt logged in)*/}
            Welcome back, {user?.username}

            {/* display list of service requests submitted */}
            {/* Make a scrollable component and MAP each object in the userRequests list to the component */}
            
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            {userRequests.map((userRequest, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '5px' }}>
                <p>Description: {userRequest?.RequestDescription}</p>
                <p>Date Scheduled: {userRequest?.ScheduleDate}</p>
                <p>Status: {userRequest?.Status}</p>
                </div>
            ))}
            </div>
            {/* TODO: link service page to this button */}
            <button className="hover:text-custom-primary bg-indigo-600 p-2 rounded" onClick={() => <Link to='/otherpage'/>}>Services</button>
            
        </div>
    );
}