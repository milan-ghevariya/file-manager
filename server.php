<?php 
define('DIR_IMAGE', __DIR__. DIRECTORY_SEPARATOR. 'uploads' . DIRECTORY_SEPARATOR);
define('DIR_URL', 'http://localhost/filemanager/uploads/');
$params = $_POST;

$action = isset($params['action']) ? $params['action'] : 'list';

function delete_files($target) {
    if(is_dir($target)){
        $files = glob($target . '*', GLOB_MARK);

        foreach($files as $file){
            @delete_files($file);      
        }
      
        rmdir( $target );
    } elseif(is_file($target)) {
        unlink( $target );  
    }
}

switch ($action) {
	case 'delete':
		$directories = (isset($params['directories']) && is_array($params['directories'])) ? $params['directories'] : array();

		foreach ($directories as $key => $directory) {
			$directory = rtrim(DIR_IMAGE . str_replace('*', '', $directory), '/');
			@delete_files($directory);
		}

		$data['success'] = 'Deleted successfully';
	break;

	case 'create_folder':
		if (isset($params['directory'])) {
			$directory = rtrim(DIR_IMAGE . str_replace('*', '', $params['directory']), '/');
		} else {
			$directory = DIR_IMAGE;
		}
		
		$folder = basename(html_entity_decode( (isset($params['folder_name']) ? $params['folder_name'] : '') , ENT_QUOTES, 'UTF-8'));

		if ($folder == '') {
			die('folder name required!');
		}

		mkdir($directory . '/' . $folder, 0777);
		chmod($directory . '/' . $folder, 0777);

		@touch($directory . '/' . $folder . '/' . 'index.html');
		$data['success'] = 'Folder created successfully';
	break;
	
	default:
		if (isset($params['directory'])) {
			$directory = rtrim(str_replace('*', '', $params['directory']), DIRECTORY_SEPARATOR);
		} else {
			$directory = '';
		}

		if (isset($params['filter_name'])) {
			$filter_name = rtrim(str_replace(array('*', '/', '\\'), '', $params['filter_name']), DIRECTORY_SEPARATOR);
		} else {
			$filter_name = '';
		}

		if (isset($params['page'])) {
			$page = $params['page'];
		} else {
			$page = 1;
		}

		if (isset($params['backStep']) && $params['backStep'] == 'true' && $directory != DIR_IMAGE) {
			$directory = dirname($directory).DIRECTORY_SEPARATOR;
		}

		$directories = array();
		$files = array();
		$data['images'] = array();

		$directory = preg_replace('/(\\\+)/','\\', (DIR_IMAGE . $directory) );

		if (!is_dir($directory)) {
			$directory = DIR_IMAGE;
		}

		$directories = glob($directory . '/' . $filter_name . '*', GLOB_ONLYDIR);
		if (!$directories) { $directories = array(); }

		$files = glob($directory . '/' . $filter_name . '*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}', GLOB_BRACE);
		if (!$files) { $files = array(); }

		$images = array_merge($directories, $files);
		$image_total = count($images);
		$images = array_splice($images, ($page - 1) * 16, 16);
		
		$data = array(
			'images' => array(),
		);

		foreach ($images as $image) {
			$name = str_split(basename($image), 14);

			if (is_dir($image)) {
				$url = '';

				$data['images'][] = array(
					'name'  => implode(' ', $name),
					'type'  => 'directory',
					'path'  => substr($image, strlen(DIR_IMAGE)),
				);
			} elseif (is_file($image)) {
				$data['images'][] = array(
					'name'  => implode(' ', $name),
					'type'  => 'image',
					'path'  => substr($image, strlen(DIR_IMAGE)),
					'href'  => DIR_URL . substr($image, strlen(DIR_IMAGE))
				);
			}
		}

		$data['dir'] = str_replace(DIR_IMAGE, '', $directory);
	break;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);