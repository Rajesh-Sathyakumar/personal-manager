  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCKSZ81yCPIE7Tn6PUZ6X93zgKThn5TmIs",
    authDomain: "cogentec-personal.firebaseapp.com",
    databaseURL: "https://cogentec-personal.firebaseio.com",
    projectId: "cogentec-personal",
    storageBucket: "cogentec-personal.appspot.com",
    messagingSenderId: "1080785279411"
  };
  firebase.initializeApp(config);

  // Initialize Cloud Firestore through Firebase
  var db = firebase.firestore();

  $('#select-date').on('change',function(){
    var timesheetdata = [];

    var collection = db.collection("/personal-manager/timesheet/timesheetdata/")
    .where("Date","==",this.value).orderBy("Id")
    .get().then(
      function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            timesheetdata.push( Object.assign(doc.data(), { 'Key': doc.id }) );
        });
      }
    ).then(
      function(){
        var source   = document.getElementById("timesheetdatatemplate").innerHTML;
        var template = Handlebars.compile(source);
        var html    = template(timesheetdata);
      
        $('#timesheetdata').html(html);
      }
    );
  });

  $('.datepicker').pickadate({
    // Escape any “rule” characters with an exclamation mark (!).
    format: 'd/m/yyyy',
    formatSubmit: 'd/m/yyyy'
  });

  $('#select-date').pickadate("picker").set("select", (new Date()).valueOf());


