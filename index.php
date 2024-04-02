<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<link rel="stylesheet" type="text/css" href="src/style.css?v=<?= time() ?>">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
</head>
<body>
	<div class="file-upload btn-file">
	  	<div class="file">
	  		<img src="https://via.placeholder.com/100x100?text=No%20Image">
	  	</div>
	  	<input type="hidden" name="image" value="">
	</div>

	<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
	<script type="text/javascript" src="src/script.js?v=<?= time() ?>"></script>
	<script type="text/javascript">
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
	</script>
</body>
</html>