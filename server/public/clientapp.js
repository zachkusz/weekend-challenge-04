$(document).ready(function(){
  getTasks();
  //even listeners//
  $('form').on('click', '#create-task', function(event){
    event.preventDefault();
    //puts entered data into an object, sends it along in  a post request
    postTask(createTaskObject());
    $('input').val('');
  });

  $('#tasks-container').on('click', '.delete', deleteTask);

  $('#tasks-container').on('click', '#completed', updateTask);

  // AJAX FUNCTIONS//
  function updateTask(){
    var thisTask = {};
    thisTask.id = $(this).parent().parent().data('id');
    thisTask.complete = $(this).parent().parent().data('complete');
    console.log(thisTask);

    //to switch the sendStatus
    if (thisTask.complete == true){
      thisTask.complete = false;
      console.log('changed completed from true to false');
    } else {
      thisTask.complete = true;
      console.log('changed completed from false to true');
    }

    $.ajax ({
       type: 'PUT',
       url: '/tasks',
       data: thisTask,
       success: function (res) {
         console.log(res);
         getTasks();
       }
     });

  }

  function deleteTask(){
    var check = confirm('Are you sure you want to delete this task? ' +
      'You can also leave the task here as completed so you can look back ' +
      'at all you\'ve got done!');

    if (check){
      var deletedTask = $(this).parent().parent().data('id');

      $.ajax ({
          type: 'DELETE',
          url: '/tasks/' + deletedTask,
          success: function (data) {
            getTasks();
          }
        });

      $(this).parent().parent().remove(); //removes it from dom on delete
    }

  }

  function postTask(task) {
    $.ajax ({
      type: 'POST',
      data: task,
      url: '/tasks',
      success: function (res) {
        console.log(res);
        getTasks();
      }
    });
  } //end of postTask

  function getTasks(){
    $.ajax ({
      type: 'GET',
      url: '/tasks',
      success: function (res) {
        appendTasksList(res);
      }
    });
  }//end of getTaasks

  //other functions//
  function appendTasksList(res){
    $('#tasks-container').empty();
    $('#tasks-container').append('<tr>' +
          '<th>' + ' ' + '</th>' +
          '<th>' + 'Description' + '</th>' +
          '<th>' + 'Status' + '</th>' +
          '<th>' + 'Remove' + '</th>' +
          '</tr>');

    res.forEach(function(row) {
      var status = '';
      //activates checkbox if complete is true
      if (row.complete == true){
        status = ' checked="checked" ';
        console.log('status changed to true, checkbox xhecked');
      }

      var $el = $('<tr>' +
        '<td class ="static">' + 'Task:   ' + '</td>' +
        '<td class="description">' + row.description + '</td>' +
        '<td class="check">' + '<input type="checkbox" id="completed" name="completed"' + status + ' />' + '</td>' +
        '<td class="static">' + '<button class="delete">Delete</button>' + '</td>' +
        '</tr>');
        $el.data('id', row.id);
        $el.data('complete', row.complete);

      $('#tasks-container').append($el);
    });
  }

  function createTaskObject(){
    var task = {};
    $.each($('input').serializeArray(), function(i, field) {
      task[field.name] = field.value;
    });
    task.complete = false;
    console.log(task);
    return task;
  }

}); //end of document.ready
