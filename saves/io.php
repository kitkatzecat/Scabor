<?php
if ($_GET['d'] == 'list') {

} else if ($_GET['d'] == 'read') {
	$name = preg_replace("[^a-zA-Z0-9\_\-]",'',base64_decode($_GET['file'])).'.sav';
	if (file_exists($name)) {
		echo file_get_contents($name);
	} else {
		http_response_code(404);
	}
} else if ($_GET['d'] == 'write') {
	$name = preg_replace("[^a-zA-Z0-9\_\-]",'',base64_decode($_GET['file'])).'.sav';
	echo file_put_contents($name,$_POST['contents']);
} else {
	http_response_code(400);
}
?>