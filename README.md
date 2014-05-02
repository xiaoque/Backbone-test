##Report
***
This is a simple web site used BackBoneJS and PHP that can fetch tweets of a certain person and edit them. All the tweets are stored in local storage and can sort them through drag.

###Usage

For the first time using it, put all files into localhost folder (PHP), and change the url in line 29 in app.js, through changing the parameter ("scree_name") in the url can fetch defferent person's tweet, and the parameter ("70") is the number of the latest tweets to fetch. After fetching the tweets, all tweets are stored in local storage named "tweetList".

And once all the tweets are stored in local storage, by delete the annotations in line 27 in app.js

```
localStorage: new Backbone.LocalStorage("tweetList"),
```

and line 147~151 in app.js. 

```
this.collection.fetch({
	success: function(){
		collec.reOrder();
	}
});
```

and annotate code in line 29~38 in app.js

```
url: 'http://localhost:8888/video/test/tweetOAuth/tweets_json.php?count=10&screen_name=fhollande',

parse: function(response){
	return _.map(response, function(obj) {
		var str = obj.text;
		obj = new Object();
		obj.text = str;
		return obj;
	});
    return response;
},
```

and line 153~158 in app.js

```
this.collection.fetch({
	success: function(collection,response){
		collection.localStorage = new Backbone.LocalStorage("tweetList");
		collection.reOrder();
		}
});
```

This is mainly because if I defind localstorage before url, the fetch function will fetch localhost instead of the url and lead to return null. I tried [Backbone collection from Json file and cache on localstorage](http://stackoverflow.com/questions/14071203/backbone-collection-from-json-file-and-cache-on-localstorage) this solution, but it doesn't work, and I think it's mainly because I don't understand the operating mechanism of those functions.

###Explanation
There is a PHP folder in the project, it's because Twitter has upgrage its API, so that all the request through API1.1 will need a authentication, so I searched a lot of documents then find this can work. the file "tmhOAuth.php" is from an OAuth library from [themattharris/tmhOAuth](https://github.com/themattharris/tmhOAuth) and the file "tweets_json.php" is from [planetoftheweb / tweets_json.php](https://gist.github.com/planetoftheweb/5914179), he also upload a video to explain this [Getting a list of tweets with the new Twitter REST API v1.1](https://www.youtube.com/watch?v=GQaPt-gQVRI)

