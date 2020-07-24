<?php
function scan($dir) {
	$scan = scandir($dir);
	$scan = array_diff($scan,['.','..']);
	$scan = array_flip($scan);
	foreach ($scan as $key => &$value) {
		if (is_dir("$dir/$key")) {
			$value = scan("$dir/$key");
		} else {
			$value = false;
		}
	}
	return $scan;
}
echo json_encode(scan($_SERVER['DOCUMENT_ROOT'].'/resources'));
?>