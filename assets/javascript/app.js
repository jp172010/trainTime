var config = {
    apiKey: "AIzaSyChoeJQgNqv2RiJc_0cyWLf3h9LQoFXhKI",
    authDomain: "train-schedule-e5f57.firebaseapp.com",
    databaseURL: "https://train-schedule-e5f57.firebaseio.com",
    projectId: "train-schedule-e5f57",
    storageBucket: "train-schedule-e5f57.appspot.com",
    messagingSenderId: "560312009913"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#submit").on("click", function(event){
    event.preventDefault();

    var name = $("#trainForm").val().trim();
    var destination = $("#destinationForm").val().trim();
    var fTrain = moment($("#firstTrainForm").val().trim(), "hh:mm a").format("X");
    var frequency = $("#frequencyForm").val().trim();
    var fTrainMin = moment().diff(moment(fTrain, "X"), "minutes");
    console.log(fTrainMin)
    if(fTrainMin < 0){
        fTrainMin = fTrainMin * -1;
    }else{
        fTrainMin = (fTrainMin * -1) + 1440;
    };
    var minAway = fTrainMin;

    var newTrain = {
        name: name,
        destination: destination,
        fTrain: fTrain, 
        frequency: frequency,
        fTrainMin: fTrainMin,
        minAway: minAway
      };
      database.ref().push(newTrain);
});

database.ref().on("child_added",function(childSnapshot){
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var minAway = childSnapshot.val().minAway;
    var nextTrain = moment().add(minAway, "minutes").format("LLL");

    

    function createTrain(){
        return `
        <tr>
            <th scope="row">${name}</th>
            <td>${destination}</td>
            <td>${nextTrain}</td>
            <td>${minAway}</td>
        </tr>    
        `
    };
    $("tbody").append(createTrain());

    $("#trainForm").val("");
    $("#destinationForm").val("");
    $("#firstTrainForm").val("");
    $("#frequencyForm").val("");
});

// database.ref().on("value", function(snapshot){
//     var minAway = snapshot.val().minAway;
//     var nextTrain = moment().add(minAway, "minutes").format("hh:mm:ss");

// });