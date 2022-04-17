// put Your SDK setup and configuration here (CDN version)
// =======================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3W0TynIaNGbc5pHvyGt_5H5ffzfbw1cE",
    authDomain: "planner-db-7c75a.firebaseapp.com",
    projectId: "planner-db-7c75a",
    storageBucket: "planner-db-7c75a.appspot.com",
    messagingSenderId: "649014743586",
    appId: "1:649014743586:web:6bcfce98705e85ca9a707b"
  };
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
    where,
    query,
} from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js';

// ======================================================= //

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const subjectRef = collection(db, 'subjects');

// global
var CourseWeeklyGlobal = 1;


async function checkDataBase(){
    console.log('CheckDatabase');
    const items = await getDocs(subjectRef)
    //console.log(items);
    if(items){
        const subject = items.docs.map((item) => ({
            ...item.data(),
        }));

        console.log(subject);
    }
}
async function search(){
    console.log('search');
    const searchName = document.getElementById('searchSubjectName').value
    const searchID = document.getElementById('searchSubjectID').value
    console.log(searchName + ' ' + searchID);
    /*
    if(!searchName || !searchID){ // Catch Error
        alert('Pls fill before submit your search')
        console.log('searchFail');
    }
    */
    const foundIDref = query(subjectRef, where('subjectID', '==', `${searchID}`));
    const queryID = await getDocs(foundIDref)
    const searchList = [] // array of data array - 2D array
    if(queryID){
        const queryMap = queryID.docs.map(item=>({
            ...item.data()
        }))
        if(queryMap.length==0) {
            console.log('Not found');
            alert('Not found')
        } else {
            searchList.push(queryMap)
        }
    }
    const searchBox = document.getElementById('searchList')
    searchBox.innerHTML = '' // clear
    //console.log(searchList);
    
    searchList.forEach(subjectData => {
        console.log(subjectData);
        const searchCard = document.createElement('div')
        searchCard.className = 'searchCard'
        searchCard.id = 'card'+subjectData[0].subjectID
        const nameDisplay = document.createElement('h1')
        nameDisplay.innerHTML = subjectData[0].subjectName
        const idDisplay = document.createElement('p')
        idDisplay.innerHTML = subjectData[0].subjectID
        searchCard.append(nameDisplay,idDisplay)
        searchBox.appendChild(searchCard)
    });
}   
function timeAdd(){
    console.log('change');
    const courseWeeklySelect = document.getElementById('courseCnt')
    const courseWeekly = courseWeeklySelect.options[courseWeeklySelect.selectedIndex].value;
    CourseWeeklyGlobal = courseWeekly // Set global
    
    const timeDiv = document.getElementById('timeDetail')
    timeDiv.innerHTML = '' //clear

    for (let index = 1; index <= courseWeekly; index++) {
        const eachInfo = document.createElement('div')
        
        const order = document.createElement('span')
        order.innerHTML = index + " : "
        const day = document.createElement('label');
        day.innerHTML = 'day'
        const timeStart = document.createElement('label');
        timeStart.innerHTML = 'timeStart'
        const timeEnd = document.createElement('label');
        timeEnd.innerHTML = 'timeEnd'
        const dayInput = document.createElement('input');
        const startInput = document.createElement('input');
        const endInput = document.createElement('input');

        // binding ID
        dayInput.id = 'dayInput' +  index
        startInput.id = 'startInput' +  index
        endInput.id = 'endInput' +  index

        eachInfo.append(order,day,dayInput,timeStart,startInput,timeEnd,endInput)
        timeDiv.appendChild(eachInfo)
    }
}
function addItem(){
    console.log("Add Item");

    // fetch 
    const subjectName = document.getElementById('subjectName').value
    const subjectID = document.getElementById('subjectID').value
    const section = document.getElementById('section').value
    const instructorName = document.getElementById('instructorName').value
    const classroom = document.getElementById('classroom').value
    
    const timeMap = {}
    for (let index = 1; index <= CourseWeeklyGlobal; index++) {
        var dayInput = document.getElementById(`dayInput${index}`).value
        var startInput = document.getElementById(`startInput${index}`).value
        var endInput = document.getElementById(`endInput${index}`).value

        timeMap[dayInput]={start:startInput,end:endInput}        
    }

    //console.log(timeMap);
    if(classroom && instructorName && section && subjectID && subjectName && timeMap){
        addDoc(subjectRef,{
            classroom,
            instructorName,
            section,
            subjectID,
            subjectName,
            timeMap
        })
        console.log("Add successfully");
    } else {
        alert("Please fill all content below before submit your data")
        console.log("Fail");
    }
}
function tableGenerator(){
    const tableContainer = document.getElementById('tableTest')
    const table = document.createElement('table')
    // ----------- head --------------// 
    const headRow = document.createElement('tr')
    const headDayTime = document.createElement('th')
    headDayTime.innerHTML = 'Day/Time'
    headRow.appendChild(headDayTime)
    for(let idx=8;idx<=16;idx++){
        const headCol = document.createElement('th')
        headCol.id = 'headCol'+idx
        headCol.innerHTML = idx
        headRow.appendChild(headCol)
    }
    table.append(headRow)
    // ----------- content row --------------// 
    const day = ['MON','TUE','WED','THU','FRI']
    for(let idx=0;idx<5;idx++){
        const contentRow = document.createElement('tr')
        var thisDay = day[idx]
        const dayCol = document.createElement('td')
        dayCol.innerHTML = thisDay
        contentRow.appendChild(dayCol)
        table.appendChild(contentRow)
        for(let idx=0;idx<9;idx++){
            const contentCol = document.createElement('td')
            contentCol.innerHTML=''
            contentRow.appendChild(contentCol)
        }
    }
    tableContainer.appendChild(table)
}
/*
async function updateItem() {
    console.log('updateItem');

    const docId = document.getElementById('docId').value;

    const bookRef = await doc(db, `books/${docId}`);
    let bookInstance = await getDoc(bookRef);
    bookInstance = bookInstance.data();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    const bookData = {
        title: title ? title : bookInstance.title,
        author: author ? author : bookInstance.author,
        isbn: isbn ? isbn : bookInstance.isbn,
    };

    console.log(bookData);

    updateDoc(bookRef, bookData)
        .then(function () {
            console.log('success');
        })
        .catch(function (error) {
            console.log('failed', error);
        });
}

async function deleteItem() {
    console.log('deleteItem');

    const docId = document.getElementById('docId').value;
    const docRef = doc(db, `books/${docId}`);

    await deleteDoc(docRef);
}
*/

// Binding Func with btn
document.getElementById('test').addEventListener('click',checkDataBase)
document.getElementById('courseCnt').addEventListener('change',timeAdd)
document.getElementById('addItemBtn').addEventListener('click',addItem)
document.getElementById('searchBtn').addEventListener('click',search)
// Starting Func when starting up website
timeAdd()
tableGenerator()