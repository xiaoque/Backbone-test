<?php
require 'tmhOAuth.php'; // Get it from: https://github.com/themattharris/tmhOAuth
 
// Use the data from http://dev.twitter.com/apps to fill out this info
// notice the slight name difference in the last two items)
 
$connection = new tmhOAuth(array(
  'consumer_key' => 'iAj7zZLkJvhoSLHn902ZsNWk5',
	'consumer_secret' => 'sTwpQ2kKvmfY5cZcUTOiVm4LdED6siMTQ58jROuWzpblRT0ocU',
	'user_token' => '577051401-f3MSYPW2iTxI6Ah8ZBKQ1qR8vntJtSpfL6TAEnBj', //access token
	'user_secret' => 'zZfJOcEAM4KDlLbwvxpUYMvjMaGYUaniMIMXQTOzmwIe3' //access token secret
));
 
// set up parameters to pass
$parameters = array();
 
if ($_GET['count']) {
	$parameters['count'] = strip_tags($_GET['count']);
}
 
if ($_GET['screen_name']) {
	$parameters['screen_name'] = strip_tags($_GET['screen_name']);
}
 
if ($_GET['twitter_path']) { $twitter_path = $_GET['twitter_path']; }  else {
	$twitter_path = '1.1/statuses/user_timeline.json';
}
 
$http_code = $connection->request('GET', $connection->url($twitter_path), $parameters );
 
if ($http_code === 200) { // if everything's good
	$response = strip_tags($connection->response['response']);
 
	if ($_GET['callback']) { // if we ask for a jsonp callback function
		echo $_GET['callback'],'(', $response,');';
	} else {
		echo $response;	
	}
} else {
	echo "Error ID: ",$http_code, "<br>\n";
	echo "Error: ",$connection->response['error'], "<br>\n";
}
