// Initialize Firebase
let config = {
  apiKey: "AIzaSyCKSZ81yCPIE7Tn6PUZ6X93zgKThn5TmIs",
  authDomain: "cogentec-personal.firebaseapp.com",
  databaseURL: "https://cogentec-personal.firebaseio.com",
  projectId: "cogentec-personal",
  storageBucket: "cogentec-personal.appspot.com",
  messagingSenderId: "1080785279411"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore();

let baseDocument = db.collection("/personal-manager").doc('timesheet');

$('#select-date').on('change', function () {
  let timesheetdata = [];

  let operations = baseDocument
    .get().then(
      function (doc) {
        let date = $('#select-date').val();
        let timesheetdata = doc.data()[date];
        if (timesheetdata !== undefined) {
          let source = document.getElementById("timesheetdatatemplate").innerHTML;
          let template = Handlebars.compile(source);
          let html = template(timesheetdata);
          $('#timesheetdata').html(html);

          // $('.updateTimeSheet').on('click', function () {
          //   cur = {};
          //   let row = $(this).closest('tr');
          //   let id = row.attr('id');
          //   cur['Date'] = date;
          //   row.find("td").each(function (i, v) {
          //     if( i < 5 )
          //     cur[heads[i]] = $(this).text().trim();
          //   });
          //   baseCollection.doc(id).set(cur).then(function () {
          //     console.log("Document successfully written!");
          //   });
          // });

          // $('.deleteTimeSheet').on('click', function () {
          //   cur = {};
          //   let row = $(this).closest('tr');
          //   let id = row.attr('id');

          //   baseCollection.doc(id).delete().then(function () {
          //     $('#select-date').trigger('change');
          //   });
          // });
        }
        else {
          timesheetTable.clear().draw();
        }
    });
    
});


let timesheetTable = $('#timesheettable').DataTable({
  'searching': false,
  'ordering': false,
  'paging': false,
  'lengthChange': false,
  'bInfo': false,
  'oLanguage': {
    'sEmptyTable': "<center><b>No Data to display</b></center>"
  }
});

let $input = $('.datepicker').pickadate({
  // Escape any “rule” characters with an exclamation mark (!).
  format: 'd/m/yyyy',
  formatSubmit: 'd/m/yyyy'
});

let picker = $input.pickadate('picker');

$input.pickadate("picker").set("select", (new Date()).valueOf());

picker.on({
  close: function () {
    $(document.activeElement).blur();
  },
});

let heads = ["Task", "Status", "Comments", "Application", "Time_Hrs"];

$('#addTimesheet').on('click',function(){
  let date = $('#select-date').val();
  baseCollection.add({Date: date}).then(function(doc){
    console.log(doc.id);
    $('#select-date').trigger('change');
  });
});