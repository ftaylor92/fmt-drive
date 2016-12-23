var name = "Nicholas"
	msg= 'Hello, ${name}!';
    
console.log(msg);    // "Hello, Nicholas!"
document.write(msg+"<br/>");


var total = 30,
    msg= 'The total is ${total} (${total*1.05} with tax)';
    
console.log(msg);       // "The total is 30 (31.5 with tax)"

document.write(msg+"<br/>");
