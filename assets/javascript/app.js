    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAHNu-VeVOKlmqdLpp-4hzjw06FlRyUseA",
        authDomain: "train-schedule-7c6d0.firebaseapp.com",
        databaseURL: "https://train-schedule-7c6d0.firebaseio.com",
        projectId: "train-schedule-7c6d0",
        storageBucket: "train-schedule-7c6d0.appspot.com",
        messagingSenderId: "895895041601"
    };
    firebase.initializeApp(config);

    // Assign the reference to the database to a variable named 'database'
    var database = firebase.database();

    //Array that stores key value for each row of train data
    var randomKeyArray = [];

    //Flag used when user edits a train info
    var isTrainEdited = false;
    var keyToBeEdited = "";


$(document).ready(function () {


    // set up event listener for form submit to capture our employee data 
    $("#train-form").on("submit", function(event) {
        event.preventDefault();

        //Check to see if user has entered all the fields, if not show an alert to enter all fields
        console.log( $("#trainName-input").val().trim() + " : "+
            $("#destination-input").val().trim() + " : "+
            $("#firstTrainTime-input").val().trim() + " : "+
            $("#frequency-input").val().trim() );


        if( ($("#trainName-input").val().trim() === "")
            || ($("#destination-input").val().trim() === "")
            || ($("#firstTrainTime-input").val().trim() === "")
            || ($("#frequency-input").val().trim() === "")) {

                alert("Kindly enter all the fields!");
                return;
        }


        // gather our form data
        var trainDataInput = {
            trainName: $("#trainName-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            firstTrainTime: $("#firstTrainTime-input").val().trim(),
            frequency: $("#frequency-input").val().trim(),
            objectKey: "" //Initially this key will be empty and will be populated on "database.ref().on("child_added".." event
        };

        console.log("trainDataInput: " + trainDataInput);

        //If user has selected to edit a particular train info then update child info else push row to DB
        if(isTrainEdited === true) {

            firebase.database().ref(keyToBeEdited).set({
                trainName: trainDataInput.trainName,
                destination: trainDataInput.destination,
                firstTrainTime: trainDataInput.firstTrainTime,
                frequency: trainDataInput.frequency
            });

            isTrainEdited = false; //Reset flag
            keyToBeEdited = ""; //Reset value

            deleteTrainInfo(event);
        }
        else {
            //Push data onto firebase DB
            database.ref().push(trainDataInput);
        }

        //Clear input text
        $("#trainName-input").val("");
        $("#destination-input").val("");
        $("#firstTrainTime-input").val("");
        $("#frequency-input").val("");
    });


    //------------------------------------------------------------------------------------------------------

    //Crete a event listener that triggers only when a child is added and populates only data of that new child 
    database.ref().on("child_added", childAddedEvent,        
        // If any errors are experienced, log them to console.
        function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    
    function childAddedEvent(childSnapshot) {

        console.log(childSnapshot.val());

        //Get the Object (Key) of the train and associate it to EditBtn & DeleteBtn id
        var trainKey = childSnapshot.key;
        // console.log("trainKey: " + trainKey);

        //Also set the objects child "objectKey" set to it for further reference
        database.ref(trainKey).child('objectKey').set(trainKey);


        //Get all the objects from DB in 'trainData'
        var trainData = childSnapshot.val();

        //Get first train time and frequency from DB
        var firstTime = trainData.firstTrainTime;
        var tFrequency = trainData.frequency;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log("First Time Converted: " + firstTimeConverted);

        // Get Current Time
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        // console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");
        // console.log("ARRIVAL TIME: " + nextTrain);


        //create a table row
        var $tr = $("<tr>");

        //create <td> for all 5 cols
        //add content from childSnapshot.val() to corresponding <td> tags
        var $tdTrainName = $("<td>").text(trainData.trainName);
        var $tdDestination = $("<td>").text(trainData.destination);
        var $tdFrequency = $("<td>").text(trainData.frequency);
        var $tdMinutesAway = $("<td>").text(tMinutesTillTrain);
        var $tdNextArrival = $("<td>").text(nextTrain);
        
        var $tdEditBtn = $("<td>");
        $tdEditBtn
            .attr("keyData", trainKey)
            .attr("id", "edit")
            .html(`<i class="fas fa-edit"></i>`);


        var $tdRemoveBtn = $("<td>");
        $tdRemoveBtn
            .attr("keyData", trainKey)
            .attr("id", "delete")
            .html(`<i class="far fa-trash-alt"></i>`);

            
        $tr.append($tdTrainName, $tdDestination, $tdFrequency, $tdNextArrival, $tdMinutesAway, $tdEditBtn, $tdRemoveBtn);

        //lastly append entire table you craeted to $("tbody")
        $("tbody").append($tr);


    }


    //------------------------------------------------------------------------------------------------------

    // Set up event listener for Edit button 
    $("tbody").on("click", "#edit" ,function(event) {
        console.log("Edit button clicked");

        var keyVal = $(this).attr("keyData");
        console.log("keyVal: " + keyVal);

        var rootRef = database.ref();
        var dataRef = rootRef.child(`${keyVal}`);

        dataRef.once("value", function(snapshot) {

            snapshot.forEach(function(child) {
                // console.log(child.key+": "+child.val());

                if(child.key === "trainName") {
                    console.log(child.key+" :: "+child.val());
                    $('input[id="trainName-input"]').val(child.val());
                }
                else if(child.key === "destination") {
                    console.log(child.key+" :: "+child.val());
                    $('input[id="destination-input"]').val(child.val());
                }
                else if(child.key === "firstTrainTime") {
                    console.log(child.key+" :: "+child.val());
                    $('input[id="firstTrainTime-input"]').val(child.val());
                }
                else if(child.key === "frequency") {
                    console.log(child.key+" :: "+child.val());
                    $('input[id="frequency-input"]').val(child.val());
                }

            });
        });        

        // deleteTrainInfo(event, keyVal);
        isTrainEdited = true;
        keyToBeEdited = keyVal;
    });


    //------------------------------------------------------------------------------------------------------

    // Set up event listener for Delete button 
    $("tbody").on("click", "#delete" , deleteTrainInfo);

    function deleteTrainInfo(event) {
        console.log("Inside deleteTrainInfo event");

        //Empty tbody data
        $("tbody").empty();

        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal to be deleted: " + keyVal);

        var rootRef = database.ref();
        var dataRef = rootRef.child(`${keyVal}`);

        dataRef.remove()
        .then(function() {
            console.log("Remove succeeded.")
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });


        console.log("------tbody empty--------");

        rootRef = database.ref();
        rootRef.once("value", function(snapshot) {

            console.log(snapshot.val());
            console.log("-------snapshot over-------");

            snapshot.forEach(function(child) { 
                // console.log(child.key+": "+child.val());
                childAddedEvent(child);
            });
            
        });
    }



}); //End of document.ready


