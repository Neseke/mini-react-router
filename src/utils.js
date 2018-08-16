/**
 * Parses the data we get from the google sheets api.
 * Inititally, the data has the following form:
 * [
 *	[ "reportName", "uri", "iframe" ],
 * 	[ "Lagadère", "lgd", "<iframe ... />" ],
 *	...
 * ]
 * This form is then parsed to an array of objects. These objects have the properties
 * [ "reportName", "uri", "iframe" ].
 * @param { Array<Array<String>> } csv - The data from the google sheets api (in a csv-like form)
 * @returns { Array<Object> } - The parsed data (in JSON format)
 */
function parseToJSON(csv) {
	const props = csv[0]; // first row contains the header names (= properties)
	const data = csv.slice(1); // following rows contain the data

	return data.reduce((acc, dataArr) => {
		const set = props.reduce((scndAcc, prop, i) => {
			scndAcc[prop] = dataArr[i];
			return scndAcc;
		}, {});
		acc = [...acc, set];
		return acc;
	}, []);
}

/**
 * Loads the reports listed on the google sheet:
 * https://docs.google.com/spreadsheets/d/1ud2HaVa5_WoZHWWgGsNe2CUOhwSQ2yERcdCuO5J7n9k
 * @callback callback - The callback that is called on success.
 * @callback errorCallback - The callback that is called on error.
 */
function loadPartnersFromSheet(callback, errorCallback) {
	// load google sheets api
	window.gapi.client.load('sheets', 'v4', () => {
		// get the values from the sheet
		return window.gapi.client.sheets.spreadsheets.values
			.get({
				spreadsheetId: '1ud2HaVa5_WoZHWWgGsNe2CUOhwSQ2yERcdCuO5J7n9k', // id of the sheet
				range: 'A1:E', // range to read
			})
			.then(response => {
				const { values } = response.result;
				callback(parseToJSON(values)); // parse the response
			})
			.catch(errorCallback); // on error call the error callback
	});
}

function getPartners(callback, errorCallback) {
	loadPartnersFromSheet(partners => {
		callback(partners);
	}, errorCallback);
}

export default getPartners;
