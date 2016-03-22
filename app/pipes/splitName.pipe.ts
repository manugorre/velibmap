import {Pipe} from 'angular2/core';

@Pipe({name: 'splitName'})
export class SplitNamePipe {
  transform(text:string, args:number) {

		// var name = /\((.+)\)/g;
		// var extractCity = text.match(city);
		// extractCity.substring(0, 1);
		// extractCity.substring(0, extractCity.lenght-1);
		// console.log(extractCity);
return text;
		console.log(text, args)

  //   if(args[0] === 0) { //NAME
	// 		console.log(args)
  //     return 'test';
	// 	} else if(args[0] === 1) { //CITY
  //
	// 		var city = /\((.+)\)/g;
	// 		var extractCity = text.match(city);
	// 		var extractedCity:string = extractCity[0].substring(1);
	// 				extractedCity = extractedCity.substring(0, extractedCity.length-1);
  //
  //     var firstChar = extractedCity.charAt(0);
	// 		console.log(firstChar);
  //     var remainingStr = extractedCity.slice(1);
	// 		console.log(remainingStr);
  //     extractedCity = firstChar + remainingStr.toLowerCase();
  //
	// 		return extractedCity;
  //   }
  // }
}
