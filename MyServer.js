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
            ).catch((error)=>{
                console.log(error)
                return null;
            });
        if (data === null) return;
		const $ = cheerio.load(data);


		const title = getTitle($);
		const qText = getQText($);
        console.log(qText);
        let s_whole_text = title + qText;
        s_whole_text = getAText($,s_whole_text);

		return s_whole_text;
	} catch (error) {
	    s_whole_text = null;
        console.error(error, error.stack);
	    return s_whole_text;
    }
};

const wrapped = limiter.wrap(getSOText);

function mainLoop(){

const curr_num = 17162334;
// const promise_arr =  [];
    // push a promise to an array
    // promise_arr.push(wrapped(i));
    for( let i = curr_num/1.01 | 0; i < curr_num; i++)
//the number of crawls is too big rn
        wrapped(i)
            .then((postTitles) => {
                if(postTitles){
                console.log(postTitles)

                fs.writeFile("./bin/"+i+".txt",postTitles,(error)=>{
                if(error)
                    return console.log(error);
                console.log("file saved");
            });
        }
    });
    //after all the crawling to change ip adress
    //const ip_promise = Promise.all(promise_arr);
    //ip_promise.then(changeMyIP());
//void changeMyIP(void);
    //const changeMyIP = require('./src/windscribe_proxy.js');
    //there are probably some nodejs tools for proxying
    //also, maybe shouldn't even use async for a crawler at all, as later
    //on video-editing will be used, as well as puppeteer running
}
mainLoop();
