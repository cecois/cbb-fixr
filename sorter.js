const __ = require('underscore')
	, FS = require('fs');
FS.readFile('./static/missings-mbta.json', (e, d) => {
	if (e) console.log(e);
	const J = JSON.parse(d);
	let so = __.sortBy(
		__.sortBy(J, "episode")
		, (o) => {
			return o.carto.cartodb_id
		}).reverse();
	console.log(JSON.stringify(so));
});