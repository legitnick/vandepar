//setup modules
const axios = require('axios');
const cheerio = require('cheerio');

const I_MIN_LIKES = 10;

//string f(doc?)
const getTitle = ($)=>{
    return $('#question-header  a.question-hyperlink').text();
}

//string f(doc?)
const getQText = ($)=>{
            $('div.postcell > div.js-post-body').text();
}


//string f(doc,string)
const getAText = ($,header)=>{

		$('div.answercell > div.js-post-body').each((_idx, el) => {
		    const a_likes = $(el).closest('.post-layout').find('.js-vote-count').text();

            console.log(parseInt(a_likes));
            if(parseInt(a_likes) < I_MIN_LIKES)return;
            console.log("str: " + a_likes);
            const answer ="comment:\n" +  $(el).text().replace("\n","\t")+"\n";
			header+=answer;
		});
    return header;
}
const getSOText = async () => {
	try {
		const { data } = await axios.get(
			'https://stackoverflow.com/questions/17162334/how-to-use-continue-in-jquery-each-loop'
            );
		const $ = cheerio.load(data);


		const title = getTitle($);
		const qText = getQText($);

        let s_whole_text = title + qText;
        s_whole_text = getAText($,s_whole_text);

		return s_whole_text;
	} catch (error) {
	    console.error(e, e.stack);
        throw error;
	}
};

getSOText()
    .then((postTitles) => console.log(postTitles));
