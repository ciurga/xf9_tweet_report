function loadData(path){
	var index,sim,max = -1, ind_max = 0, ind_cont = -1;
	var tweet;
	var person = [], cat = [];
	var count_person = [];
	var tot_stat;
        var c = 1;
	
	d3.csv("persone.csv", function(data) {
		data.forEach(function(d) {
			d.id_name = +d.id_name;
                        if (cat[cat.length-1]!==d.category){
                            cat.push(d.category);  
                            c = 1;
                        }
                        d.id_incat = c;
                        d.id_cat = cat.length-1;
			count_person[d.id_name] = 0;
                        c++;
		});
		person = data;
		loadTweet()
	});
	
	function loadTweet(){
			
		d3.csv("tweet.csv", function(data) {
		data.forEach(function(d) {
			d.is_rtw = +d.is_rtw;
			d.tweet_text = d.tweet_text;
			d.tweet_lower = d.tweet_text.replace(/[^\w\s]|_/g, "")
			 .replace(/\s+/g, " ").toLowerCase().trim();
			
			ind_max = 0, ind_cont = -1;
		
			for	(index = 0; index < person.length; index++) {
				if (d.tweet_lower.search(person[index].nick) > -1){
					ind_cont = index;
					if (ind_cont ==11){
					//console.log("cont "+person[index].nick+" "+data[0].tweet_lower.search(person[index].nick))
					//console.log(d.tweet_lower);
					}
				} else {
					/*
					sim = similar_text(d.tweet_lower,person[index].nick);
					//console.log("sim_text "+data[1].tweet_lower+" "+similar_text(data[1].tweet_lower,person[index].nick)+"% of similarity with "+person[index].nick);
					//console.log("com "+data[1].tweet_lower+" "+Compare(data[1].tweet_lower,person[index].nick)+"% of similarity with "+person[index].nick);
					if (max < sim){
						max = sim;
						ind_max = index;
					}*/
				}
			}
			
			if (ind_cont > -1) {
				count_person[person[ind_cont].id_name]++;
				//console.log("sim_text "+d.tweet_text+" "+" contains "+person[ind_cont].nick);
			} else {
				count_person[person[0].id_name]++;
				//console.log("sim_text "+d.tweet_text+" "+similar_text(data[1].tweet_text,person[ind_max].nick)+"% of similarity with "+person[ind_max].nick);
			}
			//console.log(data[1]);
		});
		tweet = data;
		tot_stat = createStat(count_person,person);
		dashboard('#dashboard',tot_stat);
		var json = buildStat(tot_stat,person);
		createVisualization(json);
		});
	}

	function createStat(count_person, person){
		var stat = [], instat = [];
		var i = 0;
		for	(index = 0; index < person.length; index++) {
			if (i==person[index].id_name){
				instat = [];
				instat.name = person[index].name;
				instat.id_name = person[index].id_name;
                                instat.id_cat = person[index].id_cat;
                                instat.id_incat = person[index].id_incat;
				instat.count = count_person[i];
				stat[i] = instat;
				i++;
			}
		}
		return stat;
	}

	
	function similar_text(first, second) {
		// Calculates the similarity between two strings  
		// discuss at: http://phpjs.org/functions/similar_text
		if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
			return 0;
		}
		first += '';
		second += '';

		var pos1 = 0,
			pos2 = 0,
			max = 0,
			firstLength = first.length,
			secondLength = second.length,
			p, q, l, sum;
		max = 0;

		for (p = 0; p < firstLength; p++) {
			for (q = 0; q < secondLength; q++) {
				for (l = 0;
				(p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
				if (l > max) {
					max = l;
					pos1 = p;
					pos2 = q;
				}
			}
		}
		sum = max;
		if (sum) {
			if (pos1 && pos2) {
				sum += similar_text(first.substr(0, pos2), second.substr(0, pos2));
			}
			if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
				sum += similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
			}
		}
		return sum;
	}

}