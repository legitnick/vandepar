const axios = require('axios');
const cheerio = require('cheerio');
const I_MIN_LIKES = 3;

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://stackoverflow.com/questions/43996443/js-promises-returns/43996485#43996485'
		);
		const $ = cheerio.load(data);


		const title = $('#question-header  a.question-hyperlink').text();

		const qText = $('div.postcell > div.js-post-body').text();

        let s_whole_text = title + qText;

		$('div.answercell > div.js-post-body').each((_idx, el) => {
		    const a_likes = $(el).closest('post-layout').children('.js-vote-count');

            console.log(parseInt(a_likes));
            if(parseInt(a_likes) < I_MIN_LIKES)return;
            console.log("smth");
            const answer = $(el).text().replace("\n","\t")+"\n";
			s_whole_text+=answer;
		});
		return s_whole_text;
	} catch (error) {
	    console.error(e, e.stack);
        throw error;
	}
};

getPostTitles()
    .then((postTitles) => console.log(postTitles));
