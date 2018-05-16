// Initialize Firebase
var config = {
  apiKey: "AIzaSyCgcApoA4vkVQDDjRcvPDDoGwcqMCAQy7Q",
  authDomain: "personal-manager-kit.firebaseapp.com",
  databaseURL: "https://personal-manager-kit.firebaseio.com",
  projectId: "personal-manager-kit",
  storageBucket: "personal-manager-kit.appspot.com",
  messagingSenderId: "576745055845"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore();

let baseCollection = db.collection("/personal-manager/timesheet/dailydata");



$('#select-date').on('change', function () {
  let timesheetdata = [];
  let date = $('#select-date').val();
  let operations = baseCollection
    .doc(date)
    .get().then(
      function (doc) {
        let data = doc.data();
        if(data !== undefined){
          let timesheetdata = doc.data()['tasks'];
          if (timesheetdata !== undefined) {
            let source = document.getElementById("timesheetdatatemplate").innerHTML;
            let template = Handlebars.compile(source);
            let html = template(timesheetdata);
            $('#timesheetdata').html(html);
           
            $('.mdb-select').material_select('destroy');
            $('.mdb-select').material_select();        
  
            $('.deleteTimeSheet').on('click', deleteTimeSheet);
          }
          else {
            timesheetTable.clear().draw();
          }
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

  $('.mdb-select').material_select('destroy');
  $('.mdb-select').material_select();

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
  let heads = ['Task', 'Status', 'Comments', 'Application', 'Time_Hrs'];
  $('#timesheetdata tr').each(function (index, value) {
    let cur = {};
    let row = value.getElementsByTagName('td');

    if ($('#timesheetdata').text().trim() !== "No Data to display") {
      data['tasks'] = [];
      for (let i = 0; i < row.length; i++) {
        if(i === 1 || i === 3){
          let data = $(this).find('select').val();
          cur[heads[i]] = data;
        }
        else if (i < 5) {
          let data = row[i].innerText.trim();
          if (data !== "")
            cur[heads[i]] = data;
        }
      }
      data['tasks'].push(cur);
    } else {
      data['tasks'] = firebase.firestore.FieldValue.delete();
    }

  });
  baseCollection.doc(date).update(data);
});

Handlebars.registerHelper('compare',function(a,b){
  if(a === b)
  return "selected";
})