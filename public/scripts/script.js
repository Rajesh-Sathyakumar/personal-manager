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

          $('.deleteTimeSheet').on('click', deleteTimeSheet);
        }
        else {
          timesheetTable.clear().draw();
        }
      });

});

let $input = $('.datepicker').pickadate({
  // Escape any “rule” characters with an exclamation mark (!).
  format: 'd-m-yyyy',
  formatSubmit: 'd-m-yyyy'
});

let picker = $input.pickadate('picker');

$input.pickadate("picker").set("select", (new Date()).valueOf());

picker.on({
  close: function () {
    $(document.activeElement).blur();
  },
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


let heads = ["Task", "Status", "Comments", "Application", "Time_Hrs"];

$('#addTimesheet').on('click', function () {
  let source = document.getElementById("timesheetdatatemplate").innerHTML;
  let template = Handlebars.compile(source);
  let html = template([{}]);
  if ($('#timesheetdata').text().trim() === "No Data to display") {
    $('#timesheetdata').html(html);
  }
  else {
    $('#timesheetdata').append(html);
  }

  $('.deleteTimeSheet').on('click', deleteTimeSheet);

});

function deleteTimeSheet() {
  let row = $(this).closest('tr');
  row.remove();
  if ($('#timesheetdata').text().trim() === "") {
    timesheetTable.clear().draw();
  }
}

$('#saveTimeSheet').on('click', function () {
  let date = $('#select-date').val();
  let data = {};
  let heads = ['Task', 'Status',	'Comments',	'Application',	'Time_Hrs'];
  $('#timesheetdata tr').each(function(index,value){
    let cur = {};
    let row = value.getElementsByTagName('td');
   
    if($('#timesheetdata').text().trim() !== "No Data to display"){
      data[date] = [];
      for(let i=0; i< row.length; i++){
        if(i < 5){
          let data = row[i].innerText.trim();
          if(data !== "")
          cur[heads[i]] = data;
        }
      }
      data[date].push(cur);
    }else{
      data[date] = firebase.firestore.FieldValue.delete();
    }
  });

  baseDocument.update(data);
});