// Generate random colors
export const getRandomColor = () => {    
  		let arr = [];
  		for (let i = 0; i < 3; i++) {
  		    arr.push(Math.floor(Math.random() * 128 + 64));
  		    arr.push(Math.floor(Math.random() * 128 + 128));
  		}
  		let [r, g, b] = arr;
  		const color = `#${r.toString(16).length > 1 ? r.toString(16) : '0' + r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : '0' + g.toString(16)}${
  			b.toString(16).length > 1 ? b.toString(16) : '0' + b.toString(16)}`;
  		return color;
 }


export interface IconData{
    list: Array<any>
    color: string
}

export const getRandomIcon = () => {
    let data = []
    for (let i = 0; i < 5; i++) {
        data.push([
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 2)
        ])
    }
    data = data.map(function(d) {
            d.push(d[1], d[0])
            return d
        })
        // duplicate first two rows
    var color = getRandomColor()
    const res:IconData = {
        list: data,
        color
    }
    return res
}



//Generate a globally unique identifier
export function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}