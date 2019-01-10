$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDZvvOQ5f1McJ8CtSZH6gaPEX_3Y_ShTa0",
    authDomain: "class-work-544f2.firebaseapp.com",
    databaseURL: "https://class-work-544f2.firebaseio.com",
    projectId: "class-work-544f2",
    storageBucket: "class-work-544f2.appspot.com",
    messagingSenderId: "34860343912"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Store values submitted from form
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();

    var trainData = {
      trainName: $("#name-input").val().trim(),
      destination: $("#destination-input").val().trim(),
      firstArrival: $("#first-arrival-input").val(),
      frequency: parseInt($("#frequency-input").val())
    };

    // add train data to firebase
    database.ref("Train Information").push(trainData);
  
    // Clear input fields after data is submitted
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-arrival-input").val("");
    $("#frequency-input").val("");

    //convert first train arrival into hours and minutes (1 year subtracted such that its before current time) 
    trainData.firstArrival = moment(trainData.firstArrival, "HH:mm").subtract(1, "years")
  });

  // add child added listener everytime new information is entered
  database.ref("Train Information").on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstArrival = childSnapshot.val().firstArrival;
    var frequency = childSnapshot.val().frequency;

    //calculate next train arrival time and minutes until train arrives
    firstArrivalFormatted = moment(firstArrival, "X").format("MM/DD/YYYY");

    timeDifferance = moment().diff(moment(firstArrivalFormatted), "minutes");

    timeAway = timeDifferance % frequency;

    minUntilArrival = frequency - timeAway;

    nextTrainArrival = moment().add(minUntilArrival, "minutes")

    nextTrainArrivalConv = moment(nextTrainArrival).format("HH:mm")

    // create a table row for train information
    var $tr = $("<tr>");
    $tr
      .append(`<td>${trainName}</td>`)
      .append(`<td>${destination}</td>`)
      .append(`<td>${frequency}</td>`)
      .append(`<td>${nextTrainArrivalConv}</td>`)
      .append(`<td>${minUntilArrival}</td>`)

      //add train information to table
      $("tbody#train-info").append($tr)
  });
});