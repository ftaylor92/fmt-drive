function selectMenu(which, menu) {
	if(which === "add") {
		switch(menu) {
			case "bill":
				$("#addBillClick").click();
				break;
			case "account":
				$("#addAccountClick").click();
				break;
			case "creditCard":
				$("#addCreditCardClick").click();
				break;
			default:
				alert("no option for "+ which+": "+ menu.value );
				break;
		}
	}
	else if(which === "edit") {
		switch(menu) {
			case "bill":
				$("#editBillClick").click();
				break;
			case "misc":
				$("#editMiscClick").click();
				break;
			case "paycheck":
				$("#editPaycheckClick").click();
				break;
			case "current":
				$("#editCurrentClick").click();
				break;
			case "account":
				$("#editAccountClick").click();
				break;
			case "creditCard":
				$("#editCreditCardClick").click();
				break;
			default:
				alert("no option For "+ which+": "+ menu.value );
				break;
		}
	} else {
		alert("No option for "+ which+": "+ menu.value );
	}
	
}
