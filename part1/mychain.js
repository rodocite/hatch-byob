"use strict";

var path = require("path");
var fs = require("fs");
var Blockchain = require("./blockchain.js");
var MyREPL = require("./repl.js");

var args = require("minimist")(process.argv.slice(2),{
	string: [ "load" ],
});

let BC
if (args.load) {
	var file = path.resolve(args.load);
	let contents = fs.readFileSync(file,"utf-8");
	let blocks = JSON.parse(contents);

	BC = new Blockchain(blocks)
} else {
	BC = new Blockchain()
}

var listener = MyREPL.start();

listener.on("add",function onAdd(text = ""){
	BC.addBlock(text)
});

listener.on("print",function onPrint(){
	BC.print()
});

listener.on("save",function onSave(){
	if (file) {
		fs.writeFileSync(file, JSON.stringify(BC.blocks), "utf-8");
	} else {
		fs.writeFileSync('./blockchain.json', JSON.stringify(BC.blocks), "utf-8");
	}
});

