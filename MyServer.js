//setup modules
const Bottleneck = require('bottleneck');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const I_MIN_LIKES = 10;
const limiter = new Bottleneck({
    maxConcurrent:4,
    minTime:250,
});

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

            const likes_on_A = parseInt(a_likes);
            if( likes_on_A < I_MIN_LIKES)return;

            const answer ="This answer has helped "+likes_on_A+" people\n" +  $(el).text().replace("\n","\t")+"\n";
			header+=answer;
		});
    return header;
}
const getSOText = async (i_link) => {
	try {
        const { data } = await axios.get(
			'https://stackoverflow.com/questions/' + i_link  + '/how-to-use-continue-in-jquery-each-loop'
            );

		const $ = cheerio.load(data);


		const title = getTitle($);
		const qText = getQText($);
        console.log(qText);
        let s_whole_text = title + qText;
        s_whole_text = getAText($,s_whole_text);

		return s_whole_text;
	} catch (error) {
	    console.error(error, error.stack);
	    return null;
    }
};

const wrapped = limiter.wrap(getSOText);

function mainLoop(){

const curr_num = 17162334;
    for( let i = curr_num/1.01 | 0; i < curr_num; i++)

wrapped(i)
    .then((postTitles) => {
        if(postTitles){
        console.log(postTitles)
//TODO: have 1 replaced by a number of a link in SO which was used for getSOText();
        fs.writeFile("./bin/"+i+".txt",postTitles,(error)=>{
            if(error)
                return console.log(error);
            console.log("file saved");
        });
        }
    });
}
mainLoop();
