import {Pipe} from 'angular2/core';

@Pipe({name: 'splitName'})
export class SplitNamePipe {
  transform(text:string, args:number) {

		// var name = /\((.+)\)/g;
		// var extractCity = text.match(city);
		// extractCity.substring(0, 1);
		// extractCity.substring(0, extractCity.lenght-1);
		// console.log(extractCity);
// return text;
		console.log(text, args)
    function formatCase(text:String){
      var firstChar    = text.charAt(0);
      var remainingStr = text.slice(1);
          text         = firstChar + remainingStr.toLowerCase();
      return text;
    }

    if(args[0] === 0) { //NAME
      var afterBar = text.substr(text.indexOf("-"));
      var extractedCity:String = afterBar.slice(2);
          extractedCity = extractedCity.replace(/\([^)]+\)/,"")
          extractedCity = extractedCity.substring(0, extractedCity.length-1);
          extractedCity = formatCase(extractedCity);

      return extractedCity;
		} else if(args[0] === 1) { //CITY

			var city = /\((.+)\)/g;
			var extractCity = text.match(city);
      if (extractCity !== null) {
  			var extractedCity:String = extractCity[0].substring(1);
  					extractedCity = extractedCity.substring(0, extractedCity.length-1);
            extractedCity = formatCase(extractedCity);

        return extractedCity;
      }else{
        return 'Paris'
      }
    }
  }
}
