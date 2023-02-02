const axios = require('axios');
const cheerio = require('cheerio');

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://stackoverflow.com/questions/43996443/js-promises-returns/43996485#43996485'
		);
		const $ = cheerio.load(data);

		
		const title = $('#question-header  a.question-hyperlink').text();

		const aTexts = [];
		aTexts.push(title);
		return aTexts;
	} catch (error) {
		throw error;
	}
};

getPostTitles()
    .then((postTitles) => console.log(postTitles));
