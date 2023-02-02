//setup modules
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const I_MIN_LIKES = 10;

//string f(doc?)
const getTitle = ($)=>{
    return $('#question-header  a.question-hyperlink').text();
}

//string f(doc?)
const getQText = ($)=>{
            return $('#question > div.post-layout > div.postcell.post-layout--right > div.s-prose.js-post-body').text();
}


//string f(doc,string)
const getAText = ($,header)=>{

		$('div.answercell > div.js-post-body').each((_idx, el) => {
		    const a_likes = $(el).closest('.post-layout').find('.js-vote-count').text();

            if(parseInt(a_likes) < I_MIN_LIKES)return;

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
        console.log(qText);
        let s_whole_text = title + qText;
        s_whole_text = getAText($,s_whole_text);

		return s_whole_text;
	} catch (error) {
	    console.error(e, e.stack);
        throw error;
	}
};

getSOText()
    .then((postTitles) => {
        console.log(postTitles)
//TODO: have 1 replaced by a number of a link in SO which was used for getSOText();
        fs.writeFile("./bin/1.txt",postTitles,(error)=>{
            if(error)
                return console.log(error);
            console.log("file saved");
        });

    });
