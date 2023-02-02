//setup modules
const axios = require('axios');
const Bottleneck = require('bottleneck');
const cheerio = require('cheerio');
const performTask = require('./src/throttle.js');

const I_MIN_LIKES = 10;

const limiter = new Bottleneck({
    minTime:100,
    maxConcurrent:4,
});


//string f(doc?)
const getTitle = ($)=>{
    const str_tmp = $('#question-header  a.question-hyperlink').text();
    console.log(str_tmp);
    return str_tmp;
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
const getPostTitles = (i_link_number) => {

		axios.get(
			'https://stackoverflow.com/questions/'+i_link_number+'/how-to-use-continue-in-jquery-each-loop'
            ).then((data)=>{
                const $ = cheerio.load(data);


		const title = getTitle($);
		const qText = getQText($);

        let s_whole_text = title + qText;
        s_whole_text = getAText($,s_whole_text);

		return s_whole_text;
	})
        .catch (error=> {
	    console.error(error, error.stack);
        throw error;
	});

};

const throttledCrawling = limiter.wrap(getPostTitles);

performTask(throttledCrawling);
const str = getPostTitles();
console.log(str);
