var queryDict = {};
location.search
	.substr(1)
	.split('&')
	.forEach(function(item) {
		queryDict[item.split('=')[0]] = item.split('=')[1];
	});
var private_key = '31a80ecbc5764eb78790cc1fb9748722899ca15966d747b08c5edcc4529e647d';

if (queryDict.id) {
	fetch('https://xivapi.com/character/' + queryDict.id + '?private_key=' + private_key, { mode: 'cors' })
		.then(response => response.json())
		.then(data => {
			console.log(data);
			var char = data.Character;
			document.getElementById('char-pic').setAttribute('src', char.Avatar);
			var battleLevel = 0;
			var merchantLevel = 0;
			var promises = [];
			Object.values(data.Character.ClassJobs).forEach(function(classObj) {
				promises.push(
					fetch('https://xivapi.com/ClassJob/' + classObj.ClassID)
						.then(response => response.json())
						.then(data2 => {
							if (data2.Role === 0) {
								merchantLevel += classObj.Level;
							} else {
								battleLevel += classObj.Level;
							}
							return Promise.resolve();
						})
				);
			});

			Promise.all(promises).then(() => {
				document.getElementById('battle-level').innerHTML = battleLevel;
				document.getElementById('merchant-level').innerHTML = merchantLevel;
			});
		});
}
