$.fn.fileManager = function(options) {
    var settings = $.extend({
        api: "server.php",
    }, options );

    var container_class = "file-chooser-" + Date.now();
    settings.container = "." + container_class;

    $('body').append(`<div class="file-chooser ${container_class}">
        <div class="files-tools">
            <button class="btn-filemanager btn-back">Back</button>
            <button class="btn-filemanager btn-folder">New Folder</button>
            <button class="btn-filemanager btn-delete">Delete</button>
        </div>
        <div class="delete-warning">
            <div>Choose files</div>
            <div><button class="btn-filemanager btn-delete-confirm">Delete</button> <button class="btn-filemanager btn-delete-remove">Cancel</button></div>
        </div>
        <div class="empty">No any images.</div>
        <div class="files"><ul></ul></div>
    </div>`);

    var last_directory;
    function show() { 
        $(settings.container).show(); 
        $(settings.container).before(`<div class='file-chooser-backdrop'></div>`); 
    }

    function hide() { 
        $(`.file-chooser-backdrop`).remove(); 
        $(settings.container).hide(); 
    }

    function showDelete() {
        $(settings.container).find('.file-chooser-checkbox').fadeIn(100);
        $(settings.container).find('.delete-warning').css('display','flex');
    }

    function hideDelete() {
        $(settings.container).find('.file-chooser-checkbox').fadeOut(100);
        $(settings.container).find('.delete-warning').css('display','none');
    }

    function hideBack(dir) {
        $(settings.container).find('.btn-back').hide();
        if(dir != '/' && dir != ''){
            $(settings.container).find('.btn-back').show();
        }
    }

    $(document).delegate('.file-chooser-backdrop','click',hide)

    return this.each(function(index,el) {
        var el = $(el);

        function loadPage(data) {
            show()
            hideDelete();

            last_directory = data.directory;

            $(settings.container).find('.btn-back').hide();
            if(last_directory != '/' && last_directory != ''){
                $(settings.container).find('.btn-back').show();
            }
            
            hideBack(last_directory)

            $.ajax({
                url: settings.api,
                type:'POST',
                dataType:'json',
                data:data,
                beforeSend:function(){el.prop("disabled",true);},
                complete:function(){el.prop("disabled",false);},
                success:function(json){
                    $(settings.container).find('ul').html('');
                    last_directory = json.dir;

                    hideBack(last_directory)

                    $.each(json.images,function(index,image){
                        var li = document.createElement('li');
                        if(image.type == "directory"){
                            li.innerHTML = `
                                <div class='thumb'>
                                    <div class="file-chooser-icon"><img src="src/images/folder.png"></div>
                                    <div class="file-chooser-name">${image.name}</div>
                                </div>
                                <label class="file-chooser-checkbox"><input type='checkbox' name='delete[]' value='${image.path}'></label>
                            `;
                        } else {
                            li.innerHTML = `
                                <div class='thumb'>
                                    <div class="file-chooser-image"><img src="${image.href}"></div>
                                    <div class="file-chooser-name"><div>${image.name}</div></div>
                                </div>
                                <label class="file-chooser-checkbox"><input type='checkbox' name='delete[]' value='${image.path}'></label>
                            `;
                        }
                        
                        li.getElementsByClassName('thumb')[0].addEventListener('click', function(e){
                            if(image.type == "directory"){
                                loadPage({
                                    directory: image.path,
                                    action: 'list',
                                });
                            } else {
                                if(typeof settings.callback == 'function'){
                                    settings.callback(image,el)
                                }
                                hide()
                            }
                        })

                        $(settings.container).find('ul')[0].appendChild(li);
                    })

                    $(settings.container).find('.empty').hide();
                    if(json.images.length == 0){
                        $(settings.container).find('.empty').show();
                    }
                },
            })
        }

        el.click(function(){
            $this = $(this);
            loadPage({
                directory:'/',
                action: 'list',
            });
        })

        

        $(settings.container).find('.btn-delete-confirm').click(function() {
            if(confirm("Are you sure to delete?")){
                $.ajax({
                    url: settings.api,
                    type:'POST',
                    dataType:'json',
                    data:{
                        directories: $(settings.container).find("input[name^=delete]:checked").map(function(){ return $(this).val() }).toArray(),
                        action: 'delete',
                    },
                    beforeSend:function(){$this.prop("disabled",true);},
                    complete:function(){$this.prop("disabled",false);},
                    success:function(json){
                        if(json.success){
                            hideDelete();
                            loadPage({
                                directory: last_directory,
                                action: 'list',
                            });
                        }
                    },
                })
            }
        });

        $(settings.container).find('.btn-folder').click(function() {
            $this = $(this);

            var folder_name = prompt("Please enter folder name");
            if(folder_name){
                $.ajax({
                    url: settings.api,
                    type:'POST',
                    dataType:'json',
                    data:{
                        directory: last_directory,
                        folder_name: folder_name,
                        action: 'create_folder',
                    },
                    beforeSend:function(){$this.prop("disabled",true);},
                    complete:function(){$this.prop("disabled",false);},
                    success:function(json){
                        if(json.success){
                            hideDelete();
                            loadPage({
                                directory: last_directory,
                                action: 'list',
                            });
                        }
                    },
                })
            }
        })

        $(settings.container).find('.btn-delete').click(showDelete)
        $(settings.container).find('.btn-delete-remove').click(hideDelete)
        $(settings.container).find('.btn-back').click(function(){
            loadPage({
                directory: last_directory,
                backStep: true,
                action: 'list',
            });
        })
    });
};