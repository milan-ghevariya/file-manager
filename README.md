# File manager
File Manager is a wonderful widget that allows you to manage images and folders, pick images and folders, and do a lot more.

![Preview](https://raw.githubusercontent.com/jaydeepakbari/file-manager/main/uploads/filemanager.png)

## Usage/Examples
```html
<div class="file-upload btn-file">
    <div class="file">
        <img src="https://via.placeholder.com/100x100?text=No%20Image">
    </div>
    <input type="hidden" name="image" value="">
</div>
```

```javascript
$(".btn-file").fileManager({
    callback:function(files,el) {
        if(files.href){
            $(el).find("img").attr("src",files.href)
            $(el).find('input').val(files.path)
        } else {
            $(el).find("img").attr("src","https://via.placeholder.com/100x100?text=No%20Image")
            $(el).find('input').val('')
        }
    }
});
```

## 🛠 Skills
PHP, Javascript, HTML, CSS...

## Features
- Choose single file
- Choose multiple files
- Delete files
- Create multiple files
