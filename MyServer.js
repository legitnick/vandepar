const axios = require('axios');
const cheerio = require('cheerio');

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://stackoverflow.com/questions/43996443/js-promises-returns/43996485#43996485'
		);
		const $ = cheerio.load(data);

		
		const title = $('#question-header  a.question-hyperlink').text();

		const qText = $('div.postcell > div.js-post-body').text();
		const aTexts = [];

		$('div.answercell > div.js-post-body').each((_idx, el) => {
			const answer = $(el).text().replace("\n","\t")+"\n";
			aTexts.push(answer);
		});
		aTexts.push(qText);
		aTexts.push(title);
		return aTexts;
	} catch (error) {
		throw error;
	}
};

getPostTitles()
    .then((postTitles) => console.log(postTitles));
