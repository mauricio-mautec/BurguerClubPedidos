import printer from 'printer';
import util from 'util';


const template = "\x1D\x6B\x0012345678901\x00\n12345678901234567890123456789012345678901234567890asdfghjkl;\nMAURICIO JUNQUEIRA\n";
function printBematech(text, printer_name){
	printer.printDirect({
        data:text,
		printer:printer_name,
		type: "RAW",
		success:function(){
			console.log("printed: "+barcode_text);
        },
        error:function(err){console.log(err);}
	});
}
console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
console.log(`default printer name: ${printer.getDefaultPrinterName() || 'is not defined on your computer'}`);
console.log("supported formats are:\n"+util.inspect(printer.getSupportedPrintFormats(), {colors:true, depth:10}));
printBematech(template, "MP-4200 TH");