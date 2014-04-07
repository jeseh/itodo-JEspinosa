$(function(){
    
    $data.Entity.extend('$todo.Types.ToDoEntry', {
        Id: { type: 'int', key: true, computed: true },
        Value: { type: 'string' },
        CreatedAt: { type: 'datetime' },
        Done: { type: 'bool' }
    });
    
    $data.EntityContext.extend('$todo.Types.ToDoContext', {
        TodoEntries: { type: $data.EntitySet, elementType: $todo.Types.ToDoEntry }
    });
    
    $todo.context = new $todo.Types.ToDoContext({ name: 'webSql', databaseName: 'todo' });
    $todo.context.onReady({
        success: updateView,
        error: function () {
            $todo.context = null;
            updateView();
        }
    });
    
    $('#btnAdd').click(function () {
        var value = $('#txtNew').val();
        if (!value) return;
        var now = new Date();
        var entity = new $todo.Types.ToDoEntry({ Value: value, CreatedAt: now});
        $todo.context.TodoEntries.add(entity);
        $todo.context.saveChanges(updateView);
        $('#txtNew').val('');
    });
    
});

function updateView() {
    if ($todo.context) {
        $todo.context.TodoEntries.toArray(function (items) {
            $('#listatareas').empty();
            items.forEach(function (entity) {
                $('<input type="checkbox" id="' + entity.Id + '" onchange="eliminartarea(' + entity.Id + ')" />').appendTo('#listatareas');
                $('<label for="' + entity.Id + '">' + entity.Value + '</label>').appendTo('#listatareas');
            });
            $('#listatareas').trigger('create');
        });
    }
}

function eliminartarea(id) {
    var entry = new $todo.Types.ToDoEntry({ Id: id });
    $todo.context.TodoEntries.remove(entry);
    $todo.context.saveChanges(updateView);
}